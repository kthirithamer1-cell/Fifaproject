import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "../../../../lib/supabase";
import { verifyPin, hashPin, signJwtToken } from "../../../../lib/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phone, pin } = body;

    if (!phone || !pin) {
      return NextResponse.json(
        { error: "رقم الهاتف والكود السري مطلوبين" },
        { status: 400 }
      );
    }

    const supabase = createServerSupabase();

    // Fetch affiliate by phone number
    const { data: affiliate, error } = await supabase
      .from("affiliates")
      .select("*")
      .eq("phone", phone)
      .single();

    if (error || !affiliate) {
      return NextResponse.json(
        { error: "رقم الهاتف أو الكود السري غالط" },
        { status: 401 }
      );
    }

    // Verify PIN against stored hash (supports both PBKDF2 and legacy hashes)
    const isValidPin = verifyPin(pin, affiliate.pin_hash);
    if (!isValidPin) {
      return NextResponse.json(
        { error: "رقم الهاتف أو الكود السري غالط" },
        { status: 401 }
      );
    }

    if (affiliate.status === "suspended") {
      return NextResponse.json(
        { error: "الحساب متاعك موقوف. تواصل معانا." },
        { status: 403 }
      );
    }

    // Upgrade legacy PIN hash to PBKDF2 transparently on successful login
    if (!affiliate.pin_hash?.startsWith("pbkdf2_")) {
      const newHash = hashPin(pin);
      await supabase
        .from("affiliates")
        .update({ pin_hash: newHash })
        .eq("id", affiliate.id);
    }

    // Issue a cryptographically signed HMAC-SHA256 JWT session token
    const sessionToken = signJwtToken({ id: affiliate.id, phone: affiliate.phone });

    return NextResponse.json({
      success: true,
      token: sessionToken,
      affiliate: {
        id: affiliate.id,
        name: affiliate.name,
        ref_code: affiliate.ref_code,
        phone: affiliate.phone,
        payment_method: affiliate.payment_method,
        tier: affiliate.tier,
        status: affiliate.status,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json(
      { error: "خطأ في السيرفر" },
      { status: 500 }
    );
  }
}
