"use client";

import { Logo } from "./Logo";
import { MessageCircle, Heart, Sparkles, ShieldCheck, Truck, ArrowUpRight } from "lucide-react";
import { useEffect, useState } from "react";

export function Footer() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <footer className="relative border-t border-white/10 bg-[#060606] pt-20 pb-10 text-neutral-400 overflow-hidden" suppressHydrationWarning>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" suppressHydrationWarning />
      </footer>
    );
  }

  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative border-t border-white/10 bg-[#060606] pt-20 pb-10 text-neutral-400 overflow-hidden" suppressHydrationWarning>
      {/* Top Gold Border Glow Line */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent pointer-events-none" />

      {/* Ambient Lighting Orbs */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute left-1/4 bottom-0 w-96 h-96 rounded-full bg-[#D4AF37]/[0.03] blur-[150px]" />
        <div className="absolute right-1/4 top-0 w-96 h-96 rounded-full bg-[#F6D365]/[0.03] blur-[150px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" suppressHydrationWarning>
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-4 sm:grid-cols-2 pb-14 border-b border-white/10" suppressHydrationWarning>
          {/* Brand Column */}
          <div className="flex flex-col items-start gap-4" suppressHydrationWarning>
            <Logo />
            <p className="text-xs text-neutral-400 leading-relaxed font-medium">
              Redesign your friends into football legends with funny Tunisian stats and custom printed PVC cards. The #1 custom meme card in Tunisia.
            </p>

            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#F6D365] text-xs font-bold" dir="rtl">
              <Sparkles className="h-3.5 w-3.5 text-[#F6D365]" />
              <span>كارطة مضحكة اليوم... ذكرى خالدة بعد سنين</span>
            </div>

            <div className="flex items-center gap-2 text-[11px] font-semibold text-gray-300 mt-2">
              <Truck className="h-4 w-4 text-[#F6D365]" />
              <span>توصيل لكامل تراب الجمهورية (PVC Premium)</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-4" suppressHydrationWarning>
            <h3 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#D4AF37]" />
              Navigation
            </h3>
            <ul className="flex flex-col gap-3 text-xs font-medium">
              <li>
                <a href="#top" className="group inline-flex items-center gap-1 hover:text-white transition-colors">
                  <span>Home</span>
                  <ArrowUpRight className="h-3 w-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-[#D4AF37]" />
                </a>
              </li>
              <li>
                <a href="#gallery" className="group inline-flex items-center gap-1 hover:text-white transition-colors">
                  <span>Examples & Gallery</span>
                  <ArrowUpRight className="h-3 w-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-[#D4AF37]" />
                </a>
              </li>
              <li>
                <a href="#how" className="group inline-flex items-center gap-1 hover:text-white transition-colors">
                  <span>How It Works</span>
                  <ArrowUpRight className="h-3 w-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-[#D4AF37]" />
                </a>
              </li>
              <li>
                <a href="#glossary" className="group inline-flex items-center gap-1 hover:text-white transition-colors">
                  <span>Stats Dictionary</span>
                  <ArrowUpRight className="h-3 w-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-[#D4AF37]" />
                </a>
              </li>
              <li>
                <a href="#testimonials" className="group inline-flex items-center gap-1 hover:text-white transition-colors">
                  <span>Customer Reviews</span>
                  <ArrowUpRight className="h-3 w-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-[#D4AF37]" />
                </a>
              </li>
            </ul>
          </div>

          {/* Legal / Orders */}
          <div className="flex flex-col gap-4" suppressHydrationWarning>
            <h3 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#D4AF37]" />
              Order & Info
            </h3>
            <ul className="flex flex-col gap-3 text-xs font-medium">
              <li>
                <a href="/generator" className="group inline-flex items-center gap-1.5 text-[#F6D365] font-bold hover:text-white transition-colors">
                  <span>+ Design My Card</span>
                  <Sparkles className="h-3.5 w-3.5" />
                </a>
              </li>
              <li>
                <a href="#packages" className="group inline-flex items-center gap-1 hover:text-white transition-colors">
                  <span>Packages & Pricing</span>
                  <ArrowUpRight className="h-3 w-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-[#D4AF37]" />
                </a>
              </li>
              <li>
                <a href="#faq" className="group inline-flex items-center gap-1 hover:text-white transition-colors">
                  <span>Frequently Asked Questions</span>
                  <ArrowUpRight className="h-3 w-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-[#D4AF37]" />
                </a>
              </li>
              <li>
                <a href="#" className="group inline-flex items-center gap-1 hover:text-white transition-colors">
                  <span>Privacy Policy</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Contact & Social */}
          <div className="flex flex-col gap-4" suppressHydrationWarning>
            <h3 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#D4AF37]" />
              Contact & Socials
            </h3>
            <div className="flex gap-3" suppressHydrationWarning>
              <a
                href="https://www.instagram.com/flawless_official1/"
                target="_blank"
                rel="noreferrer"
                className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-neutral-300 hover:text-[#F6D365] hover:border-[#D4AF37]/50 hover:bg-[#D4AF37]/10 hover:scale-110 hover:shadow-[0_0_20px_rgba(212,175,55,0.3)] transition-all duration-300"
                aria-label="Instagram"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
              <a
                href="https://wa.me/21600000000"
                target="_blank"
                rel="noreferrer"
                className="flex h-11 w-11 items-center justify-center rounded-2xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 hover:scale-110 hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all duration-300"
                aria-label="WhatsApp"
              >
                <MessageCircle className="h-5 w-5" />
              </a>
            </div>

            <div className="mt-2 text-xs text-neutral-400 bg-white/5 border border-white/10 rounded-2xl p-3.5" suppressHydrationWarning>
              <div className="font-bold text-white mb-1 flex items-center gap-1.5" suppressHydrationWarning>
                <ShieldCheck className="h-4 w-4 text-[#F6D365]" />
                <span>Customer Service & Support</span>
              </div>
              <span className="text-neutral-300 font-semibold" suppressHydrationWarning>support@flawless.tn</span>
              <div className="text-[10px] text-gray-500 mt-1" suppressHydrationWarning>Cash on Delivery 🚚</div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 text-[11px] text-neutral-400" suppressHydrationWarning>
          <div suppressHydrationWarning>
            © {currentYear} <strong className="text-white">Flawless TN</strong>. All rights reserved.
          </div>
          <div className="flex items-center gap-1.5 font-semibold text-gray-300" suppressHydrationWarning>
            <span>Designed & crafted with</span>
            <Heart className="h-3.5 w-3.5 text-red-500 fill-red-500 animate-pulse" />
            <span>in Tunisia 🇹🇳</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
