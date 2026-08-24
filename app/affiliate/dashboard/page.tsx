"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Logo } from "../../_components/Logo";
import {
  Sparkles,
  Trophy,
  Coins,
  Copy,
  Check,
  QrCode,
  Share2,
  TrendingUp,
  MousePointerClick,
  Palette,
  ShoppingBag,
  Clock,
  CheckCircle2,
  XCircle,
  Truck,
  ArrowUpRight,
  LogOut,
  Download,
  Smartphone,
  CreditCard,
  AlertCircle,
  Loader2,
  RefreshCw,
} from "lucide-react";

interface OrderItem {
  id: string;
  createdAt: string;
  customerName: string;
  cardSize: string;
  status: string;
  commission: number;
  commissionStatus: string;
}

interface AffiliateData {
  id: string;
  name: string;
  phone: string;
  code: string;
  payment_method: string;
  payment_details: string;
  commission_per_order: number;
}

interface Metrics {
  totalClicks: number;
  totalGenerated: number;
  totalOrders: number;
  deliveredOrdersCount: number;
  pendingOrdersCount: number;
  confirmedOrdersCount: number;
  cancelledOrdersCount: number;
  conversionRate: string;
  commissionPerOrder: number;
  totalGrossEarned: number;
  deliveredEarned: number;
  totalPaid: number;
  pendingPayoutAmount: number;
  availableBalance: number;
  pendingEarned?: number;
  canWithdraw?: boolean;
}

export default function AffiliateDashboard() {
  const router = useRouter();
  const [affiliate, setAffiliate] = useState<AffiliateData | null>(null);
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [payouts, setPayouts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [showPayoutModal, setShowPayoutModal] = useState(false);
  const [payoutAmount, setPayoutAmount] = useState("30");
  const [isSubmittingPayout, setIsSubmittingPayout] = useState(false);
  const [payoutSuccessMsg, setPayoutSuccessMsg] = useState<string | null>(null);
  const [payoutErrorMsg, setPayoutErrorMsg] = useState<string | null>(null);

  // Load session
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("flw_aff_user");
      if (!stored) {
        router.push("/affiliate/login");
        return;
      }
      try {
        const parsed = JSON.parse(stored);
        setAffiliate(parsed);
        fetchStats(parsed.code);
      } catch {
        router.push("/affiliate/login");
      }
    }
  }, [router]);

  const fetchStats = async (code: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/affiliate/stats?code=${encodeURIComponent(code)}&t=${Date.now()}`, {
        cache: "no-store",
      });
      const data = await res.json();
      if (data.success) {
        setMetrics(data.metrics);
        setOrders(data.orders || []);
        setPayouts(data.payouts || []);
        if (data.affiliate) {
          setAffiliate(data.affiliate);
          localStorage.setItem("flw_aff_user", JSON.stringify(data.affiliate));
        }
      }
    } catch (err) {
      console.warn("Failed to fetch affiliate stats:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("flw_aff_user");
    }
    router.push("/affiliate/login");
  };

  const siteOrigin = typeof window !== "undefined" ? window.location.origin : "https://beflawless.art";
  const refLink = affiliate ? `${siteOrigin}/generator?ref=${affiliate.code}` : "";
  const homeRefLink = affiliate ? `${siteOrigin}/?ref=${affiliate.code}` : "";

  const handleCopyLink = () => {
    if (refLink) {
      navigator.clipboard.writeText(refLink);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleCopyCode = () => {
    if (affiliate?.code) {
      navigator.clipboard.writeText(affiliate.code);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const handlePayoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!affiliate) return;
    setIsSubmittingPayout(true);
    setPayoutErrorMsg(null);
    setPayoutSuccessMsg(null);

    try {
      const res = await fetch("/api/affiliate/payout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          affiliateId: affiliate.id,
          amount: Number(payoutAmount),
          paymentMethod: affiliate.payment_method,
          paymentDetails: affiliate.payment_details,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "فشل تسجيل طلب السحب");
      }

      setPayoutSuccessMsg(data.message || "تم تسجيل طلب السحب بنجاح!");
      fetchStats(affiliate.code);
      setTimeout(() => setShowPayoutModal(false), 2500);
    } catch (err: any) {
      setPayoutErrorMsg(err.message || "حدث خطأ أثناء إرسال طلب السحب");
    } finally {
      setIsSubmittingPayout(false);
    }
  };

  if (!affiliate && loading) {
    return (
      <div className="min-h-screen bg-[#060606] flex items-center justify-center text-white" dir="rtl">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-[#D4AF37] animate-spin" />
          <span className="text-sm font-bold text-neutral-400">جاري تحميل لوحة التحكم...</span>
        </div>
      </div>
    );
  }

  const rate = metrics?.commissionPerOrder || 10;

  return (
    <div className="min-h-screen bg-[#070707] text-white flex flex-col selection:bg-[#D4AF37] selection:text-black" dir="rtl">
      {/* Top Navbar */}
      <header className="border-b border-white/10 bg-[#0c0c0c]/80 backdrop-blur-xl sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo />
            <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#F6D365] text-xs font-bold font-mono">
              @{affiliate?.code}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => affiliate && fetchStats(affiliate.code)}
              className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-neutral-300 text-xs flex items-center gap-1.5 transition-all"
              title="تحديث البيانات"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">تحديث</span>
            </button>

            <Link
              href="/affiliate#classement"
              className="px-3 py-1.5 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#F6D365] text-xs font-bold hover:bg-[#D4AF37]/20 transition-all flex items-center gap-1.5"
            >
              <Trophy className="w-3.5 h-3.5" />
              <span>الترتيب العام</span>
            </Link>

            <button
              onClick={handleLogout}
              className="p-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 text-xs flex items-center gap-1 transition-all"
              title="تسجيل الخروج"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">خروج</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-[#D4AF37]/15 via-[#111] to-[#111] border border-[#D4AF37]/30 rounded-3xl p-6 sm:p-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-[#F6D365]">مرحباً بك مجدداً 👋</span>
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                حساب نشط
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              {affiliate?.name || "الشريك المميز"}
            </h1>
            <p className="text-xs sm:text-sm text-neutral-400 font-medium mt-1">
              عمولتك الحالية: <strong className="text-[#F6D365] font-black">{rate} دينار</strong> على كل كارطة تتباع برابطك
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowPayoutModal(true)}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-[#D4AF37] to-[#F6D365] text-black font-black text-xs sm:text-sm hover:scale-105 transition-all shadow-lg shadow-[#D4AF37]/25 flex items-center gap-2 cursor-pointer"
            >
              <Coins className="w-4 h-4" />
              <span>طلب سحب المرابيح ({metrics?.availableBalance || 0} د.ت)</span>
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* FUNNEL & KPI METRICS CARDS */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* 1. Link Clicks */}
          <div className="bg-[#111111] border border-white/10 rounded-2xl p-5 relative overflow-hidden group hover:border-[#D4AF37]/40 transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-neutral-400">إجمالي النقرات</span>
              <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                <MousePointerClick className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white font-mono">
              {metrics?.totalClicks || 0}
            </div>
            <div className="text-[11px] text-neutral-500 mt-1">
              شخص ضغط على رابطك الخاص
            </div>
          </div>

          {/* 2. Cards Generated */}
          <div className="bg-[#111111] border border-white/10 rounded-2xl p-5 relative overflow-hidden group hover:border-[#D4AF37]/40 transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-neutral-400">كروت تم توليدها</span>
              <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                <Palette className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white font-mono">
              {metrics?.totalGenerated || 0}
            </div>
            <div className="text-[11px] text-neutral-500 mt-1">
              صمّموا كارطة بالذكاء الاصطناعي
            </div>
          </div>

          {/* 3. Orders Placed */}
          <div className="bg-[#111111] border border-white/10 rounded-2xl p-5 relative overflow-hidden group hover:border-[#D4AF37]/40 transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-neutral-400">الطلبيات المسجلة</span>
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <ShoppingBag className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">
              {metrics?.totalOrders || 0}
            </div>
            <div className="text-[11px] text-neutral-500 mt-1 flex items-center gap-1">
              <span>المسلّمة: <strong className="text-white">{metrics?.deliveredOrdersCount || 0}</strong></span>
              <span>•</span>
              <span>قيد التوصيل: {metrics?.pendingOrdersCount || 0}</span>
            </div>
          </div>

          {/* 4. Total Earned */}
          <div className="bg-[#111111] border border-[#D4AF37]/40 rounded-2xl p-5 relative overflow-hidden group bg-gradient-to-br from-[#D4AF37]/10 to-transparent">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-[#F6D365]">الرصيد والمرابيح</span>
              <div className="w-8 h-8 rounded-xl bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center text-[#F6D365]">
                <Coins className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FFF6B0] to-[#D4AF37] font-mono">
              {metrics?.totalGrossEarned || 0} <span className="text-xs text-white">د.ت</span>
            </div>
            <div className="text-[11px] text-neutral-400 mt-1 flex items-center gap-1.5">
              <span>المتاح للسحب: <strong className="text-emerald-400 font-bold">{metrics?.availableBalance || 0} د.ت</strong></span>
              <span>•</span>
              <span>المسحوب: {metrics?.totalPaid || 0} د.ت</span>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* REFERRAL LINK & SHARING HUB */}
        {/* ========================================================================= */}
        <div className="bg-[#111111] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-black text-white flex items-center gap-2">
                <Share2 className="w-5 h-5 text-[#F6D365]" />
                <span>رابط الإحالة والكود الخاص بيك</span>
              </h2>
              <p className="text-xs text-neutral-400 mt-1">
                أي شخص يدخل بالرابط أو يستعمل كودك، تتسجل الكوموند باسمك وتاخذ 10 دنانير مباشرة!
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
            {/* Direct Link */}
            <div className="lg:col-span-8 bg-black/60 border border-white/15 rounded-2xl p-3 sm:p-4 flex items-center justify-between gap-2 overflow-hidden">
              <span className="text-xs sm:text-sm font-mono text-[#F6D365] truncate select-all">
                {refLink}
              </span>
              <button
                onClick={handleCopyLink}
                className="px-4 py-2 rounded-xl bg-[#D4AF37] hover:bg-[#F6D365] text-black font-black text-xs shrink-0 flex items-center gap-1.5 transition-all shadow-md"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>تم النسخ!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>نسخ الرابط</span>
                  </>
                )}
              </button>
            </div>

            {/* Promo Code Box */}
            <div className="lg:col-span-4 bg-black/60 border border-white/15 rounded-2xl p-3 sm:p-4 flex items-center justify-between gap-2">
              <div>
                <div className="text-[10px] text-neutral-400">كود الخصم والإحالة:</div>
                <div className="text-sm font-black text-white font-mono tracking-wider">
                  {affiliate?.code}
                </div>
              </div>
              <button
                onClick={handleCopyCode}
                className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1 transition-all"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>نسخ الكود</span>
              </button>
            </div>
          </div>

          {/* Quick Share Shortcuts */}
          <div className="flex flex-wrap gap-2 pt-2 border-t border-white/5">
            <a
              href={`https://wa.me/?text=${encodeURIComponent(`صمّم كارتك التونسية الفاخرة للذكرى بالذكاء الاصطناعي مع خصم خاص من هنا: ${refLink}`)}`}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 rounded-xl bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-600/30 text-xs font-bold flex items-center gap-2 transition-all"
            >
              <span>مشاركة على واتساب WhatsApp</span>
            </a>

            <button
              onClick={() => {
                const text = `صمّم كارتك التونسية بالذكاء الاصطناعي باسمك وصورتك من هنا:\n${refLink}\nواستعمل الكود: ${affiliate?.code}`;
                navigator.clipboard.writeText(text);
                alert("تم نسخ نص الستوري والمنشور بنجاح! الصقه في إنستغرام أو تيك توك.");
              }}
              className="px-4 py-2 rounded-xl bg-purple-600/20 border border-purple-500/30 text-purple-300 hover:bg-purple-600/30 text-xs font-bold flex items-center gap-2 transition-all"
            >
              <span>نسخ نص الستوري لإنستغرام وتيك توك</span>
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* REFERRED ORDERS TABLE WITH LIVE STATUS */}
        {/* ========================================================================= */}
        <div className="bg-[#111111] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-lg font-black text-white flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-emerald-400" />
                <span>الطلبيات والمبيعات المحققة برابطك</span>
              </h2>
              <p className="text-xs text-neutral-400 mt-1">
                تتبع حالة كل كوموند من وقت تسجيلها حتى تسليمها وقبض الـ 10 دنانير
              </p>
            </div>
            <span className="text-xs font-bold text-neutral-400">
              إجمالي: {orders.length} طلبية
            </span>
          </div>

          {orders.length === 0 ? (
            <div className="text-center py-14 border border-dashed border-white/10 rounded-2xl bg-black/30">
              <ShoppingBag className="w-10 h-10 text-neutral-600 mx-auto mb-3" />
              <h3 className="text-sm font-bold text-neutral-300">لا توجد طلبيات مسجلة برابطك بعد</h3>
              <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto">
                شارك رابطك الآن على تيك توك أو فيسبوك للبدء في تحقيق المبيعات واستلام أول 10 دينار!
              </p>
              <button
                onClick={handleCopyLink}
                className="mt-4 px-5 py-2.5 rounded-xl bg-[#D4AF37] text-black font-black text-xs hover:scale-105 transition-all"
              >
                انسخ رابطك وانشر توا 🚀
              </button>
            </div>
          ) : (
            <div className="border border-white/10 rounded-2xl overflow-hidden bg-black/40">
              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead className="bg-white/5 border-b border-white/10 text-neutral-400 font-bold">
                    <tr>
                      <th className="p-3.5">رقم الطلبية</th>
                      <th className="p-3.5">التاريخ والوقت</th>
                      <th className="p-3.5">الحريف</th>
                      <th className="p-3.5">نوع الكارطة</th>
                      <th className="p-3.5">حالة التوصيل</th>
                      <th className="p-3.5 text-left">عمولتك</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {orders.map((order) => {
                      const isDelivered = order.status === "delivered";
                      const isCancelled = order.status === "cancelled";
                      const isConfirmed = order.status === "confirmed" || order.status === "processing" || order.status === "in_delivery";

                      let statusBadge = (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-yellow-500/10 text-yellow-400 font-bold border border-yellow-500/20 text-[11px]">
                          <Clock className="w-3 h-3" />
                          قيد التأكيد (Pending)
                        </span>
                      );

                      if (isDelivered) {
                        statusBadge = (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-400 font-bold border border-emerald-500/30 text-[11px]">
                            <CheckCircle2 className="w-3 h-3" />
                            تم التسليم ومكتسبة ✅
                          </span>
                        );
                      } else if (isConfirmed) {
                        statusBadge = (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-500/15 text-blue-400 font-bold border border-blue-500/30 text-[11px]">
                            <Truck className="w-3 h-3" />
                            مؤكدة وفي التوصيل 🚚
                          </span>
                        );
                      } else if (isCancelled) {
                        statusBadge = (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-500/10 text-red-400 font-bold border border-red-500/20 text-[11px]">
                            <XCircle className="w-3 h-3" />
                            ملغاة
                          </span>
                        );
                      }

                      return (
                        <tr key={order.id} className="hover:bg-white/[0.02] transition-colors">
                          <td className="p-3.5 font-mono font-bold text-white">
                            #{order.id.slice(0, 8)}
                          </td>
                          <td className="p-3.5 text-neutral-400">
                            {new Date(order.createdAt).toLocaleDateString("ar-TN", {
                              day: "numeric",
                              month: "short",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </td>
                          <td className="p-3.5 font-semibold text-neutral-300">
                            {order.customerName}
                          </td>
                          <td className="p-3.5 text-neutral-400 font-medium">
                            {order.cardSize === "mega" ? "Giant 60x40" : "Standard 45x30"}
                          </td>
                          <td className="p-3.5">
                            {statusBadge}
                          </td>
                          <td className="p-3.5 text-left font-black font-mono text-[#F6D365]">
                            +{order.commission.toFixed(2)} د.ت
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* PAYOUT HISTORY SECTION */}
        {/* ========================================================================= */}
        {payouts.length > 0 && (
          <div className="bg-[#111111] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-4">
            <h2 className="text-lg font-black text-white flex items-center gap-2">
              <Coins className="w-5 h-5 text-[#F6D365]" />
              <span>سجل السحوبات والتحويلات</span>
            </h2>

            <div className="divide-y divide-white/5 border border-white/10 rounded-2xl bg-black/40 overflow-hidden">
              {payouts.map((p) => (
                <div key={p.id} className="p-4 flex items-center justify-between hover:bg-white/[0.02]">
                  <div>
                    <div className="text-xs font-bold text-white flex items-center gap-2">
                      <span>سحب {Number(p.amount).toFixed(2)} د.ت</span>
                      <span className="text-[11px] text-neutral-400 font-normal">
                        عبر {p.payment_method} ({p.payment_details})
                      </span>
                    </div>
                    <div className="text-[11px] text-neutral-500 mt-0.5">
                      {new Date(p.created_at).toLocaleDateString("ar-TN")}
                      {p.transaction_ref && <span className="text-[#F6D365] mr-2 font-mono">مرجع: {p.transaction_ref}</span>}
                    </div>
                  </div>

                  <div>
                    {p.status === "completed" ? (
                      <span className="px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-xs font-bold">
                        تم التحويل بنجاح ✅
                      </span>
                    ) : p.status === "rejected" ? (
                      <span className="px-2.5 py-1 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 text-xs font-bold">
                        مرفوض
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 text-xs font-bold">
                        قيد المعالجة (24-48 ساعة) ⏳
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* ========================================================================= */}
      {/* PAYOUT REQUEST MODAL */}
      {/* ========================================================================= */}
      {showPayoutModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4" dir="rtl">
          <div className="bg-[#141414] border border-[#D4AF37]/40 rounded-3xl max-w-md w-full p-6 sm:p-8 relative shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <Coins className="w-5 h-5 text-[#F6D365]" />
                <span>طلب سحب المرابيح</span>
              </h3>
              <button
                onClick={() => setShowPayoutModal(false)}
                className="text-neutral-400 hover:text-white text-xs font-bold"
              >
                إغلاق ✕
              </button>
            </div>

            {payoutSuccessMsg ? (
              <div className="py-8 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                <h4 className="text-base font-black text-white">تم تسجيل طلب السحب!</h4>
                <p className="text-xs text-neutral-300">{payoutSuccessMsg}</p>
              </div>
            ) : (
              <form onSubmit={handlePayoutSubmit} className="space-y-4 mt-4">
                {payoutErrorMsg && (
                  <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{payoutErrorMsg}</span>
                  </div>
                )}

                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-neutral-400">الرصيد المتاح للسحب (كروت مسلّمة):</span>
                    <span className="font-black text-[#F6D365] text-sm font-mono">
                      {metrics?.availableBalance || 0} د.ت
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-neutral-400 border-t border-white/5 pt-2">
                    <span>أرباح قيد التوصيل والتحصيل:</span>
                    <span className="text-white font-bold">{metrics?.pendingEarned || 0} د.ت</span>
                  </div>
                </div>

                {(metrics?.availableBalance || 0) < 30 && (
                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs leading-relaxed space-y-1">
                    <div className="font-bold flex items-center gap-1.5">
                      <span>⚠️</span>
                      <span>شرط السحب: 30 دينار على الأقل من كروت تم تسليمها</span>
                    </div>
                    <p className="text-[11px] text-amber-200/80">
                      لديك حالياً <strong className="text-white">{metrics?.deliveredOrdersCount || 0} كروت مسلّمة</strong> من أصل 3 كروت مطلوبة. الأرباح تصبح قابلة للسحب فور استلام الزبون لكارطته من الموزّع.
                    </p>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-neutral-300 mb-1">
                    المبلغ المطلوب سحبه (د.ت)
                  </label>
                  <input
                    type="number"
                    min="30"
                    max={metrics?.availableBalance || 30}
                    step="10"
                    required
                    disabled={(metrics?.availableBalance || 0) < 30}
                    value={payoutAmount}
                    onChange={(e) => setPayoutAmount(e.target.value)}
                    className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-sm text-white font-mono focus:outline-none focus:border-[#D4AF37] disabled:opacity-50"
                  />
                  <span className="text-[10px] text-neutral-500 mt-1 block">
                    الحد الأدنى للسحب هو 30 د.ت (ما يعادل 3 كروت مسلّمة)
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs space-y-1">
                  <div className="text-neutral-400">سيتم التحويل إلى:</div>
                  <div className="font-bold text-white">
                    {affiliate?.payment_method}: {affiliate?.payment_details}
                  </div>
                </div>

                <div className="pt-2 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowPayoutModal(false)}
                    className="w-1/2 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs cursor-pointer"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingPayout || (metrics?.availableBalance || 0) < 30}
                    className="w-1/2 py-3 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#F6D365] text-black font-black text-xs hover:scale-105 transition-all shadow-lg disabled:opacity-50"
                  >
                    {isSubmittingPayout ? "جاري الإرسال..." : "تأكيد السحب 🚀"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
