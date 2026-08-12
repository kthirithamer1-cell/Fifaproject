import { NextRequest, NextResponse, after } from "next/server";
import puppeteer from "puppeteer";
import { createServerSupabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

async function generatePdfWithPuppeteerAsync(
    supabase: any,
    orderId: string,
    customerName: string,
    imageUrl: string
) {
    let browser;
    try {
        console.log(`[API Orders Async] Starting Puppeteer PDF generation for order ${orderId}...`);
        
        const pureImageHTML = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html, body { width: 700px; height: 1050px; overflow: hidden; background: #000; }
        .card-container { width: 700px; height: 1050px; display: flex; align-items: center; justify-content: center; }
        img { max-width: 100%; max-height: 100%; object-fit: contain; display: block; }
    </style>
</head>
<body>
    <div class="card-container">
        <img src="${imageUrl}" alt="AI Card Image" />
    </div>
</body>
</html>`;

        browser = await puppeteer.launch({
            headless: true,
            args: [
                "--no-sandbox",
                "--disable-setuid-sandbox",
                "--disable-dev-shm-usage",
                "--disable-gpu",
            ],
        });

        const page = await browser.newPage();
        await page.setViewport({ width: 700, height: 1050, deviceScaleFactor: 3 });
        await page.setContent(pureImageHTML, { waitUntil: "load", timeout: 30000 });
        await new Promise((resolve) => setTimeout(resolve, 300));

        const pdfBuffer = await page.pdf({
            width: "700px",
            height: "1050px",
            printBackground: true,
            margin: { top: "0px", right: "0px", bottom: "0px", left: "0px" },
            preferCSSPageSize: true,
        });

        await browser.close();
        browser = undefined;

        const cleanName = customerName.replace(/[^a-zA-Z0-9]/g, "_");
        const pdfFilename = `orders/${orderId}/${orderId}_${cleanName}_card.pdf`;

        const { data: pdfUploadData, error: pdfUploadError } = await supabase.storage
            .from("card-orders")
            .upload(pdfFilename, pdfBuffer, {
                contentType: "application/pdf",
                upsert: true,
            });

        if (!pdfUploadError && pdfUploadData) {
            const { data: pdfPublicData } = supabase.storage
                .from("card-orders")
                .getPublicUrl(pdfFilename);

            if (pdfPublicData?.publicUrl) {
                const pdfUrl = pdfPublicData.publicUrl;
                console.log(`✅ [API Orders Async] PDF uploaded to Supabase: ${pdfUrl}`);

                await supabase
                    .from("orders")
                    .update({
                        card_pdf_url: pdfUrl,
                        pdf_url: pdfUrl,
                    })
                    .eq("id", orderId);
            }
        } else {
            console.warn("[API Orders Async] PDF storage upload fallback:", pdfUploadError?.message);
        }
    } catch (err: any) {
        if (browser) {
            try { await browser.close(); } catch (_) {}
        }
        console.error(`[API Orders Async] Background PDF exception for order ${orderId}:`, err);
    }
}

async function insertOrderResilient(supabase: any, initialPayload: Record<string, any>) {
    let payload = { ...initialPayload };
    const isMega = payload.card_size === "mega";

    const packageVariations = [
        isMega ? "mega" : "standard",
        isMega ? "ULTIMATE PACK" : "PREMIUM PACK",
        isMega ? "ultimate" : "premium",
        isMega ? "Ultimate" : "Premium",
        isMega ? "Ultimate Pack" : "Premium Pack",
    ];

    let packageVarIndex = 0;

    for (let attempt = 0; attempt < 12; attempt++) {
        const { data, error } = await supabase
            .from("orders")
            .insert([payload])
            .select("id, created_at")
            .single();

        if (!error && data) {
            return { data, error: null };
        }

        if (!error) {
            return { data: { id: `FLW-${Date.now()}`, created_at: new Date().toISOString() }, error: null };
        }

        const msg = error.message || "";
        console.warn(`[API Orders] Attempt ${attempt + 1} error:`, msg);

        // Case 1: Package check constraint error
        if (msg.includes("orders_package_check") || msg.includes("check constraint")) {
            if (packageVarIndex < packageVariations.length) {
                const nextPkg = packageVariations[packageVarIndex++];
                console.log(`[API Orders] Retrying with package variation: '${nextPkg}'`);
                payload.package = nextPkg;
                continue;
            } else {
                console.log(`[API Orders] Removing package column from payload...`);
                delete payload.package;
                continue;
            }
        }

        // Case 2: Column does not exist in schema
        const missingColMatch = msg.match(/Could not find the '([^']+)' column/i);
        if (missingColMatch && missingColMatch[1]) {
            const missingCol = missingColMatch[1];
            console.log(`[API Orders] Removing non-existent column '${missingCol}' from payload and retrying...`);
            delete payload[missingCol];
            continue;
        }

        // Case 3: Column has NOT NULL constraint
        const notNullMatch = msg.match(/null value in column "([^"]+)"/i);
        if (notNullMatch && notNullMatch[1]) {
            const notNullCol = notNullMatch[1];
            console.log(`[API Orders] Column '${notNullCol}' requires value. Providing fallback and retrying...`);
            if (notNullCol === "name" || notNullCol === "customer_name") payload[notNullCol] = payload.customer_name || payload.name || "Customer";
            else if (notNullCol === "phone" || notNullCol === "customer_phone") payload[notNullCol] = payload.phone || payload.customer_phone || "";
            else if (notNullCol === "price" || notNullCol === "total" || notNullCol === "total_price") payload[notNullCol] = payload.total_price || payload.price || 0;
            else if (notNullCol === "package") payload[notNullCol] = isMega ? "mega" : "standard";
            else if (notNullCol === "image_url" || notNullCol === "card_image_url" || notNullCol === "card_pdf_url" || notNullCol === "pdf_url") payload[notNullCol] = payload.card_pdf_url || payload.card_image_url || payload.image_url || "";
            else payload[notNullCol] = "";
            continue;
        }

        return { data: null, error };
    }

    return { data: null, error: new Error("Failed to insert order after constraint resolution attempts") };
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const {
            customerName,
            phone,
            governorate,
            city,
            address,
            cardSize = "standard",
            quantity = 1,
            unitPrice = 49,
            deliveryFee = 8,
            totalPrice,
            cardImageUrl,
            notes = "",
            affiliateCode,
        } = body;

        // Validation
        if (!customerName || !phone || !governorate || !city || !address) {
            return NextResponse.json(
                { error: "الرجاء تعبئة جميع البيانات الإجبارية (الاسم، الهاتف، الولاية، المدينة والعنوان)" },
                { status: 400 }
            );
        }

        const supabase = createServerSupabase();
        const orderIdTemp = `FLW-${Date.now()}`;
        const cleanName = customerName.replace(/[^a-zA-Z0-9]/g, "_");

        // Affiliate attribution lookup (from payload or cookie)
        const cookieAffCode = req.cookies.get("flw_ref")?.value;
        const rawAffCode = affiliateCode || cookieAffCode;
        let matchedAffiliate: any = null;
        const cleanAffCode = rawAffCode ? String(rawAffCode).trim().toUpperCase() : null;

        if (cleanAffCode) {
            try {
                const { data: affData } = await supabase
                    .from("affiliates")
                    .select("*")
                    .or(`code.ilike.${cleanAffCode},ref_code.ilike.${cleanAffCode}`)
                    .maybeSingle();

                if (affData) {
                    matchedAffiliate = affData;
                    matchedAffiliate.code = affData.code || affData.ref_code || cleanAffCode;
                    console.log(`🎯 [API Orders] Attributed order to affiliate: ${matchedAffiliate.code} (ID: ${affData.id})`);
                } else {
                    console.log(`[API Orders] Affiliate code '${cleanAffCode}' not found in DB`);
                }
            } catch (affErr) {
                console.warn("[API Orders] Affiliate lookup warning:", affErr);
            }
        }

        let finalImageUrl = cardImageUrl;
        let rawImageBuffer: Buffer | null = null;
        let imageMimeType = "image/png";

        // 1. Convert base64 card image to Buffer & upload PNG to Supabase storage 'card-orders'
        if (cardImageUrl && cardImageUrl.startsWith("data:image/")) {
            try {
                const matches = cardImageUrl.match(/^data:(image\/\w+);base64,(.+)$/);
                if (matches) {
                    imageMimeType = matches[1];
                    const base64Data = matches[2];
                    rawImageBuffer = Buffer.from(base64Data, "base64");
                    const pngFilename = `orders/${orderIdTemp}/${orderIdTemp}_${cleanName}.png`;

                    const { data: uploadData, error: uploadError } = await supabase.storage
                        .from("card-orders")
                        .upload(pngFilename, rawImageBuffer, {
                            contentType: imageMimeType,
                            upsert: true,
                        });

                    if (!uploadError && uploadData) {
                        const { data: publicUrlData } = supabase.storage
                            .from("card-orders")
                            .getPublicUrl(pngFilename);
                        
                        if (publicUrlData?.publicUrl) {
                            finalImageUrl = publicUrlData.publicUrl;
                        }
                    } else {
                        console.warn("[API Orders] Storage image upload fallback:", uploadError?.message);
                    }
                }
            } catch (storageErr) {
                console.error("[API Orders] Storage image upload exception:", storageErr);
            }
        }

        const computedTotal = totalPrice || ((Number(quantity) * Number(unitPrice)) + Number(deliveryFee));
        const commissionAmount = matchedAffiliate ? Number(matchedAffiliate.commission_per_order || 10.00) : 10.00;

        const initialPayload: Record<string, any> = {
            customer_name: customerName.trim(),
            name: customerName.trim(),
            phone: phone.trim(),
            customer_phone: phone.trim(),
            package: cardSize === "mega" ? "standard" : "standard",
            governorate: governorate.trim(),
            city: city.trim(),
            address: address.trim(),
            card_size: cardSize,
            quantity: Number(quantity),
            unit_price: Number(unitPrice),
            delivery_fee: Number(deliveryFee),
            total_price: Number(computedTotal),
            price: Number(computedTotal),
            total: Number(computedTotal),
            card_image_url: finalImageUrl,
            notes: notes ? notes.trim() : null,
            status: "pending",
            affiliate_code: matchedAffiliate ? matchedAffiliate.code : (cleanAffCode || null),
            affiliate_id: matchedAffiliate ? matchedAffiliate.id : null,
            commission_amount: matchedAffiliate ? commissionAmount : null,
            commission_status: matchedAffiliate ? "pending" : null,
        };

        const { data: orderData, error: insertError } = await insertOrderResilient(supabase, initialPayload);

        if (insertError) {
            console.error("[API Orders] Insert error:", insertError);
            throw new Error(insertError.message || "Failed to create order");
        }

        // Increment affiliate statistics
        if (matchedAffiliate) {
            try {
                await supabase
                    .from("affiliates")
                    .update({
                        total_orders: (matchedAffiliate.total_orders || 0) + 1,
                        total_earned: (Number(matchedAffiliate.total_earned) || 0) + commissionAmount,
                        updated_at: new Date().toISOString(),
                    })
                    .eq("id", matchedAffiliate.id);
            } catch (updateAffErr) {
                console.warn("[API Orders] Failed to increment affiliate count:", updateAffErr);
            }
        }

        const finalOrderId = orderData?.id || orderIdTemp;
        console.log("✅ [API Orders] Order created instantly:", finalOrderId);

        // 2. Schedule Vercel-safe asynchronous background Puppeteer PDF generation via Next.js after()
        if (finalImageUrl) {
            after(async () => {
                try {
                    await generatePdfWithPuppeteerAsync(supabase, finalOrderId, customerName, finalImageUrl);
                } catch (err) {
                    console.error("[API Orders Background] PDF generation exception:", err);
                }
            });
        }

        return NextResponse.json({
            success: true,
            orderId: finalOrderId,
            createdAt: orderData?.created_at || new Date().toISOString(),
            message: "تم تسجيل طلبك بنجاح! سنتصل بك قريباً لتأكيد التوصيل.",
        });

    } catch (error: any) {
        console.error("[API Orders] Error processing order:", error);
        return NextResponse.json(
            { error: error.message || "حدث خطأ أثناء تسجيل الطلب. الرجاء المحاولة مرة أخرى." },
            { status: 500 }
        );
    }
}
