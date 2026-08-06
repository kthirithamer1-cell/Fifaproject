import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "../../../../lib/supabase";
import { verifyAdminAuth } from "../../../../lib/auth";

// GET — list all payout requests
export async function GET(request: NextRequest) {
  const authCheck = verifyAdminAuth(request);
  if (!authCheck.authorized) {
    return NextResponse.json({ error: authCheck.error || "Unauthorized" }, { status: authCheck.error?.startsWith("SERVER_MISCONFIGURATION") ? 500 : 401 });
  }

  const supabase = createServerSupabase();
  const { searchParams } = request.nextUrl;
  const status = searchParams.get("status");

  let query = supabase
    .from("payouts")
    .select("*, affiliates(name, phone, flouci_id, card_number)")
    .order("requested_at", { ascending: false });

  if (status && status !== "all") {
    query = query.eq("status", status);
  }

  const { data: payouts, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ payouts: payouts || [] });
}

// PATCH — process a payout (mark as completed or rejected)
export async function PATCH(request: NextRequest) {
  const authCheck = verifyAdminAuth(request);
  if (!authCheck.authorized) {
    return NextResponse.json({ error: authCheck.error || "Unauthorized" }, { status: authCheck.error?.startsWith("SERVER_MISCONFIGURATION") ? 500 : 401 });
  }

  const body = await request.json();
  const { id, status, reference } = body;

  if (!id || !status) {
    return NextResponse.json({ error: "id and status required" }, { status: 400 });
  }

  const supabase = createServerSupabase();

  // Get the payout details first
  const { data: payout, error: fetchErr } = await supabase
    .from("payouts")
    .select("*")
    .eq("id", id)
    .single();

  if (fetchErr || !payout) {
    return NextResponse.json({ error: "Payout not found" }, { status: 404 });
  }

  // Update the payout
  const updateData: Record<string, any> = { status };
  if (status === "completed") {
    updateData.completed_at = new Date().toISOString();
    updateData.reference = reference || null;

    // Update affiliate's total_paid
    await supabase.rpc("increment_total_paid", {
      aff_id: payout.affiliate_id,
      amount: payout.amount,
    });

    // Fallback: direct update if RPC doesn't exist
    const { data: affiliate } = await supabase
      .from("affiliates")
      .select("total_paid")
      .eq("id", payout.affiliate_id)
      .single();

    if (affiliate) {
      await supabase
        .from("affiliates")
        .update({
          total_paid: Number(affiliate.total_paid || 0) + Number(payout.amount),
        })
        .eq("id", payout.affiliate_id);
    }
  }

  if (reference) updateData.reference = reference;

  const { data: updated, error: updateErr } = await supabase
    .from("payouts")
    .update(updateData)
    .eq("id", id)
    .select()
    .single();

  if (updateErr) {
    return NextResponse.json({ error: updateErr.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, payout: updated });
}
