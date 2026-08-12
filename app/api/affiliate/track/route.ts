import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { event, code } = body;

    if (!code || !event) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const cleanCode = String(code).trim().toUpperCase();
    const supabase = createServerSupabase();

    // 1. Look up affiliate by promo code or ref_code
    let affiliate: any = null;
    const { data: affData } = await supabase
      .from("affiliates")
      .select("*")
      .or(`code.ilike.${cleanCode},ref_code.ilike.${cleanCode}`)
      .maybeSingle();

    if (affData) {
      affiliate = affData;
      affiliate.code = affiliate.code || affiliate.ref_code || cleanCode;
    }

    if (!affiliate) {
      // Return success gracefully so client isn't disrupted if code doesn't exist
      return NextResponse.json({ success: false, message: "Affiliate not found" });
    }

    if (affiliate.status === "suspended") {
      return NextResponse.json({ success: false, message: "Affiliate suspended" });
    }

    // 2. Log event in affiliate_events table safely
    try {
      const userAgent = req.headers.get("user-agent") || "";
      const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "anon";
      const ipHash = Buffer.from(ip).toString("base64").slice(0, 16);

      await supabase.from("affiliate_events").insert([
        {
          affiliate_id: affiliate.id,
          affiliate_code: affiliate.code,
          event_type: event, // 'click' or 'card_generated'
          ip_hash: ipHash,
          user_agent: userAgent.slice(0, 200),
        },
      ]);
    } catch (insertEventErr) {
      console.warn("[API Affiliate Track] affiliate_events insert fallback:", insertEventErr);
    }

    // 3. Increment counters on affiliates table
    if (event === "click") {
      const newClicks = (Number(affiliate.total_clicks) || 0) + 1;
      console.log(`[API Affiliate Track] Incrementing clicks for @${affiliate.code} -> ${newClicks}`);
      await supabase
        .from("affiliates")
        .update({
          total_clicks: newClicks,
          updated_at: new Date().toISOString(),
        })
        .eq("id", affiliate.id);
    } else if (event === "card_generated") {
      const newGenerated = (Number(affiliate.total_generated) || 0) + 1;
      console.log(`[API Affiliate Track] Incrementing cards generated for @${affiliate.code} -> ${newGenerated}`);
      const { error: updateErr } = await supabase
        .from("affiliates")
        .update({
          total_generated: newGenerated,
          updated_at: new Date().toISOString(),
        })
        .eq("id", affiliate.id);

      if (updateErr) {
        console.warn("[API Affiliate Track] Update total_generated warning:", updateErr.message);
      }
    }

    return NextResponse.json({
      success: true,
      event,
      affiliateCode: affiliate.code,
    });
  } catch (error: any) {
    console.error("[API Affiliate Track] Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
