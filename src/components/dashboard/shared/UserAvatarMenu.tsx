"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Settings, LogOut, Shield } from "lucide-react";
import { signOut } from "@/lib/auth-client";
import { SessionUser } from "@/lib/session";

interface UserAvatarMenuProps {
  user: SessionUser;
}

export default function UserAvatarMenu({ user }: UserAvatarMenuProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  const isAdmin = user.role === "ADMIN";
  const initials = user.name
    ? user.name.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase()
    : "U";

  const handleSignOut = async () => {
    setSigningOut(true);
    try {
      await signOut();
      router.push("/");
      router.refresh();
    } finally {
      setSigningOut(false);
      setOpen(false);
    }
  };

  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.6rem",
          background: "transparent",
          border: "1px solid var(--border)",
          padding: "0.25rem 0.5rem",
          borderRadius: "2rem",
          cursor: "pointer",
        }}
        aria-label="User profile menu"
      >
        {user.image ? (
          <Image
            src={user.image}
            alt={user.name}
            width={30}
            height={30}
            style={{ borderRadius: "50%", objectFit: "cover" }}
          />
        ) : (
          <div
            style={{
              width: "30px",
              height: "30px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "0.75rem",
              fontWeight: 700,
            }}
          >
            {initials}
          </div>
        )}
        <span
          style={{
            fontSize: "0.875rem",
            fontWeight: 600,
            color: "var(--foreground)",
            maxWidth: "100px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {user.name.split(" ")[0]}
        </span>
      </button>

      {open && (
        <>
          <div
            style={{ position: "fixed", inset: 0, zIndex: 40 }}
            onClick={() => setOpen(false)}
          />
          <div
            className="glass-card animate-in"
            style={{
              position: "absolute",
              right: 0,
              top: "calc(100% + 0.5rem)",
              zIndex: 50,
              width: "220px",
              borderRadius: "0.875rem",
              padding: "0.5rem",
              boxShadow: "var(--shadow-xl)",
            }}
          >
            <div style={{ padding: "0.5rem 0.75rem", borderBottom: "1px solid var(--border)" }}>
              <p style={{ margin: 0, fontSize: "0.875rem", fontWeight: 600, color: "var(--foreground)" }}>
                {user.name}
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginTop: "0.2rem" }}>
                {isAdmin ? (
                  <span style={{ fontSize: "0.7rem", color: "var(--color-brand-500)", fontWeight: 700 }}>
                    ADMIN
                  </span>
                ) : (
                  <span style={{ fontSize: "0.7rem", color: "var(--muted-foreground)" }}>
                    USER
                  </span>
                )}
                <span style={{ fontSize: "0.75rem", color: "var(--muted-foreground)" }}>•</span>
                <span style={{ fontSize: "0.75rem", color: "var(--muted-foreground)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {user.email}
                </span>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.2rem", paddingTop: "0.4rem" }}>
              <Link
                href={isAdmin ? "/" : "/"}
                onClick={() => setOpen(false)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.5rem 0.75rem",
                  borderRadius: "0.5rem",
                  fontSize: "0.8125rem",
                  color: "var(--foreground)",
                  textDecoration: "none",
                }}
              >
                <User size={15} />
                Home
              </Link>
              <Link
                href={isAdmin ? "/admin/profile" : "/dashboard/profile"}
                onClick={() => setOpen(false)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.5rem 0.75rem",
                  borderRadius: "0.5rem",
                  fontSize: "0.8125rem",
                  color: "var(--foreground)",
                  textDecoration: "none",
                }}
              >
                <User size={15} />
                Profile
              </Link>

              <Link
                href={isAdmin ? "/admin/settings" : "/dashboard/settings"}
                onClick={() => setOpen(false)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.5rem 0.75rem",
                  borderRadius: "0.5rem",
                  fontSize: "0.8125rem",
                  color: "var(--foreground)",
                  textDecoration: "none",
                }}
              >
                <Settings size={15} />
                Settings
              </Link>

              {isAdmin && (
                <Link
                  href="/dashboard?view=user"
                  onClick={() => setOpen(false)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    padding: "0.5rem 0.75rem",
                    borderRadius: "0.5rem",
                    fontSize: "0.8125rem",
                    color: "var(--color-brand-500)",
                    textDecoration: "none",
                  }}
                >
                  <Shield size={15} />
                  Personal Tasks
                </Link>
              )}

              <button
                onClick={handleSignOut}
                disabled={signingOut}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.5rem 0.75rem",
                  borderRadius: "0.5rem",
                  fontSize: "0.8125rem",
                  color: "var(--color-error)",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  textAlign: "left",
                  width: "100%",
                }}
              >
                <LogOut size={15} />
                {signingOut ? "Signing out…" : "Sign Out"}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
