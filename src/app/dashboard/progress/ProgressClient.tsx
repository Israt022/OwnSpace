"use client";

import { useState, useEffect } from "react";
import DashboardShell from "@/components/dashboard/shared/DashboardShell";
import ProgressAnalytics from "@/components/dashboard/user/ProgressAnalytics";
import { DailyTaskStats, TaskResponse } from "@server/types";
import { SessionUser } from "@/lib/session";

interface ProgressClientProps {
  user: SessionUser;
}

export default function ProgressClient({ user }: ProgressClientProps) {
  const [stats, setStats] = useState<DailyTaskStats | null>(null);
  const [tasks, setTasks] = useState<TaskResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const [statsRes, tasksRes] = await Promise.all([
          fetch("/api/tasks/stats"),
          fetch("/api/tasks"),
        ]);
        if (statsRes.ok) {
          const s = await statsRes.json();
          if (s.success) setStats(s.data);
        }
        if (tasksRes.ok) {
          const t = await tasksRes.json();
          if (t.success) setTasks(t.data);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  return (
    <DashboardShell
      user={user}
      role="USER"
      title="Productivity Progress"
      subtitle="Insights into your task execution consistency and category allocation."
    >
      {loading ? (
        <div style={{ padding: "4rem", textAlign: "center", color: "var(--muted-foreground)" }}>
          <div className="spinner" style={{ margin: "0 auto 1rem" }} />
          Calculating your analytics…
        </div>
      ) : (
        <ProgressAnalytics stats={stats} tasks={tasks} />
      )}
    </DashboardShell>
  );
}
