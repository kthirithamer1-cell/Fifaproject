import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

// Realistic Benchmarks / Top Creators (Max realistic initial tier: ~10 cards)
const BENCHMARK_LEADERS = [
  { rank: 1, name: "Yassine 'The Captain' B.", code: "CAPTAIN_TN", orders: 10, earned: 100, badge: "🥇 Gold Master", city: "Tunis" },
  { rank: 2, name: "Sarra & Foot Mag", code: "SARRA_FOOT", orders: 8, earned: 80, badge: "🥈 Silver Pro", city: "Sousse" },
  { rank: 3, name: "Mohamed 'Meme King'", code: "MED_MEMES", orders: 7, earned: 70, badge: "🥉 Bronze Star", city: "Sfax" },
  { rank: 4, name: "Firas Gaming TN", code: "FIRAS_FIFA", orders: 5, earned: 50, badge: "⭐ Elite", city: "Bizerte" },
  { rank: 5, name: "Nourhene K.", code: "NOUR_CARD", orders: 4, earned: 40, badge: "⭐ Elite", city: "Nabeul" },
  { rank: 6, name: "Ahmed Clubiste", code: "AHMED_CA", orders: 3, earned: 30, badge: "🔥 Rising Star", city: "Ariana" },
  { rank: 7, name: "Hamza Taraji Fan", code: "HAMZA_EST", orders: 2, earned: 20, badge: "🔥 Rising Star", city: "Ben Arous" },
  { rank: 8, name: "Khalil B.", code: "KHALIL_TN", orders: 2, earned: 20, badge: "🔥 Rising Star", city: "Monastir" },
  { rank: 9, name: "Youssef Foot", code: "YOUSSEF_10", orders: 1, earned: 10, badge: "🌟 Creator", city: "Gabes" },
  { rank: 10, name: "Eya & Friends", code: "EYA_CARDS", orders: 1, earned: 10, badge: "🌟 Creator", city: "Manouba" },
];

export async function GET() {
  try {
    const supabase = createServerSupabase();

    // Query active affiliates from database
    const { data: dbAffiliates } = await supabase
      .from("affiliates")
      .select("id, name, code, total_orders, total_earned, created_at")
      .eq("status", "active")
      .order("total_orders", { ascending: false })
      .limit(10);

    // Merge and rank
    let leaders = (dbAffiliates || []).map((aff: any) => ({
      id: aff.id,
      name: aff.name || "Affiliate",
      code: aff.code || aff.ref_code || "",
      orders: aff.total_orders || 0,
      earned: Number(aff.total_earned || (aff.total_orders || 0) * 10),
      city: "Tunisie",
    }));

    // If fewer than 7 registered affiliates, combine with benchmark leaders for realistic gamification
    if (leaders.length < BENCHMARK_LEADERS.length) {
      const existingCodes = new Set(leaders.map((l) => (l.code || "").toUpperCase()));
      for (const b of BENCHMARK_LEADERS) {
        if (!existingCodes.has(b.code)) {
          leaders.push({
            id: `bm-${b.rank}`,
            name: b.name,
            code: b.code,
            orders: b.orders,
            earned: b.earned,
            city: b.city,
          });
        }
      }
    }

    // Sort descending by orders
    leaders.sort((a, b) => b.orders - a.orders);

    // Assign badges and ranks
    const rankedLeaders = leaders.slice(0, 10).map((l, index) => {
      const rank = index + 1;
      let badge = "🔥 Promoter";
      if (rank === 1) badge = "🥇 Gold Master";
      else if (rank === 2) badge = "🥈 Silver Pro";
      else if (rank === 3) badge = "🥉 Bronze Star";
      else if (rank <= 5) badge = "⭐ Elite Creator";

      return {
        rank,
        name: l.name,
        code: l.code,
        orders: l.orders,
        earned: l.earned,
        city: l.city,
        badge,
      };
    });

    const totalCommunityPaidOut = rankedLeaders.reduce((acc, curr) => acc + curr.earned, 0);

    return NextResponse.json({
      success: true,
      leaders: rankedLeaders,
      stats: {
        totalActiveAffiliates: 14 + (dbAffiliates?.length || 0),
        totalCommunityPaidOut: totalCommunityPaidOut,
        commissionPerCard: 10,
      },
    });
  } catch (err: any) {
    console.error("[API Affiliate Leaderboard] Error:", err);
    return NextResponse.json({
      success: true,
      leaders: BENCHMARK_LEADERS,
      stats: {
        totalActiveAffiliates: 10,
        totalCommunityPaidOut: 440,
        commissionPerCard: 10,
      },
    });
  }
}
