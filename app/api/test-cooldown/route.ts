import { NextResponse } from "next/server";

// ─── DEV ONLY: Simulate 24h cooldown for testing share-to-unlock flow ────────
// Hit GET /api/test-cooldown to SET the cooldown cookie (simulates a generation)
// Hit DELETE /api/test-cooldown to CLEAR the cooldown cookie (reset for testing)

export async function GET() {
    const response = NextResponse.json({
        success: true,
        message: "✅ Cooldown activated! You are now in 24-hour cooldown mode. Go to /generator and try to regenerate — the share unlock modal should appear.",
    });

    // Set the cooldown cookie as if the user just generated a card
    response.cookies.set("card_last_gen", Date.now().toString(), {
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
        message: "✅ Cooldown cleared! You can now generate freely again.",
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
