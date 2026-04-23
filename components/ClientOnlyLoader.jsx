"use client";

import dynamic from "next/dynamic";
import { AuthProvider } from "@/lib/auth/AuthContext";

const InitialLoader = dynamic(
  () => import("./InitialLoader"),
  { ssr: false, loading: () => <div style={{ minHeight: "100vh" }} /> }
);

export default function ClientOnlyLoader({ children }) {
  return (
    <AuthProvider>
      <InitialLoader>{children}</InitialLoader>
    </AuthProvider>
  );
}
