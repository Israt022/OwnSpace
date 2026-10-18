"use client";

import { useState, useEffect, ChangeEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Users,
  ShieldCheck,
  CheckCircle,
  Clock,
  Search,
  Filter,
  UserCheck,
  Shield,
  Activity,
  ArrowUpRight,
  TrendingUp,
  AlertTriangle,
  RefreshCw,
  ListTodo,
} from "lucide-react";
import { AdminStats, AdminUserItem } from "@server/services/admin.service";
import { SessionUser } from "@/lib/session";

interface AdminDashboardProps {
  adminUser: SessionUser;
}

export default function AdminDashboard({ adminUser }: AdminDashboardProps) {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<AdminUserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Filters
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("ALL");
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);

  const fetchAdminData = async () => {
    try {
      const [statsRes, usersRes] = await Promise.all([
        fetch("/api/admin/stats"),
        fetch(`/api/admin/users?role=${roleFilter === "ALL" ? "" : roleFilter}&search=${encodeURIComponent(search)}`),
      ]);

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        if (statsData.success) setStats(statsData.data);
      }

      if (usersRes.ok) {
        const usersData = await usersRes.json();
        if (usersData.success) setUsers(usersData.data);
      }
    } catch (err) {
      console.error("Failed to load admin data:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, [roleFilter, search]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchAdminData();
  };

  const handleRoleChange = async (userId: string, currentRole: string) => {
    const newRole = currentRole === "ADMIN" ? "USER" : "ADMIN";
    const confirmMsg =
      newRole === "ADMIN"
        ? "Are you sure you want to promote this user to ADMIN?"
        : "Are you sure you want to demote this user to USER?";

    if (!confirm(confirmMsg)) return;

    setUpdatingUserId(userId);
    try {
      const res = await fetch(`/api/admin/users/${userId}/role`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });

      if (res.ok) {
        // Optimistically update
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
        );
        // Refresh full stats
        fetchAdminData();
      } else {
        alert("Failed to update user role");
      }
    } catch (err) {
      console.error("Error updating role:", err);
      alert("Error updating user role");
    } finally {
      setUpdatingUserId(null);
    }
  };

  return (
    <div className="dashboard-container animate-in">
      {/* ── Top Header Bar ────────────────────────────────────────────── */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: "1.5rem",
          flexWrap: "wrap",
          marginBottom: "2rem",
        }}
      >
        <div>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.25rem 0.75rem",
              borderRadius: "2rem",
              background: "rgba(99, 102, 241, 0.12)",
              color: "var(--color-brand-500)",
              fontSize: "0.75rem",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              marginBottom: "0.5rem",
            }}
          >
            <ShieldCheck size={14} />
            <span>Administrator Control Center</span>
          </div>
          <h1
            style={{
              fontSize: "clamp(1.75rem, 3.5vw, 2.25rem)",
              fontWeight: 800,
              color: "var(--foreground)",
              letterSpacing: "-0.025em",
              margin: "0 0 0.35rem",
            }}
          >
            Platform Overview & Users
          </h1>
          <p style={{ color: "var(--muted-foreground)", fontSize: "0.9375rem", margin: 0 }}>
            Logged in as {adminUser.name} ({adminUser.email}) • System operational
          </p>
        </div>

        {/* Quick Links & Actions */}
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "center", flexWrap: "wrap" }}>
          <button
            onClick={handleRefresh}
            className="hero-btn-secondary"
            style={{
              padding: "0.6rem 1rem",
              fontSize: "0.875rem",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
            }}
            disabled={refreshing}
          >
            <RefreshCw size={15} className={refreshing ? "spinner" : ""} />
            Refresh
          </button>

          <Link
            href="/dashboard?view=user"
            id="admin-to-tasks-btn"
            className="hero-btn-primary"
            style={{
              padding: "0.6rem 1.25rem",
              fontSize: "0.875rem",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
              textDecoration: "none",
            }}
          >
            <ListTodo size={16} />
            My Personal Tasks
          </Link>
        </div>
      </div>

      {/* ── Metric Cards ──────────────────────────────────────────────── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "1.25rem",
          marginBottom: "2.5rem",
        }}
      >
        {/* Total Users */}
        <div className="stat-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
            <span style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--muted-foreground)" }}>
              Total Registered Users
            </span>
            <Users size={18} style={{ color: "var(--color-brand-500)" }} />
          </div>
          <div style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--foreground)" }}>
            {stats?.totalUsers ?? 0}
          </div>
          <span style={{ fontSize: "0.75rem", color: "var(--muted-foreground)" }}>
            {stats?.totalAdmins ?? 0} Admins • {stats?.totalRegularUsers ?? 0} Regular Users
          </span>
        </div>

        {/* Total Tasks Across System */}
        <div className="stat-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
            <span style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--muted-foreground)" }}>
              System-wide Tasks
            </span>
            <Activity size={18} style={{ color: "#6366f1" }} />
          </div>
          <div style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--foreground)" }}>
            {stats?.totalTasks ?? 0}
          </div>
          <span style={{ fontSize: "0.75rem", color: "var(--muted-foreground)" }}>
            {stats?.recentTasksCount ?? 0} created in last 24h
          </span>
        </div>

        {/* Global Completion Rate */}
        <div className="stat-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
            <span style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--muted-foreground)" }}>
              Global Completion Rate
            </span>
            <TrendingUp size={18} style={{ color: "#22c55e" }} />
          </div>
          <div style={{ fontSize: "1.75rem", fontWeight: 800, color: "#22c55e" }}>
            {stats?.systemCompletionRate ?? 0}%
          </div>
          <div
            style={{
              width: "100%",
              height: "6px",
              background: "var(--muted)",
              borderRadius: "4px",
              overflow: "hidden",
              marginTop: "0.5rem",
            }}
          >
            <div
              style={{
                width: `${stats?.systemCompletionRate ?? 0}%`,
                height: "100%",
                background: "#22c55e",
                borderRadius: "4px",
              }}
            />
          </div>
        </div>

        {/* Urgent Focus Across System */}
        <div className="stat-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
            <span style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--muted-foreground)" }}>
              Urgent Tasks Pending
            </span>
            <AlertTriangle size={18} style={{ color: "#ef4444" }} />
          </div>
          <div style={{ fontSize: "1.75rem", fontWeight: 800, color: "#ef4444" }}>
            {stats?.urgentTasksCount ?? 0}
          </div>
          <span style={{ fontSize: "0.75rem", color: "var(--muted-foreground)" }}>
            High & urgent priority tasks
          </span>
        </div>
      </div>

      {/* ── User Management Section ───────────────────────────────────── */}
      <div
        className="glass-card"
        style={{
          borderRadius: "1rem",
          padding: "1.75rem",
          border: "1px solid var(--border)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "1rem",
            marginBottom: "1.5rem",
          }}
        >
          <div>
            <h2 style={{ fontSize: "1.25rem", fontWeight: 700, margin: "0 0 0.25rem", color: "var(--foreground)" }}>
              User Directory & Role Control
            </h2>
            <p style={{ color: "var(--muted-foreground)", fontSize: "0.875rem", margin: 0 }}>
              Inspect registered accounts, their productivity metrics, and manage system roles.
            </p>
          </div>

          {/* Search & Role Filter */}
          <div style={{ display: "flex", gap: "0.75rem", alignItems: "center", flexWrap: "wrap" }}>
            <div style={{ position: "relative", minWidth: "220px" }}>
              <Search
                size={16}
                style={{
                  position: "absolute",
                  left: "0.85rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "var(--muted-foreground)",
                }}
              />
              <input
                type="text"
                placeholder="Search user name/email..."
                value={search}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
                className="input-field"
                style={{
                  paddingLeft: "2.35rem",
                  fontSize: "0.875rem",
                  height: "2.35rem",
                }}
              />
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <Filter size={15} style={{ color: "var(--muted-foreground)" }} />
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="input-field"
                style={{ fontSize: "0.8125rem", padding: "0.25rem 0.75rem", height: "2.35rem", width: "auto" }}
              >
                <option value="ALL">All Roles</option>
                <option value="USER">Users</option>
                <option value="ADMIN">Admins</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table View */}
        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              textAlign: "left",
              fontSize: "0.875rem",
            }}
          >
            <thead>
              <tr
                style={{
                  borderBottom: "1px solid var(--border)",
                  color: "var(--muted-foreground)",
                  fontSize: "0.75rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                <th style={{ padding: "0.75rem 1rem" }}>User</th>
                <th style={{ padding: "0.75rem 1rem" }}>Role</th>
                <th style={{ padding: "0.75rem 1rem" }}>Tasks</th>
                <th style={{ padding: "0.75rem 1rem" }}>Completion</th>
                <th style={{ padding: "0.75rem 1rem" }}>Joined</th>
                <th style={{ padding: "0.75rem 1rem", textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} style={{ padding: "3rem", textAlign: "center", color: "var(--muted-foreground)" }}>
                    <div className="spinner" style={{ margin: "0 auto 0.75rem" }} />
                    Loading user directory…
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: "2.5rem", textAlign: "center", color: "var(--muted-foreground)" }}>
                    No users found matching your search.
                  </td>
                </tr>
              ) : (
                users.map((u) => {
                  const rate = u.totalTasks > 0 ? Math.round((u.completedTasks / u.totalTasks) * 100) : 0;
                  const isCurrentAdmin = u.id === adminUser.id;

                  return (
                    <tr
                      key={u.id}
                      style={{
                        borderBottom: "1px solid var(--border)",
                        transition: "background-color 0.15s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "var(--muted)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "";
                      }}
                    >
                      {/* User Info */}
                      <td style={{ padding: "0.85rem 1rem" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                          {u.image ? (
                            <Image
                              src={u.image}
                              alt={u.name}
                              width={34}
                              height={34}
                              style={{ borderRadius: "50%", objectFit: "cover" }}
                            />
                          ) : (
                            <div
                              style={{
                                width: "34px",
                                height: "34px",
                                borderRadius: "50%",
                                background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                                color: "#fff",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontWeight: 600,
                                fontSize: "0.8125rem",
                              }}
                            >
                              {u.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <div>
                            <div style={{ fontWeight: 600, color: "var(--foreground)" }}>
                              {u.name} {isCurrentAdmin && <span style={{ fontSize: "0.7rem", color: "var(--color-brand-500)" }}>(You)</span>}
                            </div>
                            <div style={{ fontSize: "0.75rem", color: "var(--muted-foreground)" }}>
                              {u.email}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Role Badge */}
                      <td style={{ padding: "0.85rem 1rem" }}>
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.3rem",
                            fontSize: "0.75rem",
                            fontWeight: 700,
                            padding: "0.2rem 0.6rem",
                            borderRadius: "1rem",
                            background:
                              u.role === "ADMIN" ? "rgba(99, 102, 241, 0.15)" : "var(--muted)",
                            color:
                              u.role === "ADMIN" ? "var(--color-brand-500)" : "var(--muted-foreground)",
                            border: `1px solid ${
                              u.role === "ADMIN" ? "rgba(99, 102, 241, 0.3)" : "var(--border)"
                            }`,
                          }}
                        >
                          {u.role === "ADMIN" ? <Shield size={12} /> : <Users size={12} />}
                          {u.role}
                        </span>
                      </td>

                      {/* Tasks count */}
                      <td style={{ padding: "0.85rem 1rem", color: "var(--foreground)", fontWeight: 500 }}>
                        {u.totalTasks} tasks
                      </td>

                      {/* Completion rate */}
                      <td style={{ padding: "0.85rem 1rem" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                          <span style={{ fontWeight: 600, color: "var(--foreground)" }}>{rate}%</span>
                          <div
                            style={{
                              width: "50px",
                              height: "5px",
                              background: "var(--border)",
                              borderRadius: "3px",
                              overflow: "hidden",
                            }}
                          >
                            <div
                              style={{
                                width: `${rate}%`,
                                height: "100%",
                                background: rate > 60 ? "#22c55e" : "#6366f1",
                              }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* Joined Date */}
                      <td style={{ padding: "0.85rem 1rem", color: "var(--muted-foreground)", fontSize: "0.8125rem" }}>
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>

                      {/* Role Toggle Action */}
                      <td style={{ padding: "0.85rem 1rem", textAlign: "right" }}>
                        {isCurrentAdmin ? (
                          <span style={{ fontSize: "0.75rem", color: "var(--muted-foreground)", fontStyle: "italic" }}>
                            Current Admin
                          </span>
                        ) : (
                          <button
                            onClick={() => handleRoleChange(u.id, u.role)}
                            disabled={updatingUserId === u.id}
                            style={{
                              padding: "0.35rem 0.75rem",
                              borderRadius: "0.5rem",
                              fontSize: "0.75rem",
                              fontWeight: 600,
                              cursor: "pointer",
                              border: "1px solid var(--border)",
                              background:
                                u.role === "ADMIN" ? "rgba(239, 68, 68, 0.1)" : "var(--muted)",
                              color: u.role === "ADMIN" ? "#ef4444" : "var(--foreground)",
                              transition: "all 0.15s ease",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.borderColor =
                                u.role === "ADMIN" ? "#ef4444" : "var(--color-brand-500)";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.borderColor = "var(--border)";
                            }}
                          >
                            {updatingUserId === u.id
                              ? "Updating…"
                              : u.role === "ADMIN"
                              ? "Demote to User"
                              : "Promote to Admin"}
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
