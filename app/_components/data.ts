import {
  NAV_ITEMS as navItems,
  MARKETING_FEATURES as features,
  GALLERY_MEMES as gallery,
  WORKFLOW_STEPS as steps,
  FUNNY_STATS_LIST as funnyStats,
  CARD_PACKAGES as packages,
  TESTIMONIALS_LIST as testimonials,
  FAQ_ITEMS as faqs,
  TUNISIA_STATS,
} from "@/app/constant";

export { navItems, features, gallery, steps, funnyStats, packages, testimonials, faqs };

export const allTunisianStats = TUNISIA_STATS.map((s) => ({
  code: s.code,
  label: s.stat,
  meaning: s.meaning,
  icon: s.emoji,
}));
