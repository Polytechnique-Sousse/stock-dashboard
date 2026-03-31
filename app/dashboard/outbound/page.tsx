"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";


export default function OutboundPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    batch: "",
    weight: "",
    pieces: "",
    client: "",
    price: "",
    destination: "",
    notes: "",
  });

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    console.log(form);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">

      {/* Title */}
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

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* Batch */}
        <div>
          <Label>Lot / Batch</Label>
          <Input
            name="batch"
            placeholder="Enter batch ID"
            onChange={handleChange}
          />
        </div>

        {/* Weight + Pieces */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Weight (lb)</Label>
            <Input
              type="number"
              name="weight"
              placeholder="0"
              onChange={handleChange}
            />
          </div>

          <div>
            <Label>Pieces</Label>
            <Input
              type="number"
              name="pieces"
              placeholder="0"
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Client */}
        <div>
          <Label>Client Name</Label>
          <Input
            name="client"
            placeholder="Enter client name"
            onChange={handleChange}
          />
        </div>

        {/* Destination */}
        <div>
          <Label>Destination</Label>
          <Input
            name="destination"
            placeholder="City / Warehouse"
            onChange={handleChange}
          />
        </div>

        {/* Price */}
        <div>
          <Label>Sales Price ($)</Label>
          <Input
            type="number"
            name="price"
            placeholder="0"
            onChange={handleChange}
          />
        </div>

        {/* Submit */}
        <Button className="w-full bg-black hover:bg-green-700 text-white">
          Confirm Dispatch
        </Button>

      </form>
    </div>
  );
}