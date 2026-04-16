"use client";

import { useState, useEffect } from "react";
import PrivateRoute from "../../components/PrivateRoute";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Pencil, Trash2, Search, Save, X,
  Users, Phone, Mail, MapPin, Package, Loader2,
} from "lucide-react";

type Supplier = {
  id: number;
  name: string;
  phone: string;
  email: string;
  address: string;
  products: string;
};

const emptyForm = { name: "", phone: "", email: "", address: "", products: "" };

export default function SuppliersPage() {
  const [suppliers, setSuppliers]       = useState<Supplier[]>([]);
  const [search, setSearch]             = useState("");
  const [editSupplier, setEditSupplier] = useState<Supplier | null>(null);
  const [deleteId, setDeleteId]         = useState<number | null>(null);
  const [openDelete, setOpenDelete]     = useState(false);
  const [form, setForm]                 = useState(emptyForm);
  const [errors, setErrors]             = useState<Record<string, string>>({});
  const [loading, setLoading]           = useState(true);
  const [saving, setSaving]             = useState(false);

  // ── Charger depuis la base de données ──
  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/suppliers");
      const data = await res.json();
      setSuppliers(data);
    } catch {
      console.error("Failed to fetch suppliers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const filtered = suppliers.filter(
    (s) =>
      (s.name ?? "").toLowerCase().includes(search.toLowerCase()) ||
      (s.products ?? "").toLowerCase().includes(search.toLowerCase())
  );

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim())     e.name     = "Name is required";
    if (!form.phone.trim())    e.phone    = "Phone is required";
    if (!form.email.trim())    e.email    = "Email is required";
    if (!form.address.trim())  e.address  = "Address is required";
    if (!form.products.trim()) e.products = "Products are required";
    return e;
  };

  // ── Add ou Edit → enregistre dans la base ──
  const handleSave = async () => {
  const e = validate();
  if (Object.keys(e).length > 0) {
    setErrors(e);
    return;
  }

  setSaving(true);

  try {
    const payload = {
  name: form.name.trim(),
  email: form.email,
  phone: form.phone,
  address: form.address,
};

    if (editSupplier) {
      const res = await fetch(`/api/suppliers/${editSupplier.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

    } else {
      const res = await fetch("/api/suppliers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
    }

    await fetchSuppliers();
    setEditSupplier(null);
    setForm(emptyForm);

  } catch (err) {
    console.error("❌ Failed to save supplier:", err);
  } finally {
    setSaving(false);
  }
};

  const handleEdit = (s: Supplier) => {
  setEditSupplier(s);
  setForm({
    name: s.name ?? "",
    phone: s.phone ?? "",
    email: s.email ?? "",
    address: s.address ?? "",
    products: s.products ?? "",
  });
};

  const handleCancel = () => {
    setEditSupplier(null);
    setForm(emptyForm);
    setErrors({});
  };

  const handleDeleteConfirm = (id: number) => { setDeleteId(id); setOpenDelete(true); };

  // ── Supprimer définitivement de la base ──
  const handleDelete = async () => {
  try {
    const res = await fetch(`/api/suppliers/${deleteId}`, {
      method: "DELETE",
    });

    if (!res.ok) throw new Error("Delete failed");

    await fetchSuppliers();
  } catch (err) {
    console.error("Delete error:", err);
  } finally {
    setOpenDelete(false);
  }
};

  return (
    <PrivateRoute>
      <div className="min-h-screen bg-gray-50 p-6">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Suppliers</h1>
          <p className="text-gray-400 text-sm mt-1">Manage your suppliers</p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {[
            { label: "Total Suppliers",  value: suppliers.length, icon: Users,   color: "bg-blue-500"   },
            { label: "Active",           value: suppliers.length, icon: Package, color: "bg-green-500"  },
            { label: "Products Covered", value: new Set(suppliers.flatMap(s => (s.products ?? "").split(","))).size, icon: Package, color: "bg-purple-500" },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
              <div className={`${color} p-3 rounded-xl`}><Icon size={22} className="text-white" /></div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide">{label}</p>
                <p className="text-2xl font-bold text-gray-800">{value}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Form */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-base font-semibold text-gray-800 mb-5">
              {editSupplier ? "✏️ Edit Supplier" : "➕ Add Supplier"}
            </h2>

            <div className="flex flex-col gap-4">

              <div className="flex flex-col gap-1.5">
                <Label className="text-sm text-gray-600 flex items-center gap-1">
                  <Users size={13} /> Name
                </Label>
                <Input
                  placeholder="e.g. Ben Ali Farm"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className={errors.name ? "border-red-400" : ""}
                />
                {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
              </div>

              <div className="flex flex-col gap-1.5">
                <Label className="text-sm text-gray-600 flex items-center gap-1">
                  <Phone size={13} /> Phone
                </Label>
                <Input
                  placeholder="+216 XX XXX XXX"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className={errors.phone ? "border-red-400" : ""}
                />
                {errors.phone && <p className="text-xs text-red-500">{errors.phone}</p>}
              </div>

              <div className="flex flex-col gap-1.5">
                <Label className="text-sm text-gray-600 flex items-center gap-1">
                  <Mail size={13} /> Email
                </Label>
                <Input
                  type="email"
                  placeholder="email@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className={errors.email ? "border-red-400" : ""}
                />
                {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
              </div>

              <div className="flex flex-col gap-1.5">
                <Label className="text-sm text-gray-600 flex items-center gap-1">
                  <MapPin size={13} /> Address
                </Label>
                <Input
                  placeholder="e.g. Tunis, Tunisia"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  className={errors.address ? "border-red-400" : ""}
                />
                {errors.address && <p className="text-xs text-red-500">{errors.address}</p>}
              </div>

              <div className="flex flex-col gap-1.5">
                <Label className="text-sm text-gray-600 flex items-center gap-1">
                  <Package size={13} /> Products Supplied
                </Label>
                <Input
                  placeholder="e.g. Chicken, Beef, Lamb..."
                  value={form.products}
                  onChange={(e) => setForm({ ...form, products: e.target.value })}
                  className={errors.products ? "border-red-400" : ""}
                />
                {errors.products && <p className="text-xs text-red-500">{errors.products}</p>}
              </div>

              <div className="flex gap-2 mt-2">
                <Button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 bg-red-900 hover:bg-red-800 text-white rounded-xl gap-2"
                >
                  {saving
                    ? <Loader2 size={15} className="animate-spin" />
                    : <Save size={15} />
                  }
                  {editSupplier ? "Save Changes" : "Add Supplier"}
                </Button>
                {editSupplier && (
                  <Button
                    variant="outline"
                    onClick={handleCancel}
                    className="rounded-xl gap-2 text-gray-600"
                  >
                    <X size={15} /> Cancel
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-5">

            <div className="flex items-center gap-2 bg-gray-100 rounded-xl px-3 py-2 mb-5 w-72">
              <Search size={14} className="text-gray-400" />
              <input
                type="text"
                placeholder="Search suppliers..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-transparent text-sm text-gray-600 outline-none w-full"
              />
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 size={24} className="animate-spin text-gray-400" />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-xs text-gray-400 uppercase border-b border-gray-100">
                      <th className="pb-3 pr-4">#</th>
                      <th className="pb-3 pr-4">Name</th>
                      <th className="pb-3 pr-4">Phone</th>
                      <th className="pb-3 pr-4">Email</th>
                      <th className="pb-3 pr-4">Products</th>
                      <th className="pb-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((s, index) => (
                      <tr
                        key={s.id}
                        className={`border-b border-gray-50 hover:bg-gray-50 transition-colors ${editSupplier?.id === s.id ? "bg-yellow-50" : ""}`}
                      >
                        <td className="py-3 pr-4 text-gray-400 text-xs">{index + 1}</td>
                        <td className="py-3 pr-4 font-medium text-gray-800">{s.name}</td>
                        <td className="py-3 pr-4 text-gray-500">{s.phone}</td>
                        <td className="py-3 pr-4 text-gray-500">{s.email}</td>
                        <td className="py-3 pr-4">
                          <div className="flex flex-wrap gap-1">
                            {(s.products ?? "").split(",").map((p) => (
                              <span key={p} className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs">
                                {p.trim()}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="py-3">
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEdit(s)}
                              className="h-8 px-3 text-yellow-600 border-yellow-200 hover:bg-yellow-50 gap-1"
                            >
                              <Pencil size={13} /> Edit
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDeleteConfirm(s.id)}
                              className="h-8 px-3 text-red-600 border-red-200 hover:bg-red-50 gap-1"
                            >
                              <Trash2 size={13} /> Delete
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}

                    {filtered.length === 0 && !loading && (
                      <tr>
                        <td colSpan={6} className="py-10 text-center text-gray-400 text-sm">
                          No suppliers found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Alert Dialog Delete */}
        <AlertDialog open={openDelete} onOpenChange={setOpenDelete}>
          <AlertDialogContent className="rounded-2xl">
            <AlertDialogHeader>
              <AlertDialogTitle>Delete this supplier?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. The supplier will be permanently deleted from the database.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className="bg-red-600 hover:bg-red-700 text-white rounded-xl"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

      </div>
    </PrivateRoute>
  );
}