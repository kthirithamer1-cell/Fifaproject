import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { payoutId, status, transactionRef, notes } = body;

    if (!payoutId || !status) {
      return NextResponse.json({ error: "Missing required fields (payoutId, status)" }, { status: 400 });
    }

    const supabase = createServerSupabase();

    const updates: Record<string, any> = {
      status,
      notes: notes || null,
    };

    if (transactionRef) {
      updates.transaction_ref = transactionRef.trim();
    }

    if (status === "completed") {
      updates.paid_at = new Date().toISOString();
    }

    const { data: payout, error } = await supabase
      .from("affiliate_payouts")
      .update(updates)
      .eq("id", payoutId)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // If completed, also update affiliate total_paid counter
    if (status === "completed" && payout) {
      const { data: aff } = await supabase
        .from("affiliates")
        .select("total_paid")
        .eq("id", payout.affiliate_id)
        .single();

      if (aff) {
        await supabase
          .from("affiliates")
          .update({
            total_paid: (Number(aff.total_paid) || 0) + Number(payout.amount),
          })
          .eq("id", payout.affiliate_id);
      }
    }

    return NextResponse.json({ success: true, payout });
  } catch (err: any) {
    console.error("[API Admin Payouts] Error:", err);
    return NextResponse.json({ error: err.message || "Failed to update payout" }, { status: 500 });
  }
}
