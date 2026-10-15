"use client";

/**
 * Navbar component for OwnSpace.
 *
 * "use client" is required because:
 *  - useSession() is a React hook (hooks only work in Client Components)
 *  - We handle click events (mobile menu toggle, sign out button)
 *
 * What this component does:
 *  1. Shows the OwnSpace brand logo.
 *  2. Shows "Sign In" and "Sign Up" links when the user is logged out.
 *  3. Shows a user avatar + dropdown menu when the user is logged in.
 *  4. Handles sign-out through Better Auth.
 *  5. Collapses into a hamburger menu on small screens.
 */

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "@/lib/auth-client";

// ── Logo SVG ──────────────────────────────────────────────────────────────
// A simple geometric mark that fits the brand name "OwnSpace"
function OwnSpaceLogo() {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
    >
      <rect width="32" height="32" rx="8" fill="url(#logo-grad)" />
      <path
        d="M8 16 L16 8 L24 16 L16 24 Z"
        fill="white"
        fillOpacity="0.9"
      />
      <circle cx="16" cy="16" r="4" fill="white" />
      <defs>
        <linearGradient id="logo-grad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// ── Avatar (image or initials fallback) ───────────────────────────────────
function UserAvatar({
  name,
  image,
}: {
  name: string | null | undefined;
  image: string | null | undefined;
}) {
  const initials = name
    ? name
        .split(" ")
        .slice(0, 2)
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "?";

  if (image) {
    return (
      <Image
        src={image}
        alt={name ?? "User avatar"}
        width={36}
        height={36}
        className="avatar"
      />
    );
  }

  return <span className="avatar-fallback">{initials}</span>;
}

// ── Main Navbar ────────────────────────────────────────────────────────────
export default function Navbar() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const user = session?.user;

  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  const handleSignOut = async () => {
    setSigningOut(true);
    try {
      await signOut();
      router.push("/");
      router.refresh(); // clears cached server components
    } catch {
      // If sign-out fails, the user stays on the page; error is silent here.
    } finally {
      setSigningOut(false);
      setDropdownOpen(false);
    }
  };

  return (
    <nav className="navbar" role="navigation" aria-label="Main navigation">
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          height: "100%",
          padding: "0 1.5rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1rem",
        }}
      >
        {/* ── Brand ───────────────────────────────────────────────────── */}
        <Link
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.625rem",
            textDecoration: "none",
          }}
          aria-label="OwnSpace home"
        >
          <OwnSpaceLogo />
          <span
            style={{
              fontSize: "1.1875rem",
              fontWeight: 700,
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              letterSpacing: "-0.02em",
            }}
          >
            OwnSpace
          </span>
        </Link>

        {/* ── Desktop navigation ──────────────────────────────────────── */}
        <div
          className="desktop-nav"
          style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
        >
          <Link
            href="/"
            style={{
              padding: "0.4rem 0.875rem",
              borderRadius: "0.5rem",
              fontSize: "0.9375rem",
              fontWeight: 500,
              color: "var(--color-text-muted)",
              textDecoration: "none",
              transition: "background 0.15s, color 0.15s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.background =
                "var(--color-surface-2)";
              (e.currentTarget as HTMLAnchorElement).style.color =
                "var(--color-text)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.background = "";
              (e.currentTarget as HTMLAnchorElement).style.color =
                "var(--color-text-muted)";
            }}
          >
            Home
          </Link>

          {/* Loading skeleton */}
          {isPending && (
            <div
              aria-label="Loading session"
              style={{
                width: "120px",
                height: "36px",
                borderRadius: "0.5rem",
                background: "var(--color-surface-2)",
                opacity: 0.5,
                animation: "pulse 1.5s ease-in-out infinite",
              }}
            />
          )}

          {/* Logged-out state */}
          {!isPending && !user && (
            <>
              <Link
                href="/sign-in"
                id="nav-sign-in"
                style={{
                  padding: "0.4rem 0.875rem",
                  borderRadius: "0.5rem",
                  fontSize: "0.9375rem",
                  fontWeight: 500,
                  color: "var(--color-text-muted)",
                  textDecoration: "none",
                  transition: "background 0.15s, color 0.15s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.background =
                    "var(--color-surface-2)";
                  (e.currentTarget as HTMLAnchorElement).style.color =
                    "var(--color-text)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.background = "";
                  (e.currentTarget as HTMLAnchorElement).style.color =
                    "var(--color-text-muted)";
                }}
              >
                Sign In
              </Link>

              <Link
                href="/sign-up"
                id="nav-sign-up"
                style={{
                  padding: "0.4rem 1rem",
                  borderRadius: "0.5rem",
                  fontSize: "0.9375rem",
                  fontWeight: 600,
                  color: "#fff",
                  textDecoration: "none",
                  background:
                    "linear-gradient(135deg, #6366f1, #8b5cf6)",
                  boxShadow: "0 2px 8px rgba(99,102,241,0.35)",
                  transition: "transform 0.15s, box-shadow 0.15s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.transform =
                    "translateY(-1px)";
                  (e.currentTarget as HTMLAnchorElement).style.boxShadow =
                    "0 4px 14px rgba(99,102,241,0.5)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.transform = "";
                  (e.currentTarget as HTMLAnchorElement).style.boxShadow =
                    "0 2px 8px rgba(99,102,241,0.35)";
                }}
              >
                Sign Up
              </Link>
            </>
          )}

          {/* Logged-in: avatar + dropdown */}
          {!isPending && user && (
            <div style={{ position: "relative" }}>
              <button
                id="nav-user-menu"
                onClick={() => setDropdownOpen((o) => !o)}
                aria-haspopup="true"
                aria-expanded={dropdownOpen}
                aria-label="User menu"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.25rem 0.5rem",
                  borderRadius: "2rem",
                  border: "1.5px solid var(--color-border)",
                  background: "transparent",
                  cursor: "pointer",
                  transition: "background 0.15s, border-color 0.15s",
                  color: "var(--color-text)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background =
                    "var(--color-surface-2)";
                  (e.currentTarget as HTMLButtonElement).style.borderColor =
                    "var(--color-brand-400)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = "";
                  (e.currentTarget as HTMLButtonElement).style.borderColor =
                    "var(--color-border)";
                }}
              >
                <UserAvatar name={user.name} image={user.image} />
                <span
                  style={{
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    maxWidth: "120px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {user.name?.split(" ")[0] ?? "Account"}
                </span>
                {/* Chevron */}
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{
                    color: "var(--color-text-muted)",
                    transition: "transform 0.2s",
                    transform: dropdownOpen ? "rotate(180deg)" : "rotate(0deg)",
                  }}
                  aria-hidden="true"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>

              {/* Dropdown */}
              {dropdownOpen && (
                <>
                  {/* Backdrop to close dropdown on outside click */}
                  <div
                    style={{
                      position: "fixed",
                      inset: 0,
                      zIndex: 40,
                    }}
                    onClick={() => setDropdownOpen(false)}
                    aria-hidden="true"
                  />
                  <div
                    role="menu"
                    style={{
                      position: "absolute",
                      right: 0,
                      top: "calc(100% + 0.5rem)",
                      zIndex: 50,
                      width: "220px",
                      background: "var(--color-surface)",
                      border: "1px solid var(--color-border)",
                      borderRadius: "0.875rem",
                      boxShadow: "var(--shadow-xl)",
                      overflow: "hidden",
                      animation: "slide-down 0.15s ease both",
                    }}
                  >
                    {/* User info header */}
                    <div
                      style={{
                        padding: "1rem",
                        borderBottom: "1px solid var(--color-border)",
                      }}
                    >
                      <p
                        style={{
                          fontSize: "0.9rem",
                          fontWeight: 600,
                          color: "var(--color-text)",
                          margin: 0,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {user.name}
                      </p>
                      <p
                        style={{
                          fontSize: "0.8125rem",
                          color: "var(--color-text-muted)",
                          margin: "0.125rem 0 0",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {user.email}
                      </p>
                    </div>

                    {/* Menu items */}
                    <div style={{ padding: "0.5rem" }}>
                      <Link
                        href="/"
                        role="menuitem"
                        onClick={() => setDropdownOpen(false)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.625rem",
                          padding: "0.625rem 0.75rem",
                          borderRadius: "0.5rem",
                          fontSize: "0.875rem",
                          color: "var(--color-text)",
                          textDecoration: "none",
                          transition: "background 0.15s",
                        }}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLAnchorElement).style.background =
                            "var(--color-surface-2)";
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLAnchorElement).style.background =
                            "";
                        }}
                      >
                        {/* Home icon */}
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                        Dashboard
                      </Link>

                      <button
                        id="nav-sign-out"
                        role="menuitem"
                        onClick={handleSignOut}
                        disabled={signingOut}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.625rem",
                          padding: "0.625rem 0.75rem",
                          borderRadius: "0.5rem",
                          fontSize: "0.875rem",
                          color: "var(--color-error)",
                          background: "transparent",
                          border: "none",
                          cursor: signingOut ? "not-allowed" : "pointer",
                          width: "100%",
                          textAlign: "left",
                          transition: "background 0.15s",
                          opacity: signingOut ? 0.6 : 1,
                        }}
                        onMouseEnter={(e) => {
                          if (!signingOut)
                            (e.currentTarget as HTMLButtonElement).style.background =
                              "var(--color-error-bg)";
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLButtonElement).style.background =
                            "";
                        }}
                      >
                        {signingOut ? (
                          <span className="spinner" style={{ borderTopColor: "var(--color-error)", borderColor: "rgba(239,68,68,0.3)" }} />
                        ) : (
                          /* Log-out icon */
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                        )}
                        {signingOut ? "Signing out…" : "Sign Out"}
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* ── Mobile hamburger ─────────────────────────────────────────── */}
        <button
          id="mobile-menu-toggle"
          className="mobile-only"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          style={{
            display: "none",
            background: "transparent",
            border: "1.5px solid var(--color-border)",
            borderRadius: "0.5rem",
            padding: "0.375rem",
            cursor: "pointer",
            color: "var(--color-text)",
          }}
        >
          {menuOpen ? (
            /* X icon */
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          ) : (
            /* Hamburger */
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
          )}
        </button>
      </div>

      {/* ── Mobile menu ──────────────────────────────────────────────────── */}
      {menuOpen && (
        <div
          id="mobile-menu"
          className="mobile-menu-open"
          style={{
            position: "absolute",
            top: "var(--navbar-h)",
            left: 0,
            right: 0,
            background: "var(--color-surface)",
            borderBottom: "1px solid var(--color-border)",
            boxShadow: "var(--shadow-lg)",
            padding: "1rem 1.5rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
          }}
        >
          <Link
            href="/"
            onClick={() => setMenuOpen(false)}
            style={{
              padding: "0.75rem",
              borderRadius: "0.5rem",
              fontSize: "1rem",
              fontWeight: 500,
              color: "var(--color-text)",
              textDecoration: "none",
              display: "block",
            }}
          >
            Home
          </Link>

          {!isPending && !user && (
            <>
              <Link
                href="/sign-in"
                onClick={() => setMenuOpen(false)}
                style={{
                  padding: "0.75rem",
                  borderRadius: "0.5rem",
                  fontSize: "1rem",
                  fontWeight: 500,
                  color: "var(--color-text)",
                  textDecoration: "none",
                  display: "block",
                }}
              >
                Sign In
              </Link>
              <Link
                href="/sign-up"
                onClick={() => setMenuOpen(false)}
                style={{
                  padding: "0.75rem 1rem",
                  borderRadius: "0.5rem",
                  fontSize: "1rem",
                  fontWeight: 600,
                  color: "#fff",
                  textDecoration: "none",
                  background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                  display: "block",
                  textAlign: "center",
                }}
              >
                Sign Up
              </Link>
            </>
          )}

          {!isPending && user && (
            <>
              <div
                style={{
                  padding: "0.75rem",
                  borderRadius: "0.5rem",
                  background: "var(--color-surface-2)",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                }}
              >
                <UserAvatar name={user.name} image={user.image} />
                <div>
                  <p style={{ margin: 0, fontWeight: 600, fontSize: "0.9rem" }}>{user.name}</p>
                  <p style={{ margin: 0, fontSize: "0.8rem", color: "var(--color-text-muted)" }}>{user.email}</p>
                </div>
              </div>

              <button
                onClick={() => {
                  setMenuOpen(false);
                  handleSignOut();
                }}
                disabled={signingOut}
                style={{
                  padding: "0.75rem",
                  borderRadius: "0.5rem",
                  fontSize: "1rem",
                  fontWeight: 500,
                  color: "var(--color-error)",
                  background: "var(--color-error-bg)",
                  border: "none",
                  cursor: "pointer",
                  width: "100%",
                  textAlign: "left",
                }}
              >
                {signingOut ? "Signing out…" : "Sign Out"}
              </button>
            </>
          )}
        </div>
      )}

      {/* Responsive style — inline since we can't use a separate CSS file here */}
      <style>{`
        @media (max-width: 640px) {
          .desktop-nav { display: none !important; }
          .mobile-only { display: flex !important; }
        }
      `}</style>
    </nav>
  );
}
