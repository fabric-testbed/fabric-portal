"use client";

import dynamic from "next/dynamic";
import { AuthProvider } from "@/lib/auth/AuthContext";

const InitialLoader = dynamic(
  () => import("./InitialLoader"),
  { ssr: false, loading: () => <div style={{ minHeight: "100vh" }} /> }
);

const Chatbot = dynamic(() => import("./common/Chatbot"), { ssr: false });

export default function ClientOnlyLoader({ children }) {
  return (
    <AuthProvider>
      <InitialLoader>{children}</InitialLoader>
      <Chatbot />
    </AuthProvider>
  );
}
