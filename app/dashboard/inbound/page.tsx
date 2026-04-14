"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function InboundPage() {
  const router = useRouter();

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

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

  // 🔥 LOAD PRODUCTS
  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data));
  }, []);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🔥 SUBMIT INBOUND
  const handleSubmit = async () => {
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/inbound", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: Number(form.productId),
          quantity: Number(form.qty),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || "Error");
      } else {
        setMessage("✅ Product added successfully");

        // reset form
        setForm({
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
      }
    } catch (error) {
      setMessage("Server error");
    }

    setLoading(false);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">

      {/* Title */}
      <h1 className="text-2xl text-center font-bold">Product Details</h1>

      {/* Tabs */}
      <div className="flex bg-gray-100 rounded-lg p-1">
        <button className="flex-1 bg-white rounded-md py-2 font-medium shadow">
          Inbound
        </button>

        <button
          onClick={() => router.push("/dashboard/outbound")}
          className="flex-1 text-gray-500 py-2"
        >
          Outbound
        </button>
      </div>

      {/* Product Select */}
      <div>
        <Label>Product Name</Label>
        <select
          name="productId"
          value={form.productId}
          onChange={handleChange}
          className="w-full border rounded-md p-2"
        >
          <option value="">Select product</option>

          {products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name} (Stock: {p.stock})
            </option>
          ))}
        </select>
      </div>

      {/* Provider */}
      <div>
        <Label>Provider</Label>
        <Input
          name="provider"
          placeholder="Provider name"
          value={form.provider}
          onChange={handleChange}
        />
      </div>

      {/* Grade */}
      <div>
        <Label>Grade</Label>
        <Input
          name="grade"
          placeholder="e.g. Premium"
          value={form.grade}
          onChange={handleChange}
        />
      </div>

      {/* Brand */}
      <div>
        <Label>Brand</Label>
        <Input
          name="brand"
          placeholder="Brand"
          value={form.brand}
          onChange={handleChange}
        />
      </div>

      {/* Origin */}
      <div>
        <Label>Origin</Label>
        <Input
          name="origin"
          placeholder="Country"
          value={form.origin}
          onChange={handleChange}
        />
      </div>

      {/* Condition */}
      <div>
        <Label>Condition</Label>
        <Input
          name="condition"
          placeholder="Condition"
          value={form.condition}
          onChange={handleChange}
        />
      </div>

      {/* Dates */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Production Date</Label>
          <Input
            type="date"
            name="productionDate"
            value={form.productionDate}
            onChange={handleChange}
          />
        </div>

        <div>
          <Label>Expiration Date</Label>
          <Input
            type="date"
            name="expirationDate"
            value={form.expirationDate}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* Quantity */}
      <div>
        <Label>Qty Received</Label>
        <Input
          type="number"
          name="qty"
          placeholder="0"
          value={form.qty}
          onChange={handleChange}
        />
      </div>

      {/* Price */}
      <div>
        <Label>Price</Label>
        <Input
          type="number"
          name="price"
          placeholder="0"
          value={form.price}
          onChange={handleChange}
        />
      </div>

      {/* Notes */}
      <div>
        <Label>Notes</Label>
        <Input
          name="notes"
          placeholder="Optional notes"
          value={form.notes}
          onChange={handleChange}
        />
      </div>

      {/* MESSAGE */}
      {message && (
        <p className="text-center text-sm text-blue-600">{message}</p>
      )}

      {/* Submit */}
      <Button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full bg-black text-white"
      >
        {loading ? "Loading..." : "Confirm Arrival"}
      </Button>

    </div>
  );
}