"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Plus, List } from "lucide-react";
import { toast } from "react-toastify";
import PrivateRoute from "../../components/PrivateRoute";

export default function OutboundPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [outboundHistory, setOutboundHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"add" | "list">("add");

  const [form, setForm] = useState({
    productId: "",
    quantity: "",
    client: "",
    amount: "",
  });

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data));
  }, []);

  useEffect(() => {
    loadOutboundHistory();
  }, []);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const loadOutboundHistory = async () => {
    try {
      const res = await fetch("/api/outbound");
      if (res.ok) {
        const data = await res.json();
        setOutboundHistory(data);
      }
    } catch (error) {
      console.error("Failed to load outbound history:", error);
    }
  };

  const handleSubmit = async () => {
    if (!form.productId) { toast.error("Please select a product"); return; }
    if (!form.quantity || Number(form.quantity) <= 0) { toast.error("Please enter a valid quantity"); return; }
    if (!form.client.trim()) { toast.error("Please enter a client name"); return; }

    setLoading(true);
    try {
      const res = await fetch("/api/outbound", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: Number(form.productId),
          quantity: Number(form.quantity),
          client: form.client,
          amount: Number(form.amount),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Something went wrong");
      } else {
        toast.success("Dispatch successful");
        setForm({ productId: "", quantity: "", client: "", amount: "" });
        loadOutboundHistory();
        setTimeout(() => setActiveTab("list"), 1500);
      }
    } catch {
      toast.error("Server error");
    }
    setLoading(false);
  };

  return (
    <PrivateRoute>
      <div className="min-h-screen bg-gray-50 p-6">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Outbound</h1>
          <p className="text-gray-400 text-sm mt-1">Manage your outbound dispatches</p>
        </div>

        <div className="max-w-4xl mx-auto space-y-6">

          {/* Tabs */}
          <div className="flex gap-2 bg-gray-100 rounded-xl p-1">
            <button
              onClick={() => setActiveTab("add")}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-medium transition-all ${
                activeTab === "add"
                  ? "bg-white text-gray-800 shadow-md"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              <Plus size={18} />
              Add Outbound
            </button>

            <button
              onClick={() => setActiveTab("list")}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-medium transition-all ${
                activeTab === "list"
                  ? "bg-white text-gray-800 shadow-md"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              <List size={18} />
              View List
            </button>
          </div>

          {/* TAB 1: ADD OUTBOUND */}
          {activeTab === "add" && (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-6">
              <h2 className="text-xl font-bold text-gray-800">Add New Outbound</h2>

              <div>
                <Label className="text-sm font-medium">Product Name *</Label>
                <select
                  name="productId"
                  value={form.productId}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-lg p-3 mt-1 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="">Select product</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} (Stock: {p.stock})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Quantity *</Label>
                  <Input
                    type="number"
                    name="quantity"
                    placeholder="0"
                    value={form.quantity}
                    onChange={handleChange}
                    className="border-gray-200"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium">Client Name *</Label>
                  <Input
                    name="client"
                    placeholder="Client name"
                    value={form.client}
                    onChange={handleChange}
                    className="border-gray-200"
                  />
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">Amount</Label>
                <Input
                  type="number"
                  name="amount"
                  placeholder="Enter amount"
                  value={form.amount}
                  onChange={handleChange}
                  className="border-gray-200"
                />
              </div>

              <Button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-red-900 hover:bg-red-800 text-white rounded-xl py-3 font-medium"
              >
                {loading ? "Processing..." : "✓ Confirm Dispatch"}
              </Button>
            </div>
          )}

          {/* TAB 2: VIEW LIST */}
          {activeTab === "list" && (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Outbound History</h2>
              <div className="space-y-3">
                {outboundHistory && outboundHistory.length > 0 ? (
                  outboundHistory.map((outbound: any, index: number) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">
                          {products.find((p) => p.id === outbound.productId)?.name || "Unknown Product"}
                        </p>
                        <p className="text-sm text-gray-500">
                          Client: {outbound.client} • Destination: {outbound.destination || "—"}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-800">Qty: {outbound.quantity}</p>
                        <p className="text-xs text-gray-400">
                          {new Date(outbound.createdAt).toLocaleDateString("fr-FR")}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500 py-8">No outbound records yet</p>
                )}
              </div>
            </div>
          )}

        </div>
      </div>
    </PrivateRoute>
  );
}