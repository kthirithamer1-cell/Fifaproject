"use client";

import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Logo } from "./Logo";
import { navItems } from "./data";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "border-b border-white/10 bg-black/95 backdrop-blur-2xl py-1.5 shadow-xl shadow-black/40"
          : "border-b border-transparent bg-transparent py-4"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Logo />

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-8 lg:flex">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="relative text-[13px] font-medium text-gray-200 transition duration-300 hover:text-white after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-[#D4AF37] after:transition-all hover:after:w-full"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Desktop CTA */}
          <a
            href="/generator"
            className="hidden rounded-lg bg-[#D4AF37] px-5 py-2.5 text-sm font-bold text-white transition-all duration-300 hover:bg-[#C89B3C] hover:shadow-[0_0_24px_rgba(212,175,55,.35)] lg:inline-flex"
          >
            صمّم كارطتي
          </a>

          {/* Mobile Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="rounded-lg border border-white/20 bg-white/10 p-2 text-white transition hover:border-[#D4AF37] lg:hidden"
          >
            {isOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`overflow-hidden transition-all duration-300 lg:hidden ${
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="border-t border-white/10 bg-black/95 px-4 py-4 backdrop-blur-2xl">
          <nav className="flex flex-col gap-4">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="text-sm font-medium text-gray-200 transition hover:text-white"
              >
                {item.label}
              </a>
            ))}

            <a
              href="/generator"
              onClick={() => setIsOpen(false)}
              className="mt-2 flex justify-center rounded-lg bg-[#D4AF37] py-2.5 text-sm font-bold text-white transition hover:scale-[1.02]"
            >
              صمّم كارطتي
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
}