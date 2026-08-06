import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "../../../../lib/supabase";
import { verifyJwtToken } from "../../../../lib/auth";

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.replace("Bearer ", "");
    const session = verifyJwtToken<{ id: string; phone: string }>(token);
    if (!session) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
    }

    const body = await request.json();
    const { method } = body; // 'flouci' or 'bank_transfer'

    const supabase = createServerSupabase();

    // Get affiliate
    const { data: affiliate, error: affError } = await supabase
      .from("affiliates")
      .select("*")
      .eq("id", session.id)
      .single();

    if (affError || !affiliate) {
      return NextResponse.json({ error: "Affiliate not found" }, { status: 404 });
    }

    // Calculate available balance
    const totalEarned = Number(affiliate.total_earned) || 0;
    const totalPaid = Number(affiliate.total_paid) || 0;
    const availableBalance = totalEarned - totalPaid;

    // Check minimum withdrawal (30 DT)
    if (availableBalance < 30) {
      return NextResponse.json(
        { error: `الرصيد متاعك ${availableBalance} DT. لازم يوصل 30 DT باش تسحب.` },
        { status: 400 }
      );
    }

    // Check for pending payout
    const { data: pendingPayout } = await supabase
      .from("payouts")
      .select("id")
      .eq("affiliate_id", affiliate.id)
      .eq("status", "pending")
      .single();

    if (pendingPayout) {
      return NextResponse.json(
        { error: "عندك طلب سحب بصدد المعالجة. استنى يتأكد قبل ما تعمل واحد جديد." },
        { status: 400 }
      );
    }

    // Determine withdrawal method
    const withdrawMethod = method || affiliate.payment_method || "flouci";

    // Create payout request
    const { data: payout, error: payError } = await supabase
      .from("payouts")
      .insert({
        affiliate_id: affiliate.id,
        amount: availableBalance,
        method: withdrawMethod,
        status: "pending",
      })
      .select()
      .single();

    if (payError) {
      console.error("Payout error:", payError);
      return NextResponse.json(
        { error: "مشكل في إنشاء طلب السحب" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      payout: {
        id: payout.id,
        amount: payout.amount,
        method: payout.method,
        status: payout.status,
        requested_at: payout.requested_at,
      },
      message: `تم طلب سحب ${availableBalance} DT بنجاح. رح يوصلك عبر ${withdrawMethod === "flouci" ? "Flouci" : "تحويل بنكي"}.`,
    });
  } catch (err) {
    console.error("Withdraw error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
