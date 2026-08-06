import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "../../../../lib/supabase";
import { hashPin } from "../../../../lib/auth";

// Generate a unique referral code from name
function generateRefCode(name: string): string {
  const cleanName = name
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "")
    .slice(0, 8);
  const suffix = Math.random().toString(36).slice(2, 5).toUpperCase();
  return `${cleanName}-${suffix}`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, phone, instagram, tiktok, governorate, pin, payment_method, flouci_id, card_number } = body;

    // Validation
    if (!name || !phone || !pin) {
      return NextResponse.json(
        { error: "الإسم، رقم الهاتف، والكود السري مطلوبين" },
        { status: 400 }
      );
    }

    if (pin.length !== 4 || !/^\d{4}$/.test(pin)) {
      return NextResponse.json(
        { error: "الكود السري لازم يكون 4 أرقام" },
        { status: 400 }
      );
    }

    if (!/^\d{8}$/.test(phone)) {
      return NextResponse.json(
        { error: "رقم الهاتف لازم يكون 8 أرقام" },
        { status: 400 }
      );
    }

    const supabase = createServerSupabase();

    // Check if phone already registered
    const { data: existing } = await supabase
      .from("affiliates")
      .select("id")
      .eq("phone", phone)
      .single();

    if (existing) {
      return NextResponse.json(
        { error: "هذا الرقم مسجل من قبل. حاول تسجل دخول." },
        { status: 409 }
      );
    }

    // Generate unique ref code
    let refCode = generateRefCode(name);
    let attempts = 0;
    while (attempts < 5) {
      const { data: codeExists } = await supabase
        .from("affiliates")
        .select("id")
        .eq("ref_code", refCode)
        .single();

      if (!codeExists) break;
      refCode = generateRefCode(name);
      attempts++;
    }

    // Create affiliate with salted cryptographic PBKDF2 PIN hash
    const { data: affiliate, error } = await supabase
      .from("affiliates")
      .insert({
        name,
        phone,
        instagram: instagram || null,
        tiktok: tiktok || null,
        governorate: governorate || null,
        ref_code: refCode,
        payment_method: payment_method || "flouci",
        flouci_id: flouci_id || null,
        card_number: card_number || null,
        pin_hash: hashPin(pin),
      })
      .select()
      .single();

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: "صار مشكل في التسجيل. حاول مرة أخرى." },
        { status: 500 }
      );
    }

    const baseUrl = request.nextUrl.origin;
    const referralUrl = `${baseUrl}/?ref=${refCode}`;

    return NextResponse.json({
      success: true,
      affiliate: {
        id: affiliate.id,
        name: affiliate.name,
        ref_code: refCode,
        referral_url: referralUrl,
      },
    });
  } catch (err) {
    console.error("Registration error:", err);
    return NextResponse.json(
      { error: "خطأ في السيرفر" },
      { status: 500 }
    );
  }
}
