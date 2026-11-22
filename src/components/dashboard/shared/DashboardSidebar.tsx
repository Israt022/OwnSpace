"use client";

import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CheckSquare,
  Calendar,
  CalendarClock,
  TrendingUp,
  Sparkles,
  User,
  Settings,
  Users,
  Activity,
} from "lucide-react";
import SidebarNavItem from "./SidebarNavItem";
import SidebarHeader from "./SidebarHeader";
import SidebarRoleSwitcher from "./SidebarRoleSwitcher";
import { SessionUser } from "@/lib/session";

interface DashboardSidebarProps {
  user: SessionUser;
  role: "USER" | "ADMIN";
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  onNavClick?: () => void;
}

export default function DashboardSidebar({
  user,
  role,
  isCollapsed = false,
  onToggleCollapse,
  onNavClick,
}: DashboardSidebarProps) {
  const pathname = usePathname();

  const userNavItems = [
    { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { label: "My Space", href: "/dashboard/my-space", icon: Sparkles },
    { label: "Tasks", href: "/dashboard/tasks", icon: CheckSquare },
    { label: "Routine Planner", href: "/dashboard/routine", icon: CalendarClock },
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
        width: isCollapsed ? "72px" : "250px",
        minWidth: isCollapsed ? "72px" : "250px",
        maxWidth: isCollapsed ? "72px" : "250px",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: isCollapsed ? "1.25rem 0.5rem" : "1.25rem 1rem",
        borderRight: "1px solid var(--border)",
        background: "var(--card)",
        transition: "width 0.25s cubic-bezier(0.4, 0, 0.2, 1), padding 0.25s cubic-bezier(0.4, 0, 0.2, 1), min-width 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
        boxSizing: "border-box",
        overflow: "hidden",
      }}
    >
      <div>
        <SidebarHeader
          role={role}
          isCollapsed={isCollapsed}
          onToggleCollapse={onToggleCollapse}
        />

        {/* Navigation list */}
        <nav style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
          {navItems.map((item) => (
            <SidebarNavItem
              key={item.href}
              label={item.label}
              href={item.href}
              icon={item.icon}
              isActive={isItemActive(item.href)}
              isCollapsed={isCollapsed}
              onClick={onNavClick}
            />
          ))}
        </nav>
      </div>

      {/* Bottom Switcher Card for Admin */}
      {user.role === "ADMIN" && (
        <SidebarRoleSwitcher
          role={role}
          isCollapsed={isCollapsed}
          onNavClick={onNavClick}
        />
      )}
    </aside>
  );
}
