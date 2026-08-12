import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderId, status } = body;

    if (!orderId || !status) {
      return NextResponse.json({ error: "Missing required orderId or status" }, { status: 400 });
    }

    const validStatuses = ["pending", "confirmed", "in_delivery", "delivered", "cancelled"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: "Invalid status value" }, { status: 400 });
    }

    const supabase = createServerSupabase();

    // 1. Fetch current order
    const { data: order, error: fetchErr } = await supabase
      .from("orders")
      .select("id, status, affiliate_id, affiliate_code, commission_amount, commission_status")
      .eq("id", orderId)
      .single();

    if (fetchErr || !order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // 2. Determine commission status based on order status
    let newCommissionStatus = order.commission_status || "pending";
    if (status === "delivered") {
      newCommissionStatus = "approved"; // Qualified for payout
    } else if (status === "cancelled") {
      newCommissionStatus = "cancelled";
    } else {
      newCommissionStatus = "pending";
    }

    // 3. Update order in database
    const { data: updatedOrder, error: updateErr } = await supabase
      .from("orders")
      .update({
        status: status,
        commission_status: newCommissionStatus,
        updated_at: new Date().toISOString(),
      })
      .eq("id", orderId)
      .select()
      .single();

    if (updateErr) {
      console.error("[API Admin Order Status] Update error:", updateErr);
      return NextResponse.json({ error: updateErr.message }, { status: 500 });
    }

    // 4. If order is tied to an affiliate, update total delivered / earned stats
    if (order.affiliate_id || order.affiliate_code) {
      try {
        const affIdentifier = order.affiliate_id
          ? { col: "id", val: order.affiliate_id }
          : { col: "code", val: order.affiliate_code };

        const { data: affOrders } = await supabase
          .from("orders")
          .select("id, status, commission_amount")
          .or(`affiliate_id.eq.${order.affiliate_id},affiliate_code.ilike.${order.affiliate_code}`)
          .neq("status", "cancelled");

        const activeOrders = affOrders || [];
        const deliveredOrders = activeOrders.filter((o) => o.status === "delivered");
        const totalDeliveredEarned = deliveredOrders.length * Number(order.commission_amount || 10.00);

        await supabase
          .from("affiliates")
          .update({
            total_orders: activeOrders.length,
            total_earned: totalDeliveredEarned,
            updated_at: new Date().toISOString(),
          })
          .eq(affIdentifier.col, affIdentifier.val);

        console.log(`[API Admin Order Status] Synced affiliate stats for order ${orderId}. Delivered orders: ${deliveredOrders.length}`);
      } catch (affSyncErr) {
        console.warn("[API Admin Order Status] Affiliate sync fallback warning:", affSyncErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: `تم تحديث حالة الطلبية بنجاح إلى: ${status}`,
      order: updatedOrder,
    });
  } catch (err: any) {
    console.error("[API Admin Order Status] Exception:", err);
    return NextResponse.json({ error: err.message || "Failed to update order status" }, { status: 500 });
  }
}
