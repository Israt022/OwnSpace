"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  CheckSquare,
  Calendar,
  TrendingUp,
  Sparkles,
  User,
  Settings,
  Users,
  Activity,
  Shield,
  ArrowLeftRight,
} from "lucide-react";
import SidebarNavItem from "./SidebarNavItem";
import { SessionUser } from "@/lib/session";

interface DashboardSidebarProps {
  user: SessionUser;
  role: "USER" | "ADMIN";
  onNavClick?: () => void;
}

export default function DashboardSidebar({
  user,
  role,
  onNavClick,
}: DashboardSidebarProps) {
  const pathname = usePathname();

  const userNavItems = [
    { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { label: "My Space", href: "/dashboard/my-space", icon: Sparkles },
    { label: "Tasks", href: "/dashboard/tasks", icon: CheckSquare },
    { label: "Calendar", href: "/dashboard/calendar", icon: Calendar },
    { label: "Progress", href: "/dashboard/progress", icon: TrendingUp },
    { label: "Profile", href: "/dashboard/profile", icon: User },
    { label: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  const adminNavItems = [
    { label: "Overview", href: "/admin", icon: LayoutDashboard },
    { label: "Users", href: "/admin/users", icon: Users },
    { label: "Activities", href: "/admin/activities", icon: Activity },
    { label: "Profile", href: "/admin/profile", icon: User },
    { label: "Settings", href: "/admin/settings", icon: Settings },
  ];

  const navItems = role === "ADMIN" ? adminNavItems : userNavItems;

  const isItemActive = (href: string) => {
    if (href === "/dashboard" || href === "/admin") {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <aside
      style={{
        width: "250px",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "1.25rem 1rem",
        borderRight: "1px solid var(--border)",
        background: "var(--card)",
      }}
    >
      <div>
        {/* Workspace Title & Role Badge */}
        <div style={{ padding: "0 0.5rem 1.25rem", borderBottom: "1px solid var(--border)", marginBottom: "1rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: "0.875rem", fontWeight: 700, color: "var(--foreground)" }}>
              {role === "ADMIN" ? "Admin Workspace" : "Personal Workspace"}
            </span>
            <span
              style={{
                fontSize: "0.6875rem",
                fontWeight: 700,
                padding: "0.15rem 0.5rem",
                borderRadius: "1rem",
                background: role === "ADMIN" ? "rgba(99, 102, 241, 0.15)" : "var(--muted)",
                color: role === "ADMIN" ? "var(--color-brand-500)" : "var(--muted-foreground)",
                textTransform: "uppercase",
              }}
            >
              {role}
            </span>
          </div>
        </div>

        {/* Navigation list */}
        <nav style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
          {navItems.map((item) => (
            <SidebarNavItem
              key={item.href}
              label={item.label}
              href={item.href}
              icon={item.icon}
              isActive={isItemActive(item.href)}
              onClick={onNavClick}
            />
          ))}
        </nav>
      </div>

      {/* Bottom Switcher Card for Admin */}
      {user.role === "ADMIN" && (
        <div
          style={{
            padding: "0.875rem",
            borderRadius: "0.75rem",
            background: "var(--muted)",
            border: "1px solid var(--border)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
            <Shield size={16} style={{ color: "var(--color-brand-500)" }} />
            <span style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--foreground)" }}>
              Role Switcher
            </span>
          </div>
          <p style={{ margin: "0 0 0.75rem", fontSize: "0.75rem", color: "var(--muted-foreground)" }}>
            {role === "ADMIN"
              ? "Switch to manage your own personal tasks."
              : "Switch back to platform administration."}
          </p>
          <Link
            href={role === "ADMIN" ? "/dashboard?view=user" : "/admin"}
            onClick={onNavClick}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.4rem",
              padding: "0.45rem",
              borderRadius: "0.5rem",
              fontSize: "0.75rem",
              fontWeight: 600,
              color: "var(--primary-foreground)",
              background: "var(--primary)",
              textDecoration: "none",
            }}
          >
            <ArrowLeftRight size={13} />
            {role === "ADMIN" ? "Open My Tasks" : "Open Admin"}
          </Link>
        </div>
      )}
    </aside>
  );
}
