"use client";

import { useEffect } from "react";

/**
 * ReferralTracker — silently detects ?ref=CODE in the URL,
 * stores it in a cookie (30 days), and logs the click to Supabase.
 * No visible UI. Place in layout.tsx.
 */
export function ReferralTracker() {
  useEffect(() => {
    try {
      const url = new URL(window.location.href);
      const refCode = url.searchParams.get("ref");

      if (!refCode) return;

      // Check if we already have a referral cookie (first-click attribution)
      const existingRef = document.cookie
        .split("; ")
        .find((c) => c.startsWith("flawless_ref="));

      if (existingRef) return; // Don't overwrite existing referral

      // Set cookie for 30 days
      const expires = new Date();
      expires.setDate(expires.getDate() + 30);
      document.cookie = `flawless_ref=${refCode};expires=${expires.toUTCString()};path=/;SameSite=Lax`;

      // Log the click to our API
      fetch("/api/affiliate/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ref_code: refCode,
          source_url: window.location.href,
        }),
      }).catch(() => {
        // Silent fail — don't block user experience
      });

      // Clean the URL (remove ?ref= without page reload)
      url.searchParams.delete("ref");
      const cleanUrl = url.pathname + (url.search || "") + (url.hash || "");
      window.history.replaceState({}, "", cleanUrl);
    } catch {
      // Silent fail
    }
  }, []);

  return null; // No visible UI
}
