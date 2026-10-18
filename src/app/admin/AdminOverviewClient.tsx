"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Users, Activity, ShieldCheck, ArrowRight, RefreshCw } from "lucide-react";
import DashboardShell from "@/components/dashboard/shared/DashboardShell";
import AdminStatsGrid from "@/components/dashboard/admin/AdminStatsGrid";
import { AdminStats } from "@server/services/admin.service";
import { SessionUser } from "@/lib/session";

interface AdminOverviewClientProps {
  user: SessionUser;
}

export default function AdminOverviewClient({ user }: AdminOverviewClientProps) {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/admin/stats");
      if (res.ok) {
        const data = await res.json();
        if (data.success) setStats(data.data);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <DashboardShell
      user={user}
      role="ADMIN"
      title="Platform Overview"
      subtitle="System health, registered users, and task metrics."
      actions={
        <button
          onClick={fetchStats}
          className="hero-btn-secondary"
          style={{ padding: "0.55rem 1rem", fontSize: "0.8125rem", display: "inline-flex", alignItems: "center", gap: "0.35rem" }}
        >
          <RefreshCw size={14} /> Refresh
        </button>
      }
    >
      <AdminStatsGrid stats={stats} />

      {/* Quick Navigation Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.25rem" }}>
        <div className="glass-card" style={{ padding: "1.5rem", borderRadius: "1rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.5rem" }}>
            <Users size={18} style={{ color: "var(--color-brand-500)" }} />
            <h3 style={{ margin: 0, fontSize: "1.125rem", fontWeight: 700, color: "var(--foreground)" }}>
              User Directory & Role Administration
            </h3>
          </div>
          <p style={{ margin: "0 0 1.25rem", fontSize: "0.8125rem", color: "var(--muted-foreground)" }}>
            Inspect registered user profiles, view completion rates, and manage roles.
          </p>
          <Link
            href="/admin/users"
            className="hero-btn-primary"
            style={{ padding: "0.5rem 1.15rem", fontSize: "0.8125rem", textDecoration: "none" }}
          >
            Manage Users <ArrowRight size={14} />
          </Link>
        </div>

        <div className="glass-card" style={{ padding: "1.5rem", borderRadius: "1rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.5rem" }}>
            <Activity size={18} style={{ color: "#6366f1" }} />
            <h3 style={{ margin: 0, fontSize: "1.125rem", fontWeight: 700, color: "var(--foreground)" }}>
              System Activity Log
            </h3>
          </div>
          <p style={{ margin: "0 0 1.25rem", fontSize: "0.8125rem", color: "var(--muted-foreground)" }}>
            View live task creations and completions across all users on the platform.
          </p>
          <Link
            href="/admin/activities"
            className="hero-btn-primary"
            style={{ padding: "0.5rem 1.15rem", fontSize: "0.8125rem", textDecoration: "none" }}
          >
            View Activity Feed <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </DashboardShell>
  );
}
