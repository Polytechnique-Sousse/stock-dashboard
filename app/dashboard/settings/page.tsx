"use client";

import { useState, useEffect } from "react";

// ── Types ──────────────────────────────────────────────────────────────────────
interface SettingsForm {
  companyName: string;
  currency:    string;
  unit:        string;
  lowStock:    boolean;
  emailNotif:  boolean;
  password:    string;
  confirmPassword: string;
}

// ── Toast notification ─────────────────────────────────────────────────────────
function Toast({ message, type, onClose }: { message: string; type: "success" | "error"; onClose: () => void }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div className={`fixed top-5 right-5 z-50 px-5 py-3 rounded-xl shadow-lg text-white text-sm font-medium flex items-center gap-2 transition-all ${type === "success" ? "bg-green-600" : "bg-red-600"}`}>
      {type === "success" ? "✓" : "✗"} {message}
    </div>
  );
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
  const [toast, setToast]       = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [pwError, setPwError]   = useState("");

  // ── Charger les settings existants ─────────────────────────────────────────
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

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const target = e.target as HTMLInputElement;
    const value  = target.type === "checkbox" ? target.checked : target.value;
    setForm((prev) => ({ ...prev, [target.name]: value }));

    // Reset password error when typing
    if (target.name === "password" || target.name === "confirmPassword") {
      setPwError("");
    }
  };

  const handleSave = async () => {
    // Validation mot de passe
    if (form.password) {
      if (form.password.length < 6) {
        setPwError("Password must be at least 6 characters.");
        return;
      }
      if (form.password !== form.confirmPassword) {
        setPwError("Passwords do not match.");
        return;
      }
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
          // N'envoyer le mot de passe que s'il est rempli
          password: form.password || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setToast({ message: data.error ?? "Failed to save settings.", type: "error" });
        return;
      }

      setToast({ message: "Settings saved successfully!", type: "success" });

      // Reset les champs mot de passe après succès
      setForm((prev) => ({ ...prev, password: "", confirmPassword: "" }));

    } catch (err) {
      console.error(err);
      setToast({ message: "Network error. Please try again.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  // ── Input style ────────────────────────────────────────────────────────────
  const inputClass =
    "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B0000] focus:border-transparent transition-all bg-white";

  // ── Render ────────────────────────────────────────────────────────────────
  if (fetching) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-[#8B0000]" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">

      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <h1 className="text-2xl font-bold text-gray-800">Settings</h1>

      {/* ── System Settings ─────────────────────────────────────────────── */}
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

      {/* ── Notifications ──────────────────────────────────────────────── */}
      {/* ── Notifications ──────────────────────────────────────────────── */}
<div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
  <h2 className="font-semibold text-gray-800 text-lg">Notifications</h2>

  {/* OPTION 1 */}
  <label className="flex items-center justify-between py-3 border-b border-gray-50 cursor-pointer">
    <div>
      <p className="text-sm font-medium text-gray-700">Low Stock Alerts</p>
      <p className="text-xs text-gray-400">
        Get notified when stock is critically low
      </p>
    </div>

    <input
      type="radio"
      name="notificationType"
      checked={form.lowStock}
      onChange={() =>
        setForm((prev) => ({
          ...prev,
          lowStock: true,
          emailNotif: false,
        }))
      }
      className="w-4 h-4 accent-[#8B0000]"
    />
  </label>

  {/* OPTION 2 */}
  <label className="flex items-center justify-between py-3 cursor-pointer">
    <div>
      <p className="text-sm font-medium text-gray-700">Email Notifications</p>
      <p className="text-xs text-gray-400">
        Receive email updates for orders and alerts
      </p>
    </div>

    <input
      type="radio"
      name="notificationType"
      checked={form.emailNotif}
      onChange={() =>
        setForm((prev) => ({
          ...prev,
          lowStock: false,
          emailNotif: true,
        }))
      }
      className="w-4 h-4 accent-[#8B0000]"
    />
  </label>
</div>
      {/* ── Security ────────────────────────────────────────────────────── */}
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
          {pwError && (
            <p className="text-xs text-red-500 mt-1">{pwError}</p>
          )}
        </div>
        <button
  onClick={() => {
    if (!form.password) {
      setPwError("Please enter a password");
      return;
    }
    if (form.password.length < 6) {
      setPwError("Password must be at least 6 characters");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setPwError("Passwords do not match");
      return;
    }

    setPwError("");
    setToast({ message: "Password confirmed ✔", type: "success" });
  }}
  className="w-full mt-2 bg-red-900 border border-[#8B0000] text-white py-2 rounded-lg hover:bg-[#8B0000] hover:text-white transition"
>
  Confirm 
</button>
      </div>

      {/* ── Save Button ─────────────────────────────────────────────────── */}
      

    </div>
  );
}