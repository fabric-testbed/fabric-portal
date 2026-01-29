"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import LoginRequired from "./LoginRequired";

export default function AuthGuard({ children }) {
  const [status, setStatus] = useState("loading"); // "loading" | "active" | "inactive"
  const router = useRouter();
  const pathname = usePathname();

  // Read localStorage exactly once, on the client
  useEffect(() => {
    const userStatus = localStorage.getItem("userStatus");
    setStatus(userStatus === "active" ? "active" : "inactive");
  }, []);

  // Handle redirect logic in ONE place
  useEffect(() => {
    if (status !== "inactive") return;

    if (pathname === "/experiments") {
      router.replace("/experiments/experiments-public");
    }
  }, [status, pathname, router]);

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (status !== "active" && pathname !== "/experiments") {
    return <LoginRequired />;
  }

  return <>{children}</>;
}
