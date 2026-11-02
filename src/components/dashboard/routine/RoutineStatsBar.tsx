"use client";

import { useMemo } from "react";
import { Clock, Calendar, CheckCircle, Zap } from "lucide-react";
import { RoutineResponse, RoutineStats } from "@server/types";
import { getCurrentDayOfWeek, getRoutineStatus } from "@/lib/constants/routine";

interface RoutineStatsBarProps {
  stats: RoutineStats | null;
  routines: RoutineResponse[];
}

export default function RoutineStatsBar({ stats, routines }: RoutineStatsBarProps) {
  const currentDay = useMemo(() => getCurrentDayOfWeek(), []);

  const activeRoutine = useMemo(() => {
    return routines.find((r) => getRoutineStatus(r.dayOfWeek, r.startTime, r.endTime) === "active");
  }, [routines]);

  const weeklyHours = useMemo(() => {
    const mins = stats?.totalWeeklyMinutes ?? 0;
    const hours = (mins / 60).toFixed(1);
    return hours.endsWith(".0") ? hours.slice(0, -2) : hours;
  }, [stats?.totalWeeklyMinutes]);

  const items = [
    {
      label: "Total Routines",
      value: stats?.total ?? routines.length,
      icon: Calendar,
      color: "#6366f1",
      bgColor: "rgba(99, 102, 241, 0.1)",
    },
    {
      label: "Today's Schedule",
      value: stats?.todayCount ?? routines.filter((r) => r.dayOfWeek === currentDay).length,
      icon: Clock,
      color: "#10b981",
      bgColor: "rgba(16, 185, 129, 0.1)",
    },
    {
      label: "Weekly Commitment",
      value: `${weeklyHours} hrs`,
      icon: CheckCircle,
      color: "#3b82f6",
      bgColor: "rgba(59, 130, 246, 0.1)",
    },
    {
      label: "Status Now",
      value: activeRoutine ? activeRoutine.title : "Free Time",
      icon: Zap,
      color: activeRoutine ? "#f59e0b" : "#8b5cf6",
      bgColor: activeRoutine ? "rgba(245, 158, 11, 0.1)" : "rgba(139, 92, 246, 0.1)",
      highlight: Boolean(activeRoutine),
    },
  ];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: "1rem",
        marginBottom: "1.5rem",
      }}
    >
      {items.map((item, idx) => {
        const Icon = item.icon;
        return (
          <div
            key={idx}
            className="glass-card"
            style={{
              padding: "1rem 1.25rem",
              borderRadius: "0.875rem",
              display: "flex",
              alignItems: "center",
              gap: "0.875rem",
            }}
          >
            <div
              style={{
                width: "42px",
                height: "42px",
                borderRadius: "0.75rem",
                backgroundColor: item.bgColor,
                color: item.color,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Icon size={20} />
            </div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <span style={{ fontSize: "0.75rem", color: "var(--muted-foreground)", display: "block" }}>
                {item.label}
              </span>
              <span
                style={{
                  fontSize: "1.125rem",
                  fontWeight: 700,
                  color: "var(--foreground)",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "block",
                }}
              >
                {item.value}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

