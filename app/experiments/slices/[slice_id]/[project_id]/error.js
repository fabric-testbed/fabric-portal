"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container d-flex flex-column align-items-center justify-content-center" style={{ minHeight: "50vh" }}>
      <h2>Error Loading Slice</h2>
      <p className="text-muted">{error?.message || "An error occurred while loading the slice."}</p>
      <div className="d-flex gap-3 mt-3">
        <button className="btn btn-outline-primary" onClick={() => reset()}>
          Try Again
        </button>
        <Link href="/experiments/slices" className="btn btn-outline-secondary">
          Back to Slices
        </Link>
      </div>
    </div>
  );
}
