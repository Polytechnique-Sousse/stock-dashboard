"use client";

import { useEffect, useState } from "react";
import PrivateRoute from "../components/PrivateRoute";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import {
  Package,
  AlertTriangle,
  ShoppingCart,
  TrendingUp,
  CheckCircle,
} from "lucide-react";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

// ── Types ─────────────────────────────────────────────────────────────────────
interface StockItem {
  name: string;
  category: string;
  stock: number;
  threshold: number;
}

interface TopProduct {
  name: string;
  sales: number;
  progress: number;
}

interface RecentOrder {
  id: string;
  client: string;
  amount: string;
  status: string;
}

interface DashboardData {
  totalProducts:  number;
  totalOrders:    number;
  lowStockCount:  number;
  inStockCount:   number;
  topProducts:    TopProduct[];
  recentOrders:   RecentOrder[];
  chartLabels:    string[];
  chartValues:    number[];
  stockItems:     StockItem[];
}

// ── Status styles ─────────────────────────────────────────────────────────────
const statusStyle: Record<string, string> = {
  Delivered:  "bg-green-100 text-green-700",
  Processing: "bg-blue-100 text-blue-700",
  Pending:    "bg-yellow-100 text-yellow-700",
  Cancelled:  "bg-red-100 text-red-700",
};

// ── Skeleton loader ───────────────────────────────────────────────────────────
function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse bg-gray-200 rounded-xl ${className}`} />;
}

export default function DashboardPage() {
  const [data,    setData]    = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/stats");
        if (!res.ok) throw new Error("Failed to fetch stats");
        const json = await res.json();
        setData(json);
      } catch (err) {
        setError("Impossible de charger les données.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();

    // Rafraîchissement automatique toutes les 30s
    const interval = setInterval(fetchStats, 30_000);
    return () => clearInterval(interval);
  }, []);

  // ── Chart config ─────────────────────────────────────────────────────────
  const chartData = {
    labels: data?.chartLabels ?? ["Jan","Feb","Mar","Apr","May","Jun"],
    datasets: [
      {
        label: "Sales",
        data:  data?.chartValues ?? [0, 0, 0, 0, 0, 0],
        borderColor:     "rgb(59, 130, 246)",
        backgroundColor: "rgba(59, 130, 246, 0.08)",
        tension: 0.4,
        fill:    true,
        pointBackgroundColor: "rgb(59, 130, 246)",
        pointRadius: 4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      y: { grid: { color: "rgba(0,0,0,0.04)" }, ticks: { color: "#9ca3af", font: { size: 11 } } },
      x: { grid: { display: false },            ticks: { color: "#9ca3af", font: { size: 11 } } },
    },
  };

  // ── Stats cards ───────────────────────────────────────────────────────────
  const statCards = [
    {
      title: "Products",
      value: data?.totalProducts ?? 0,
      icon:  Package,
      color: "bg-blue-500",
      trend: "+12%",
      up:    true,
    },
    {
      title: "Orders",
      value: data?.totalOrders ?? 0,
      icon:  ShoppingCart,
      color: "bg-purple-500",
      trend: "+8%",
      up:    true,
    },
  ];

  const stockStats = [
    {
      title: "Total Items",
      value: data?.stockItems?.length ?? 0,
      icon:  Package,
      color: "bg-blue-500",
    },
    {
      title: "In Stock",
      value: data?.inStockCount ?? 0,
      icon:  CheckCircle,
      color: "bg-green-500",
    },
    {
      title: "Low Stock",
      value: data?.lowStockCount ?? 0,
      icon:  AlertTriangle,
      color: "bg-red-500",
    },
  ];

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <PrivateRoute isPublic={true}>
      <div className="min-h-screen bg-gray-50 p-6">

        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
            <p className="text-gray-400 text-sm mt-1">Overview of your business activity</p>
          </div>
          {/* Indicateur de chargement */}
          {loading && (
            <span className="text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-full animate-pulse">
              Refreshing…
            </span>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
            {error}
          </div>
        )}

        {/* ── Stat Cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {loading
            ? Array(2).fill(0).map((_, i) => <Skeleton key={i} className="h-24" />)
            : statCards.map((stat) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={stat.title}
                    className="bg-white rounded-2xl shadow-sm p-5 flex items-center gap-4 border border-gray-100 hover:shadow-md transition-shadow"
                  >
                    <div className={`${stat.color} p-3 rounded-xl`}>
                      <Icon size={22} className="text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-gray-400 uppercase tracking-wide">{stat.title}</p>
                      <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                    </div>
                    <div className="flex items-center gap-1 text-xs font-semibold text-green-500">
                      <TrendingUp size={14} />
                      {stat.trend}
                    </div>
                  </div>
                );
              })}
        </div>

        {/* ── Chart + Top Products ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">

          {/* Chart */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-gray-900">Sales over 6 months</h2>
              <span className="text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
                {new Date(new Date().setMonth(new Date().getMonth() - 5)).toLocaleString("en-US", { month: "short" })}
                {" — "}
                {new Date().toLocaleString("en-US", { month: "short", year: "numeric" })}
              </span>
            </div>
            {loading
              ? <Skeleton className="h-48" />
              : (
                <div style={{ height: "200px" }}>
                  <Line data={chartData} options={chartOptions} />
                </div>
              )
            }
          </div>

          {/* Top Products */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <h2 className="text-base font-semibold text-gray-800 mb-4">Top Products</h2>
            {loading
              ? <div className="flex flex-col gap-3">{Array(5).fill(0).map((_, i) => <Skeleton key={i} className="h-8" />)}</div>
              : data?.topProducts?.length === 0
                ? <p className="text-sm text-gray-400 text-center py-8">No sales data yet</p>
                : (
                  <div className="flex flex-col gap-4">
                    {(data?.topProducts ?? []).map((p, i) => (
                      <div key={p.name}>
                        <div className="flex justify-between items-center mb-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-gray-400">#{i + 1}</span>
                            <span className="text-sm font-medium text-gray-700">{p.name}</span>
                          </div>
                          <span className="text-xs text-gray-400">{p.sales} sales</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-1.5">
                          <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${p.progress}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                )
            }
          </div>
        </div>

        {/* ── Recent Orders + Stock ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

          {/* Recent Orders */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <h2 className="text-base font-semibold text-gray-900 mb-4">Recent Orders</h2>
            {loading
              ? <Skeleton className="h-48" />
              : data?.recentOrders?.length === 0
                ? <p className="text-sm text-gray-400 text-center py-8">No orders yet</p>
                : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-left text-xs text-gray-400 uppercase border-b border-gray-100">
                          <th className="pb-3 pr-3">ID</th>
                          <th className="pb-3 pr-3">Client</th>
                          <th className="pb-3 pr-3">Amount</th>
                          <th className="pb-3">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(data?.recentOrders ?? []).map((order) => (
                          <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                            <td className="py-3 pr-3 font-mono text-gray-400 text-xs">{order.id}</td>
                            <td className="py-3 pr-3 font-medium text-gray-700">{order.client}</td>
                            <td className="py-3 pr-3 font-semibold text-gray-800">{order.amount}</td>
                            <td className="py-3">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyle[order.status] ?? "bg-gray-100 text-gray-600"}`}>
                                {order.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )
            }
          </div>

          {/* Stock */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <h2 className="text-base font-semibold text-gray-900 mb-4">Stock</h2>

            {loading
              ? <Skeleton className="h-48" />
              : (
                <>
                  {/* Mini stat cards */}
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    {stockStats.map((s) => {
                      const Icon = s.icon;
                      return (
                        <div key={s.title} className={`${s.color} rounded-xl p-3 text-white text-center`}>
                          <Icon size={16} className="mx-auto mb-1" />
                          <p className="text-lg font-bold">{s.value}</p>
                          <p className="text-xs opacity-80">{s.title}</p>
                        </div>
                      );
                    })}
                  </div>

                  {/* Liste des produits */}
                  <div className="flex flex-col gap-2">
                    {(data?.stockItems ?? []).map((item, index) => {
                      const isLow    = item.stock <= item.threshold;
                      const progress = Math.min((item.stock / 50) * 100, 100);
                      return (
                        <div key={index} className="flex items-center gap-3 py-2 border-b border-gray-50">
                          <span className="text-sm font-medium text-gray-700 w-36 truncate">{item.name}</span>
                          <div className="flex-1 bg-gray-100 rounded-full h-1.5">
                            <div
                              className={`h-1.5 rounded-full ${isLow ? "bg-red-400" : "bg-green-400"}`}
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${isLow ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"}`}>
                            {item.stock}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </>
              )
            }
          </div>

        </div>
      </div>
    </PrivateRoute>
  );
}