"use client";

import { useEffect } from "react";

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container d-flex flex-column align-items-center justify-content-center" style={{ minHeight: "50vh" }}>
      <h2>Something went wrong</h2>
      <p className="text-muted">{error?.message || "An unexpected error occurred."}</p>
      <button className="btn btn-outline-primary mt-3" onClick={() => reset()}>
        Try Again
      </button>
    </div>
  );
}
