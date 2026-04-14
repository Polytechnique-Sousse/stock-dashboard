"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("loggedIn"); // ou "token" si JWT
    router.push("/login");
  };

  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl"
    >
      <LogOut size={16} />
      Logout
    </button>
  );
}