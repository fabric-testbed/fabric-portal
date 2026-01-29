"use client";

import dynamic from "next/dynamic";

const InitialLoader = dynamic(
  () => import("./InitialLoader"),
  { ssr: false }
);

export default function ClientOnlyLoader({ children }) {
  return <InitialLoader>{children}</InitialLoader>;
}
