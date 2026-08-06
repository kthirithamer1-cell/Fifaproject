import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "../../../../lib/supabase";
import { verifyAdminAuth } from "../../../../lib/auth";

// GET — list all affiliates with stats
export async function GET(request: NextRequest) {
  const authCheck = verifyAdminAuth(request);
  if (!authCheck.authorized) {
    return NextResponse.json({ error: authCheck.error || "Unauthorized" }, { status: authCheck.error?.startsWith("SERVER_MISCONFIGURATION") ? 500 : 401 });
  }

  const supabase = createServerSupabase();

  const { data: affiliates, error } = await supabase
    .from("affiliates")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Get click and order counts for each affiliate
  const enriched = await Promise.all(
    (affiliates || []).map(async (aff) => {
      const { count: clicks } = await supabase
        .from("referral_clicks")
        .select("*", { count: "exact", head: true })
        .eq("affiliate_id", aff.id);

      const { count: orders } = await supabase
        .from("orders")
        .select("*", { count: "exact", head: true })
        .eq("affiliate_id", aff.id);

      return {
        ...aff,
        pin_hash: undefined, // Don't expose PIN hash
        click_count: clicks || 0,
        order_count: orders || 0,
      };
    })
  );

  return NextResponse.json({ affiliates: enriched });
}

// PATCH — update affiliate status (activate/suspend)
export async function PATCH(request: NextRequest) {
  const authCheck = verifyAdminAuth(request);
  if (!authCheck.authorized) {
    return NextResponse.json({ error: authCheck.error || "Unauthorized" }, { status: authCheck.error?.startsWith("SERVER_MISCONFIGURATION") ? 500 : 401 });
  }

  const body = await request.json();
  const { id, status, tier } = body;

  if (!id) {
    return NextResponse.json({ error: "id required" }, { status: 400 });
  }

  const supabase = createServerSupabase();
  const updateData: Record<string, any> = {};
  if (status) updateData.status = status;
  if (tier) updateData.tier = tier;

  const { data, error } = await supabase
    .from("affiliates")
    .update(updateData)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, affiliate: data });
}
