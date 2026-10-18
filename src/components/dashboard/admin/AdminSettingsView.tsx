"use client";

import { Database, ShieldCheck, Key, Server, Lock, ExternalLink } from "lucide-react";
import { SessionUser } from "@/lib/session";

interface AdminSettingsViewProps {
  adminUser: SessionUser;
}

export default function AdminSettingsView({ adminUser }: AdminSettingsViewProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", maxWidth: "720px" }}>
      {/* Infrastructure & Database Health */}
      <div className="glass-card" style={{ padding: "1.75rem", borderRadius: "1rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
          <Database size={18} style={{ color: "var(--color-brand-500)" }} />
          <h3 style={{ margin: 0, fontSize: "1.125rem", fontWeight: 700, color: "var(--foreground)" }}>
            Database & Infrastructure
          </h3>
        </div>
        <p style={{ margin: "0 0 1.25rem", fontSize: "0.8125rem", color: "var(--muted-foreground)" }}>
          Connected PostgreSQL instance powered by Supabase with Prisma ORM 7.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "0.75rem 1rem", borderRadius: "0.5rem", background: "var(--muted)", border: "1px solid var(--border)", fontSize: "0.875rem" }}>
            <span style={{ fontWeight: 600, color: "var(--foreground)" }}>Database Status</span>
            <span style={{ color: "#22c55e", fontWeight: 600, display: "flex", alignItems: "center", gap: "0.35rem" }}>
              <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#22c55e", display: "inline-block" }} />
              Active & Connected
            </span>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", padding: "0.75rem 1rem", borderRadius: "0.5rem", background: "var(--muted)", border: "1px solid var(--border)", fontSize: "0.875rem" }}>
            <span style={{ fontWeight: 600, color: "var(--foreground)" }}>Connection Pooler</span>
            <span style={{ color: "var(--muted-foreground)" }}>PgBouncer AWS AP-Northeast-1</span>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", padding: "0.75rem 1rem", borderRadius: "0.5rem", background: "var(--muted)", border: "1px solid var(--border)", fontSize: "0.875rem" }}>
            <span style={{ fontWeight: 600, color: "var(--foreground)" }}>Prisma Client Engine</span>
            <span style={{ color: "var(--muted-foreground)" }}>Prisma 7 with pg adapter</span>
          </div>
        </div>
      </div>

      {/* Authentication & Security */}
      <div className="glass-card" style={{ padding: "1.75rem", borderRadius: "1rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
          <Lock size={18} style={{ color: "var(--color-brand-500)" }} />
          <h3 style={{ margin: 0, fontSize: "1.125rem", fontWeight: 700, color: "var(--foreground)" }}>
            Authentication & Security Policies
          </h3>
        </div>
        <p style={{ margin: "0 0 1.25rem", fontSize: "0.8125rem", color: "var(--muted-foreground)" }}>
          Session parameters, Better Auth configuration, and administrative privileges.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "0.75rem 1rem", borderRadius: "0.5rem", background: "var(--muted)", border: "1px solid var(--border)", fontSize: "0.875rem" }}>
            <span style={{ fontWeight: 600, color: "var(--foreground)" }}>Auth Framework</span>
            <span style={{ color: "var(--muted-foreground)" }}>Better Auth 1.7</span>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", padding: "0.75rem 1rem", borderRadius: "0.5rem", background: "var(--muted)", border: "1px solid var(--border)", fontSize: "0.875rem" }}>
            <span style={{ fontWeight: 600, color: "var(--foreground)" }}>OAuth Provider</span>
            <span style={{ color: "var(--muted-foreground)" }}>Google OAuth Enabled</span>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", padding: "0.75rem 1rem", borderRadius: "0.5rem", background: "var(--muted)", border: "1px solid var(--border)", fontSize: "0.875rem" }}>
            <span style={{ fontWeight: 600, color: "var(--foreground)" }}>Server Authorization Guard</span>
            <span style={{ color: "var(--muted-foreground)" }}>Strict Role-Based Middleware</span>
          </div>
        </div>
      </div>
    </div>
  );
}
