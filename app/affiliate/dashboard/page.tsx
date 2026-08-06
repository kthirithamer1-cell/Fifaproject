"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  DollarSign,
  MousePointerClick,
  Package,
  TrendingUp,
  Copy,
  ExternalLink,
  LogOut,
  ArrowDownToLine,
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
  Eye,
  Share2,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

interface AffiliateData {
  name: string;
  ref_code: string;
  referral_url: string;
  tier: string;
  payment_method: string;
  flouci_id: string;
  card_number: string;
}

interface StatsData {
  total_clicks: number;
  month_clicks: number;
  total_orders: number;
  delivered_orders: number;
  pending_orders: number;
  month_orders: number;
  total_earned: number;
  total_paid: number;
  available_balance: number;
  can_withdraw: boolean;
  conversion_rate: string;
}

interface OrderItem {
  id: string;
  customer_name: string;
  package: string;
  price: number;
  status: string;
  commission_status: string;
  commission_amount: number;
  created_at: string;
}

interface PayoutItem {
  id: string;
  amount: number;
  method: string;
  status: string;
  reference: string;
  requested_at: string;
  completed_at: string;
}

// ─── Login Screen ────────────────────────────────────────────────────────────

function LoginScreen({ onLogin }: { onLogin: (token: string) => void }) {
  const [phone, setPhone] = useState("");
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/affiliate/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, pin }),
      });
      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("flawless_affiliate_token", data.token);
        onLogin(data.token);
      } else {
        setError(data.error);
      }
    } catch {
      setError("خطأ في الاتصال. حاول مرة أخرى.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#060606] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#D4AF37] to-[#F6D365] flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[#D4AF37]/20">
            <DollarSign className="h-8 w-8 text-black" />
          </div>
          <h1 className="text-2xl font-black text-white">Flawless Affiliate</h1>
          <p className="text-sm font-bold text-gray-300 mt-1" dir="rtl">
            Connexion Dashboard / ادخل لوحة التحكم
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          {error && (
            <div className="rounded-xl bg-red-500/10 border border-red-500/30 px-4 py-3 text-red-400 text-sm font-bold text-center" dir="rtl">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-black text-gray-200 uppercase tracking-wider mb-2">
              Numéro Téléphone / رقم الهاتف *
            </label>
            <input
              type="tel"
              required
              maxLength={8}
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
              className="w-full px-4 py-3.5 rounded-xl bg-white/10 border border-white/20 text-white text-sm font-bold focus:outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/40 transition-all placeholder:text-gray-400 placeholder:font-normal text-center tracking-wider"
              placeholder="Ex: 28998300"
              dir="ltr"
            />
          </div>

          <div>
            <label className="block text-xs font-black text-gray-200 uppercase tracking-wider mb-2">
              Code PIN Secret / الكود السري *
            </label>
            <input
              type="password"
              required
              maxLength={4}
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
              className="w-full px-4 py-3.5 rounded-xl bg-white/10 border border-white/20 text-white text-lg font-black focus:outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/40 transition-all placeholder:text-gray-400 text-center tracking-[0.5em]"
              placeholder="● ● ● ●"
              dir="ltr"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#D4AF37] to-[#F6D365] text-black font-black text-base uppercase tracking-wider hover:scale-[1.02] transition-all disabled:opacity-50 shadow-xl shadow-[#D4AF37]/20"
          >
            {loading ? "Connexion..." : "Se Connecter 🔐"}
          </button>
        </form>

        <p className="text-center text-xs text-gray-400 font-bold mt-6">
          Pas encore inscrit? / ما عندكش حساب؟{" "}
          <a href="/affiliate" className="text-[#F6D365] font-black hover:underline">
            Inscris-toi هنا
          </a>
        </p>
      </motion.div>
    </div>
  );
}

// ─── Stat Card ───────────────────────────────────────────────────────────────

function StatCard({
  icon: Icon,
  label,
  value,
  suffix,
  highlight,
}: {
  icon: React.ComponentType<any>;
  label: string;
  value: string | number;
  suffix?: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border p-5 transition-all ${
        highlight
          ? "bg-gradient-to-br from-[#D4AF37]/15 to-[#D4AF37]/5 border-[#D4AF37]/40 shadow-lg shadow-[#D4AF37]/10"
          : "bg-white/[0.04] border-white/15"
      }`}
    >
      <Icon
        className={`h-5 w-5 mb-3 ${highlight ? "text-[#F6D365]" : "text-gray-300"}`}
      />
      <p className={`text-2xl font-black ${highlight ? "text-[#F6D365]" : "text-white"}`}>
        {value}
        {suffix && <span className="text-sm font-black ml-1">{suffix}</span>}
      </p>
      <p className="text-xs font-black text-gray-200 mt-1 uppercase tracking-wider">{label}</p>
    </div>
  );
}

// ─── Status Badge ────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    none: "bg-gray-500/10 text-gray-400 border-gray-500/20",
  };

  return (
    <span
      className={`inline-flex px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase border ${
        styles[status] || styles.none
      }`}
    >
      {status}
    </span>
  );
}

// ─── Withdrawal Modal ────────────────────────────────────────────────────────

function WithdrawModal({
  open,
  onClose,
  token,
  affiliate,
  balance,
  onSuccess,
}: {
  open: boolean;
  onClose: () => void;
  token: string;
  affiliate: AffiliateData;
  balance: number;
  onSuccess: () => void;
}) {
  const [method, setMethod] = useState(affiliate.payment_method || "flouci");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success?: boolean; message?: string; error?: string } | null>(null);

  const handleWithdraw = async () => {
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/affiliate/withdraw", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ method }),
      });
      const data = await res.json();

      if (res.ok) {
        setResult({ success: true, message: data.message });
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 2000);
      } else {
        setResult({ error: data.error });
      }
    } catch {
      setResult({ error: "خطأ في الاتصال" });
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md rounded-3xl bg-neutral-900 border border-white/10 p-8"
      >
        <h3 className="text-xl font-black text-white text-center mb-2" dir="rtl">
          💸 Demande de Retrait / طلب سحب
        </h3>
        <p className="text-sm font-bold text-gray-300 text-center mb-6" dir="rtl">
          Solde Disponible / رصيدك المتاح: <span className="text-[#F6D365] font-black">{balance} DT</span>
        </p>

        {result?.success ? (
          <div className="text-center py-4">
            <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-3" />
            <p className="text-green-400 font-bold" dir="rtl">{result.message}</p>
          </div>
        ) : (
          <>
            {result?.error && (
              <div className="rounded-xl bg-red-500/10 border border-red-500/30 px-4 py-3 text-red-400 text-sm font-bold text-center mb-4" dir="rtl">
                {result.error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-black text-gray-200 uppercase tracking-wider mb-2">
                  Méthode de Retrait / طريقة السحب
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setMethod("flouci")}
                    className={`px-4 py-3 rounded-xl text-sm font-black border transition-all ${
                      method === "flouci"
                        ? "bg-[#D4AF37]/20 border-[#D4AF37] text-[#F6D365] shadow-md shadow-[#D4AF37]/10"
                        : "bg-white/5 border-white/10 text-gray-300"
                    }`}
                  >
                    💳 Flouci
                  </button>
                  <button
                    type="button"
                    onClick={() => setMethod("bank_transfer")}
                    className={`px-4 py-3 rounded-xl text-sm font-black border transition-all ${
                      method === "bank_transfer"
                        ? "bg-[#D4AF37]/20 border-[#D4AF37] text-[#F6D365] shadow-md shadow-[#D4AF37]/10"
                        : "bg-white/5 border-white/10 text-gray-300"
                    }`}
                  >
                    🏦 Carte / Virement
                  </button>
                </div>
              </div>

              <div className="rounded-xl bg-white/5 border border-white/10 p-4 text-sm text-gray-300 font-bold" dir="rtl">
                {method === "flouci" ? (
                  <p>Transfert vers compte Flouci: <span className="text-[#F6D365] font-black">{affiliate.flouci_id || "Non spécifié"}</span></p>
                ) : (
                  <p>Transfert vers Carte / RIB: <span className="text-[#F6D365] font-black">{affiliate.card_number || "Non spécifié"}</span></p>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 py-3 rounded-xl bg-white/5 border border-white/10 text-gray-300 text-sm font-black hover:bg-white/10 transition-colors"
                >
                  Annuler / إلغاء
                </button>
                <button
                  onClick={handleWithdraw}
                  disabled={loading}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#F6D365] text-black text-sm font-black hover:scale-[1.02] transition-all disabled:opacity-50 shadow-lg shadow-[#D4AF37]/20"
                >
                  {loading ? "Chargement..." : `Retirer ${balance} DT 💸`}
                </button>
              </div>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}

// ─── Dashboard ───────────────────────────────────────────────────────────────

function Dashboard({ token, onLogout }: { token: string; onLogout: () => void }) {
  const [loading, setLoading] = useState(true);
  const [affiliate, setAffiliate] = useState<AffiliateData | null>(null);
  const [stats, setStats] = useState<StatsData | null>(null);
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [payouts, setPayouts] = useState<PayoutItem[]>([]);
  const [copied, setCopied] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [activeTab, setActiveTab] = useState<"orders" | "payouts">("orders");
  const [selectedMonth, setSelectedMonth] = useState<string>("current");

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch(`/api/affiliate/stats?month=${selectedMonth}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        if (res.status === 401) {
          onLogout();
          return;
        }
        return;
      }

      const data = await res.json();
      setAffiliate(data.affiliate);
      setStats(data.stats);
      setOrders(data.recent_orders);
      setPayouts(data.payouts);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, [token, onLogout, selectedMonth]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCopy = () => {
    if (affiliate?.referral_url) {
      navigator.clipboard.writeText(affiliate.referral_url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShare = () => {
    if (affiliate?.referral_url && navigator.share) {
      navigator.share({
        title: "Flawless - كارطات FIFA تونسية",
        text: "اعمل كارطة FIFA بالستيل التونسي! 🇹🇳⚽",
        url: affiliate.referral_url,
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#060606] flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-[#D4AF37] animate-spin" />
      </div>
    );
  }

  if (!affiliate || !stats) {
    return (
      <div className="min-h-screen bg-[#060606] flex items-center justify-center text-white">
        <p>Error loading dashboard</p>
      </div>
    );
  }

  const tierEmoji: Record<string, string> = {
    bronze: "🥉",
    silver: "🥈",
    gold: "🥇",
    diamond: "💎",
  };

  const monthOptions = [
    { value: "current", label: "📅 الشهر الحالي (أوت 2026)" },
    { value: "2026-07", label: "🗓️ جويلية 2026" },
    { value: "2026-06", label: "🗓️ جوان 2026" },
    { value: "2026-05", label: "🗓️ ماي 2026" },
    { value: "all", label: "♾️ كل الأوقات (All Time)" },
  ];

  const getOrdersLabel = () => {
    if (selectedMonth === "current") return "كومندات هالشهر";
    if (selectedMonth === "all") return "إجمالي الكومندات";
    if (selectedMonth === "2026-07") return "كومندات جويلية";
    if (selectedMonth === "2026-06") return "كومندات جوان";
    if (selectedMonth === "2026-05") return "كومندات ماي";
    return "الكومندات المحددة";
  };

  return (
    <div className="min-h-screen bg-[#060606] text-white">
      {/* Withdraw Modal */}
      <WithdrawModal
        open={showWithdraw}
        onClose={() => setShowWithdraw(false)}
        token={token}
        affiliate={affiliate}
        balance={stats.available_balance}
        onSuccess={fetchData}
      />

      {/* ── Header ──────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-[#060606]/80 backdrop-blur-xl border-b border-white/5">
        <div className="mx-auto max-w-5xl px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#F6D365] flex items-center justify-center text-black font-black text-xs">
              F
            </div>
            <div>
              <p className="text-sm font-bold text-white">{affiliate.name}</p>
              <p className="text-[10px] text-gray-500">
                {tierEmoji[affiliate.tier] || "🥉"} {affiliate.tier.toUpperCase()}
              </p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-gray-400 text-xs font-bold hover:bg-white/10 transition-colors"
          >
            <LogOut className="h-3.5 w-3.5" />
            خروج
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-4 py-8">
        {/* ── Month Selector Filter ─────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6 bg-white/[0.03] border border-white/10 rounded-2xl p-4">
          <div>
            <h2 className="text-sm font-black text-white" dir="rtl">
              📊 تصفية الإحصائيات حسب الشهر
            </h2>
            <p className="text-xs text-gray-400 mt-0.5" dir="rtl">
              اختار الشهر باش تشوف الكليكات والكومندات متاعو
            </p>
          </div>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="px-4 py-2.5 rounded-xl bg-neutral-900 border border-[#D4AF37]/40 text-[#F6D365] font-black text-xs focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 shadow-md shadow-[#D4AF37]/10"
            dir="rtl"
          >
            {monthOptions.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-neutral-900 font-bold text-white">
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* ── Stats Grid ────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <StatCard
            icon={DollarSign}
            label="الرصيد المتاح"
            value={stats.available_balance}
            suffix="DT"
            highlight
          />
          <StatCard
            icon={Package}
            label={getOrdersLabel()}
            value={stats.month_orders}
          />
          <StatCard
            icon={MousePointerClick}
            label={selectedMonth === "all" ? "إجمالي الكليكات" : "كليكات الشهر"}
            value={selectedMonth === "all" ? stats.total_clicks : stats.month_clicks}
          />
          <StatCard
            icon={TrendingUp}
            label="نسبة التحويل"
            value={stats.conversion_rate}
            suffix="%"
          />
        </div>

        {/* ── Referral Link + Withdraw ──────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          {/* Referral Link */}
          <div className="rounded-2xl bg-white/[0.03] border border-white/10 p-5">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
              🔗 الرابط متاعك
            </p>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-black/40 rounded-xl px-3 py-2.5 text-xs text-[#F6D365] font-mono truncate border border-white/5">
                {affiliate.referral_url}
              </div>
              <button
                onClick={handleCopy}
                className={`p-2.5 rounded-xl border transition-all ${
                  copied
                    ? "bg-green-500/20 border-green-500/30 text-green-400"
                    : "bg-white/5 border-white/10 text-gray-400 hover:text-white"
                }`}
              >
                {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </button>
              <button
                onClick={handleShare}
                className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white transition-colors"
              >
                <Share2 className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Withdraw */}
          <div className="rounded-2xl bg-gradient-to-br from-[#D4AF37]/5 to-transparent border border-[#D4AF37]/20 p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                💰 السحب
              </p>
              <p className="text-xs text-gray-500">
                الحد الأدنى: 30 DT
              </p>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-black text-[#F6D365]">
                  {stats.available_balance} <span className="text-sm">DT</span>
                </p>
                <p className="text-[10px] text-gray-500 mt-1">
                  إجمالي الأرباح: {stats.total_earned} DT | مسحوب: {stats.total_paid} DT
                </p>
              </div>
              <button
                onClick={() => setShowWithdraw(true)}
                disabled={!stats.can_withdraw}
                className={`px-5 py-3 rounded-xl text-sm font-black transition-all ${
                  stats.can_withdraw
                    ? "bg-gradient-to-r from-[#D4AF37] to-[#F6D365] text-black hover:scale-105 shadow-lg shadow-[#D4AF37]/20"
                    : "bg-white/5 text-gray-500 cursor-not-allowed border border-white/10"
                }`}
              >
                <ArrowDownToLine className="h-4 w-4 inline mr-1" />
                سحب
              </button>
            </div>
          </div>
        </div>

        {/* ── Earnings Summary Row ──────────────────────────────────── */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="rounded-2xl bg-white/[0.03] border border-white/10 p-4 text-center">
            <p className="text-lg font-black text-white">{stats.total_orders}</p>
            <p className="text-[10px] text-gray-500">إجمالي الكومندات</p>
          </div>
          <div className="rounded-2xl bg-white/[0.03] border border-white/10 p-4 text-center">
            <p className="text-lg font-black text-green-400">{stats.delivered_orders}</p>
            <p className="text-[10px] text-gray-500">تم التوصيل</p>
          </div>
          <div className="rounded-2xl bg-white/[0.03] border border-white/10 p-4 text-center">
            <p className="text-lg font-black text-yellow-400">{stats.pending_orders}</p>
            <p className="text-[10px] text-gray-500">في الانتظار</p>
          </div>
        </div>

        {/* ── Tabs: Orders / Payouts ───────────────────────────────── */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab("orders")}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === "orders"
                ? "bg-[#D4AF37]/20 text-[#F6D365] border border-[#D4AF37]/30"
                : "bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10"
            }`}
          >
            📦 الكومندات
          </button>
          <button
            onClick={() => setActiveTab("payouts")}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === "payouts"
                ? "bg-[#D4AF37]/20 text-[#F6D365] border border-[#D4AF37]/30"
                : "bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10"
            }`}
          >
            💸 عمليات السحب
          </button>
        </div>

        {/* Orders Table */}
        {activeTab === "orders" && (
          <div className="rounded-2xl bg-white/[0.02] border border-white/10 overflow-hidden">
            {orders.length === 0 ? (
              <div className="p-12 text-center">
                <Package className="h-10 w-10 text-gray-600 mx-auto mb-3" />
                <p className="text-sm text-gray-500" dir="rtl">
                  ما عندكش كومندات بعد. شارك الرابط متاعك وابدا اربح! 🚀
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/10 bg-white/[0.02]">
                      <th className="text-left py-3 px-4 text-xs font-black text-gray-200 uppercase tracking-wider">الحريف</th>
                      <th className="text-left py-3 px-4 text-xs font-black text-gray-200 uppercase tracking-wider">الباك</th>
                      <th className="text-left py-3 px-4 text-xs font-black text-gray-200 uppercase tracking-wider">السوم</th>
                      <th className="text-left py-3 px-4 text-xs font-black text-gray-200 uppercase tracking-wider">الحالة</th>
                      <th className="text-left py-3 px-4 text-xs font-black text-gray-200 uppercase tracking-wider">العمولة</th>
                      <th className="text-left py-3 px-4 text-xs font-black text-gray-200 uppercase tracking-wider">التاريخ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                        <td className="py-3 px-4 text-xs text-white font-medium">{order.customer_name}</td>
                        <td className="py-3 px-4 text-xs text-gray-400 uppercase">{order.package}</td>
                        <td className="py-3 px-4 text-xs text-white font-bold">{order.price} DT</td>
                        <td className="py-3 px-4"><StatusBadge status={order.status} /></td>
                        <td className="py-3 px-4">
                          {order.commission_amount > 0 ? (
                            <span className="text-xs text-green-400 font-bold">+{order.commission_amount} DT</span>
                          ) : (
                            <StatusBadge status={order.commission_status} />
                          )}
                        </td>
                        <td className="py-3 px-4 text-xs text-gray-500">
                          {new Date(order.created_at).toLocaleDateString("ar-TN")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Payouts Table */}
        {activeTab === "payouts" && (
          <div className="rounded-2xl bg-white/[0.02] border border-white/10 overflow-hidden">
            {payouts.length === 0 ? (
              <div className="p-12 text-center">
                <DollarSign className="h-10 w-10 text-gray-600 mx-auto mb-3" />
                <p className="text-sm text-gray-500" dir="rtl">
                  ما عملتش عمليات سحب بعد.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/10 bg-white/[0.02]">
                      <th className="text-left py-3 px-4 text-xs font-black text-gray-200 uppercase tracking-wider">المبلغ</th>
                      <th className="text-left py-3 px-4 text-xs font-black text-gray-200 uppercase tracking-wider">الطريقة</th>
                      <th className="text-left py-3 px-4 text-xs font-black text-gray-200 uppercase tracking-wider">الحالة</th>
                      <th className="text-left py-3 px-4 text-xs font-black text-gray-200 uppercase tracking-wider">المرجع</th>
                      <th className="text-left py-3 px-4 text-xs font-black text-gray-200 uppercase tracking-wider">التاريخ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payouts.map((payout) => (
                      <tr key={payout.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                        <td className="py-3 px-4 text-xs text-[#F6D365] font-black">{payout.amount} DT</td>
                        <td className="py-3 px-4 text-xs text-gray-400">
                          {payout.method === "flouci" ? "💳 Flouci" : "🏦 بطاقة"}
                        </td>
                        <td className="py-3 px-4"><StatusBadge status={payout.status} /></td>
                        <td className="py-3 px-4 text-xs text-gray-500 font-mono">{payout.reference || "—"}</td>
                        <td className="py-3 px-4 text-xs text-gray-500">
                          {new Date(payout.requested_at).toLocaleDateString("ar-TN")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main Page Component ─────────────────────────────────────────────────────

export default function AffiliateDashboardPage() {
  const [token, setToken] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("flawless_affiliate_token");
    if (saved) setToken(saved);
    setChecked(true);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("flawless_affiliate_token");
    setToken(null);
  };

  if (!checked) {
    return (
      <div className="min-h-screen bg-[#060606] flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-[#D4AF37] animate-spin" />
      </div>
    );
  }

  if (!token) {
    return <LoginScreen onLogin={setToken} />;
  }

  return <Dashboard token={token} onLogout={handleLogout} />;
}
