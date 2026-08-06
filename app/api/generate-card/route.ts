import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "../../../lib/supabase";

// ─── Cooldown Helper (24-Hour Rate Limit) ───────────────────────────────────
const COOLDOWN_MS = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

function checkCooldown(req: NextRequest) {
    const cookie = req.cookies.get("card_last_gen");
    if (!cookie || !cookie.value) {
        return { isAllowed: true, remainingSeconds: 0 };
    }

    const lastGenTime = parseInt(cookie.value, 10);
    if (isNaN(lastGenTime)) {
        return { isAllowed: true, remainingSeconds: 0 };
    }

    const elapsed = Date.now() - lastGenTime;
    if (elapsed < COOLDOWN_MS) {
        const remainingSeconds = Math.ceil((COOLDOWN_MS - elapsed) / 1000);
        return {
            isAllowed: false,
            remainingSeconds,
            nextAllowedAt: new Date(lastGenTime + COOLDOWN_MS).toISOString(),
        };
    }

    return { isAllowed: true, remainingSeconds: 0 };
}

// ─── GET Handler: Check generation cooldown status ──────────────────────────
export async function GET(req: NextRequest) {
    const cooldown = checkCooldown(req);
    if (!cooldown.isAllowed) {
        return NextResponse.json({
            canGenerate: false,
            cooldownRemainingSeconds: cooldown.remainingSeconds,
            nextAllowedAt: cooldown.nextAllowedAt,
            message: "24-hour AI generation cooldown active. You can edit your card details freely or share on social media to unlock!",
        });
    }

    return NextResponse.json({
        canGenerate: true,
        cooldownRemainingSeconds: 0,
    });
}

// ─── DELETE Handler: Unlock 24-hour cooldown by social media share ─────────
export async function DELETE() {
    const response = NextResponse.json({
        success: true,
        message: "AI Card Regeneration unlocked via social media share! 🎉",
    });

    // Clear rate limit cookie
    response.cookies.set("card_last_gen", "", {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        maxAge: 0,
        expires: new Date(0),
    });

    return response;
}

// ─── Main POST handler: Instant job creation + fire-and-forget ────────────────
export async function POST(req: NextRequest) {
    try {
        // 1. Enforce 24-hour rate limit
        const cooldown = checkCooldown(req);
        if (!cooldown.isAllowed) {
            return NextResponse.json(
                {
                    error: `You can only generate an AI card once every 24 hours. You can still edit your existing card details freely! Next generation available in ${Math.floor((cooldown.remainingSeconds || 0) / 3600)}h ${Math.floor(((cooldown.remainingSeconds || 0) % 3600) / 60)}m.`,
                    cooldownRemainingSeconds: cooldown.remainingSeconds,
                    nextAllowedAt: cooldown.nextAllowedAt,
                },
                { status: 429 }
            );
        }

        // 2. Parse & validate request body
        const body = await req.json();
        const { photo } = body;

        if (!photo) {
            return NextResponse.json({ error: "Photo is required" }, { status: 400 });
        }

        // 3. Generate a unique job ID
        const jobId = crypto.randomUUID();

        // 4. Insert job into Supabase as "pending"
        const supabase = createServerSupabase();
        const { error: insertError } = await supabase
            .from("card_jobs")
            .insert({
                id: jobId,
                status: "pending",
                input: body,  // full payload: photo, cardData, stats, profileInfo, etc.
            });

        if (insertError) {
            console.error("[generate-card] Failed to create job:", insertError);
            return NextResponse.json(
                { error: "Failed to queue card generation" },
                { status: 500 }
            );
        }

        // 5. Fire-and-forget: trigger the background worker (dynamically resolves host for Vercel)
        const host = req.headers.get("host");
        const protocol = req.headers.get("x-forwarded-proto") || (host?.includes("localhost") ? "http" : "https");
        const baseUrl = process.env.BASE_URL || (host ? `${protocol}://${host}` : "http://localhost:3000");

        fetch(`${baseUrl}/api/process-card`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ jobId }),
        }).catch((err) => {
            console.error("[generate-card] Fire-and-forget failed:", err.message);
        });

        console.log(`[generate-card] ✅ Job ${jobId} queued — returning immediately`);

        // 6. Set cooldown cookie and return jobId instantly
        const response = NextResponse.json({ jobId });
        response.cookies.set("card_last_gen", Date.now().toString(), {
            httpOnly: true,
            sameSite: "lax",
            path: "/",
            maxAge: 86400, // 24 hours in seconds
        });

        return response;

    } catch (error: any) {
        console.error("API Route Error:", error);
        return NextResponse.json(
            {
                error: error.message || "Failed to queue card generation",
                details: {
                    message: error.message || null,
                    code: error.code || null,
                    status: error.status || null,
                }
            },
            { status: 500 }
        );
    }
}
