"use client";

import { useState } from "react";
import PrivateRoute from "../../components/PrivateRoute";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Pencil, Trash2, Search, Package, AlertTriangle, CheckCircle } from "lucide-react";

type Product = {
  id: number;
  name: string;
  stock: number;
  price: string;
  category: string;
};

const categories = ["Poultry", "Red Meat", "Seafood", "Charcuterie", "Other"];

const initialProducts: Product[] = [
  { id: 1, name: "Whole Chicken",   stock: 25, price: "12.500 TND", category: "Poultry"     },
  { id: 2, name: "Ground Beef",     stock: 40, price: "28.000 TND", category: "Red Meat"    },
  { id: 3, name: "Lamb Chops",      stock: 8,  price: "45.000 TND", category: "Red Meat"    },
  { id: 4, name: "Fish Fillet",     stock: 20, price: "18.000 TND", category: "Seafood"     },
  { id: 5, name: "Turkey Breast",   stock: 3,  price: "22.000 TND", category: "Poultry"     },
  { id: 6, name: "Merguez Sausage", stock: 30, price: "14.000 TND", category: "Charcuterie" },
  { id: 7, name: "Chicken Thighs",  stock: 5,  price: "9.000 TND",  category: "Poultry"     },
];

const emptyForm = { name: "", stock: "", price: "", category: "" };

export default function ProductsPage() {
  const [products, setProducts]       = useState<Product[]>(initialProducts);
  const [search, setSearch]           = useState("");
  const [openDialog, setOpenDialog]   = useState(false);
  const [openDelete, setOpenDelete]   = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [deleteId, setDeleteId]       = useState<number | null>(null);
  const [form, setForm]               = useState(emptyForm);
  const [errors, setErrors]           = useState<Record<string, string>>({});

  // Safe filter with null checks
  const filtered = products.filter((p) =>
    (p.name ?? "").toLowerCase().includes(search.toLowerCase()) ||
    (p.category ?? "").toLowerCase().includes(search.toLowerCase())
  );

  const totalStock = products.reduce((a, b) => a + (b.stock ?? 0), 0);
  const lowStock   = products.filter((p) => (p.stock ?? 0) <= 5).length;

  const handleAdd = () => {
    setEditProduct(null);
    setForm(emptyForm);
    setErrors({});
    setOpenDialog(true);
  };

  const handleEdit = (p: Product) => {
    setEditProduct(p);
    setForm({
      name:     p.name     ?? "",
      stock:    String(p.stock ?? 0),
      price:    p.price    ?? "",
      category: p.category ?? "",
    });
    setErrors({});
    setOpenDialog(true);
  };

  const handleDeleteConfirm = (id: number) => {
    setDeleteId(id);
    setOpenDelete(true);
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim())                        e.name     = "Name is required";
    if (!form.price.trim())                       e.price    = "Price is required";
    if (!form.category)                           e.category = "Category is required";
    if (!form.stock || isNaN(Number(form.stock))) e.stock    = "Invalid stock value";
    return e;
  };

  const handleSave = () => {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }

    if (editProduct) {
      setProducts((prev) =>
        prev.map((p) =>
          p.id === editProduct.id
            ? { ...p, name: form.name, stock: Number(form.stock), price: form.price, category: form.category }
            : p
        )
      );
    } else {
      setProducts((prev) => [
        ...prev,
        { id: Date.now(), name: form.name, stock: Number(form.stock), price: form.price, category: form.category },
      ]);
    }
    setOpenDialog(false);
  };

  const handleDelete = () => {
    setProducts((prev) => prev.filter((p) => p.id !== deleteId));
    setOpenDelete(false);
  };

  return (
    <PrivateRoute>
      <div className="min-h-screen bg-gray-50 p-6">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Products</h1>
            <p className="text-gray-400 text-sm mt-1">Manage your product catalog</p>
          </div>
          <Button
            onClick={handleAdd}
            className="bg-red-900 hover:bg-red-800 text-white rounded-xl gap-2"
          >
            <Plus size={16} /> Add Product
          </Button>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {[
            { label: "Total Products", value: products.length, icon: Package,       color: "bg-blue-500"  },
            { label: "Total Stock",    value: totalStock,       icon: CheckCircle,   color: "bg-green-500" },
            { label: "Low Stock",      value: lowStock,         icon: AlertTriangle, color: "bg-red-500"   },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
              <div className={`${color} p-3 rounded-xl`}>
                <Icon size={22} className="text-white" />
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide">{label}</p>
                <p className="text-2xl font-bold text-gray-800">{value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">

          <div className="flex items-center gap-2 bg-gray-100 rounded-xl px-3 py-2 mb-5 w-72">
            <Search size={14} className="text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent text-sm text-gray-600 outline-none w-full"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-gray-400 uppercase border-b border-gray-100">
                  <th className="pb-3 pr-4">#</th>
                  <th className="pb-3 pr-4">Product</th>
                  <th className="pb-3 pr-4">Category</th>
                  <th className="pb-3 pr-4">Stock</th>
                  <th className="pb-3 pr-4">Price</th>
                  <th className="pb-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item, index) => {
                  const isLow = (item.stock ?? 0) <= 5;
                  return (
                    <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="py-3 pr-4 text-gray-400 text-xs">{index + 1}</td>
                      <td className="py-3 pr-4 font-medium text-gray-800">{item.name}</td>
                      <td className="py-3 pr-4 text-sm text-gray-600">{item.category}</td>
                      <td className="py-3 pr-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${isLow ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
                          {isLow ? `⚠ ${item.stock} Low` : `✓ ${item.stock}`}
                        </span>
                      </td>
                      <td className="py-3 pr-4 font-semibold text-gray-700">{item.price}</td>
                      <td className="py-3">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(item)}
                            className="h-8 px-3 text-yellow-600 border-yellow-200 hover:bg-yellow-50 gap-1"
                          >
                            <Pencil size={13} /> Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteConfirm(item.id)}
                            className="h-8 px-3 text-red-600 border-red-200 hover:bg-red-50 gap-1"
                          >
                            <Trash2 size={13} /> Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-10 text-center text-gray-400 text-sm">
                      No products found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Dialog Add / Edit */}
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogContent className="sm:max-w-md rounded-2xl">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold text-gray-800">
                {editProduct ? "Edit Product" : "Add Product"}
              </DialogTitle>
            </DialogHeader>

            <div className="flex flex-col gap-4 py-2">

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="name" className="text-sm text-gray-600">Product Name</Label>
                <Input
                  id="name"
                  placeholder="e.g. Whole Chicken, Ground Beef..."
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className={errors.name ? "border-red-400" : ""}
                />
                {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
              </div>

              <div className="flex flex-col gap-1.5">
                <Label className="text-sm text-gray-600">Category</Label>
                <Select
                  value={form.category}
                  onValueChange={(val) => setForm({ ...form, category: val })}
                >
                  <SelectTrigger className={errors.category ? "border-red-400" : ""}>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category && <p className="text-xs text-red-500">{errors.category}</p>}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="price" className="text-sm text-gray-600">Price (TND)</Label>
                  <Input
                    id="price"
                    placeholder="e.g. 12.500 TND"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    className={errors.price ? "border-red-400" : ""}
                  />
                  {errors.price && <p className="text-xs text-red-500">{errors.price}</p>}
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="stock" className="text-sm text-gray-600">Stock</Label>
                  <Input
                    id="stock"
                    type="number"
                    placeholder="e.g. 25"
                    value={form.stock}
                    onChange={(e) => setForm({ ...form, stock: e.target.value })}
                    className={errors.stock ? "border-red-400" : ""}
                  />
                  {errors.stock && <p className="text-xs text-red-500">{errors.stock}</p>}
                </div>
              </div>
            </div>

            <DialogFooter className="gap-2 mt-2">
              <Button variant="outline" onClick={() => setOpenDialog(false)} className="rounded-xl">
                Cancel
              </Button>
              <Button onClick={handleSave} className="bg-red-900 hover:bg-red-800 text-white rounded-xl">
                {editProduct ? "Save Changes" : "Add Product"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Alert Dialog Delete */}
        <AlertDialog open={openDelete} onOpenChange={setOpenDelete}>
          <AlertDialogContent className="rounded-2xl">
            <AlertDialogHeader>
              <AlertDialogTitle>Delete this product?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. The product will be permanently deleted.
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