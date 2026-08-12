import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, phone, email, code, password, paymentMethod = "D17", paymentDetails } = body;

    // Basic Validation
    if (!name || !phone || !code || !password || !paymentDetails) {
      return NextResponse.json(
        { error: "الرجاء تعبئة جميع الحقول الإجبارية (الاسم، الهاتف، كود الإحالة، كلمة السر، وتفاصيل الدفع)" },
        { status: 400 }
      );
    }

    const cleanCode = String(code).trim().toUpperCase().replace(/[^A-Z0-9_-]/g, "");
    if (cleanCode.length < 3 || cleanCode.length > 20) {
      return NextResponse.json(
        { error: "كود الإحالة يجب أن يتكون من 3 إلى 20 حرف ورقم بدون مسافات" },
        { status: 400 }
      );
    }

    const cleanPhone = String(phone).trim().replace(/\s+/g, "");

    const supabase = createServerSupabase();

    // Check if code is already registered
    const { data: existingCode } = await supabase
      .from("affiliates")
      .select("id")
      .ilike("code", cleanCode)
      .maybeSingle();

    if (existingCode) {
      return NextResponse.json(
        { error: "كود الإحالة هذا مأخوذ بالفعل، الرجاء اختيار كود آخر" },
        { status: 409 }
      );
    }

    // Check if phone is already registered
    const { data: existingPhone } = await supabase
      .from("affiliates")
      .select("id")
      .eq("phone", cleanPhone)
      .maybeSingle();

    if (existingPhone) {
      return NextResponse.json(
        { error: "رقم الهاتف هذا مسجل مسبقاً، يرجى تسجيل الدخول مباشرة" },
        { status: 409 }
      );
    }

    // Insert new affiliate with 10 DT default commission & legacy schema compatibility
    let payload: Record<string, any> = {
      name: name.trim(),
      full_name: name.trim(),
      phone: cleanPhone,
      email: email ? email.trim().toLowerCase() : null,
      code: cleanCode,
      ref_code: cleanCode,
      referral_code: cleanCode,
      password_hash: password, // For lightweight custom auth
      payment_method: paymentMethod,
      payment_details: paymentDetails.trim(),
      commission_per_order: 10.00,
      status: "active",
      total_clicks: 0,
      total_generated: 0,
      total_orders: 0,
      total_earned: 0.00,
      total_paid: 0.00,
    };

    let inserted: any = null;
    let insertError: any = null;

    for (let attempt = 0; attempt < 8; attempt++) {
      const res = await supabase
        .from("affiliates")
        .insert([payload])
        .select("*")
        .single();

      if (!res.error && res.data) {
        inserted = res.data;
        insertError = null;
        break;
      }

      insertError = res.error;
      const msg = res.error?.message || "";
      console.warn(`[API Affiliate Register] Attempt ${attempt + 1} error:`, msg);

      // Case 1: Column does not exist in schema
      const missingColMatch = msg.match(/Could not find the '([^']+)' column/i);
      if (missingColMatch && missingColMatch[1]) {
        const missingCol = missingColMatch[1];
        console.log(`[API Affiliate Register] Removing non-existent column '${missingCol}'...`);
        delete payload[missingCol];
        continue;
      }

      // Case 2: Column has NOT NULL constraint
      const notNullMatch = msg.match(/null value in column "([^"]+)"/i);
      if (notNullMatch && notNullMatch[1]) {
        const notNullCol = notNullMatch[1];
        console.log(`[API Affiliate Register] Providing fallback for NOT NULL column '${notNullCol}'...`);
        if (notNullCol === "ref_code" || notNullCol === "code" || notNullCol === "referral_code") payload[notNullCol] = cleanCode;
        else if (notNullCol === "name" || notNullCol === "full_name") payload[notNullCol] = name.trim();
        else if (notNullCol === "phone") payload[notNullCol] = cleanPhone;
        else if (notNullCol === "password" || notNullCol === "password_hash") payload[notNullCol] = password;
        else if (notNullCol === "payment_details") payload[notNullCol] = paymentDetails.trim();
        else payload[notNullCol] = "";
        continue;
      }

      // Case 3: Check constraint error (e.g., payment_method or status)
      if (msg.includes("check constraint") || msg.includes("affiliates_payment_method_check")) {
        console.log(`[API Affiliate Register] Check constraint error on payment_method. Retrying with variations...`);
        if (payload.payment_method === "D17") {
          payload.payment_method = "d17";
          continue;
        } else if (payload.payment_method === "Flouci") {
          payload.payment_method = "flouci";
          continue;
        } else if (payload.payment_method === "Bank_RIB") {
          payload.payment_method = "bank";
          continue;
        } else {
          delete payload.payment_method;
          continue;
        }
      }

      break;
    }

    if (insertError || !inserted) {
      console.error("[API Affiliate Register] DB error:", insertError);
      return NextResponse.json(
        { error: insertError?.message || "فشل إنشاء الحساب، يرجى المحاولة لاحقاً" },
        { status: 500 }
      );
    }

    // Normalize code for frontend
    inserted.code = inserted.code || inserted.ref_code || cleanCode;

    return NextResponse.json({
      success: true,
      message: "تم إنشاء حسابك الشريك بنجاح!",
      affiliate: inserted,
    });
  } catch (err: any) {
    console.error("[API Affiliate Register] Exception:", err);
    return NextResponse.json(
      { error: err.message || "حدث خطأ غير متوقع أثناء التسجيل" },
      { status: 500 }
    );
  }
}
