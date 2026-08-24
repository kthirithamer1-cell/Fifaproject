"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Logo } from "../../_components/Logo";
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  User,
  Phone,
  Lock,
  Tag,
  CreditCard,
  Smartphone,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";

export default function AffiliateSignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    code: "",
    password: "",
    paymentMethod: "D17",
    paymentDetails: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (!form.name || !form.phone || !form.code || !form.password || !form.paymentDetails) {
        throw new Error("الرجاء تعبئة جميع الحقول الإجبارية");
      }

      const res = await fetch("/api/affiliate/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "فشل التسجيل");
      }

      // Store active affiliate session in localStorage
      if (typeof window !== "undefined" && data.affiliate) {
        localStorage.setItem("flw_aff_user", JSON.stringify(data.affiliate));
      }

      router.push("/affiliate/dashboard");
    } catch (err: any) {
      setError(err.message || "حدث خطأ أثناء إنشاء الحساب");
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
          <span>عمولة 10 دينار صابة على كل كارطة</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-white">
          إنشاء حساب شريك جديد 🚀
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-neutral-400">
          عندك حساب مسبقاً؟{" "}
          <Link href="/affiliate/login" className="text-[#F6D365] font-bold hover:underline">
            تسجيل الدخول هنا
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="bg-[#111111]/90 border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-xl">
          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold text-neutral-300 mb-1.5">
                الاسم واللقب (أو اسم صفحتك) <span className="text-[#D4AF37]">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="مثال: خليل العبيدي / Foot TN"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#D4AF37] transition-all"
                />
                <User className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3.5" />
              </div>
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-xs font-bold text-neutral-300 mb-1.5">
                رقم الهاتف التونسي (للتواصل والـ D17) <span className="text-[#D4AF37]">*</span>
              </label>
              <div className="relative">
                <input
                  type="tel"
                  required
                  placeholder="مثال: 98123456"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#D4AF37] transition-all font-mono"
                />
                <Phone className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3.5" />
              </div>
            </div>

            {/* Referral Code */}
            <div>
              <label className="block text-xs font-bold text-neutral-300 mb-1.5">
                كود الإحالة الخاص بيك (Slug) <span className="text-[#D4AF37]">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="مثال: KHALIL10 أو FOOT_TN"
                  value={form.code}
                  onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase().replace(/[^A-Z0-9_-]/g, "") })}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-[#F6D365] font-black focus:outline-none focus:border-[#D4AF37] transition-all font-mono uppercase"
                />
                <Tag className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3.5" />
              </div>
              <p className="text-[11px] text-neutral-500 mt-1 font-mono">
                رابطك سيكون: <strong>beflawless.art?ref={form.code || "YOURCODE"}</strong>
              </p>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold text-neutral-300 mb-1.5">
                كلمة المرور لدخول حسابك <span className="text-[#D4AF37]">*</span>
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#D4AF37] transition-all"
                />
                <Lock className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3.5" />
              </div>
            </div>

            {/* Payout Method */}
            <div>
              <label className="block text-xs font-bold text-neutral-300 mb-2">
                طريقة استلام الأرباح المفضلة <span className="text-[#D4AF37]">*</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "D17", label: "تطبيق D17", icon: Smartphone },
                  { id: "Flouci", label: "Flouci", icon: Sparkles },
                  { id: "Bank_RIB", label: "تحويل بنكي", icon: CreditCard },
                ].map((m) => {
                  const Icon = m.icon;
                  const selected = form.paymentMethod === m.id;
                  return (
                    <button
                      type="button"
                      key={m.id}
                      onClick={() => setForm({ ...form, paymentMethod: m.id })}
                      className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${
                        selected
                          ? "bg-[#D4AF37]/20 border-[#D4AF37] text-[#F6D365]"
                          : "bg-black/40 border-white/10 text-neutral-400 hover:border-white/20"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{m.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Payment Details */}
            <div>
              <label className="block text-xs font-bold text-neutral-300 mb-1.5">
                {form.paymentMethod === "D17"
                  ? "رقم الهاتف المسجل في تطبيق D17"
                  : form.paymentMethod === "Flouci"
                  ? "رقم هاتف Flouci أو معرف الحساب"
                  : "رقم الحساب البنكي (20 رقم RIB)"}{" "}
                <span className="text-[#D4AF37]">*</span>
              </label>
              <input
                type="text"
                required
                placeholder={form.paymentMethod === "Bank_RIB" ? "08000000000000000000" : "مثال: 98123456"}
                value={form.paymentDetails}
                onChange={(e) => setForm({ ...form, paymentDetails: e.target.value })}
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#D4AF37] transition-all font-mono"
              />
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
                  <span>جاري إنشاء حسابك...</span>
                </>
              ) : (
                <>
                  <span>تأكيد التسجيل والدخول للوحة التحكم 🚀</span>
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
