import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "../../../../lib/supabase";
import { verifyJwtToken } from "../../../../lib/auth";

export async function GET(request: NextRequest) {
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

    const supabase = createServerSupabase();

    // Get affiliate info
    const { data: affiliate, error: affError } = await supabase
      .from("affiliates")
      .select("*")
      .eq("id", session.id)
      .single();

    if (affError || !affiliate) {
      return NextResponse.json({ error: "Affiliate not found" }, { status: 404 });
    }

    // Parse requested month from searchParams (default: current)
    const monthParam = request.nextUrl.searchParams.get("month") || "current";

    let startRange: Date | null = null;
    let endRange: Date | null = null;

    const now = new Date();
    if (monthParam === "current") {
      startRange = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0);
      endRange = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
    } else if (monthParam !== "all" && /^\d{4}-\d{2}$/.test(monthParam)) {
      const [y, m] = monthParam.split("-").map(Number);
      startRange = new Date(y, m - 1, 1, 0, 0, 0);
      endRange = new Date(y, m, 0, 23, 59, 59);
    }

    // Get total clicks
    const { count: totalClicks } = await supabase
      .from("referral_clicks")
      .select("*", { count: "exact", head: true })
      .eq("affiliate_id", affiliate.id);

    // Get clicks in selected range
    let monthClicks = totalClicks || 0;
    if (startRange && endRange) {
      const { count } = await supabase
        .from("referral_clicks")
        .select("*", { count: "exact", head: true })
        .eq("affiliate_id", affiliate.id)
        .gte("clicked_at", startRange.toISOString())
        .lte("clicked_at", endRange.toISOString());
      monthClicks = count || 0;
    }

    // Get all orders attributed to this affiliate
    const { data: orders } = await supabase
      .from("orders")
      .select("*")
      .eq("affiliate_id", affiliate.id)
      .order("created_at", { ascending: false });

    const allOrders = orders || [];
    const totalOrders = allOrders.length;
    const deliveredOrders = allOrders.filter((o) => o.status === "delivered").length;
    const pendingOrders = allOrders.filter((o) => o.status === "pending" || o.status === "processing").length;
    
    // Filter orders by selected month
    const selectedMonthOrders = allOrders.filter((o) => {
      if (!startRange || !endRange) return true; // 'all'
      const orderDate = new Date(o.created_at);
      return orderDate >= startRange && orderDate <= endRange;
    });

    const monthOrdersCount = selectedMonthOrders.length;

    // Calculate financials
    const totalEarned = Number(affiliate.total_earned) || 0;
    const totalPaid = Number(affiliate.total_paid) || 0;
    const availableBalance = totalEarned - totalPaid;
    const canWithdraw = availableBalance >= 30;

    // Get recent payouts
    const { data: payouts } = await supabase
      .from("payouts")
      .select("*")
      .eq("affiliate_id", affiliate.id)
      .order("requested_at", { ascending: false })
      .limit(10);

    // Conversion rate for selected range
    const effectiveClicks = monthParam === "all" ? (totalClicks || 0) : monthClicks;
    const effectiveOrdersCount = monthParam === "all" ? totalOrders : monthOrdersCount;
    const conversionRate = effectiveClicks > 0
      ? ((effectiveOrdersCount / effectiveClicks) * 100).toFixed(1)
      : "0.0";

    const baseUrl = request.nextUrl.origin;

    return NextResponse.json({
      affiliate: {
        name: affiliate.name,
        ref_code: affiliate.ref_code,
        referral_url: `${baseUrl}/?ref=${affiliate.ref_code}`,
        tier: affiliate.tier,
        payment_method: affiliate.payment_method,
        flouci_id: affiliate.flouci_id,
        card_number: affiliate.card_number,
      },
      stats: {
        total_clicks: totalClicks || 0,
        month_clicks: monthClicks || 0,
        total_orders: totalOrders,
        delivered_orders: deliveredOrders,
        pending_orders: pendingOrders,
        month_orders: monthOrdersCount,
        total_earned: totalEarned,
        total_paid: totalPaid,
        available_balance: availableBalance,
        can_withdraw: canWithdraw,
        conversion_rate: conversionRate,
      },
      recent_orders: allOrders.slice(0, 20).map((o) => ({
        id: o.id,
        customer_name: o.customer_name,
        package: o.package,
        price: o.price,
        status: o.status,
        commission_status: o.commission_status,
        commission_amount: o.commission_amount,
        created_at: o.created_at,
      })),
      payouts: payouts || [],
    });
  } catch (err) {
    console.error("Stats error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
