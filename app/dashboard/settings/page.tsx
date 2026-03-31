"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function SettingsPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    currency: "TND",
    unit: "kg",
    password: "",
  });

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-8">

      <h1 className="text-2xl text-center font-bold">Settings</h1>

      {/* Profile */}
      <div className="space-y-4 bg-white p-5 rounded-xl shadow">
        <h2 className="font-semibold text-lg">Profile</h2>

        <div>
          <Label>Full Name</Label>
          <Input name="name" onChange={handleChange} placeholder="Your name" />
        </div>

        <div>
          <Label>Email</Label>
          <Input name="email" onChange={handleChange} placeholder="Your email" />
        </div>
      </div>

      {/* System */}
      <div className="space-y-4 bg-white p-5 rounded-xl shadow">
        <h2 className="font-semibold text-lg">System Settings</h2>

        <div>
          <Label>Company Name</Label>
          <Input name="company" onChange={handleChange} placeholder="Company name" />
        </div>

        <div>
          <Label>Currency</Label>
          <select
            name="currency"
            onChange={handleChange}
            className="w-full border rounded-md p-2"
          >
            <option value="TND">TND</option>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
          </select>
        </div>

        <div>
          <Label>Unit</Label>
          <select
            name="unit"
            onChange={handleChange}
            className="w-full border rounded-md p-2"
          >
            <option value="kg">kg</option>
            <option value="lb">lb</option>
          </select>
        </div>
      </div>

      {/* Notifications */}
      <div className="space-y-4 bg-white p-5 rounded-xl shadow">
        <h2 className="font-semibold text-lg">Notifications</h2>

        <div className="flex items-center justify-between">
          <span>Low Stock Alerts</span>
          <input type="checkbox" />
        </div>

        <div className="flex items-center justify-between">
          <span>Email Notifications</span>
          <input type="checkbox" />
        </div>
      </div>

      {/* Security */}
      <div className="space-y-4 bg-white p-5 rounded-xl shadow">
        <h2 className="font-semibold text-lg">Security</h2>

        <div>
          <Label>New Password</Label>
          <Input
            type="password"
            name="password"
            onChange={handleChange}
            placeholder="Enter new password"
          />
        </div>

        <Button className="w-full bg-black text-white">
          Save Changes
        </Button>
      </div>

    </div>
  );
}