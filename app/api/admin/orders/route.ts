import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "../../../../lib/supabase";
import { verifyAdminAuth } from "../../../../lib/auth";

// GET — list all orders with optional filters
export async function GET(request: NextRequest) {
  const authCheck = verifyAdminAuth(request);
  if (!authCheck.authorized) {
    return NextResponse.json({ error: authCheck.error || "Unauthorized" }, { status: authCheck.error?.startsWith("SERVER_MISCONFIGURATION") ? 500 : 401 });
  }

  const supabase = createServerSupabase();
  const { searchParams } = request.nextUrl;
  const status = searchParams.get("status");
  const page = parseInt(searchParams.get("page") || "1");
  const limit = 50;
  const offset = (page - 1) * limit;

  let query = supabase
    .from("orders")
    .select("*, affiliates(name, ref_code)", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (status && status !== "all") {
    query = query.eq("status", status);
  }

  const { data: orders, error, count } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    orders: orders || [],
    total: count || 0,
    page,
    pages: Math.ceil((count || 0) / limit),
  });
}

// PATCH — update order status
export async function PATCH(request: NextRequest) {
  const authCheck = verifyAdminAuth(request);
  if (!authCheck.authorized) {
    return NextResponse.json({ error: authCheck.error || "Unauthorized" }, { status: authCheck.error?.startsWith("SERVER_MISCONFIGURATION") ? 500 : 401 });
  }

  const body = await request.json();
  const { id, status } = body;

  if (!id || !status) {
    return NextResponse.json({ error: "id and status required" }, { status: 400 });
  }

  const supabase = createServerSupabase();

  const updateData: Record<string, any> = { status };
  if (status === "delivered") {
    updateData.delivered_at = new Date().toISOString();
  }

  const { data, error } = await supabase
    .from("orders")
    .update(updateData)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, order: data });
}
