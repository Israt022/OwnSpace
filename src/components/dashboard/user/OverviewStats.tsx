"use client";

import { CheckCircle2, ListTodo, Clock, AlertTriangle, TrendingUp } from "lucide-react";
import StatCard from "../shared/StatCard";
import { DailyTaskStats } from "@server/types";

interface OverviewStatsProps {
  stats: DailyTaskStats | null;
}

export default function OverviewStats({ stats }: OverviewStatsProps) {
  const completionRate = stats?.completionRate ?? 0;
  const total = stats?.total ?? 0;
  const completed = stats?.completed ?? 0;
  const pending = stats?.pending ?? 0;
  const urgent = stats?.urgentOrHigh ?? 0;

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
        gap: "1.25rem",
        marginBottom: "2rem",
      }}
    >
      <StatCard
        label="Completion Rate"
        value={`${completionRate}%`}
        icon={TrendingUp}
        iconColor="#22c55e"
        progressPercent={completionRate}
        subtitle="Keep up the daily momentum"
      />

      <StatCard
        label="Total Tasks"
        value={total}
        icon={ListTodo}
        iconColor="var(--color-brand-500)"
        subtitle="Across all lists and tags"
      />

      <StatCard
        label="Completed"
        value={completed}
        icon={CheckCircle2}
        iconColor="#22c55e"
        subtitle="Tasks accomplished"
      />

      <StatCard
        label="Pending Tasks"
        value={pending}
        icon={Clock}
        iconColor="#f59e0b"
        subtitle={`${urgent} high priority`}
      />
    </div>
  );
}
