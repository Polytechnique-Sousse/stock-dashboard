"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Plus, List } from "lucide-react";
import { toast } from "react-toastify";
import PrivateRoute from "../../components/PrivateRoute";

export default function InboundPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"add" | "list">("add");

  const [form, setForm] = useState({
    productId: "",
    provider: "",
    grade: "",
    brand: "",
    origin: "",
    condition: "",
    productionDate: "",
    expirationDate: "",
    qty: "",
    price: "",
    notes: "",
  });

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data));
  }, []);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!form.productId) { toast.error("Please select a product"); return; }
    if (!form.qty || Number(form.qty) <= 0) { toast.error("Please enter a valid quantity"); return; }

    setLoading(true);
    try {
      const res = await fetch("/api/inbound", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: Number(form.productId),
          quantity: Number(form.qty),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Error");
      } else {
        toast.success("Product added successfully");
        setForm({
          productId: "", provider: "", grade: "", brand: "", origin: "",
          condition: "", productionDate: "", expirationDate: "", qty: "", price: "", notes: "",
        });
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
          <h1 className="text-2xl font-bold text-gray-800">Inbound</h1>
          <p className="text-gray-400 text-sm mt-1">Manage your inbound stock</p>
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
              Add Inbound
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

          {/* TAB 1: ADD INBOUND */}
          {activeTab === "add" && (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-6">
              <h2 className="text-xl font-bold text-gray-800">Add New Inbound</h2>

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

              <div>
                <Label className="text-sm font-medium">Provider</Label>
                <Input name="provider" placeholder="Provider name" value={form.provider} onChange={handleChange} className="border-gray-200" />
              </div>

              <div>
                <Label className="text-sm font-medium">Grade</Label>
                <Input name="grade" placeholder="e.g. Premium, Standard" value={form.grade} onChange={handleChange} className="border-gray-200" />
              </div>

              <div>
                <Label className="text-sm font-medium">Brand</Label>
                <Input name="brand" placeholder="Brand name" value={form.brand} onChange={handleChange} className="border-gray-200" />
              </div>

              <div>
                <Label className="text-sm font-medium">Origin</Label>
                <Input name="origin" placeholder="Country / Region" value={form.origin} onChange={handleChange} className="border-gray-200" />
              </div>

              <div>
                <Label className="text-sm font-medium">Condition</Label>
                <Input name="condition" placeholder="e.g. Fresh, Frozen" value={form.condition} onChange={handleChange} className="border-gray-200" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Production Date</Label>
                  <Input type="date" name="productionDate" value={form.productionDate} onChange={handleChange} className="border-gray-200" />
                </div>
                <div>
                  <Label className="text-sm font-medium">Expiration Date</Label>
                  <Input type="date" name="expirationDate" value={form.expirationDate} onChange={handleChange} className="border-gray-200" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Qty Received *</Label>
                  <Input type="number" name="qty" placeholder="0" value={form.qty} onChange={handleChange} className="border-gray-200" />
                </div>
                <div>
                  <Label className="text-sm font-medium">Price (TND)</Label>
                  <Input type="number" name="price" placeholder="0.00" value={form.price} onChange={handleChange} className="border-gray-200" />
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">Notes</Label>
                <Input name="notes" placeholder="Optional notes" value={form.notes} onChange={handleChange} className="border-gray-200" />
              </div>

              <Button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-red-900 hover:bg-red-800 text-white rounded-xl py-3 font-medium"
              >
                {loading ? "Processing..." : "✓ Confirm Inbound"}
              </Button>
            </div>
          )}

          {/* TAB 2: VIEW LIST */}
          {activeTab === "list" && (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Inbound History</h2>
              <div className="space-y-3">
                {products && products.length > 0 ? (
                  products.map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
                    >
                      <div>
                        <p className="font-medium text-gray-800">{product.name}</p>
                        <p className="text-sm text-gray-500">
                          Category: {product.category} • Stock: {product.stock}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-800">
                          {Number(product.price).toFixed(3)} TND
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500 py-8">No inbound records yet</p>
                )}
              </div>
            </div>
          )}

        </div>
      </div>
    </PrivateRoute>
  );
}