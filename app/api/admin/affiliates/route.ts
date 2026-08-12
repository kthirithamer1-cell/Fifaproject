import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const supabase = createServerSupabase();

    // 1. Fetch All Affiliates
    const { data: affiliates, error: affError } = await supabase
      .from("affiliates")
      .select("*")
      .order("created_at", { ascending: false });

    if (affError) {
      return NextResponse.json({ error: affError.message }, { status: 500 });
    }

    // 2. Fetch All Orders safely with select("*")
    const { data: allOrdersData, error: ordersErr } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (ordersErr) {
      console.warn("[API Admin Affiliates] orders query warning:", ordersErr.message);
    }

    // 3. Fetch All Payouts
    const { data: payouts } = await supabase
      .from("affiliate_payouts")
      .select("*, affiliates(name, phone, code)")
      .order("created_at", { ascending: false });

    // 4. Fetch Recent Traffic Events (Clicks & AI Card Generations)
    const { data: trafficEvents } = await supabase
      .from("affiliate_events")
      .select("id, created_at, affiliate_code, event_type, ip_hash, user_agent")
      .order("created_at", { ascending: false })
      .limit(60);

    const allAffiliates = affiliates || [];
    const rawOrders = allOrdersData || [];
    const allPayouts = payouts || [];
    const events = trafficEvents || [];

    // Normalize all order fields
    const allOrders = rawOrders.map((o: any) => ({
      ...o,
      id: o.id || `FLW-${Date.now()}`,
      created_at: o.created_at || new Date().toISOString(),
      customer_name: o.customer_name || o.name || "Customer",
      phone: o.phone || o.customer_phone || "",
      governorate: o.governorate || "تونس",
      city: o.city || "",
      address: o.address || "",
      card_size: o.card_size || o.package || "standard",
      quantity: Number(o.quantity) || 1,
      total_price: Number(o.total_price || o.price || o.total) || 57,
      status: o.status || "pending",
      card_image_url: o.card_image_url || o.image_url || null,
      card_pdf_url: o.card_pdf_url || o.pdf_url || null,
      affiliate_code: o.affiliate_code || null,
      commission_amount: Number(o.commission_amount) || 10.00,
      commission_status: o.commission_status || "pending",
      notes: o.notes || "",
    }));

    // Filter referred orders vs direct orders
    const referredOrders = allOrders.filter((o) => o.affiliate_code || o.affiliate_id);
    const deliveredOrders = allOrders.filter((o) => o.status === "delivered");
    const deliveredReferredOrders = referredOrders.filter((o) => o.status === "delivered");
    const inDeliveryOrders = allOrders.filter((o) => o.status === "in_delivery" || o.status === "confirmed" || o.status === "processing");
    const pendingOrders = allOrders.filter((o) => o.status === "pending" || !o.status);
    const cancelledOrders = allOrders.filter((o) => o.status === "cancelled");

    // Compute Metrics
    const totalClicks = allAffiliates.reduce((sum, a) => sum + (a.total_clicks || 0), 0);
    const totalGenerated = allAffiliates.reduce((sum, a) => sum + (a.total_generated || 0), 0);
    
    const totalCommissionsEarned = referredOrders
      .filter((o) => o.status !== "cancelled")
      .reduce((sum, o) => sum + Number(o.commission_amount || 10.00), 0);

    const totalDeliveredCommissions = deliveredReferredOrders
      .reduce((sum, o) => sum + Number(o.commission_amount || 10.00), 0);

    const totalPaidCommissions = allPayouts
      .filter((p) => p.status === "completed")
      .reduce((sum, p) => sum + Number(p.amount || 0), 0);

    const totalPendingPayouts = allPayouts
      .filter((p) => p.status === "pending" || p.status === "processing")
      .reduce((sum, p) => sum + Number(p.amount || 0), 0);

    // Map affiliates with accurate delivered counts
    const enrichedAffiliates = allAffiliates.map((aff) => {
      const code = aff.code || aff.ref_code || "";
      const affOrders = allOrders.filter(
        (o) => (o.affiliate_code && o.affiliate_code.toUpperCase() === code.toUpperCase()) || o.affiliate_id === aff.id
      );
      const affDelivered = affOrders.filter((o) => o.status === "delivered");
      const affPaid = allPayouts
        .filter((p) => p.affiliate_id === aff.id && p.status === "completed")
        .reduce((sum, p) => sum + Number(p.amount || 0), 0);
      const affPendingPayout = allPayouts
        .filter((p) => p.affiliate_id === aff.id && (p.status === "pending" || p.status === "processing"))
        .reduce((sum, p) => sum + Number(p.amount || 0), 0);

      const rate = Number(aff.commission_per_order || 10.00);
      const deliveredEarned = affDelivered.length * rate;
      const availableBalance = Math.max(0, deliveredEarned - affPaid - affPendingPayout);

      return {
        ...aff,
        code,
        ordersCount: affOrders.length,
        deliveredCount: affDelivered.length,
        deliveredEarned,
        availableBalance,
        totalPaid: affPaid,
      };
    });

    return NextResponse.json({
      success: true,
      stats: {
        totalAffiliates: allAffiliates.length,
        totalClicks,
        totalGenerated,
        totalOrdersCount: allOrders.length,
        referredOrdersCount: referredOrders.length,
        deliveredOrdersCount: deliveredOrders.length,
        deliveredReferredCount: deliveredReferredOrders.length,
        inDeliveryOrdersCount: inDeliveryOrders.length,
        pendingOrdersCount: pendingOrders.length,
        cancelledOrdersCount: cancelledOrders.length,
        totalCommissionsEarned,
        totalDeliveredCommissions,
        totalPaidCommissions,
        totalPendingPayouts,
        unpaidWithdrawable: Math.max(0, totalDeliveredCommissions - totalPaidCommissions - totalPendingPayouts),
      },
      affiliates: enrichedAffiliates,
      orders: allOrders,
      referredOrders: referredOrders,
      payouts: allPayouts,
      trafficEvents: events,
    });
  } catch (err: any) {
    console.error("[API Admin Affiliates] Error:", err);
    return NextResponse.json({ error: err.message || "Admin request failed" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { affiliateId, status, commissionRate } = body;

    if (!affiliateId) {
      return NextResponse.json({ error: "Missing affiliateId" }, { status: 400 });
    }

    const supabase = createServerSupabase();
    const updates: Record<string, any> = { updated_at: new Date().toISOString() };

    if (status) updates.status = status;
    if (commissionRate !== undefined) updates.commission_per_order = Number(commissionRate);

    const { data, error } = await supabase
      .from("affiliates")
      .update(updates)
      .eq("id", affiliateId)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, affiliate: data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to update affiliate" }, { status: 500 });
  }
}
