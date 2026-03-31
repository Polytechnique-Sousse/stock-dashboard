"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function PrivateRoute({ 
  children,
  isPublic = false  // ← nouveau paramètre
}: { 
  children: React.ReactNode;
  isPublic?: boolean;
}) {
  const router = useRouter();
  const [isLogged, setIsLogged] = useState(false);

  useEffect(() => {
    const logged = localStorage.getItem("loggedIn");
    if (logged === "true" || isPublic) {
      setIsLogged(true);
    } else {
      router.push("/login");
    }
  }, [router, isPublic]);

  if (!isLogged) return null;
  return <>{children}</>;
}