"use client";

import { useEffect } from "react";
import { initAffiliateTracker } from "@/lib/affiliateTracker";

export function AffiliateTrackerProvider() {
  useEffect(() => {
    initAffiliateTracker();
  }, []);

  return null;
}
