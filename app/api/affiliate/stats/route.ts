import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");
    const id = searchParams.get("id");

    if (!code && !id) {
      return NextResponse.json({ error: "Missing affiliate identifier" }, { status: 400 });
    }

    const supabase = createServerSupabase();

    let affiliate: any = null;
    if (id) {
      const { data } = await supabase.from("affiliates").select("*").eq("id", id).maybeSingle();
      affiliate = data;
    } else if (code) {
      const cleanCode = code.trim().toUpperCase();
      const { data } = await supabase
        .from("affiliates")
        .select("*")
        .or(`code.ilike.${cleanCode},ref_code.ilike.${cleanCode}`)
        .maybeSingle();
      affiliate = data;
    }

    if (!affiliate) {
      return NextResponse.json({ error: "Affiliate not found" }, { status: 404 });
    }

    const affCode = affiliate.code || affiliate.ref_code || code || "";
    affiliate.code = affCode;
    const rate = Number(affiliate.commission_per_order || 10.00);

    // Fetch referred orders from orders table safely
    const { data: ordersData, error: ordersErr } = await supabase
      .from("orders")
      .select("*")
      .or(`affiliate_code.ilike.${affCode},affiliate_id.eq.${affiliate.id}`)
      .order("created_at", { ascending: false });

    if (ordersErr) {
      console.warn("[API Affiliate Stats] orders query warning:", ordersErr.message);
    }

    const orders = ordersData || [];

    // Categorize orders
    const totalOrdersCount = Math.max(orders.length, Number(affiliate.total_orders) || 0);
    const deliveredOrders = orders.filter((o) => o.status === "delivered");
    const activeOrders = orders.filter((o) => o.status !== "cancelled");
    const pendingOrders = orders.filter((o) => o.status === "pending" || !o.status);
    const confirmedOrders = orders.filter((o) => o.status === "confirmed" || o.status === "processing" || o.status === "in_delivery");
    const cancelledOrders = orders.filter((o) => o.status === "cancelled");

    // Fetch Payouts
    const { data: payoutsData } = await supabase
      .from("affiliate_payouts")
      .select("*")
      .eq("affiliate_id", affiliate.id)
      .order("created_at", { ascending: false });

    const payouts = payoutsData || [];
    const totalPaid = payouts
      .filter((p) => p.status === "completed")
      .reduce((sum, p) => sum + Number(p.amount || 0), 0);

    const pendingPayoutAmount = payouts
      .filter((p) => p.status === "pending" || p.status === "processing")
      .reduce((sum, p) => sum + Number(p.amount || 0), 0);

    // Calculate Earnings
    const totalGrossEarned = Math.max(activeOrders.length * rate, Number(affiliate.total_earned) || (totalOrdersCount * rate));
    const deliveredEarned = deliveredOrders.length * rate;
    const pendingEarned = Math.max(0, totalGrossEarned - deliveredEarned);
    // Withdrawable Balance is strictly from DELIVERED orders (min 30 DT to withdraw)
    const availableBalance = Math.max(0, deliveredEarned - totalPaid - pendingPayoutAmount);
    const canWithdraw = availableBalance >= 30;

    // Sanitize order details for customer privacy
    const safeOrders = orders.map((o) => {
      const rawName = o.customer_name || o.name || "Customer";
      const parts = rawName.trim().split(" ");
      const maskedName = parts.length > 1 ? `${parts[0]} ${parts[parts.length - 1][0]}.` : rawName;

      return {
        id: o.id,
        createdAt: o.created_at,
        customerName: maskedName,
        cardSize: o.card_size || "standard",
        status: o.status || "pending",
        commission: rate,
        commissionStatus: o.commission_status || "pending",
      };
    });

    // Query event table counters
    let eventsGenCount = 0;
    let eventsClickCount = 0;
    try {
      const { count: cGen } = await supabase
        .from("affiliate_events")
        .select("id", { count: "exact", head: true })
        .or(`affiliate_id.eq.${affiliate.id},affiliate_code.ilike.${affCode}`)
        .eq("event_type", "card_generated");
      eventsGenCount = cGen || 0;

      const { count: cClick } = await supabase
        .from("affiliate_events")
        .select("id", { count: "exact", head: true })
        .or(`affiliate_id.eq.${affiliate.id},affiliate_code.ilike.${affCode}`)
        .eq("event_type", "click");
      eventsClickCount = cClick || 0;
    } catch (_) {}

    const clicksCount = Math.max(Number(affiliate.total_clicks) || 0, eventsClickCount);
    const generatedCount = Math.max(Number(affiliate.total_generated) || 0, eventsGenCount);
    const conversionRate = clicksCount > 0 ? ((totalOrdersCount / clicksCount) * 100).toFixed(1) : "0.0";

    const { password_hash, ...safeAffiliate } = affiliate;

    return NextResponse.json({
      success: true,
      affiliate: safeAffiliate,
      metrics: {
        totalClicks: clicksCount,
        totalGenerated: generatedCount,
        totalOrders: totalOrdersCount,
        deliveredOrdersCount: deliveredOrders.length,
        pendingOrdersCount: pendingOrders.length,
        confirmedOrdersCount: confirmedOrders.length,
        cancelledOrdersCount: cancelledOrders.length,
        conversionRate: `${conversionRate}%`,
        commissionPerOrder: rate,
        totalGrossEarned,
        deliveredEarned,
        pendingEarned,
        totalPaid,
        pendingPayoutAmount,
        availableBalance,
        canWithdraw,
      },
      orders: safeOrders,
      payouts: payouts,
    });
  } catch (err: any) {
    console.error("[API Affiliate Stats] Exception:", err);
    return NextResponse.json({ error: err.message || "Failed to fetch stats" }, { status: 500 });
  }
}
