"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, ArrowLeft, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function FloatingCtaBar() {
  const [isVisible, setIsVisible] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      // Show floating CTA once user has scrolled past 350px
      if (window.scrollY > 350) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="fixed bottom-0 inset-x-0 z-40 p-3 sm:hidden bg-neutral-950/95 border-t border-[#D4AF37]/30 backdrop-blur-xl shadow-[0_-10px_30px_rgba(0,0,0,0.8)] pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))]"
          dir="rtl"
        >
          <div className="flex items-center justify-between gap-3 max-w-md mx-auto">
            <div className="text-right">
              <div className="text-xs font-bold text-white font-space flex items-center gap-1">
                <span>كارت مخصص</span>
                <span className="text-[#F6D365] font-black">من 49 DT</span>
              </div>
              <div className="text-[10px] text-emerald-400 font-space font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> خلاص عند الاستلام
              </div>
            </div>

            <button
              onClick={() => router.push("/generator")}
              className="py-2.5 px-5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#F6D365] text-black font-black text-xs shadow-lg shadow-[#D4AF37]/20 flex items-center gap-1.5 cursor-pointer font-space active:scale-95 transition-transform"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>صمّم كارتك الآن</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
