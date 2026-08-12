import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { identifier, password } = body;

    if (!identifier || !password) {
      return NextResponse.json(
        { error: "الرجاء إدخال رقم الهاتف أو الكود وكلمة المرور" },
        { status: 400 }
      );
    }

    const cleanIdentifier = String(identifier).trim();
    const supabase = createServerSupabase();

    // Query by code, ref_code, phone, or email
    let affiliate: any = null;

    // 1. Try direct search
    const { data, error } = await supabase
      .from("affiliates")
      .select("*")
      .or(`code.ilike.${cleanIdentifier.toUpperCase()},phone.eq.${cleanIdentifier},email.ilike.${cleanIdentifier}`)
      .maybeSingle();

    if (data) {
      affiliate = data;
    } else {
      // 2. Fallback search by ref_code
      const { data: fallbackData } = await supabase
        .from("affiliates")
        .select("*")
        .or(`ref_code.ilike.${cleanIdentifier.toUpperCase()}`)
        .maybeSingle();
      if (fallbackData) affiliate = fallbackData;
    }

    if (!affiliate) {
      return NextResponse.json(
        { error: "الحساب غير موجود، يرجى التثبت من البيانات" },
        { status: 404 }
      );
    }

    if (affiliate.status === "suspended") {
      return NextResponse.json(
        { error: "تم تجميد هذا الحساب، يرجى الاتصال بالإدارة" },
        { status: 403 }
      );
    }

    // Verify password
    if (affiliate.password_hash !== password && affiliate.password !== password) {
      return NextResponse.json(
        { error: "كلمة المرور غير صحيحة" },
        { status: 401 }
      );
    }

    // Don't return password in response
    const { password_hash, password: _p, ...safeAffiliate } = affiliate;
    safeAffiliate.code = safeAffiliate.code || safeAffiliate.ref_code || cleanIdentifier;

    return NextResponse.json({
      success: true,
      affiliate: safeAffiliate,
    });
  } catch (err: any) {
    console.error("[API Affiliate Login] Exception:", err);
    return NextResponse.json(
      { error: err.message || "حدث خطأ أثناء تسجيل الدخول" },
      { status: 500 }
    );
  }
}
