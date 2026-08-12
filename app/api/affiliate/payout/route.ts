import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { affiliateId, amount, paymentMethod, paymentDetails, notes } = body;

    if (!affiliateId || !amount || Number(amount) <= 0) {
      return NextResponse.json({ error: "الرجاء تحديد مبلغ السحب المطلوب" }, { status: 400 });
    }

    const withdrawAmount = Number(amount);
    if (withdrawAmount < 30) {
      return NextResponse.json({ error: "الحد الأدنى للسحب هو 30 دينار تونسي" }, { status: 400 });
    }

    const supabase = createServerSupabase();

    // 1. Fetch Affiliate Record
    const { data: affiliate, error: affError } = await supabase
      .from("affiliates")
      .select("id, name, phone, payment_method, payment_details, commission_per_order")
      .eq("id", affiliateId)
      .single();

    if (affError || !affiliate) {
      return NextResponse.json({ error: "Affiliate not found" }, { status: 404 });
    }

    // 2. Check Available Balance from DELIVERED orders ONLY
    const affCode = affiliate.code || affiliate.ref_code || "";
    const { data: deliveredOrders } = await supabase
      .from("orders")
      .select("id, status")
      .or(`affiliate_id.eq.${affiliate.id},affiliate_code.ilike.${affCode}`)
      .eq("status", "delivered");

    const rate = Number(affiliate.commission_per_order || 10.00);
    const deliveredCount = (deliveredOrders || []).length;
    const deliveredEarned = deliveredCount * rate;

    const { data: payouts } = await supabase
      .from("affiliate_payouts")
      .select("amount, status")
      .eq("affiliate_id", affiliate.id)
      .in("status", ["completed", "pending", "processing"]);

    const alreadyDrawnOrPending = (payouts || []).reduce((sum, p) => sum + Number(p.amount || 0), 0);
    const available = Math.max(0, deliveredEarned - alreadyDrawnOrPending);

    if (available < 30) {
      return NextResponse.json(
        {
          error: `لا يمكنك طلب السحب إلا بعد تسليم 3 كروت على الأقل (30 د.ت). لديك حالياً ${deliveredCount} كروت مسلّمة (الرصيد المتاح: ${available.toFixed(2)} د.ت).`,
        },
        { status: 400 }
      );
    }

    if (withdrawAmount > available) {
      return NextResponse.json(
        { error: `الرصيد المتاح للسحب من الكروت المسلّمة (${available.toFixed(2)} د.ت) أقل من المبلغ المطلوب (${withdrawAmount.toFixed(2)} د.ت)` },
        { status: 400 }
      );
    }

    // 3. Create Payout Request
    const { data: payout, error: payoutError } = await supabase
      .from("affiliate_payouts")
      .insert([
        {
          affiliate_id: affiliate.id,
          amount: withdrawAmount,
          payment_method: paymentMethod || affiliate.payment_method || "D17",
          payment_details: paymentDetails || affiliate.payment_details,
          status: "pending",
          notes: notes || null,
        },
      ])
      .select()
      .single();

    if (payoutError) {
      return NextResponse.json({ error: payoutError.message || "فشل تسجيل طلب السحب" }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "تم إرسال طلب السحب بنجاح! ستصلك أموالك خلال 24-48 ساعة عبر D17 / Flouci.",
      payout,
    });
  } catch (err: any) {
    console.error("[API Affiliate Payout] Exception:", err);
    return NextResponse.json({ error: err.message || "Failed to process payout" }, { status: 500 });
  }
}
