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
 *
 * The actual authenticated dashboard will be built in a future step.
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
            background: "rgba(99, 102, 241, 0.15)",
            border: "1px solid rgba(99, 102, 241, 0.3)",
            marginBottom: "1.5rem",
          }}
        >
          <span style={{ fontSize: "0.75rem", color: "#818cf8", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase" }}>
            ✦ Your personal space
          </span>
        </div>

        <h1
          style={{
            fontSize: "clamp(2.25rem, 5vw, 3.5rem)",
            fontWeight: 800,
            lineHeight: 1.1,
            letterSpacing: "-0.03em",
            margin: "0 0 1.25rem",
            background: "linear-gradient(135deg, #f1f5f9 0%, #a5b4fc 50%, #8b5cf6 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Own your day,
          <br />
          every day.
        </h1>

        <p
          style={{
            fontSize: "1.125rem",
            color: "rgba(241, 245, 249, 0.7)",
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
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
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
          {["✓ Daily tasks", "✓ Habit streaks", "✓ Routine builder", "✓ Progress insights"].map(
            (feature) => (
              <span
                key={feature}
                style={{
                  fontSize: "0.8125rem",
                  fontWeight: 500,
                  color: "rgba(165, 180, 252, 0.9)",
                  padding: "0.3rem 0.75rem",
                  borderRadius: "2rem",
                  background: "rgba(99, 102, 241, 0.1)",
                  border: "1px solid rgba(99, 102, 241, 0.2)",
                }}
              >
                {feature}
              </span>
            )
          )}
        </div>
      </div>
    </div>
  );
}
