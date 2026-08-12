/**
 * Flawless TN - Affiliate & Referral Tracking Engine
 */

export function getAffiliateCode(): string | null {
  if (typeof window === "undefined") return null;

  // 1. Try URL parameter first
  try {
    const params = new URLSearchParams(window.location.search);
    const refParam = params.get("ref") || params.get("aff") || params.get("code");
    if (refParam && refParam.trim()) {
      return refParam.trim().toUpperCase();
    }
  } catch (_) {}

  // 2. Try localStorage flw_ref
  try {
    const stored = localStorage.getItem("flw_ref");
    if (stored && stored.trim()) {
      return stored.trim().toUpperCase();
    }
  } catch (_) {}

  // 3. Try cookies
  try {
    const match = document.cookie.match(/(?:^|;\s*)flw_ref=([^;]+)/);
    if (match && match[1]) {
      return decodeURIComponent(match[1]).trim().toUpperCase();
    }
  } catch (_) {}

  // 4. Try active affiliate session (convenient for testing while logged into affiliate dashboard)
  try {
    const affUser = localStorage.getItem("flw_aff_user");
    if (affUser) {
      const parsed = JSON.parse(affUser);
      const code = parsed?.code || parsed?.ref_code;
      if (code && typeof code === "string" && code.trim()) {
        return code.trim().toUpperCase();
      }
    }
  } catch (_) {}

  return null;
}

export async function initAffiliateTracker(): Promise<string | null> {
  if (typeof window === "undefined") return null;

  try {
    const params = new URLSearchParams(window.location.search);
    const refParam = params.get("ref") || params.get("aff") || params.get("code");

    if (refParam && refParam.trim()) {
      const code = refParam.trim().toUpperCase();

      // Store in localStorage
      localStorage.setItem("flw_ref", code);
      localStorage.setItem("flw_ref_time", Date.now().toString());

      // Store in cookie (30 days validity)
      const maxAge = 30 * 24 * 60 * 60;
      document.cookie = `flw_ref=${encodeURIComponent(code)}; max-age=${maxAge}; path=/; SameSite=Lax`;

      // Log click event once per session
      const sessionKey = `flw_click_tracked_${code}`;
      if (!sessionStorage.getItem(sessionKey)) {
        sessionStorage.setItem(sessionKey, "1");
        
        fetch("/api/affiliate/track", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            event: "click",
            code: code,
          }),
        }).catch((err) => console.warn("[Affiliate Tracker] Click log error:", err));
      }

      return code;
    }
  } catch (err) {
    console.warn("[Affiliate Tracker] Init error:", err);
  }

  return getAffiliateCode();
}

export async function trackCardGenerated(customCode?: string) {
  if (typeof window === "undefined") return;

  const code = customCode ? customCode.trim().toUpperCase() : getAffiliateCode();
  if (!code) {
    console.log("[Affiliate Tracker] No affiliate code detected to attribute card generation.");
    return;
  }

  try {
    console.log(`[Affiliate Tracker] 🎯 Tracking card generation for affiliate: @${code}`);
    const res = await fetch("/api/affiliate/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event: "card_generated",
        code: code,
      }),
    });
    const data = await res.json();
    console.log("[Affiliate Tracker] Card generation logged response:", data);
  } catch (err) {
    console.warn("[Affiliate Tracker] trackCardGenerated error:", err);
  }
}
