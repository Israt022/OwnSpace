"use client";

import Image from "next/image";
import { CheckCircle2, PlusCircle, Clock, Shield } from "lucide-react";
import { AdminActivityItem } from "@server/services/admin.service";

interface ActivityListProps {
  activities: AdminActivityItem[];
  loading: boolean;
}

export default function ActivityList({ activities, loading }: ActivityListProps) {
  if (loading) {
    return (
      <div style={{ padding: "4rem 2rem", textAlign: "center", color: "var(--muted-foreground)" }}>
        <div className="spinner" style={{ margin: "0 auto 1rem" }} />
        Loading system activities…
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="glass-card" style={{ padding: "3rem 2rem", textAlign: "center", borderRadius: "1rem" }}>
        <Clock size={32} style={{ color: "var(--muted-foreground)", margin: "0 auto 0.75rem" }} />
        <h3 style={{ margin: 0, fontSize: "1.125rem", fontWeight: 700, color: "var(--foreground)" }}>
          No recent activity recorded
        </h3>
        <p style={{ margin: "0.25rem 0 0", fontSize: "0.8125rem", color: "var(--muted-foreground)" }}>
          As users create and complete daily tasks, their activity logs will display here.
        </p>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
      {activities.map((act) => {
        const isCompleted = act.type === "TASK_COMPLETED";
        const dateFormatted = new Date(act.timestamp).toLocaleString();

        return (
          <div
            key={act.id + act.type}
            className="glass-card"
            style={{
              padding: "1rem 1.25rem",
              borderRadius: "0.875rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "1rem",
              flexWrap: "wrap",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.875rem" }}>
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  background: isCompleted ? "rgba(34, 197, 94, 0.12)" : "rgba(99, 102, 241, 0.12)",
                  color: isCompleted ? "#22c55e" : "#6366f1",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                {isCompleted ? <CheckCircle2 size={18} /> : <PlusCircle size={18} />}
              </div>

              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <span style={{ fontWeight: 600, fontSize: "0.9375rem", color: "var(--foreground)" }}>
                    {act.userName}
                  </span>
                  <span style={{ fontSize: "0.8125rem", color: "var(--muted-foreground)" }}>
                    {isCompleted ? "completed task" : "created task"}
                  </span>
                  <span style={{ fontWeight: 600, fontSize: "0.875rem", color: "var(--foreground)" }}>
                    &ldquo;{act.title}&rdquo;
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "0.25rem" }}>
                  <span className={`priority-badge priority-${act.priority.toLowerCase()}`}>
                    {act.priority}
                  </span>
                  <span style={{ fontSize: "0.75rem", color: "var(--muted-foreground)" }}>
                    in {act.category}
                  </span>
                </div>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "var(--muted-foreground)", fontSize: "0.75rem" }}>
              <Clock size={13} />
              <span>{dateFormatted}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
