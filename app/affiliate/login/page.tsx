"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Logo } from "../../_components/Logo";
import {
  Sparkles,
  ArrowRight,
  User,
  Lock,
  AlertCircle,
  Loader2,
} from "lucide-react";

export default function AffiliateLoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (!identifier || !password) {
        throw new Error("الرجاء إدخال رقم الهاتف أو الكود وكلمة المرور");
      }

      const res = await fetch("/api/affiliate/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "فشل تسجيل الدخول");
      }

      if (typeof window !== "undefined" && data.affiliate) {
        localStorage.setItem("flw_aff_user", JSON.stringify(data.affiliate));
      }

      router.push("/affiliate/dashboard");
    } catch (err: any) {
      setError(err.message || "حدث خطأ أثناء تسجيل الدخول");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#060606] text-white flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden" dir="rtl">
      {/* Background Glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#F6D365]/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="flex justify-center mb-4">
          <Logo />
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#F6D365] text-xs font-bold mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>لوحة تحكم الشركاء والمؤثرين</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-white">
          تسجيل الدخول لحسابك
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-neutral-400">
          ليس لديك حساب بعد؟{" "}
          <Link href="/affiliate/signup" className="text-[#F6D365] font-bold hover:underline">
            سجّل حساب جديد هنا
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-[#111111]/90 border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-xl">
          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Phone or Code */}
            <div>
              <label className="block text-xs font-bold text-neutral-300 mb-1.5">
                رقم الهاتف أو كود الإحالة <span className="text-[#D4AF37]">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="مثال: 98123456 أو KHALIL10"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#D4AF37] transition-all"
                />
                <User className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3.5" />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold text-neutral-300 mb-1.5">
                كلمة المرور <span className="text-[#D4AF37]">*</span>
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#D4AF37] transition-all"
                />
                <Lock className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3.5" />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#D4AF37] to-[#F6D365] text-black font-black text-sm hover:scale-[1.02] transition-all shadow-xl shadow-[#D4AF37]/25 flex items-center justify-center gap-2 mt-6 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>جاري تسجيل الدخول...</span>
                </>
              ) : (
                <>
                  <span>دخول لوحة التحكم 🚀</span>
                  <ArrowRight className="w-4 h-4 rotate-180" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-white/10 text-center">
            <Link
              href="/affiliate"
              className="text-xs text-neutral-400 hover:text-white transition-colors"
            >
              ← العودة لصفحة برنامج الشركاء
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
