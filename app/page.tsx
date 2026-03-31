import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 gap-6">

      {/* Logo / Title */}
      <div className="text-center mb-4">
        <img src="/logo-du-visioad.png" className="w-32 mx-auto mb-10" />
        <h1 className="text-3xl font-bold text-gray-800">Welcome to VisioAD</h1>
        <p className="text-gray-400 mt-2 text-sm">Stock & Inventory Management System</p>
      </div>

      {/* Buttons */}
      <div className="flex gap-4">
        <Link
          href="/login"
          className="bg-red-900 hover:bg-red-800 text-white px-8 py-3 rounded-xl font-medium transition-colors"
        >
          Login
        </Link>
        <Link
          href="/dashboard"
          className="bg-white hover:bg-gray-100 text-gray-800 border border-gray-200 px-8 py-3 rounded-xl font-medium transition-colors"
        >
          Dashboard
        </Link>
      </div>

    </div>
  );
}