"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";


export default function InboundPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    productName: "",
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

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
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

      {/* Product Name */}
      <div>
        <Label>Product Name</Label>
        <select
          name="productName"
          onChange={handleChange}
          className="w-full border rounded-md p-2"
        >
          <option>ChickenWings8456</option>
          <option>Poulet entier</option>
          <option>Bœuf haché</option>
          <option>Côtelettes d'agneau</option>
          <option>Escalope de dinde</option>
          <option>Filet de merlan</option>
          <option>Merguez</option>
          <option>Cuisse de poulet</option>
        </select>
        <p className="text-sm text-gray-500 mt-1">
          Can't find the product? Use the emergency button below.
        </p>
      </div>

      {/* Emergency Button */}
      <Button variant="outline" className="w-full border-red-500 text-red-500">
        ⚠ Create Emergency Product
      </Button>

      {/* Provider */}
      <div>
        <Label>Provider</Label>
        <Input
          name="provider"
          placeholder="Provider name"
          onChange={handleChange}
        />
      </div>

      {/* Grade */}
      <div>
        <Label>Grade</Label>
        <Input
          name="grade"
          placeholder="e.g. Premium, Standard"
          onChange={handleChange}
        />
      </div>

      {/* Brand */}
      <div>
        <Label>Brand</Label>
        <Input
          name="brand"
          placeholder="Brand name"
          onChange={handleChange}
        />
      </div>

      {/* Origin */}
      <div>
        <Label>Origin</Label>
        <Input
          name="origin"
          placeholder="Country/Region of origin"
          onChange={handleChange}
        />
      </div>

      {/* Condition */}
      <div>
        <Label>Condition</Label>
        <Input
          name="condition"
          placeholder="Product condition"
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
            onChange={handleChange}
          />
        </div>

        <div>
          <Label>Expiration Date</Label>
          <Input
            type="date"
            name="expirationDate"
            onChange={handleChange}
          />
        </div>
      </div>

      {/* Quantity */}
      <div>
        <Label>Qty Received (lb)</Label>
        <Input
          type="number"
          name="qty"
          placeholder="0"
          onChange={handleChange}
        />
      </div>

      {/* Price */}
      <div>
        <Label>Price ($)</Label>
        <Input
          type="number"
          name="price"
          placeholder="0"
          onChange={handleChange}
        />
      </div>

      {/* Upload Invoice */}
      <div>
        <Label>Invoice (optional)</Label>
        <div className="border rounded-md p-3 flex justify-center cursor-pointer">
          Upload Invoice
        </div>
      </div>

    

      {/* Voice Note */}
      <div>
        <Label>Voice Note (optional)</Label>
        <Button variant="outline" className="w-full">
          🎤 Start Recording
        </Button>
      </div>

      {/* Lot ID */}
      <div>
        <Label>Lot ID (Auto-generated)</Label>
        <Input disabled placeholder="Auto-generated" />
      </div>

      {/* Submit */}
      <Button className="w-full bg-black text-white">
        Confirm Arrival
      </Button>

    </div>
  );
}