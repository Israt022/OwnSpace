"use client";

import { useState, useEffect, useCallback } from "react";
import DashboardSidebar from "./DashboardSidebar";
import DashboardHeader from "./DashboardHeader";
import DashboardMobileDrawer from "./DashboardMobileDrawer";
import { SessionUser } from "@/lib/session";

interface DashboardShellProps {
  user: SessionUser;
  role: "USER" | "ADMIN";
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}

export default function DashboardShell({
  user,
  role,
  title,
  subtitle,
  actions,
  children,
}: DashboardShellProps) {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleCollapse = useCallback(() => {
    setIsCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("ownspace_sidebar_collapsed", String(next));
      } catch {
        // ignore storage errors
      }
      return next;
    });
  }, []);

  useEffect(() => {
    queueMicrotask(() => {
      try {
        const saved = localStorage.getItem("ownspace_sidebar_collapsed");
        if (saved !== null) {
          setIsCollapsed(saved === "true");
        }
      } catch {
        // ignore storage errors
      }
    });

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "b") {
        const target = e.target as HTMLElement | null;
        const isEditing =
          target?.tagName === "INPUT" ||
          target?.tagName === "TEXTAREA" ||
          target?.isContentEditable;
        if (!isEditing) {
          e.preventDefault();
          toggleCollapse();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleCollapse]);

  return (
    <div
      style={{
        display: "flex",
        height: "100dvh",
        overflow: "hidden",
        background: "var(--background)",
        position: "relative",
      }}
    >
      {/* Desktop Sidebar */}
      <div
        className="desktop-sidebar-container"
        style={{
          height: "100%",
          overflowY: "auto",
          overflowX: "hidden",
          flexShrink: 0,
          width: isCollapsed ? "72px" : "250px",
          minWidth: isCollapsed ? "72px" : "250px",
          maxWidth: isCollapsed ? "72px" : "250px",
          transition: "width 0.25s cubic-bezier(0.4, 0, 0.2, 1), min-width 0.25s cubic-bezier(0.4, 0, 0.2, 1), max-width 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
          position: "relative",
        }}
      >
        <DashboardSidebar
          user={user}
          role={role}
          isCollapsed={isCollapsed}
          onToggleCollapse={toggleCollapse}
        />
      </div>

      {/* Mobile Drawer */}
      <DashboardMobileDrawer
        isOpen={mobileDrawerOpen}
        onClose={() => setMobileDrawerOpen(false)}
        user={user}
        role={role}
      />

      {/* Main Content Area */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
          minHeight: 0,
          overflow: "hidden",
        }}
      >
        <DashboardHeader
          user={user}
          title={title}
          subtitle={subtitle}
          onMobileMenuToggle={() => setMobileDrawerOpen(true)}
          isSidebarCollapsed={isCollapsed}
          onDesktopSidebarToggle={toggleCollapse}
          actions={actions}
        />

        {/* Scroll wrapper — fills remaining height, scrolls vertically */}
        <div
          style={{
            flex: 1,
            minHeight: 0,
            overflowY: "auto",
            overflowX: "hidden",
          }}
        >
          <main
            style={{
              maxWidth: "1280px",
              width: "100%",
              margin: "0 auto",
              padding: "1.75rem 1.5rem",
              boxSizing: "border-box",
            }}
          >
            {children}
          </main>
        </div>
      </div>

      <style>{`
        .desktop-sidebar-container {
          display: block;
        }
        @media (min-width: 769px) {
          .desktop-only {
            display: inline-flex !important;
          }
        }
        @media (max-width: 768px) {
          .desktop-sidebar-container {
            display: none !important;
          }
          .mobile-only {
            display: inline-flex !important;
          }
        }
        @keyframes slide-right {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
        .nav-item-link .nav-tooltip {
          opacity: 0;
          visibility: hidden;
          transform: translateY(-50%) translateX(6px);
          transition: opacity 0.15s ease, transform 0.15s ease, visibility 0.15s ease;
        }
        .nav-item-link:hover .nav-tooltip {
          opacity: 1;
          visibility: visible;
          transform: translateY(-50%) translateX(0);
        }
      `}</style>
    </div>
  );
}
