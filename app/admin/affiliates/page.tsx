"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Logo } from "../../_components/Logo";
import {
  ShieldCheck,
  Users,
  MousePointerClick,
  Palette,
  ShoppingBag,
  Coins,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  Edit2,
  Lock,
  ArrowUpRight,
  RefreshCw,
  Eye,
  AlertTriangle,
  Smartphone,
  Truck,
  Check,
  X,
  MessageCircle,
  PhoneCall,
  FileText,
  ExternalLink,
  Activity,
  Layers,
  ChevronDown,
  Percent,
} from "lucide-react";

export default function AdminAffiliatesDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [passcodeError, setPasscodeError] = useState(false);

  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<any>(null);
  const [affiliates, setAffiliates] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [referredOrders, setReferredOrders] = useState<any[]>([]);
  const [payouts, setPayouts] = useState<any[]>([]);
  const [trafficEvents, setTrafficEvents] = useState<any[]>([]);

  // Navigation & Filters
  const [activeTab, setActiveTab] = useState<"overview" | "orders" | "affiliates" | "payouts">("orders");
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>("all");
  const [orderSearchQuery, setOrderSearchQuery] = useState("");
  const [affiliateSearchQuery, setAffiliateSearchQuery] = useState("");

  // Payout Approval Modal
  const [selectedPayout, setSelectedPayout] = useState<any>(null);
  const [transactionRef, setTransactionRef] = useState("");
  const [isProcessingPayout, setIsProcessingPayout] = useState(false);

  // Status updating state
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

  // Preview Image Modal
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);

  // Commission Rate Edit Modal
  const [editingAffiliate, setEditingAffiliate] = useState<any>(null);
  const [newCommissionRate, setNewCommissionRate] = useState<string>("10");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem("flw_admin_auth");
      if (stored === "ok") {
        setIsAuthenticated(true);
        loadAdminData();
      }
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      passcode.trim() === "Nicenameflawless12@"
    ) {
      sessionStorage.setItem("flw_admin_auth", "ok");
      setIsAuthenticated(true);
      setPasscodeError(false);
      loadAdminData();
    } else {
      setPasscodeError(true);
    }
  };

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/affiliates?t=${Date.now()}`, { cache: "no-store" });
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      const data = await res.json();
      if (data && data.success) {
        setStats(data.stats);
        setAffiliates(data.affiliates || []);
        setOrders(data.orders || []);
        setReferredOrders(data.referredOrders || []);
        setPayouts(data.payouts || []);
        setTrafficEvents(data.trafficEvents || []);
      }
    } catch (err) {
      console.warn("Admin data load warning:", err);
    } finally {
      setLoading(false);
    }
  };

  // 1-Click Update Order Status (Pending -> In Delivery -> Delivered -> Cancelled)
  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    setUpdatingOrderId(orderId);
    try {
      const res = await fetch("/api/admin/orders/status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId,
          status: newStatus,
        }),
      });

      if (res.ok) {
        await loadAdminData();
      } else {
        const errData = await res.json();
        alert(errData.error || "فشل تحديث حالة الطلبية");
      }
    } catch (err) {
      console.error("Order status update error:", err);
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const handleToggleAffiliateStatus = async (affiliateId: string, currentStatus: string) => {
    const nextStatus = currentStatus === "active" ? "suspended" : "active";
    try {
      const res = await fetch("/api/admin/affiliates", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          affiliateId,
          status: nextStatus,
        }),
      });

      if (res.ok) {
        loadAdminData();
      }
    } catch (err) {
      console.error("Toggle error:", err);
    }
  };

  const handleSaveCommissionRate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAffiliate) return;

    try {
      const res = await fetch("/api/admin/affiliates", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          affiliateId: editingAffiliate.id,
          commissionRate: parseFloat(newCommissionRate) || 10.0,
        }),
      });

      if (res.ok) {
        setEditingAffiliate(null);
        loadAdminData();
      }
    } catch (err) {
      console.error("Commission rate save error:", err);
    }
  };

  const handleApprovePayout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPayout) return;
    setIsProcessingPayout(true);

    try {
      const res = await fetch("/api/admin/payouts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          payoutId: selectedPayout.id,
          status: "completed",
          transactionRef: transactionRef.trim() || "D17_APPROVED",
        }),
      });

      if (res.ok) {
        setSelectedPayout(null);
        setTransactionRef("");
        loadAdminData();
      }
    } catch (err) {
      console.error("Payout approval error:", err);
    } finally {
      setIsProcessingPayout(false);
    }
  };

  // Filter Orders
  const filteredOrders = orders.filter((o) => {
    // Status Filter
    if (orderStatusFilter === "pending") {
      const isPending = o.status === "pending" || !o.status;
      if (!isPending) return false;
    } else if (orderStatusFilter === "in_delivery") {
      const isInDelivery = o.status === "in_delivery" || o.status === "confirmed" || o.status === "processing";
      if (!isInDelivery) return false;
    } else if (orderStatusFilter === "delivered") {
      if (o.status !== "delivered") return false;
    } else if (orderStatusFilter === "cancelled") {
      if (o.status !== "cancelled") return false;
    } else if (orderStatusFilter === "affiliate_only") {
      if (!o.affiliate_code && !o.affiliate_id) return false;
    }

    // Search Query
    if (orderSearchQuery.trim()) {
      const q = orderSearchQuery.toLowerCase().trim();
      const matchName = String(o.customer_name || o.name || "").toLowerCase().includes(q);
      const matchPhone = String(o.phone || o.customer_phone || "").includes(q);
      const matchCode = String(o.affiliate_code || "").toLowerCase().includes(q);
      const matchId = String(o.id || "").toLowerCase().includes(q);
      const matchGov = String(o.governorate || "").toLowerCase().includes(q);
      if (!matchName && !matchPhone && !matchCode && !matchId && !matchGov) return false;
    }

    return true;
  });

  // Filter Affiliates
  const filteredAffiliates = affiliates.filter((aff) => {
    if (!affiliateSearchQuery.trim()) return true;
    const q = affiliateSearchQuery.toLowerCase().trim();
    return (
      (aff.name || "").toLowerCase().includes(q) ||
      (aff.code || aff.ref_code || "").toLowerCase().includes(q) ||
      (aff.phone || "").includes(q) ||
      (aff.payment_details || "").toLowerCase().includes(q)
    );
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#060606] flex items-center justify-center p-4 text-white" dir="rtl">
        <div className="bg-[#111] border border-white/10 rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl">
          <div className="w-12 h-12 rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center text-[#F6D365] mx-auto mb-4">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-black text-white">لوحة تحكم الإدارة</h2>
          <p className="text-xs text-neutral-400 mt-1 mb-6">
            الرجاء إدخال رمز الحماية للوصول إلى إدارة الطلبيات والترافيك والشركاء
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              placeholder="رمز الدخول (Passcode)"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/10 text-center font-mono text-white text-sm focus:outline-none focus:border-[#D4AF37]"
            />
            {passcodeError && (
              <div className="text-xs text-red-400 font-bold">
                رمز الدخول غير صحيح!
              </div>
            )}
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#F6D365] text-black font-black text-xs hover:scale-105 transition-all shadow-lg cursor-pointer"
            >
              دخول إلى اللوحة 🛡️
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#060606] text-white flex flex-col font-sans" dir="rtl">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-[#060606]/95 backdrop-blur-xl border-b border-white/10 px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Logo />
            <div className="hidden sm:flex items-center gap-2 pr-3 border-r border-white/10">
              <span className="px-2.5 py-0.5 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#F6D365] text-[11px] font-bold">
                Admin Control Center 🛡️
              </span>
            </div>
          </div>

          {/* Quick Stats in Header */}
          <div className="hidden lg:flex items-center gap-4 text-xs font-mono">
            <div className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2">
              <span className="text-neutral-400">إجمالي الطلبيات:</span>
              <span className="font-bold text-white">{stats?.totalOrdersCount || 0}</span>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-2 text-emerald-400">
              <span>مسلّمة:</span>
              <span className="font-bold">{stats?.deliveredOrdersCount || 0}</span>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center gap-2 text-[#F6D365]">
              <span>عمولات جاهزة للسحب:</span>
              <span className="font-bold">{stats?.unpaidWithdrawable || 0} د.ت</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadAdminData}
              disabled={loading}
              className="p-2 rounded-xl bg-white/5 border border-white/10 text-neutral-300 hover:text-white hover:bg-white/10 text-xs flex items-center gap-1.5 transition-all cursor-pointer"
              title="تحديث البيانات"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-[#F6D365]" : ""}`} />
              <span className="hidden sm:inline">تحديث</span>
            </button>

            <button
              onClick={() => {
                sessionStorage.removeItem("flw_admin_auth");
                setIsAuthenticated(false);
              }}
              className="px-3 py-1.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 text-xs font-bold transition-all cursor-pointer"
            >
              خروج
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 p-1.5 bg-[#111] border border-white/10 rounded-2xl">
          <button
            onClick={() => setActiveTab("orders")}
            className={`flex-1 min-w-[140px] py-3 px-4 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === "orders"
                ? "bg-gradient-to-r from-[#D4AF37] to-[#F6D365] text-black shadow-lg shadow-[#D4AF37]/20"
                : "text-neutral-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>إدارة وتأكيد الطلبيات ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("overview")}
            className={`flex-1 min-w-[140px] py-3 px-4 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === "overview"
                ? "bg-gradient-to-r from-[#D4AF37] to-[#F6D365] text-black shadow-lg shadow-[#D4AF37]/20"
                : "text-neutral-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>نظرة عامة وحركة المرور</span>
          </button>

          <button
            onClick={() => setActiveTab("affiliates")}
            className={`flex-1 min-w-[140px] py-3 px-4 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === "affiliates"
                ? "bg-gradient-to-r from-[#D4AF37] to-[#F6D365] text-black shadow-lg shadow-[#D4AF37]/20"
                : "text-neutral-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <Users className="w-4 h-4" />
            <span>دليل الشركاء ({affiliates.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("payouts")}
            className={`flex-1 min-w-[140px] py-3 px-4 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 relative cursor-pointer ${
              activeTab === "payouts"
                ? "bg-gradient-to-r from-[#D4AF37] to-[#F6D365] text-black shadow-lg shadow-[#D4AF37]/20"
                : "text-neutral-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <Coins className="w-4 h-4" />
            <span>طلبات السحب ({payouts.filter((p) => p.status === "pending").length})</span>
            {payouts.filter((p) => p.status === "pending").length > 0 && (
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping absolute top-2 right-2" />
            )}
          </button>
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: ORDERS & DELIVERY VALIDATION PIPELINE */}
        {/* ========================================================================= */}
        {activeTab === "orders" && (
          <div className="space-y-6">
            {/* Filter Bar */}
            <div className="bg-[#111] border border-white/10 rounded-2xl p-4 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
              {/* Status Filter Badges */}
              <div className="flex flex-wrap items-center gap-1.5">
                {[
                  { id: "all", label: "الكل", count: orders.length },
                  { id: "pending", label: "قيد التأكيد ⏳", count: stats?.pendingOrdersCount || 0 },
                  { id: "in_delivery", label: "في التوصيل 🚚", count: stats?.inDeliveryOrdersCount || 0 },
                  { id: "delivered", label: "تم التسليم ✅", count: stats?.deliveredOrdersCount || 0 },
                  { id: "cancelled", label: "ملغاة ❌", count: stats?.cancelledOrdersCount || 0 },
                  { id: "affiliate_only", label: "إحالات الشركاء 🎯", count: stats?.referredOrdersCount || 0 },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setOrderStatusFilter(tab.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      orderStatusFilter === tab.id
                        ? "bg-[#D4AF37] text-black"
                        : "bg-white/5 text-neutral-400 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    {tab.label} ({tab.count})
                  </button>
                ))}
              </div>

              {/* Search Box */}
              <div className="relative min-w-[260px]">
                <Search className="w-4 h-4 text-neutral-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="ابحث بالاسم، الهاتف، الولاية، أو كود الشريك..."
                  value={orderSearchQuery}
                  onChange={(e) => setOrderSearchQuery(e.target.value)}
                  className="w-full bg-black/60 border border-white/10 rounded-xl pr-10 pl-4 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
            </div>

            {/* Orders Table */}
            <div className="bg-[#111] border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
              <div className="p-4 sm:p-6 border-b border-white/10 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-black text-white flex items-center gap-2">
                    <Truck className="w-5 h-5 text-[#F6D365]" />
                    <span>سجل الطلبيات وتأكيد التوصيل</span>
                  </h3>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    تغيير الحالة إلى <strong className="text-emerald-400">"تم التسليم ✅"</strong> يضيف 10 د.ت فوراً إلى رصيد الشريك القابل للسحب.
                  </p>
                </div>
                <span className="text-xs font-mono font-bold text-neutral-400">
                  {filteredOrders.length} طلبية
                </span>
              </div>

              {filteredOrders.length === 0 ? (
                <div className="py-16 text-center text-neutral-500 text-xs">
                  لا توجد طلبيات مطابقة للبحث أو الفلتر المحدد.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-right text-xs">
                    <thead>
                      <tr className="bg-white/5 border-b border-white/10 text-neutral-400 font-bold uppercase">
                        <th className="py-3.5 px-4">رقم وتاريخ الطلب</th>
                        <th className="py-3.5 px-4">معلومات الزبون</th>
                        <th className="py-3.5 px-4">العنوان والتوصيل</th>
                        <th className="py-3.5 px-4">الكارت والسعر</th>
                        <th className="py-3.5 px-4">الشريك المنسوب</th>
                        <th className="py-3.5 px-4 text-center">حالة التوصيل (تحديث فوري)</th>
                        <th className="py-3.5 px-4 text-center">المعاينة والـ PDF</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {filteredOrders.map((order) => {
                        const isReferred = Boolean(order.affiliate_code);
                        const isDelivered = order.status === "delivered";
                        const isUpdating = updatingOrderId === order.id;

                        return (
                          <tr
                            key={order.id}
                            className={`hover:bg-white/[0.02] transition-colors ${
                              isDelivered ? "bg-emerald-500/[0.02]" : ""
                            }`}
                          >
                            {/* Order ID & Date */}
                            <td className="py-4 px-4 font-mono">
                              <div className="font-bold text-white">{order.id}</div>
                              <div className="text-[10px] text-neutral-500 mt-0.5">
                                {order.created_at
                                  ? new Date(order.created_at).toLocaleDateString("ar-TN", {
                                      month: "short",
                                      day: "numeric",
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })
                                  : "—"}
                              </div>
                            </td>

                            {/* Customer info & Phone */}
                            <td className="py-4 px-4">
                              <div className="font-bold text-white">{order.customer_name || order.name || "—"}</div>
                              <div className="flex items-center gap-2 mt-1">
                                <a
                                  href={`tel:${order.phone || order.customer_phone}`}
                                  className="text-[11px] text-[#F6D365] font-mono hover:underline flex items-center gap-1"
                                >
                                  <PhoneCall className="w-3 h-3" />
                                  <span>{order.phone || order.customer_phone}</span>
                                </a>
                                <a
                                  href={`https://wa.me/216${String(order.phone || order.customer_phone).replace(/\s+/g, "")}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-1 rounded bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30"
                                  title="مراسلة عبر واتساب"
                                >
                                  <MessageCircle className="w-3 h-3" />
                                </a>
                              </div>
                            </td>

                            {/* Address */}
                            <td className="py-4 px-4 max-w-[200px]">
                              <div className="font-bold text-white">
                                {order.governorate || "تونس"} {order.city ? `• ${order.city}` : ""}
                              </div>
                              <div className="text-[10px] text-neutral-400 truncate mt-0.5" title={order.address}>
                                {order.address || "العنوان غير محدد"}
                              </div>
                            </td>

                            {/* Card & Price */}
                            <td className="py-4 px-4 font-mono">
                              <div className="font-bold text-white">
                                {order.card_size === "mega" ? "Mega 60x40" : "Standard 45x30"} (x{order.quantity || 1})
                              </div>
                              <div className="text-[11px] text-[#F6D365] font-bold mt-0.5">
                                {order.total_price || order.price || 57} د.ت
                              </div>
                            </td>

                            {/* Affiliate Code */}
                            <td className="py-4 px-4">
                              {isReferred ? (
                                <div className="space-y-0.5">
                                  <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#F6D365] font-mono font-bold text-[11px]">
                                    @{order.affiliate_code}
                                  </span>
                                  <div className="text-[10px] text-neutral-400">
                                    عمولة: <strong className="text-white">+{order.commission_amount || 10} د.ت</strong>
                                  </div>
                                </div>
                              ) : (
                                <span className="text-[10px] text-neutral-500">طلب مباشر</span>
                              )}
                            </td>

                            {/* 1-Click Status Selector */}
                            <td className="py-4 px-4 text-center">
                              <div className="inline-flex flex-col gap-1 items-center">
                                <select
                                  disabled={isUpdating}
                                  value={order.status || "pending"}
                                  onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                                  className={`px-3 py-1.5 rounded-xl font-bold text-xs border focus:outline-none transition-all cursor-pointer ${
                                    order.status === "delivered"
                                      ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40 font-black"
                                      : order.status === "in_delivery" || order.status === "confirmed"
                                      ? "bg-blue-500/20 text-blue-400 border-blue-500/40"
                                      : order.status === "cancelled"
                                      ? "bg-red-500/20 text-red-400 border-red-500/40"
                                      : "bg-yellow-500/20 text-yellow-300 border-yellow-500/40"
                                  }`}
                                >
                                  <option value="pending" className="bg-neutral-900 text-yellow-300">
                                    ⏳ قيد التأكيد (Pending)
                                  </option>
                                  <option value="in_delivery" className="bg-neutral-900 text-blue-400">
                                    🚚 في التوصيل مع الموزّع
                                  </option>
                                  <option value="delivered" className="bg-neutral-900 text-emerald-400">
                                    ✅ تم التسليم واستلام النقود
                                  </option>
                                  <option value="cancelled" className="bg-neutral-900 text-red-400">
                                    ❌ ملغاة (Cancelled)
                                  </option>
                                </select>
                                {isUpdating && (
                                  <span className="text-[9px] text-[#F6D365] animate-pulse">جاري الحفظ...</span>
                                )}
                              </div>
                            </td>

                            {/* Preview Thumbnail & PDF Link */}
                            <td className="py-4 px-4 text-center">
                              <div className="flex items-center justify-center gap-2">
                                {order.card_image_url ? (
                                  <button
                                    onClick={() => setPreviewImageUrl(order.card_image_url)}
                                    className="p-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/15 text-neutral-300 hover:text-white cursor-pointer"
                                    title="معاينة الصورة"
                                  >
                                    <Eye className="w-3.5 h-3.5" />
                                  </button>
                                ) : null}

                                {(order.card_pdf_url || order.pdf_url) ? (
                                  <a
                                    href={order.card_pdf_url || order.pdf_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-1.5 rounded-lg bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#F6D365] hover:bg-[#D4AF37]/25"
                                    title="تحميل كارت الطباعة PDF"
                                  >
                                    <FileText className="w-3.5 h-3.5" />
                                  </a>
                                ) : null}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: OVERVIEW & TRAFFIC ANALYTICS */}
        {/* ========================================================================= */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* 6 Key Stat Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
              <div className="bg-[#111] border border-white/10 rounded-2xl p-4 space-y-1">
                <div className="text-[11px] font-bold text-neutral-400 flex items-center justify-between">
                  <span>إجمالي النقرات</span>
                  <MousePointerClick className="w-4 h-4 text-blue-400" />
                </div>
                <div className="text-2xl font-black text-white font-mono">{stats?.totalClicks || 0}</div>
                <div className="text-[10px] text-neutral-500">زيارة عبر الروابط</div>
              </div>

              <div className="bg-[#111] border border-white/10 rounded-2xl p-4 space-y-1">
                <div className="text-[11px] font-bold text-neutral-400 flex items-center justify-between">
                  <span>كروت مولدة بالـ AI</span>
                  <Palette className="w-4 h-4 text-purple-400" />
                </div>
                <div className="text-2xl font-black text-purple-400 font-mono">{stats?.totalGenerated || 0}</div>
                <div className="text-[10px] text-neutral-500">تصميم تجريبي مكتمل</div>
              </div>

              <div className="bg-[#111] border border-white/10 rounded-2xl p-4 space-y-1">
                <div className="text-[11px] font-bold text-neutral-400 flex items-center justify-between">
                  <span>إجمالي الطلبيات</span>
                  <ShoppingBag className="w-4 h-4 text-white" />
                </div>
                <div className="text-2xl font-black text-white font-mono">{stats?.totalOrdersCount || 0}</div>
                <div className="text-[10px] text-neutral-500">
                  منها <strong className="text-[#F6D365]">{stats?.referredOrdersCount || 0}</strong> من الشركاء
                </div>
              </div>

              <div className="bg-[#111] border border-emerald-500/30 bg-emerald-500/[0.03] rounded-2xl p-4 space-y-1">
                <div className="text-[11px] font-bold text-emerald-400 flex items-center justify-between">
                  <span>كروت تم تسليمها ✅</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-2xl font-black text-emerald-400 font-mono">{stats?.deliveredOrdersCount || 0}</div>
                <div className="text-[10px] text-emerald-400/80">مقبوضة نقداً 100%</div>
              </div>

              <div className="bg-[#111] border border-white/10 rounded-2xl p-4 space-y-1">
                <div className="text-[11px] font-bold text-neutral-400 flex items-center justify-between">
                  <span>عمولات مقبوضة</span>
                  <Coins className="w-4 h-4 text-[#F6D365]" />
                </div>
                <div className="text-2xl font-black text-[#F6D365] font-mono">{stats?.totalDeliveredCommissions || 0} د.ت</div>
                <div className="text-[10px] text-neutral-500">أرباح مؤكدة للشركاء</div>
              </div>

              <div className="bg-[#111] border border-[#D4AF37]/40 bg-[#D4AF37]/5 rounded-2xl p-4 space-y-1">
                <div className="text-[11px] font-bold text-[#F6D365] flex items-center justify-between">
                  <span>جاهز للسحب 💳</span>
                  <Coins className="w-4 h-4 text-[#F6D365]" />
                </div>
                <div className="text-2xl font-black text-white font-mono">{stats?.unpaidWithdrawable || 0} د.ت</div>
                <div className="text-[10px] text-neutral-400">مستحق ولم يُسحب بعد</div>
              </div>
            </div>

            {/* Real-time Traffic Event Log Stream */}
            <div className="bg-[#111] border border-white/10 rounded-3xl p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <h3 className="text-base font-black text-white flex items-center gap-2">
                    <Activity className="w-5 h-5 text-[#F6D365]" />
                    <span>حركة المرور اللحظية (Live Traffic & Events Stream)</span>
                  </h3>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    سجل النقرات وتوليد الكروت الصادر من روابط الشركاء في الوقت الحقيقي
                  </p>
                </div>
                <span className="text-xs text-neutral-400 font-mono">آخر {trafficEvents.length} حدث</span>
              </div>

              {trafficEvents.length === 0 ? (
                <div className="py-8 text-center text-neutral-500 text-xs">
                  لا توجد أحداث مسجلة بعد. عند فتح أي رابط إحالة أو توليد كارت ستظهر هنا مباشرة.
                </div>
              ) : (
                <div className="divide-y divide-white/5 max-h-[400px] overflow-y-auto">
                  {trafficEvents.map((evt) => (
                    <div key={evt.id} className="py-3 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                            evt.event_type === "card_generated"
                              ? "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                              : "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                          }`}
                        >
                          {evt.event_type === "card_generated" ? (
                            <Palette className="w-4 h-4" />
                          ) : (
                            <MousePointerClick className="w-4 h-4" />
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-white flex items-center gap-2">
                            <span>
                              {evt.event_type === "card_generated"
                                ? "قام زائر بتوليد كارت بالذكاء الاصطناعي"
                                : "ضغط زائر جديد على رابط الإحالة"}
                            </span>
                            <span className="px-2 py-0.5 rounded bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#F6D365] font-mono text-[10px]">
                              @{evt.affiliate_code}
                            </span>
                          </div>
                          <div className="text-[10px] text-neutral-500 mt-0.5 flex items-center gap-2 font-mono">
                            <span>IP Hash: {evt.ip_hash || "anon"}</span>
                            <span>•</span>
                            <span className="truncate max-w-[200px]">{evt.user_agent || "Browser"}</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-[11px] text-neutral-400 font-mono shrink-0">
                        {evt.created_at
                          ? new Date(evt.created_at).toLocaleTimeString("ar-TN", {
                              hour: "2-digit",
                              minute: "2-digit",
                              second: "2-digit",
                            })
                          : "—"}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: AFFILIATES DIRECTORY */}
        {/* ========================================================================= */}
        {activeTab === "affiliates" && (
          <div className="space-y-6">
            <div className="bg-[#111] border border-white/10 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative w-full sm:max-w-md">
                <Search className="w-4 h-4 text-neutral-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="ابحث باسم الشريك، كوده، هاتفه، أو وسيلة الدفع..."
                  value={affiliateSearchQuery}
                  onChange={(e) => setAffiliateSearchQuery(e.target.value)}
                  className="w-full bg-black/60 border border-white/10 rounded-xl pr-10 pl-4 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="text-xs text-neutral-400 font-mono">
                {filteredAffiliates.length} شريك مسجل
              </div>
            </div>

            <div className="bg-[#111] border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead>
                    <tr className="bg-white/5 border-b border-white/10 text-neutral-400 font-bold uppercase">
                      <th className="py-3.5 px-4">الشريك والكود</th>
                      <th className="py-3.5 px-4">الهاتف وواتساب</th>
                      <th className="py-3.5 px-4">تفاصيل الدفع (D17 / RIB)</th>
                      <th className="py-3.5 px-4">النقرات والتوليد</th>
                      <th className="py-3.5 px-4">الطلبيات والتسليم</th>
                      <th className="py-3.5 px-4">المرابيح والرصيد المتاح</th>
                      <th className="py-3.5 px-4 text-center">العمولة والحالة</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredAffiliates.map((aff) => (
                      <tr key={aff.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="py-4 px-4">
                          <div className="font-bold text-white flex items-center gap-2">
                            <span>{aff.name}</span>
                            <span className="px-2 py-0.5 rounded bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#F6D365] font-mono text-[10px] font-bold">
                              @{aff.code || aff.ref_code}
                            </span>
                          </div>
                          <div className="text-[10px] text-neutral-500 mt-0.5">
                            انضم: {aff.created_at ? new Date(aff.created_at).toLocaleDateString("ar-TN") : "—"}
                          </div>
                        </td>

                        <td className="py-4 px-4">
                          <div className="font-mono text-white font-bold">{aff.phone}</div>
                          <a
                            href={`https://wa.me/216${String(aff.phone).replace(/\s+/g, "")}?text=${encodeURIComponent(
                              `مرحباً ${aff.name}، معك إدارة Flawless TN 🇹🇳 بخصوص برنامج الشركاء.`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] text-emerald-400 hover:underline mt-0.5"
                          >
                            <MessageCircle className="w-3 h-3" />
                            <span>مراسلة واتساب</span>
                          </a>
                        </td>

                        <td className="py-4 px-4">
                          <div className="font-bold text-white">{aff.payment_method || "D17"}</div>
                          <div className="text-[10px] text-neutral-400 font-mono">{aff.payment_details}</div>
                        </td>

                        <td className="py-4 px-4 font-mono">
                          <div className="text-blue-400 font-bold">{aff.total_clicks || 0} نقرة</div>
                          <div className="text-purple-400 text-[10px]">{aff.total_generated || 0} كارت AI</div>
                        </td>

                        <td className="py-4 px-4 font-mono">
                          <div className="font-bold text-white">{aff.ordersCount || aff.total_orders || 0} طلبية</div>
                          <div className="text-[10px] text-emerald-400 font-bold">
                            {aff.deliveredCount || 0} مسلّمة بنجاح
                          </div>
                        </td>

                        <td className="py-4 px-4 font-mono">
                          <div className="font-bold text-[#F6D365]">
                            المتاح: {aff.availableBalance || 0} د.ت
                          </div>
                          <div className="text-[10px] text-neutral-500">
                            المسحوب: {aff.totalPaid || aff.total_paid || 0} د.ت
                          </div>
                        </td>

                        <td className="py-4 px-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => {
                                setEditingAffiliate(aff);
                                setNewCommissionRate(String(aff.commission_per_order || 10));
                              }}
                              className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 hover:border-[#D4AF37] text-neutral-300 text-[11px] font-mono cursor-pointer"
                              title="تعديل نسبة العمولة"
                            >
                              {aff.commission_per_order || 10} د.ت ✏️
                            </button>

                            <button
                              onClick={() => handleToggleAffiliateStatus(aff.id, aff.status)}
                              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer transition-all ${
                                aff.status === "active"
                                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/30"
                                  : "bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-emerald-500/20 hover:text-emerald-400"
                              }`}
                            >
                              {aff.status === "active" ? "نشط ✅" : "مجمّد 🚫"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: PAYOUT APPROVALS */}
        {/* ========================================================================= */}
        {activeTab === "payouts" && (
          <div className="bg-[#111] border border-white/10 rounded-3xl overflow-hidden shadow-2xl p-6 space-y-6">
            <div className="border-b border-white/10 pb-4 flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <Coins className="w-5 h-5 text-[#F6D365]" />
                  <span>طلبات سحب المرابيح والمستحقات</span>
                </h3>
                <p className="text-xs text-neutral-400 mt-0.5">
                  لا تظهر طلبات السحب إلا للشركاء الذين حققوا شرط الـ 30 د.ت على الأقل من كروت مسلّمة.
                </p>
              </div>
            </div>

            {payouts.length === 0 ? (
              <div className="py-12 text-center text-neutral-500 text-xs">
                لا توجد طلبات سحب في الوقت الحالي.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead>
                    <tr className="bg-white/5 border-b border-white/10 text-neutral-400 font-bold uppercase">
                      <th className="py-3 px-4">تاريخ الطلب</th>
                      <th className="py-3 px-4">الشريك</th>
                      <th className="py-3 px-4">المبلغ المطلوب</th>
                      <th className="py-3 px-4">وسيلة التحويل والتفاصيل</th>
                      <th className="py-3 px-4">مرجع التحويل</th>
                      <th className="py-3 px-4 text-center">الإجراء</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {payouts.map((payout) => (
                      <tr key={payout.id} className="hover:bg-white/[0.02]">
                        <td className="py-4 px-4 font-mono text-neutral-400">
                          {payout.created_at
                            ? new Date(payout.created_at).toLocaleDateString("ar-TN", {
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : "—"}
                        </td>

                        <td className="py-4 px-4">
                          <div className="font-bold text-white">{payout.affiliates?.name || "شريك"}</div>
                          <div className="text-[10px] text-[#F6D365] font-mono">
                            @{payout.affiliates?.code}
                          </div>
                        </td>

                        <td className="py-4 px-4 font-mono font-black text-[#F6D365] text-sm">
                          {payout.amount} د.ت
                        </td>

                        <td className="py-4 px-4">
                          <div className="font-bold text-white">{payout.payment_method}</div>
                          <div className="text-[11px] text-neutral-400 font-mono">
                            {payout.payment_details}
                          </div>
                        </td>

                        <td className="py-4 px-4 font-mono text-neutral-400">
                          {payout.transaction_ref || "—"}
                        </td>

                        <td className="py-4 px-4 text-center">
                          {payout.status === "completed" ? (
                            <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[11px] font-bold">
                              تم التحويل بنجاح ✅
                            </span>
                          ) : (
                            <button
                              onClick={() => setSelectedPayout(payout)}
                              className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#F6D365] text-black font-black text-xs hover:scale-105 transition-all shadow-lg cursor-pointer"
                            >
                              تأكيد التحويل عبر D17 💸
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </main>

      {/* ========================================================================= */}
      {/* PAYOUT APPROVAL MODAL */}
      {/* ========================================================================= */}
      {selectedPayout && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4" dir="rtl">
          <div className="bg-[#141414] border border-[#D4AF37]/40 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h4 className="text-base font-black text-white">تأكيد تحويل المستحقات</h4>
              <button onClick={() => setSelectedPayout(null)} className="text-neutral-400 hover:text-white text-xs">
                إغلاق ✕
              </button>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-neutral-400">الشريك المستفيد:</span>
                <span className="font-bold text-white">{selectedPayout.affiliates?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">المبلغ:</span>
                <span className="font-black text-[#F6D365] text-sm">{selectedPayout.amount} د.ت</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">طريقة الدفع:</span>
                <span className="font-bold text-white">{selectedPayout.payment_method}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">رقم الحساب / الهاتف:</span>
                <span className="font-mono font-bold text-[#F6D365]">{selectedPayout.payment_details}</span>
              </div>
            </div>

            <form onSubmit={handleApprovePayout} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-neutral-300 mb-1">
                  رقم مرجع التحويل (D17 Reference / Reçu Code)
                </label>
                <input
                  type="text"
                  required
                  placeholder="مثال: D17-TX-98421"
                  value={transactionRef}
                  onChange={(e) => setTransactionRef(e.target.value)}
                  className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedPayout(null)}
                  className="w-1/2 py-2.5 rounded-xl bg-white/10 text-white font-bold text-xs"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={isProcessingPayout}
                  className="w-1/2 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#F6D365] text-black font-black text-xs hover:scale-105 transition-all cursor-pointer"
                >
                  {isProcessingPayout ? "جاري التأكيد..." : "تأكيد التحويل ✅"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* COMMISSION RATE EDIT MODAL */}
      {/* ========================================================================= */}
      {editingAffiliate && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4" dir="rtl">
          <div className="bg-[#141414] border border-[#D4AF37]/40 rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h4 className="text-base font-black text-white">تعديل عمولة الشريك</h4>
              <button onClick={() => setEditingAffiliate(null)} className="text-neutral-400 hover:text-white text-xs">
                إغلاق ✕
              </button>
            </div>

            <div className="text-xs text-neutral-300">
              تعديل عمولة الشريك: <strong className="text-white">{editingAffiliate.name}</strong> (@{editingAffiliate.code})
            </div>

            <form onSubmit={handleSaveCommissionRate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-neutral-300 mb-1">
                  العمولة على كل كارطة (د.ت)
                </label>
                <input
                  type="number"
                  step="1"
                  min="5"
                  max="30"
                  required
                  value={newCommissionRate}
                  onChange={(e) => setNewCommissionRate(e.target.value)}
                  className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setEditingAffiliate(null)}
                  className="w-1/2 py-2.5 rounded-xl bg-white/10 text-white font-bold text-xs"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#F6D365] text-black font-black text-xs hover:scale-105 transition-all cursor-pointer"
                >
                  حفظ العمولة 💾
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* IMAGE PREVIEW MODAL */}
      {/* ========================================================================= */}
      {previewImageUrl && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setPreviewImageUrl(null)}
        >
          <div className="relative max-w-lg w-full bg-[#111] border border-[#D4AF37]/40 rounded-3xl p-4 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <span className="text-xs font-bold text-white">معاينة الكارت</span>
              <button onClick={() => setPreviewImageUrl(null)} className="text-neutral-400 hover:text-white text-xs font-bold">
                إغلاق ✕
              </button>
            </div>
            <div className="relative aspect-[2/3] w-full rounded-2xl overflow-hidden border border-white/10">
              <Image src={previewImageUrl} alt="Card preview" fill className="object-contain" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
