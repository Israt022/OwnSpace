"use client";

import { useState } from "react";
import DashboardSidebar from "./DashboardSidebar";
import DashboardHeader from "./DashboardHeader";
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
          flexShrink: 0,
        }}
      >
        <DashboardSidebar user={user} role={role} />
      </div>

      {/* Mobile Drawer Backdrop & Drawer */}
      {mobileDrawerOpen && (
        <>
          <div
            style={{
              position: "fixed",
              inset: 0,
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              backdropFilter: "blur(2px)",
              zIndex: 90,
            }}
            onClick={() => setMobileDrawerOpen(false)}
          />
          <div
            style={{
              position: "fixed",
              top: 0,
              bottom: 0,
              left: 0,
              zIndex: 100,
              width: "260px",
              background: "var(--card)",
              boxShadow: "var(--shadow-xl)",
              animation: "slide-right 0.25s ease both",
            }}
          >
            <DashboardSidebar
              user={user}
              role={role}
              onNavClick={() => setMobileDrawerOpen(false)}
            />
          </div>
        </>
      )}

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
          actions={actions}
        />

        <main
          style={{
            flex: 1,
            minHeight: 0,
            overflowY: "auto",
            padding: "1.75rem 1.5rem",
            maxWidth: "1280px",
            width: "100%",
            margin: "0 auto",
            boxSizing: "border-box",
          }}
        >
          {children}
        </main>
      </div>

      <style>{`
        .desktop-sidebar-container {
          display: block;
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
      `}</style>
    </div>
  );
}
