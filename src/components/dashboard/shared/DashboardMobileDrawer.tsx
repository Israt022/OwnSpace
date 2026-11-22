"use client";

import DashboardSidebar from "./DashboardSidebar";
import { SessionUser } from "@/lib/session";

interface DashboardMobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  user: SessionUser;
  role: "USER" | "ADMIN";
}

export default function DashboardMobileDrawer({
  isOpen,
  onClose,
  user,
  role,
}: DashboardMobileDrawerProps) {
  if (!isOpen) return null;

  return (
    <>
      <div
        style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          backdropFilter: "blur(2px)",
          zIndex: 90,
        }}
        onClick={onClose}
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
          isCollapsed={false}
          onNavClick={onClose}
        />
      </div>
    </>
  );
}
