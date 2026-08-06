"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Package,
  Users,
  DollarSign,
  TrendingUp,
  CheckCircle,
  XCircle,
  Loader2,
  RefreshCw,
  LogOut,
  Truck,
  Clock,
  Ban,
  Eye,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

interface Order {
  id: string;
  customer_name: string;
  customer_phone: string;
  package: string;
  price: number;
  affiliate_code: string | null;
  status: string;
  commission_status: string;
  commission_amount: number;
  created_at: string;
  delivered_at: string | null;
  affiliates?: { name: string; ref_code: string } | null;
}

interface Affiliate {
  id: string;
  name: string;
  phone: string;
  instagram: string;
  tiktok: string;
  ref_code: string;
  tier: string;
  status: string;
  total_earned: number;
  total_paid: number;
  click_count: number;
  order_count: number;
  payment_method: string;
  created_at: string;
}

interface Payout {
  id: string;
  amount: number;
  method: string;
  status: string;
  reference: string | null;
  requested_at: string;
  completed_at: string | null;
  affiliates?: { name: string; phone: string; flouci_id: string; card_number: string } | null;
}

// ─── Login Screen ────────────────────────────────────────────────────────────

function AdminLogin({ onLogin }: { onLogin: (pw: string) => void }) {
  const [password, setPassword] = useState("");

  return (
    <div className="min-h-screen bg-[#060606] flex items-center justify-center px-4">
      <div className="w-full max-w-sm text-center">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#D4AF37] to-[#F6D365] flex items-center justify-center mx-auto mb-4">
          <Eye className="h-8 w-8 text-black" />
        </div>
        <h1 className="text-2xl font-black text-white mb-6">Admin Panel</h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onLogin(password);
          }}
        >
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm text-center focus:outline-none focus:border-[#D4AF37]/50 mb-4"
            placeholder="Admin Password"
          />
          <button className="w-full py-3 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#F6D365] text-black font-black text-sm">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

// ─── Status Badge ────────────────────────────────────────────────────────────

function Badge({ status, size = "sm" }: { status: string; size?: "sm" | "xs" }) {
  const colors: Record<string, string> = {
    pending: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    processing: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    delivered: "bg-green-500/10 text-green-400 border-green-500/20",
    completed: "bg-green-500/10 text-green-400 border-green-500/20",
    confirmed: "bg-green-500/10 text-green-400 border-green-500/20",
    cancelled: "bg-red-500/10 text-red-400 border-red-500/20",
    rejected: "bg-red-500/10 text-red-400 border-red-500/20",
    active: "bg-green-500/10 text-green-400 border-green-500/20",
    suspended: "bg-red-500/10 text-red-400 border-red-500/20",
    paid: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    none: "bg-gray-500/10 text-gray-400 border-gray-500/20",
  };

  return (
    <span
      className={`inline-flex px-2 py-0.5 rounded-md font-bold uppercase border ${
        colors[status] || colors.none
      } ${size === "xs" ? "text-[9px]" : "text-[10px]"}`}
    >
      {status}
    </span>
  );
}

// ─── Admin Dashboard ─────────────────────────────────────────────────────────

function AdminDashboard({ password, onLogout }: { password: string; onLogout: () => void }) {
  const [tab, setTab] = useState<"orders" | "affiliates" | "payouts">("orders");
  const [orders, setOrders] = useState<Order[]>([]);
  const [affiliates, setAffiliates] = useState<Affiliate[]>([]);
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [loading, setLoading] = useState(true);
  const [orderFilter, setOrderFilter] = useState("all");
  const [payoutFilter, setPayoutFilter] = useState("pending");
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [refInput, setRefInput] = useState<Record<string, string>>({});

  const headers = { Authorization: `Bearer ${password}` };

  const fetchOrders = useCallback(async () => {
    const res = await fetch(`/api/admin/orders?status=${orderFilter}`, { headers });
    if (res.ok) {
      const data = await res.json();
      setOrders(data.orders);
    }
  }, [orderFilter, password]);

  const fetchAffiliates = useCallback(async () => {
    const res = await fetch("/api/admin/affiliates", { headers });
    if (res.ok) {
      const data = await res.json();
      setAffiliates(data.affiliates);
    }
  }, [password]);

  const fetchPayouts = useCallback(async () => {
    const res = await fetch(`/api/admin/payouts?status=${payoutFilter}`, { headers });
    if (res.ok) {
      const data = await res.json();
      setPayouts(data.payouts);
    }
  }, [payoutFilter, password]);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    await Promise.all([fetchOrders(), fetchAffiliates(), fetchPayouts()]);
    setLoading(false);
  }, [fetchOrders, fetchAffiliates, fetchPayouts]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);
  useEffect(() => { fetchPayouts(); }, [fetchPayouts]);

  // ── Actions ──

  const updateOrderStatus = async (id: string, status: string) => {
    setActionLoading(id);
    await fetch("/api/admin/orders", {
      method: "PATCH",
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    await fetchOrders();
    setActionLoading(null);
  };

  const updateAffiliateStatus = async (id: string, status: string) => {
    setActionLoading(id);
    await fetch("/api/admin/affiliates", {
      method: "PATCH",
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    await fetchAffiliates();
    setActionLoading(null);
  };

  const processPayoutAction = async (id: string, status: string) => {
    setActionLoading(id);
    await fetch("/api/admin/payouts", {
      method: "PATCH",
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify({ id, status, reference: refInput[id] || "" }),
    });
    await fetchPayouts();
    setActionLoading(null);
  };

  // ── Stats ──

  const totalRevenue = orders.reduce((s, o) => s + Number(o.price), 0);
  const affiliateOrders = orders.filter((o) => o.affiliate_code).length;
  const pendingPayoutsCount = payouts.filter((p) => p.status === "pending").length;

  const tabs = [
    { id: "orders" as const, label: "📦 Orders", count: orders.length },
    { id: "affiliates" as const, label: "👥 Affiliates", count: affiliates.length },
    { id: "payouts" as const, label: "💸 Payouts", count: pendingPayoutsCount },
  ];

  return (
    <div className="min-h-screen bg-[#060606] text-white">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#060606]/90 backdrop-blur-xl border-b border-white/5">
        <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#D4AF37] to-[#F6D365] flex items-center justify-center text-black font-black text-xs">
              A
            </div>
            <span className="text-sm font-bold">Flawless Admin</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchAll}
              className="p-2 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white transition-colors"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            </button>
            <button
              onClick={onLogout}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-gray-400 text-xs font-bold hover:bg-white/10"
            >
              <LogOut className="h-3.5 w-3.5" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-6">
        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <div className="rounded-xl bg-white/[0.03] border border-white/10 p-4">
            <Package className="h-4 w-4 text-gray-400 mb-2" />
            <p className="text-xl font-black">{orders.length}</p>
            <p className="text-[10px] text-gray-500">Total Orders</p>
          </div>
          <div className="rounded-xl bg-white/[0.03] border border-white/10 p-4">
            <DollarSign className="h-4 w-4 text-[#F6D365] mb-2" />
            <p className="text-xl font-black text-[#F6D365]">{totalRevenue} DT</p>
            <p className="text-[10px] text-gray-500">Total Revenue</p>
          </div>
          <div className="rounded-xl bg-white/[0.03] border border-white/10 p-4">
            <Users className="h-4 w-4 text-blue-400 mb-2" />
            <p className="text-xl font-black">{affiliates.length}</p>
            <p className="text-[10px] text-gray-500">Affiliates</p>
          </div>
          <div className="rounded-xl bg-white/[0.03] border border-white/10 p-4">
            <TrendingUp className="h-4 w-4 text-green-400 mb-2" />
            <p className="text-xl font-black">{affiliateOrders}</p>
            <p className="text-[10px] text-gray-500">Affiliate Orders</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                tab === t.id
                  ? "bg-[#D4AF37]/20 text-[#F6D365] border border-[#D4AF37]/30"
                  : "bg-white/5 text-gray-400 border border-white/10"
              }`}
            >
              {t.label}
              {t.count > 0 && (
                <span className="px-1.5 py-0.5 rounded-md bg-white/10 text-[9px]">{t.count}</span>
              )}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 text-[#D4AF37] animate-spin" />
          </div>
        ) : (
          <>
            {/* ── Orders Tab ──────────────────────────────────────── */}
            {tab === "orders" && (
              <>
                <div className="flex gap-2 mb-4 overflow-x-auto">
                  {["all", "pending", "processing", "delivered", "cancelled"].map((s) => (
                    <button
                      key={s}
                      onClick={() => setOrderFilter(s)}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all ${
                        orderFilter === s
                          ? "bg-white/10 text-white"
                          : "text-gray-500 hover:text-gray-300"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>

                <div className="rounded-xl bg-white/[0.02] border border-white/10 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b border-white/10 bg-white/[0.02]">
                          <th className="text-left py-2.5 px-3 text-[9px] font-bold text-gray-500 uppercase">Customer</th>
                          <th className="text-left py-2.5 px-3 text-[9px] font-bold text-gray-500 uppercase">Phone</th>
                          <th className="text-left py-2.5 px-3 text-[9px] font-bold text-gray-500 uppercase">Pack</th>
                          <th className="text-left py-2.5 px-3 text-[9px] font-bold text-gray-500 uppercase">Price</th>
                          <th className="text-left py-2.5 px-3 text-[9px] font-bold text-gray-500 uppercase">Affiliate</th>
                          <th className="text-left py-2.5 px-3 text-[9px] font-bold text-gray-500 uppercase">Status</th>
                          <th className="text-left py-2.5 px-3 text-[9px] font-bold text-gray-500 uppercase">Date</th>
                          <th className="text-left py-2.5 px-3 text-[9px] font-bold text-gray-500 uppercase">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map((order) => (
                          <tr key={order.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                            <td className="py-2.5 px-3 font-medium text-white">{order.customer_name}</td>
                            <td className="py-2.5 px-3 text-gray-400 font-mono">{order.customer_phone}</td>
                            <td className="py-2.5 px-3 text-gray-400 uppercase">{order.package}</td>
                            <td className="py-2.5 px-3 text-white font-bold">{order.price} DT</td>
                            <td className="py-2.5 px-3">
                              {order.affiliates ? (
                                <span className="text-[#F6D365] font-bold">{order.affiliates.ref_code}</span>
                              ) : (
                                <span className="text-gray-600">—</span>
                              )}
                            </td>
                            <td className="py-2.5 px-3"><Badge status={order.status} /></td>
                            <td className="py-2.5 px-3 text-gray-500">{new Date(order.created_at).toLocaleDateString()}</td>
                            <td className="py-2.5 px-3">
                              <div className="flex gap-1">
                                {order.status === "pending" && (
                                  <button
                                    onClick={() => updateOrderStatus(order.id, "processing")}
                                    disabled={actionLoading === order.id}
                                    className="p-1.5 rounded-md bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors"
                                    title="Mark Processing"
                                  >
                                    {actionLoading === order.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <Clock className="h-3 w-3" />}
                                  </button>
                                )}
                                {(order.status === "pending" || order.status === "processing") && (
                                  <>
                                    <button
                                      onClick={() => updateOrderStatus(order.id, "delivered")}
                                      disabled={actionLoading === order.id}
                                      className="p-1.5 rounded-md bg-green-500/10 text-green-400 hover:bg-green-500/20 transition-colors"
                                      title="Mark Delivered"
                                    >
                                      <Truck className="h-3 w-3" />
                                    </button>
                                    <button
                                      onClick={() => updateOrderStatus(order.id, "cancelled")}
                                      disabled={actionLoading === order.id}
                                      className="p-1.5 rounded-md bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                                      title="Cancel"
                                    >
                                      <Ban className="h-3 w-3" />
                                    </button>
                                  </>
                                )}
                                {order.status === "delivered" && (
                                  <CheckCircle className="h-4 w-4 text-green-400" />
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {orders.length === 0 && (
                      <p className="text-center text-gray-500 text-xs py-8">No orders found</p>
                    )}
                  </div>
                </div>
              </>
            )}

            {/* ── Affiliates Tab ──────────────────────────────────── */}
            {tab === "affiliates" && (
              <div className="rounded-xl bg-white/[0.02] border border-white/10 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-white/10 bg-white/[0.02]">
                        <th className="text-left py-2.5 px-3 text-[9px] font-bold text-gray-500 uppercase">Name</th>
                        <th className="text-left py-2.5 px-3 text-[9px] font-bold text-gray-500 uppercase">Phone</th>
                        <th className="text-left py-2.5 px-3 text-[9px] font-bold text-gray-500 uppercase">Code</th>
                        <th className="text-left py-2.5 px-3 text-[9px] font-bold text-gray-500 uppercase">Social</th>
                        <th className="text-left py-2.5 px-3 text-[9px] font-bold text-gray-500 uppercase">Clicks</th>
                        <th className="text-left py-2.5 px-3 text-[9px] font-bold text-gray-500 uppercase">Orders</th>
                        <th className="text-left py-2.5 px-3 text-[9px] font-bold text-gray-500 uppercase">Earned</th>
                        <th className="text-left py-2.5 px-3 text-[9px] font-bold text-gray-500 uppercase">Tier</th>
                        <th className="text-left py-2.5 px-3 text-[9px] font-bold text-gray-500 uppercase">Status</th>
                        <th className="text-left py-2.5 px-3 text-[9px] font-bold text-gray-500 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {affiliates.map((aff) => (
                        <tr key={aff.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                          <td className="py-2.5 px-3 font-medium text-white">{aff.name}</td>
                          <td className="py-2.5 px-3 text-gray-400 font-mono">{aff.phone}</td>
                          <td className="py-2.5 px-3 text-[#F6D365] font-bold">{aff.ref_code}</td>
                          <td className="py-2.5 px-3 text-gray-400">
                            {aff.instagram && <span className="mr-1">📸 {aff.instagram}</span>}
                            {aff.tiktok && <span>🎵 {aff.tiktok}</span>}
                          </td>
                          <td className="py-2.5 px-3 text-white font-bold">{aff.click_count}</td>
                          <td className="py-2.5 px-3 text-white font-bold">{aff.order_count}</td>
                          <td className="py-2.5 px-3 text-[#F6D365] font-bold">{aff.total_earned} DT</td>
                          <td className="py-2.5 px-3"><Badge status={aff.tier} size="xs" /></td>
                          <td className="py-2.5 px-3"><Badge status={aff.status} size="xs" /></td>
                          <td className="py-2.5 px-3">
                            {aff.status === "active" ? (
                              <button
                                onClick={() => updateAffiliateStatus(aff.id, "suspended")}
                                disabled={actionLoading === aff.id}
                                className="p-1.5 rounded-md bg-red-500/10 text-red-400 hover:bg-red-500/20 text-[9px] font-bold"
                              >
                                Suspend
                              </button>
                            ) : (
                              <button
                                onClick={() => updateAffiliateStatus(aff.id, "active")}
                                disabled={actionLoading === aff.id}
                                className="p-1.5 rounded-md bg-green-500/10 text-green-400 hover:bg-green-500/20 text-[9px] font-bold"
                              >
                                Activate
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {affiliates.length === 0 && (
                    <p className="text-center text-gray-500 text-xs py-8">No affiliates registered</p>
                  )}
                </div>
              </div>
            )}

            {/* ── Payouts Tab ─────────────────────────────────────── */}
            {tab === "payouts" && (
              <>
                <div className="flex gap-2 mb-4">
                  {["pending", "completed", "rejected", "all"].map((s) => (
                    <button
                      key={s}
                      onClick={() => setPayoutFilter(s)}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all ${
                        payoutFilter === s
                          ? "bg-white/10 text-white"
                          : "text-gray-500 hover:text-gray-300"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>

                <div className="rounded-xl bg-white/[0.02] border border-white/10 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b border-white/10 bg-white/[0.02]">
                          <th className="text-left py-2.5 px-3 text-[9px] font-bold text-gray-500 uppercase">Affiliate</th>
                          <th className="text-left py-2.5 px-3 text-[9px] font-bold text-gray-500 uppercase">Phone</th>
                          <th className="text-left py-2.5 px-3 text-[9px] font-bold text-gray-500 uppercase">Amount</th>
                          <th className="text-left py-2.5 px-3 text-[9px] font-bold text-gray-500 uppercase">Method</th>
                          <th className="text-left py-2.5 px-3 text-[9px] font-bold text-gray-500 uppercase">Account</th>
                          <th className="text-left py-2.5 px-3 text-[9px] font-bold text-gray-500 uppercase">Status</th>
                          <th className="text-left py-2.5 px-3 text-[9px] font-bold text-gray-500 uppercase">Date</th>
                          <th className="text-left py-2.5 px-3 text-[9px] font-bold text-gray-500 uppercase">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {payouts.map((payout) => (
                          <tr key={payout.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                            <td className="py-2.5 px-3 font-medium text-white">{payout.affiliates?.name || "—"}</td>
                            <td className="py-2.5 px-3 text-gray-400 font-mono">{payout.affiliates?.phone || "—"}</td>
                            <td className="py-2.5 px-3 text-[#F6D365] font-black">{payout.amount} DT</td>
                            <td className="py-2.5 px-3 text-gray-400">
                              {payout.method === "flouci" ? "💳 Flouci" : "🏦 Bank"}
                            </td>
                            <td className="py-2.5 px-3 text-gray-400 font-mono text-[10px]">
                              {payout.method === "flouci"
                                ? payout.affiliates?.flouci_id || "—"
                                : payout.affiliates?.card_number || "—"}
                            </td>
                            <td className="py-2.5 px-3"><Badge status={payout.status} /></td>
                            <td className="py-2.5 px-3 text-gray-500">{new Date(payout.requested_at).toLocaleDateString()}</td>
                            <td className="py-2.5 px-3">
                              {payout.status === "pending" && (
                                <div className="flex items-center gap-1">
                                  <input
                                    type="text"
                                    value={refInput[payout.id] || ""}
                                    onChange={(e) => setRefInput({ ...refInput, [payout.id]: e.target.value })}
                                    placeholder="Ref#"
                                    className="w-20 px-2 py-1 rounded-md bg-white/5 border border-white/10 text-white text-[10px] focus:outline-none"
                                  />
                                  <button
                                    onClick={() => processPayoutAction(payout.id, "completed")}
                                    disabled={actionLoading === payout.id}
                                    className="p-1.5 rounded-md bg-green-500/10 text-green-400 hover:bg-green-500/20"
                                    title="Approve"
                                  >
                                    <CheckCircle className="h-3 w-3" />
                                  </button>
                                  <button
                                    onClick={() => processPayoutAction(payout.id, "rejected")}
                                    disabled={actionLoading === payout.id}
                                    className="p-1.5 rounded-md bg-red-500/10 text-red-400 hover:bg-red-500/20"
                                    title="Reject"
                                  >
                                    <XCircle className="h-3 w-3" />
                                  </button>
                                </div>
                              )}
                              {payout.status === "completed" && (
                                <span className="text-[10px] text-gray-500 font-mono">{payout.reference || "—"}</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {payouts.length === 0 && (
                      <p className="text-center text-gray-500 text-xs py-8">No payouts found</p>
                    )}
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function AdminPage() {
  const [password, setPassword] = useState<string | null>(null);

  useEffect(() => {
    const saved = sessionStorage.getItem("flawless_admin_pw");
    if (saved) setPassword(saved);
  }, []);

  const handleLogin = (pw: string) => {
    sessionStorage.setItem("flawless_admin_pw", pw);
    setPassword(pw);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("flawless_admin_pw");
    setPassword(null);
  };

  if (!password) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  return <AdminDashboard password={password} onLogout={handleLogout} />;
}
