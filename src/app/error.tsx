"use client";

import { useEffect } from "react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("App error:", error);
  }, [error]);

  return (
    <div
      style={{
        minHeight: "calc(100vh - var(--navbar-h, 4rem))",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
        textAlign: "center",
        backgroundColor: "var(--background)",
      }}
    >
      <div
        style={{
          maxWidth: "480px",
          padding: "2.5rem",
          borderRadius: "1rem",
          border: "1px solid var(--border)",
          backgroundColor: "var(--card)",
          boxShadow: "var(--shadow-md)",
        }}
      >
        <div
          style={{
            width: "3rem",
            height: "3rem",
            borderRadius: "50%",
            backgroundColor: "var(--color-error-bg, #fef2f2)",
            color: "var(--color-error, #ef4444)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 1.5rem",
            fontSize: "1.5rem",
            fontWeight: "bold",
          }}
        >
          !
        </div>
        <h2
          style={{
            fontSize: "1.5rem",
            fontWeight: 700,
            color: "var(--foreground)",
            marginBottom: "0.75rem",
          }}
        >
          Something went wrong
        </h2>
        <p
          style={{
            fontSize: "0.9375rem",
            color: "var(--muted-foreground)",
            lineHeight: 1.6,
            marginBottom: "1.75rem",
          }}
        >
          An unexpected error occurred while loading this page. Please try again or return to home.
        </p>
        <div
          style={{
            display: "flex",
            gap: "0.75rem",
            justifyContent: "center",
          }}
        >
          <button
            onClick={() => reset()}
            style={{
              padding: "0.625rem 1.25rem",
              borderRadius: "0.5rem",
              background: "var(--foreground)",
              color: "var(--background)",
              fontWeight: 600,
              fontSize: "0.875rem",
              border: "none",
              cursor: "pointer",
            }}
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
}
