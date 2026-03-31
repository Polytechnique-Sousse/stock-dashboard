"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogIn } from "lucide-react";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    // Ici tu mets ton username et mot de passe
    if (username === "roua" && password === "1234") {
      localStorage.setItem("loggedIn", "true"); // Sauvegarde session simple
      router.push("/dashboard"); // Redirection vers dashboard
    } else {
      setError("Nom d'utilisateur ou mot de passe incorrect");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-xl shadow-md min-w-md flex flex-col gap-4"
      >
        <div className="flex justify-center items-center">
          <img src="/logo-visioad.png" className="w-20 h-20 " />
        </div>

        <div>
          <h1 className="text-lg  text-center">Welcome Back </h1>
          <h1 className="text-2xl font-bold text-center">Login</h1>
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}

        <input
          type="text"
          placeholder="Username"
          className="border p-2 rounded"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="border p-2 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="bg-red-900 flex items-center justify-center text-white gap-2 p-2 rounded"> Login <LogIn size={15} /></button>
      </form>
    </div>
  );
}