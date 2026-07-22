import { Logo } from "./Logo";
import { MessageCircle, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-white/[.06] bg-[#080808] pt-16 pb-8 text-neutral-400">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4 sm:grid-cols-2 pb-12 border-b border-white/[.06]">
          {/* Brand Column */}
          <div className="flex flex-col items-start gap-4">
            <Logo />
            <p className="text-xs text-neutral-500 leading-relaxed font-medium">
              Redesign your friends into football legends with funny Tunisian stats and custom printed PVC cards. The perfect gift for football enthusiasts.
            </p>
            <p className="text-xs text-[#E5A500]/90 font-semibold uppercase tracking-wider mt-1" dir="rtl">
              كارطة مضحكة. ذكريات خالدة
            </p>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-col gap-3.5">
            <span className="text-xs font-bold text-white uppercase tracking-widest">Navigation</span>
            <ul className="flex flex-col gap-2.5 text-xs font-medium">
              <li>
                <a href="#top" className="hover:text-[#E5A500] transition-colors">Accueil</a>
              </li>
              <li>
                <a href="#gallery" className="hover:text-[#E5A500] transition-colors">Exemples</a>
              </li>
              <li>
                <a href="#how" className="hover:text-[#E5A500] transition-colors">Comment ça marche</a>
              </li>
              <li>
                <a href="#faq" className="hover:text-[#E5A500] transition-colors">FAQ</a>
              </li>
            </ul>
          </div>

          {/* Legal / Info Links */}
          <div className="flex flex-col gap-3.5">
            <span className="text-xs font-bold text-white uppercase tracking-widest">Informations</span>
            <ul className="flex flex-col gap-2.5 text-xs font-medium">
              <li>
                <a href="#order" className="hover:text-[#E5A500] transition-colors">Commander</a>
              </li>
              <li>
                <a href="#" className="hover:text-[#E5A500] transition-colors">Mentions Légales</a>
              </li>
              <li>
                <a href="#" className="hover:text-[#E5A500] transition-colors">Politique de Confidentialité</a>
              </li>
              <li>
                <a href="#" className="hover:text-[#E5A500] transition-colors">Livraison & Retours</a>
              </li>
            </ul>
          </div>

          {/* Social Links & Support */}
          <div className="flex flex-col gap-4">
            <span className="text-xs font-bold text-white uppercase tracking-widest">Suivez-nous</span>
            <div className="flex gap-4">
              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-neutral-400 hover:text-[#E5A500] hover:border-[#E5A500] hover:shadow-[0_0_16px_rgba(229,165,0,.15)] transition duration-300"
                aria-label="Instagram"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-neutral-400 hover:text-[#E5A500] hover:border-[#E5A500] hover:shadow-[0_0_16px_rgba(229,165,0,.15)] transition duration-300"
                aria-label="Facebook"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>
              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-neutral-400 hover:text-[#E5A500] hover:border-[#E5A500] hover:shadow-[0_0_16px_rgba(229,165,0,.15)] transition duration-300"
                aria-label="WhatsApp"
              >
                <MessageCircle className="h-5 w-5" />
              </a>
            </div>
            <div className="mt-2 text-xs text-neutral-500">
              Pour toute assistance: <br />
              <span className="text-neutral-300 font-semibold">support@kartetna.tn</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 text-[11px] text-neutral-500">
          <div>
            © {new Date().getFullYear()} Kartetna. All rights reserved.
          </div>
          <div className="flex items-center gap-1.5 font-medium">
            <span>Designed & crafted in Tunisia</span>
            <Heart className="h-3 w-3 text-red-500 fill-red-500 animate-pulse" />
          </div>
        </div>
      </div>
    </footer>
  );
}
