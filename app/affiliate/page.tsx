"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  DollarSign,
  Users,
  Link2,
  TrendingUp,
  Gift,
  ChevronDown,
  ChevronRight,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Star,
  Zap,
} from "lucide-react";

// ─── Registration Form ──────────────────────────────────────────────────────

function RegistrationForm() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    instagram: "",
    tiktok: "",
    governorate: "",
    pin: "",
    payment_method: "flouci",
    flouci_id: "",
    card_number: "",
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    success?: boolean;
    ref_code?: string;
    referral_url?: string;
    error?: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/affiliate/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (res.ok) {
        setResult({
          success: true,
          ref_code: data.affiliate.ref_code,
          referral_url: data.affiliate.referral_url,
        });
      } else {
        setResult({ error: data.error });
      }
    } catch {
      setResult({ error: "Erreur de connexion. حاول مرة أخرى." });
    } finally {
      setLoading(false);
    }
  };

  const governorates = [
    "تونس (Tunis)", "أريانة (Ariana)", "بن عروس (Ben Arous)", "منوبة (Manouba)", "نابل (Nabeul)",
    "زغوان (Zaghouan)", "بنزرت (Bizerte)", "باجة (Béja)", "جندوبة (Jendouba)", "الكاف (Le Kef)",
    "سليانة (Siliana)", "سوسة (Sousse)", "المنستير (Monastir)", "المهدية (Mahdia)", "صفاقس (Sfax)",
    "القيروان (Kairouan)", "القصرين (Kasserine)", "سيدي بوزيد (Sidi Bouzid)", "قابس (Gabès)",
    "مدنين (Médenine)", "تطاوين (Tataouine)", "قفصة (Gafsa)", "توزر (Tozeur)", "قبلي (Kébili)",
  ];

  if (result?.success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="rounded-3xl bg-gradient-to-b from-green-900/50 to-neutral-900/80 border border-green-500/30 p-8 sm:p-10 text-center max-w-xl mx-auto"
      >
        <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="h-8 w-8 text-green-400" />
        </div>
        <h3 className="text-2xl font-black text-white mb-2">Félicitations! 🎉</h3>
        <p className="text-gray-300 mb-6 font-bold">تم تسجيلك بنجاح في Programme Affiliate</p>

        <div className="bg-black/40 rounded-2xl p-5 mb-6 border border-white/10">
          <p className="text-xs font-black text-gray-300 uppercase tracking-wider mb-2">🔗 Ton Lien Referral</p>
          <p className="text-[#F6D365] font-bold text-sm break-all font-mono">{result.referral_url}</p>
          <button
            onClick={() => navigator.clipboard.writeText(result.referral_url || "")}
            className="mt-3 px-5 py-2 rounded-xl bg-[#D4AF37]/20 text-[#F6D365] text-xs font-black border border-[#D4AF37]/30 hover:bg-[#D4AF37]/30 transition-colors"
          >
            📋 Copier le Lien
          </button>
        </div>

        <div className="bg-black/40 rounded-2xl p-5 mb-6 border border-white/10">
          <p className="text-xs font-black text-gray-300 uppercase tracking-wider mb-2">🎫 Ton Code Referral</p>
          <p className="text-3xl font-black text-white font-mono">{result.ref_code}</p>
        </div>

        <a
          href="/affiliate/dashboard"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-[#D4AF37] to-[#F6D365] text-black font-black text-sm hover:scale-105 transition-transform shadow-lg shadow-[#D4AF37]/20"
        >
          Accéder au Dashboard 🚀
          <ArrowRight className="h-4 w-4" />
        </a>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto space-y-5">
      {result?.error && (
        <div className="rounded-xl bg-red-500/10 border border-red-500/30 px-4 py-3 text-red-400 text-sm font-bold text-center">
          {result.error}
        </div>
      )}

      {/* Name */}
      <div>
        <label className="block text-xs font-black text-gray-200 uppercase tracking-wider mb-2">
          Nom & Prénom / الإسم واللقب *
        </label>
        <input
          type="text"
          required
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full px-4 py-3.5 rounded-xl bg-white/10 border border-white/20 text-white text-sm font-bold focus:outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/40 transition-all placeholder:text-gray-400 placeholder:font-normal"
          placeholder="Ex: Ahmed Ben Ali"
          dir="rtl"
        />
      </div>

      {/* Phone */}
      <div>
        <label className="block text-xs font-black text-gray-200 uppercase tracking-wider mb-2">
          Numéro Téléphone / رقم الهاتف * (8 chiffres)
        </label>
        <input
          type="tel"
          required
          maxLength={8}
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value.replace(/\D/g, "") })}
          className="w-full px-4 py-3.5 rounded-xl bg-white/10 border border-white/20 text-white text-sm font-bold focus:outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/40 transition-all placeholder:text-gray-400 placeholder:font-normal"
          placeholder="Ex: 28998300"
          dir="ltr"
        />
      </div>

      {/* Social Media */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-black text-gray-200 uppercase tracking-wider mb-2">
            Instagram Handle
          </label>
          <input
            type="text"
            value={form.instagram}
            onChange={(e) => setForm({ ...form, instagram: e.target.value })}
            className="w-full px-4 py-3.5 rounded-xl bg-white/10 border border-white/20 text-white text-sm font-bold focus:outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/40 transition-all placeholder:text-gray-400 placeholder:font-normal"
            placeholder="@username"
            dir="ltr"
          />
        </div>
        <div>
          <label className="block text-xs font-black text-gray-200 uppercase tracking-wider mb-2">
            TikTok Handle
          </label>
          <input
            type="text"
            value={form.tiktok}
            onChange={(e) => setForm({ ...form, tiktok: e.target.value })}
            className="w-full px-4 py-3.5 rounded-xl bg-white/10 border border-white/20 text-white text-sm font-bold focus:outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/40 transition-all placeholder:text-gray-400 placeholder:font-normal"
            placeholder="@username"
            dir="ltr"
          />
        </div>
      </div>

      {/* Governorate */}
      <div>
        <label className="block text-xs font-black text-gray-200 uppercase tracking-wider mb-2">
          Gouvernorat / الولاية
        </label>
        <select
          value={form.governorate}
          onChange={(e) => setForm({ ...form, governorate: e.target.value })}
          className="w-full px-4 py-3.5 rounded-xl bg-white/10 border border-white/20 text-white text-sm font-bold focus:outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/40 transition-all appearance-none"
          dir="rtl"
        >
          <option value="" className="bg-neutral-900 font-bold">Sélectionner Gouvernorat</option>
          {governorates.map((g) => (
            <option key={g} value={g} className="bg-neutral-900 font-bold">{g}</option>
          ))}
        </select>
      </div>

      {/* Payment Method */}
      <div>
        <label className="block text-xs font-black text-gray-200 uppercase tracking-wider mb-2">
          Méthode de Paiement / طريقة السحب
        </label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setForm({ ...form, payment_method: "flouci" })}
            className={`px-4 py-3 rounded-xl text-sm font-black border transition-all ${
              form.payment_method === "flouci"
                ? "bg-[#D4AF37]/20 border-[#D4AF37] text-[#F6D365] shadow-md shadow-[#D4AF37]/10"
                : "bg-white/5 border-white/10 text-gray-300 hover:border-white/20 font-extrabold"
            }`}
          >
            💳 Flouci
          </button>
          <button
            type="button"
            onClick={() => setForm({ ...form, payment_method: "bank_transfer" })}
            className={`px-4 py-3 rounded-xl text-sm font-black border transition-all ${
              form.payment_method === "bank_transfer"
                ? "bg-[#D4AF37]/20 border-[#D4AF37] text-[#F6D365] shadow-md shadow-[#D4AF37]/10"
                : "bg-white/5 border-white/10 text-gray-300 hover:border-white/20 font-extrabold"
            }`}
          >
            🏦 Virement Bancaire
          </button>
        </div>
      </div>

      {/* Flouci ID or Card Number */}
      {form.payment_method === "flouci" ? (
        <div>
          <label className="block text-xs font-black text-gray-200 uppercase tracking-wider mb-2">
            Numéro / ID Flouci
          </label>
          <input
            type="text"
            value={form.flouci_id}
            onChange={(e) => setForm({ ...form, flouci_id: e.target.value })}
            className="w-full px-4 py-3.5 rounded-xl bg-white/10 border border-white/20 text-white text-sm font-bold focus:outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/40 transition-all placeholder:text-gray-400 placeholder:font-normal"
            placeholder="Flouci Account ID / Phone"
            dir="ltr"
          />
        </div>
      ) : (
        <div>
          <label className="block text-xs font-black text-gray-200 uppercase tracking-wider mb-2">
            RIB / Numéro Carte Bancaire
          </label>
          <input
            type="text"
            value={form.card_number}
            onChange={(e) => setForm({ ...form, card_number: e.target.value })}
            className="w-full px-4 py-3.5 rounded-xl bg-white/10 border border-white/20 text-white text-sm font-bold focus:outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/40 transition-all placeholder:text-gray-400 placeholder:font-normal"
            placeholder="20 chiffres RIB / Carte"
            dir="ltr"
          />
        </div>
      )}

      {/* PIN */}
      <div>
        <label className="block text-xs font-black text-gray-200 uppercase tracking-wider mb-2">
          Code PIN Secret (4 chiffres) * — pour la connexion au Dashboard
        </label>
        <input
          type="password"
          required
          maxLength={4}
          value={form.pin}
          onChange={(e) => setForm({ ...form, pin: e.target.value.replace(/\D/g, "") })}
          className="w-full px-4 py-3.5 rounded-xl bg-white/10 border border-white/20 text-white text-lg font-black focus:outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/40 transition-all placeholder:text-gray-400 text-center tracking-[0.5em]"
          placeholder="● ● ● ●"
          dir="ltr"
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#D4AF37] to-[#F6D365] text-black font-black text-base uppercase tracking-wider hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-[#D4AF37]/25"
      >
        {loading ? "Chargement..." : "Inscris-toi & ابدا اربح 💰"}
      </button>
    </form>
  );
}

// ─── Earnings Calculator ─────────────────────────────────────────────────────

function EarningsCalculator() {
  const [orders, setOrders] = useState(10);
  const earnings = orders * 10;

  return (
    <div className="rounded-3xl bg-gradient-to-b from-neutral-900/90 to-neutral-900/60 border border-white/10 p-8 text-center backdrop-blur-xl">
      <h3 className="text-lg font-black text-white mb-6">
        💰 Calcule tes Revenus / أرباحك الشهرية
      </h3>
      <div className="mb-6">
        <input
          type="range"
          min={1}
          max={100}
          value={orders}
          onChange={(e) => setOrders(Number(e.target.value))}
          className="w-full h-2 rounded-full appearance-none bg-white/10 accent-[#D4AF37] cursor-pointer"
        />
        <div className="flex justify-between text-xs text-gray-400 font-bold mt-2">
          <span>1 Commande</span>
          <span>100 Commandes</span>
        </div>
      </div>
      <div className="flex items-center justify-center gap-4">
        <div className="text-center">
          <p className="text-xs font-bold text-gray-400 mb-1">Commandes / mois</p>
          <p className="text-3xl font-black text-white">{orders}</p>
        </div>
        <ArrowRight className="h-5 w-5 text-[#D4AF37]" />
        <div className="text-center">
          <p className="text-xs font-bold text-gray-400 mb-1">Tes Gains / أرباحك</p>
          <p className="text-3xl font-black text-[#F6D365]">{earnings} DT</p>
        </div>
      </div>
    </div>
  );
}

// ─── FAQ Section ─────────────────────────────────────────────────────────────

const AFFILIATE_FAQ = [
  {
    q: "Comment commencer ? / كيفاش نبدا؟",
    a: "Inscris-toi هنا، تاخو ton lien referral، وابدا بارتاجي مع الناس. كل واحد يمركي commande من الـ lien = 10 DT cash في حسابك!",
  },
  {
    q: "Quand est-ce que je peux retirer l'argent ? / وقتاش نقدر نسحب؟",
    a: "Dès que ton solde atteint 30 DT (3 commandes livrées)، تنجم تعمل Retrait via Flouci أو Virement bancaire.",
  },
  {
    q: "Comment est calculée la commission ? / كيفاش تتحسب العمولة؟",
    a: "La commission se confirme كي تتوصل la commande للحريف (Status Delivered). الـ 10 DT يتزادو أوتوماتيكياً في solde disponible متاعك.",
  },
  {
    q: "Est-ce que le client doit mettre un promo code ? / هل لازم كود؟",
    a: "Non! C'est 100% automatique. غير يحلو ton lien referral، le système يربط la commande أوتوماتيكياً مع حسابك.",
  },
  {
    q: "Quelle est la durée de validité du lien ? / مدة فعاليتها؟",
    a: "Le cookie reste actif pendant 30 jours. إذا الحريف يشري dans les 30 jours، تربح أنت la commission!",
  },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-white/5">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-4 text-right"
        dir="rtl"
      >
        <span className="text-sm font-black text-white">{q}</span>
        <ChevronDown
          className={`h-4 w-4 text-[#D4AF37] transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <p className="text-sm text-gray-300 pb-4 leading-relaxed font-medium" dir="rtl">
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

const TIERS = [
  { name: "Bronze 🥉", range: "1-10", commission: "10 DT", perks: "Commission Standard" },
  { name: "Silver 🥈", range: "11-25", commission: "12 DT", perks: "Carte FIFA Gratuite" },
  { name: "Gold 🥇", range: "26-50", commission: "15 DT", perks: "Carte + Visibilité Site" },
  { name: "Diamond 💎", range: "50+", commission: "18 DT", perks: "Bonus Mensuel VIP" },
];

export default function AffiliatePage() {
  return (
    <div className="min-h-screen bg-[#060606] text-white">
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-20 pb-16 sm:pt-28 sm:pb-24">
        {/* Background effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute left-1/2 top-0 -translate-x-1/2 w-[800px] h-[600px] rounded-full bg-[#D4AF37]/[0.06] blur-[180px]" />
        </div>

        <div className="relative z-10 mx-auto max-w-4xl px-4 text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#F6D365] text-xs font-black uppercase tracking-widest mb-6 backdrop-blur-md"
          >
            <Sparkles className="h-4 w-4 animate-pulse" />
            <span>PROGRAMME AFFILIATE TUNI-STYLE</span>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-6xl font-black leading-tight mb-6"
            dir="rtl"
          >
            Gagne{" "}
            <span className="bg-gradient-to-r from-[#D4AF37] to-[#F6D365] bg-clip-text text-transparent">
              10 DT Cash
            </span>{" "}
            sur chaque commande! 💰
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-gray-300 font-bold max-w-2xl mx-auto mb-10 leading-relaxed"
            dir="rtl"
          >
            بارتاجي ton lien referral مع المتابعين متاعك، وكل واحد يمركي commande تربح 10 DT!
            Sans code promo, sans complication — Tout est 100% automatique.
          </motion.p>

          {/* Quick stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-3 gap-4 max-w-md mx-auto"
          >
            {[
              { icon: DollarSign, label: "Commission / Commande", value: "10 DT" },
              { icon: Zap, label: "Tracking Automatique", value: "100%" },
              { icon: Gift, label: "Seuil de Retrait", value: "30 DT" },
            ].map((s, i) => (
              <div
                key={i}
                className="rounded-2xl bg-white/5 border border-white/10 p-4 backdrop-blur-lg"
              >
                <s.icon className="h-5 w-5 text-[#F6D365] mx-auto mb-2" />
                <p className="text-lg font-black text-white">{s.value}</p>
                <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase">{s.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── How It Works ─────────────────────────────────────────────── */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="text-2xl sm:text-3xl font-black text-center mb-12" dir="rtl">
            Comment ça marche? / كيفاش تخدم؟ 🤔
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                step: "1",
                icon: Users,
                title: "1. Inscris-toi",
                desc: "عبّي le formulaire وسجّل في البرنامج. En 1 minute تاخو ton lien referral.",
              },
              {
                step: "2",
                icon: Link2,
                title: "2. Partage le Lien",
                desc: "بارتاجي ton lien في Instagram, TikTok, WhatsApp... وين ما تحب.",
              },
              {
                step: "3",
                icon: DollarSign,
                title: "3. Gagne du Cash",
                desc: "Chaque commande = 10 DT cash. Dès 30 DT تعمل Retrait via Flouci أو Virement.",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative rounded-3xl bg-white/[0.03] border border-white/10 p-7 text-center group hover:border-[#D4AF37]/30 transition-all"
              >
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#F6D365] flex items-center justify-center text-black font-black text-xs">
                  {item.step}
                </div>
                <item.icon className="h-8 w-8 text-[#F6D365] mx-auto mb-4 mt-3" />
                <h3 className="text-lg font-black text-white mb-2">{item.title}</h3>
                <p className="text-sm text-gray-300 font-medium leading-relaxed" dir="rtl">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Earnings Calculator ───────────────────────────────────────── */}
      <section className="py-16 sm:py-20 bg-[#0a0a0a]">
        <div className="mx-auto max-w-lg px-4">
          <EarningsCalculator />
        </div>
      </section>

      {/* ── Commission Tiers ──────────────────────────────────────────── */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="text-2xl sm:text-3xl font-black text-center mb-4" dir="rtl">
            Plus tu vends, plus tu gagnes! 📈
          </h2>
          <p className="text-sm font-bold text-gray-400 text-center mb-10" dir="rtl">
            Niveaux de commission progressive — كل ما تكبر vos commandes، تكبر la commission.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm" dir="rtl">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-right py-3 px-4 text-xs font-black text-gray-300 uppercase">Niveau / الدرجة</th>
                  <th className="text-right py-3 px-4 text-xs font-black text-gray-300 uppercase">Commandes / mois</th>
                  <th className="text-right py-3 px-4 text-xs font-black text-gray-300 uppercase">Commission</th>
                  <th className="text-right py-3 px-4 text-xs font-black text-gray-300 uppercase">Avantages / مزايا</th>
                </tr>
              </thead>
              <tbody>
                {TIERS.map((tier, i) => (
                  <tr key={i} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 px-4 font-black text-white">{tier.name}</td>
                    <td className="py-3.5 px-4 text-gray-300 font-bold">{tier.range}</td>
                    <td className="py-3.5 px-4 text-[#F6D365] font-black">{tier.commission}</td>
                    <td className="py-3.5 px-4 text-gray-300 font-bold">{tier.perks}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── Registration Form ─────────────────────────────────────────── */}
      <section className="py-16 sm:py-24 bg-[#0a0a0a]" id="register">
        <div className="mx-auto max-w-4xl px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#F6D365] text-xs font-black uppercase tracking-widest mb-4">
              <Star className="h-4 w-4" />
              <span>REJOINS LE PROGRAMME</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white mb-3" dir="rtl">
              Rejoins-nous & ابدا اربح اليوم! 🚀
            </h2>
            <p className="text-sm font-bold text-gray-400" dir="rtl">
              Inscription 100% Gratuite. Remplis le formulaire et prends ton lien referral.
            </p>
          </div>
          <RegistrationForm />
        </div>
      </section>

      {/* ── FAQ ────────────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-2xl px-4">
          <h2 className="text-2xl font-black text-center mb-10" dir="rtl">
            Questions Fréquentes / الأسئلة 🤷
          </h2>
          <div className="rounded-3xl bg-white/[0.02] border border-white/10 px-6 py-2">
            {AFFILIATE_FAQ.map((item, i) => (
              <FaqItem key={i} q={item.q} a={item.a} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Already registered? Login link ─────────────────────────────── */}
      <section className="py-10 text-center border-t border-white/5">
        <p className="text-sm text-gray-400 font-bold mb-3" dir="rtl">
          Déjà inscrit? / عندك حساب قبل؟
        </p>
        <a
          href="/affiliate/dashboard"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-[#F6D365] font-black text-sm hover:bg-white/10 transition-colors"
        >
          Accéder au Dashboard 🔐
        </a>
      </section>
    </div>
  );
}
