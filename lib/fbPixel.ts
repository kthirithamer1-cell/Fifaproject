/**
 * Facebook Meta Pixel Helper
 * Pixel ID: 2660680664349474
 *
 * Centralizes all fbq() calls with type safety and SSR guards.
 * Full funnel: PageView → ViewContent → AddToCart → InitiateCheckout → Purchase
 */

// Safe fbq caller — guards against SSR and pixel not loaded
function fbq(...args: any[]) {
  if (typeof window !== "undefined" && typeof (window as any).fbq === "function") {
    (window as any).fbq(...args);
  }
}

// ─── Standard Events ───────────────────────────────────────────────────

/**
 * ViewContent — User views a product/card page
 * Fire on: /cards/[slug] product page, /generator page load
 */
export function trackViewContent(params: {
  content_name: string;
  content_type?: string;
  content_ids?: string[];
  value?: number;
  currency?: string;
}) {
  fbq("track", "ViewContent", {
    content_type: "product",
    currency: "TND",
    ...params,
  });
}

/**
 * AddToCart — User commits to ordering (clicks "Order" from review step)
 * Fire on: review → checkout transition
 */
export function trackAddToCart(params: {
  content_name: string;
  content_ids?: string[];
  value: number;
  currency?: string;
  content_type?: string;
}) {
  fbq("track", "AddToCart", {
    content_type: "product",
    currency: "TND",
    ...params,
  });
}

/**
 * InitiateCheckout — User enters the checkout/delivery form
 * Fire on: checkout step renders
 */
export function trackInitiateCheckout(params: {
  content_name?: string;
  value: number;
  currency?: string;
  num_items?: number;
}) {
  fbq("track", "InitiateCheckout", {
    currency: "TND",
    ...params,
  });
}

/**
 * Purchase — Order confirmed by server (payment = Cash on Delivery confirmation)
 * Fire on: /api/orders returns success
 */
export function trackPurchase(params: {
  value: number;
  currency?: string;
  content_name: string;
  content_type?: string;
  content_ids?: string[];
  num_items?: number;
}) {
  fbq("track", "Purchase", {
    content_type: "product",
    currency: "TND",
    ...params,
  });
}
