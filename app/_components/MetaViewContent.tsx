"use client";

import { useEffect } from "react";
import { trackViewContent } from "@/lib/fbPixel";

/**
 * Client component that fires Meta Pixel ViewContent on mount.
 * Drop into any server component page to track product views.
 */
export default function MetaViewContent({
  contentName,
  contentIds,
  value,
}: {
  contentName: string;
  contentIds?: string[];
  value?: number;
}) {
  useEffect(() => {
    trackViewContent({
      content_name: contentName,
      content_ids: contentIds,
      value,
    });
  }, [contentName, contentIds, value]);

  return null; // Renders nothing — fires pixel only
}
