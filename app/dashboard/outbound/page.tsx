"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function OutboundPage() {
  const router = useRouter();

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    productId: "",
    quantity: "",
    client: "",
    destination: "",
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

  // 🔥 SUBMIT
  const handleSubmit = async () => {
    setLoading(true);
    setMessage("");

    const res = await fetch("/api/outbound", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        productId: Number(form.productId),
        quantity: Number(form.quantity),
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setMessage("❌ " + data.error);
    } else {
      setMessage("✅ Dispatch réussi");

      setForm({
        productId: "",
        quantity: "",
        client: "",
        destination: "",
      });
    }

    setLoading(false);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">

      <h1 className="text-2xl text-center font-bold">Product Dispatch</h1>

      {/* Tabs */}
      <div className="flex bg-gray-100 rounded-lg p-1">
        <button
          onClick={() => router.push("/dashboard/inbound")}
          className="flex-1 text-gray-500 py-2"
        >
          Inbound
        </button>

        <button className="flex-1 bg-white rounded-md py-2 font-medium shadow">
          Outbound
        </button>
      </div>

      {/* Product */}
      <div>
        <Label>Product</Label>
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

      {/* Quantity */}
      <div>
        <Label>Quantity</Label>
        <Input
          type="number"
          name="quantity"
          placeholder="0"
          value={form.quantity}
          onChange={handleChange}
        />
      </div>

      {/* Client */}
      <div>
        <Label>Client</Label>
        <Input
          name="client"
          placeholder="Client name"
          value={form.client}
          onChange={handleChange}
        />
      </div>

      {/* Destination */}
      <div>
        <Label>Destination</Label>
        <Input
          name="destination"
          placeholder="City"
          value={form.destination}
          onChange={handleChange}
        />
      </div>

      {/* MESSAGE */}
      {message && (
        <p className="text-center text-sm text-blue-600">{message}</p>
      )}

      {/* BUTTON */}
      <Button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full bg-black text-white"
      >
        {loading ? "Loading..." : "Confirm Dispatch"}
      </Button>

    </div>
  );
}