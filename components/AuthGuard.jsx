"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import LoginRequired from "./LoginRequired";

export default function AuthGuard({ children }) {
  const [status, setStatus] = useState("loading"); // "loading" | "active" | "inactive"
  const router = useRouter();

  useEffect(() => {
    const userStatus = localStorage.getItem("userStatus");
    if (userStatus === "active") {
      setStatus("active");
    } else {
      setStatus("inactive");
    }
  }, []);

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (status !== "active" && location.pathname !== "/experiments") {
    return <LoginRequired />;
  }

  if (localStorage.getItem("userStatus") !== "active" && location.pathname === "/experiments") {
    useEffect(() => { router.push("/experiments/experiments-public");}, [router]); 
    return null;
  }

  return <>{children}</>;
}
