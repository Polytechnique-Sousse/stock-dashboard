"use client";

import React from "react";
import {
  LayoutDashboard,
  Settings,
  User,
  Package,
  ArrowDownCircle,
  ArrowUpCircle,
  LogOut,
} from "lucide-react";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("loggedIn");
    router.replace("/login");
  };

  const links = [
    { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/dashboard/products", icon: Package, label: "Products" },
    { href: "/dashboard/suppliers", icon: User, label: "Suppliers" },
    { href: "/dashboard/inbound", icon: ArrowDownCircle, label: "Inbound" },
    { href: "/dashboard/outbound", icon: ArrowUpCircle, label: "Outbound" },
    { href: "/dashboard/settings", icon: Settings, label: "Settings" },
  ];

  return (
    <div className="fixed top-0 left-0 w-64 h-full bg-red-950 text-white p-6 flex flex-col">

      {/* LOGO */}
      <div className="flex justify-center items-center mb-10">
        <img src="/logo.svg" alt="logo" />
      </div>

      {/* LINKS */}
      <div className="flex flex-col gap-2 flex-1">
        {links.map(({ href, icon: Icon, label }) => (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${
              pathname === href
                ? "bg-white/20 text-white font-semibold"
                : "text-white/70 hover:text-white hover:bg-white/10"
            }`}
          >
            <Icon size={20} />
            {label}
          </Link>
        ))}
      </div>

      {/* LOGOUT EN BAS */}
      <button
  onClick={handleLogout}
  className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors text-white/70 hover:text-white hover:bg-white/10 w-full mt-4"
>
  <LogOut size={20} />
  Logout
</button>
    </div>
  );
}