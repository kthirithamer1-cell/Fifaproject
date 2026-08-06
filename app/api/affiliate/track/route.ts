import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "../../../../lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { ref_code, source_url } = body;

    if (!ref_code) {
      return NextResponse.json({ error: "Missing ref_code" }, { status: 400 });
    }

    const supabase = createServerSupabase();

    // Verify the affiliate exists and is active
    const { data: affiliate } = await supabase
      .from("affiliates")
      .select("id, status")
      .eq("ref_code", ref_code)
      .single();

    if (!affiliate || affiliate.status !== "active") {
      return NextResponse.json({ error: "Invalid referral code" }, { status: 404 });
    }

    // Get IP and user agent from request
    const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown";
    const userAgent = request.headers.get("user-agent") || "unknown";

    // Log the click
    await supabase.from("referral_clicks").insert({
      affiliate_id: affiliate.id,
      ref_code,
      ip_address: ip,
      user_agent: userAgent,
      source_url: source_url || null,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Track error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
