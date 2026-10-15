import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Home",
};

/**
 * Home page — Server Component (no "use client").
 *
 * This is a static landing page. It does not need access to the session
 * because the Navbar (a Client Component) handles the auth state display.
 */
export default function Home() {
  return (
    <div
      className="auth-bg"
      style={{
        minHeight: "calc(100vh - var(--navbar-h))",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "4rem 1.5rem",
        textAlign: "center",
      }}
    >
      {/* Hero */}
      <div
        className="animate-in"
        style={{ maxWidth: "640px", position: "relative", zIndex: 1 }}
      >
        {/* Badge */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.375rem 0.875rem",
            borderRadius: "2rem",
            background: "var(--muted)",
            border: "1px solid var(--border)",
            marginBottom: "1.5rem",
          }}
        >
          <span
            style={{
              fontSize: "0.75rem",
              color: "var(--foreground)",
              fontWeight: 600,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
            }}
          >
            ✦ Your personal space
          </span>
        </div>

        <h1
          style={{
            fontSize: "clamp(2.25rem, 5vw, 3.5rem)",
            fontWeight: 800,
            lineHeight: 1.15,
            letterSpacing: "-0.03em",
            margin: "0 0 1.25rem",
            color: "var(--foreground)",
          }}
        >
          Own your day,
          <br />
          every day.
        </h1>

        <p
          style={{
            fontSize: "1.125rem",
            color: "var(--muted-foreground)",
            lineHeight: 1.7,
            margin: "0 0 2.5rem",
          }}
        >
          OwnSpace helps you track daily tasks, build lasting habits, and stay
          consistent — all in one beautiful, distraction-free space.
        </p>

        {/* CTA buttons */}
        <div
          style={{
            display: "flex",
            gap: "1rem",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <Link
            href="/sign-up"
            id="hero-signup-btn"
            className="hero-btn-primary"
          >
            Get Started Free
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>

          <Link
            href="/sign-in"
            id="hero-signin-btn"
            className="hero-btn-secondary"
          >
            Sign In
          </Link>
        </div>

        {/* Feature pills */}
        <div
          style={{
            display: "flex",
            gap: "0.75rem",
            justifyContent: "center",
            flexWrap: "wrap",
            marginTop: "3rem",
          }}
        >
          {[
            "✓ Daily tasks",
            "✓ Habit streaks",
            "✓ Routine builder",
            "✓ Progress insights",
          ].map((feature) => (
            <span
              key={feature}
              style={{
                fontSize: "0.8125rem",
                fontWeight: 500,
                color: "var(--foreground)",
                padding: "0.35rem 0.85rem",
                borderRadius: "2rem",
                background: "var(--card)",
                border: "1px solid var(--border)",
                boxShadow: "var(--shadow-sm)",
              }}
            >
              {feature}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
