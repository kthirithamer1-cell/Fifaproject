import { NextRequest, NextResponse } from "next/server";

// ─── DEV ONLY: Simulate or reset 24h rate limit for testing ─────────────────
// Visit /api/test-cooldown?reset=true in your browser to RESET attempts back to 3
// Visit /api/test-cooldown in your browser to ACTIVATE 24h cooldown mode (3/3 used)

export async function GET(req: NextRequest) {
    const isReset = req.nextUrl.searchParams.has("reset") || req.nextUrl.searchParams.has("clear");

    if (isReset) {
        const response = NextResponse.json({
            success: true,
            message: "✅ Rate limit cleared! You have 3 generations available again. Please refresh /generator",
        });

        response.cookies.set("card_limit_data", "", {
            httpOnly: true,
            sameSite: "lax",
            path: "/",
            maxAge: 0,
            expires: new Date(0),
        });

        response.cookies.set("card_last_gen", "", {
            httpOnly: true,
            sameSite: "lax",
            path: "/",
            maxAge: 0,
            expires: new Date(0),
        });

        return response;
    }

    const response = NextResponse.json({
        success: true,
        message: "✅ Rate limit activated (3/3 generations used)! You are now in 24-hour cooldown mode.",
    });

    response.cookies.set("card_limit_data", JSON.stringify({ count: 3, windowStart: Date.now() }), {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        maxAge: 86400, // 24 hours
    });

    return response;
}

export async function DELETE() {
    const response = NextResponse.json({
        success: true,
        message: "✅ Rate limit cleared! You have 3 generations available again.",
    });

    response.cookies.set("card_limit_data", "", {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        maxAge: 0,
        expires: new Date(0),
    });

    response.cookies.set("card_last_gen", "", {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        maxAge: 0,
        expires: new Date(0),
    });

    return response;
}

