"use client";

import { useState, useEffect } from "react";
import PrivateRoute from "../../components/PrivateRoute";
import { toast } from "react-toastify";

interface SettingsForm {
  companyName: string;
  currency:    string;
  unit:        string;
  lowStock:    boolean;
  emailNotif:  boolean;
  password:    string;
  confirmPassword: string;
}

export default function SettingsPage() {
  const [form, setForm] = useState<SettingsForm>({
    companyName:     "",
    currency:        "TND",
    unit:            "kg",
    lowStock:        false,
    emailNotif:      false,
    password:        "",
    confirmPassword: "",
  });

  const [loading, setLoading]   = useState(false);
  const [fetching, setFetching] = useState(true);
  const [pwError, setPwError]   = useState("");

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res  = await fetch("/api/settings");
        if (!res.ok) return;
        const data = await res.json();
        setForm((prev) => ({
          ...prev,
          companyName: data.companyName ?? "",
          currency:    data.currency    ?? "TND",
          unit:        data.unit        ?? "kg",
          lowStock:    data.lowStock    ?? false,
          emailNotif:  data.emailNotif  ?? false,
        }));
      } catch (err) {
        console.error("Failed to fetch settings:", err);
      } finally {
        setFetching(false);
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const target = e.target as HTMLInputElement;
    const value  = target.type === "checkbox" ? target.checked : target.value;
    setForm((prev) => ({ ...prev, [target.name]: value }));
    if (target.name === "password" || target.name === "confirmPassword") {
      setPwError("");
    }
  };

  const handleSave = async () => {
    if (form.password) {
      if (form.password.length < 6) { setPwError("Password must be at least 6 characters."); return; }
      if (form.password !== form.confirmPassword) { setPwError("Passwords do not match."); return; }
    }

    setLoading(true);
    setPwError("");

    try {
      const res = await fetch("/api/settings", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyName: form.companyName,
          currency:    form.currency,
          unit:        form.unit,
          lowStock:    form.lowStock,
          emailNotif:  form.emailNotif,
          password:    form.password || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error ?? "Failed to save settings.");
        return;
      }

      toast.success("Settings saved successfully!");
      setForm((prev) => ({ ...prev, password: "", confirmPassword: "" }));

    } catch (err) {
      console.error(err);
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B0000] focus:border-transparent transition-all bg-white";

  if (fetching) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-[#8B0000]" />
      </div>
    );
  }

  return (
    <PrivateRoute>
      <div className="min-h-screen bg-gray-50 p-6">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
          <p className="text-gray-400 text-sm mt-1">Manage your preferences</p>
        </div>

        <div className="max-w-3xl mx-auto space-y-6">

          {/* System Settings */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
            <h2 className="font-semibold text-gray-800 text-lg">System Settings</h2>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Company Name</label>
              <input
                name="companyName"
                value={form.companyName}
                onChange={handleChange}
                placeholder="Company name"
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Currency</label>
              <select name="currency" value={form.currency} onChange={handleChange} className={inputClass}>
                <option value="TND">TND</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Unit</label>
              <select name="unit" value={form.unit} onChange={handleChange} className={inputClass}>
                <option value="kg">kg</option>
                <option value="lb">lb</option>
              </select>
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
            <h2 className="font-semibold text-gray-800 text-lg">Notifications</h2>

            <label className="flex items-center justify-between py-3 border-b border-gray-50 cursor-pointer">
              <div>
                <p className="text-sm font-medium text-gray-700">Low Stock Alerts</p>
                <p className="text-xs text-gray-400">Get notified when stock is critically low</p>
              </div>
              <input
                type="radio"
                name="notificationType"
                checked={form.lowStock}
                onChange={() => setForm((prev) => ({ ...prev, lowStock: true, emailNotif: false }))}
                className="w-4 h-4 accent-[#8B0000]"
              />
            </label>

            <label className="flex items-center justify-between py-3 cursor-pointer">
              <div>
                <p className="text-sm font-medium text-gray-700">Email Notifications</p>
                <p className="text-xs text-gray-400">Receive email updates for orders and alerts</p>
              </div>
              <input
                type="radio"
                name="notificationType"
                checked={form.emailNotif}
                onChange={() => setForm((prev) => ({ ...prev, lowStock: false, emailNotif: true }))}
                className="w-4 h-4 accent-[#8B0000]"
              />
            </label>
          </div>

          {/* Security */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
            <h2 className="font-semibold text-gray-800 text-lg">Security</h2>
            <p className="text-xs text-gray-400">Leave blank to keep your current password.</p>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">New Password</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter new password (min. 6 characters)"
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm new password"
                className={`${inputClass} ${pwError ? "border-red-400 focus:ring-red-400" : ""}`}
              />
              {pwError && <p className="text-xs text-red-500 mt-1">{pwError}</p>}
            </div>

            <button
              onClick={() => {
                if (!form.password) { setPwError("Please enter a password"); return; }
                if (form.password.length < 6) { setPwError("Password must be at least 6 characters"); return; }
                if (form.password !== form.confirmPassword) { setPwError("Passwords do not match"); return; }
                setPwError("");
                toast.success("Password confirmed ✔");
              }}
              className="w-full mt-2 bg-red-900 border border-[#8B0000] text-white py-2 rounded-lg hover:bg-[#8B0000] hover:text-white transition"
            >
              Confirm
            </button>
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={loading}
            className="w-full bg-red-900 hover:bg-red-800 text-white py-3 rounded-xl font-medium transition"
          >
            {loading ? "Saving..." : "💾 Save Settings"}
          </button>

        </div>
      </div>
    </PrivateRoute>
  );
}