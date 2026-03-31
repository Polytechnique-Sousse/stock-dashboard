"use client";

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
  Users,
  ShoppingCart,
  TrendingUp,
  TrendingDown,
  CheckCircle,
} from "lucide-react";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const stats = [
  { title: "Products", value: 120, icon: Package,      color: "bg-blue-500",   trend: "+12%", up: true  },
  { title: "Orders",   value: 32,  icon: ShoppingCart, color: "bg-purple-500", trend: "+8%",  up: true  },
];

const recentOrders = [
  { id: "#0012", client: "Ahmed Saleh",   product: "Whole Chicken",   amount: "18.000 TND", status: "Delivered"  },
  { id: "#0011", client: "Sara Mansour",  product: "Ground Beef",     amount: "56.000 TND", status: "Processing" },
  { id: "#0010", client: "Mehdi Ayari",   product: "Lamb Chops",      amount: "90.000 TND", status: "Pending"    },
  { id: "#0009", client: "Nour Trabelsi", product: "Turkey Breast",   amount: "44.000 TND", status: "Delivered"  },
  { id: "#0008", client: "Yassine Khlil", product: "Merguez Sausage", amount: "28.000 TND", status: "Cancelled"  },
];

const topProducts = [
  { name: "Whole Chicken",   sales: 48, progress: 96 },
  { name: "Ground Beef",     sales: 35, progress: 70 },
  { name: "Lamb Chops",      sales: 29, progress: 58 },
  { name: "Turkey Breast",   sales: 22, progress: 44 },
  { name: "Merguez Sausage", sales: 15, progress: 30 },
];

const stockData = [
  { name: "Whole Chicken",   category: "Poultry",     stock: 25, threshold: 10 },
  { name: "Ground Beef",     category: "Red Meat",    stock: 40, threshold: 10 },
  { name: "Lamb Chops",      category: "Red Meat",    stock: 12, threshold: 8  },
  { name: "Turkey Breast",   category: "Poultry",     stock: 5,  threshold: 6  },
  { name: "Merguez Sausage", category: "Charcuterie", stock: 18, threshold: 10 },
  { name: "Fish Fillet",     category: "Seafood",     stock: 2,  threshold: 5  },
  { name: "Chicken Thighs",  category: "Poultry",     stock: 3,  threshold: 5  },
];

const statusStyle: Record<string, string> = {
  "Delivered":  "bg-green-100 text-green-700",
  "Processing": "bg-blue-100 text-blue-700",
  "Pending":    "bg-yellow-100 text-yellow-700",
  "Cancelled":  "bg-red-100 text-red-700",
};

export default function DashboardPage() {
  const sufficient = stockData.filter((p) => p.stock > p.threshold).length;
  const lowStock   = stockData.filter((p) => p.stock <= p.threshold).length;

  const stockStats = [
    { title: "Total Items", value: stockData.length, icon: Package,       color: "bg-blue-500"  },
    { title: "In Stock",    value: sufficient,        icon: CheckCircle,   color: "bg-green-500" },
    { title: "Low Stock",   value: lowStock,          icon: AlertTriangle, color: "bg-red-500"   },
  ];

  const chartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Sales",
        data: [120, 200, 150, 220, 170, 250],
        borderColor: "rgb(59, 130, 246)",
        backgroundColor: "rgba(59, 130, 246, 0.08)",
        tension: 0.4,
        fill: true,
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

  return (
    // ← isPublic={true} permet d'accéder sans login
    <PrivateRoute isPublic={true}>
      <div className="min-h-screen bg-gray-50 p-6">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-400 text-sm mt-1">Overview of your business activity</p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.title} className="bg-white rounded-2xl shadow-sm p-5 flex items-center gap-4 border border-gray-100 hover:shadow-md transition-shadow">
                <div className={`${stat.color} p-3 rounded-xl`}>
                  <Icon size={22} className="text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-400 uppercase tracking-wide">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                </div>
                <div className={`flex items-center gap-1 text-xs font-semibold ${stat.up ? "text-green-500" : "text-red-500"}`}>
                  {stat.up ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                  {stat.trend}
                </div>
              </div>
            );
          })}
        </div>

        {/* Chart + Top Products */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-gray-900">Sales over 6 months</h2>
              <span className="text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-full">Jan — Jun 2025</span>
            </div>
            <div style={{ height: "200px" }}>
              <Line data={chartData} options={chartOptions} />
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <h2 className="text-base font-semibold text-gray-800 mb-4">Top Products</h2>
            <div className="flex flex-col gap-4">
              {topProducts.map((p, i) => (
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
          </div>
        </div>

        {/* Recent Orders + Stock */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

          {/* Recent Orders */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-gray-900">Recent Orders</h2>
              
            </div>
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
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="py-3 pr-3 font-mono text-gray-400 text-xs">{order.id}</td>
                      <td className="py-3 pr-3 font-medium text-gray-700">{order.client}</td>
                      <td className="py-3 pr-3 font-semibold text-gray-800">{order.amount}</td>
                      <td className="py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyle[order.status]}`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Stock */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-gray-900">Stock</h2>
              
            </div>

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

            <div className="flex flex-col gap-2">
              {stockData.map((item, index) => {
                const isLow    = item.stock <= item.threshold;
                const progress = Math.min((item.stock / 50) * 100, 100);
                return (
                  <div key={index} className="flex items-center gap-3 py-2 border-b border-gray-50">
                    <span className="text-sm font-medium text-gray-700 w-36">{item.name}</span>
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
          </div>

        </div>
      </div>
    </PrivateRoute>
  );
}