"use client";

import { useMemo } from "react";
import { TrendingUp, CheckCircle, Clock, Zap, Target } from "lucide-react";
import { DailyTaskStats, TaskResponse } from "@server/types";

interface ProgressAnalyticsProps {
  stats: DailyTaskStats | null;
  tasks: TaskResponse[];
}

export default function ProgressAnalytics({ stats, tasks }: ProgressAnalyticsProps) {
  const completionRate = stats?.completionRate ?? 0;
  const total = stats?.total ?? 0;
  const completed = stats?.completed ?? 0;
  const pending = stats?.pending ?? 0;

  // Category breakdown calculation
  const categoryStats = useMemo(() => {
    const counts: Record<string, { total: number; completed: number }> = {};
    tasks.forEach((t) => {
      const cat = t.category || "General";
      if (!counts[cat]) counts[cat] = { total: 0, completed: 0 };
      counts[cat].total += 1;
      if (t.completed) counts[cat].completed += 1;
    });

    return Object.entries(counts).map(([name, data]) => ({
      name,
      total: data.total,
      completed: data.completed,
      rate: data.total > 0 ? Math.round((data.completed / data.total) * 100) : 0,
    }));
  }, [tasks]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* Top Banner Metric */}
      <div
        className="glass-card"
        style={{
          padding: "1.75rem",
          borderRadius: "1rem",
          background: "linear-gradient(135deg, rgba(99, 102, 241, 0.08), rgba(139, 92, 246, 0.08))",
          border: "1px solid var(--color-brand-400)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--color-brand-500)", fontWeight: 700, fontSize: "0.8125rem", textTransform: "uppercase" }}>
              <Zap size={16} /> Productivity Performance Score
            </div>
            <h2 style={{ fontSize: "2rem", fontWeight: 800, margin: "0.4rem 0 0.2rem", color: "var(--foreground)" }}>
              {completionRate}% Overall Efficiency
            </h2>
            <p style={{ margin: 0, fontSize: "0.875rem", color: "var(--muted-foreground)" }}>
              {completed} of {total} scheduled tasks successfully executed.
            </p>
          </div>

          <div style={{ display: "flex", gap: "1.5rem" }}>
            <div style={{ textAlign: "center" }}>
              <span style={{ fontSize: "1.5rem", fontWeight: 800, color: "#22c55e" }}>{completed}</span>
              <p style={{ margin: 0, fontSize: "0.75rem", color: "var(--muted-foreground)" }}>Done</p>
            </div>
            <div style={{ textAlign: "center" }}>
              <span style={{ fontSize: "1.5rem", fontWeight: 800, color: "#f59e0b" }}>{pending}</span>
              <p style={{ margin: 0, fontSize: "0.75rem", color: "var(--muted-foreground)" }}>Pending</p>
            </div>
          </div>
        </div>
      </div>

      {/* Category Productivity Distribution */}
      <div className="glass-card" style={{ padding: "1.75rem", borderRadius: "1rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.25rem" }}>
          <Target size={18} style={{ color: "var(--color-brand-500)" }} />
          <h3 style={{ margin: 0, fontSize: "1.125rem", fontWeight: 700, color: "var(--foreground)" }}>
            Category Breakdown & Completion Rates
          </h3>
        </div>

        {categoryStats.length === 0 ? (
          <p style={{ color: "var(--muted-foreground)", fontSize: "0.875rem" }}>
            Add tasks with categories to see analytics breakdown here.
          </p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {categoryStats.map((cat) => (
              <div key={cat.name}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.875rem", marginBottom: "0.35rem" }}>
                  <span style={{ fontWeight: 600, color: "var(--foreground)" }}>{cat.name}</span>
                  <span style={{ color: "var(--muted-foreground)" }}>
                    {cat.completed}/{cat.total} tasks ({cat.rate}%)
                  </span>
                </div>
                <div style={{ width: "100%", height: "8px", background: "var(--muted)", borderRadius: "4px", overflow: "hidden" }}>
                  <div
                    style={{
                      width: `${cat.rate}%`,
                      height: "100%",
                      background: cat.rate >= 75 ? "#22c55e" : "var(--color-brand-500)",
                      borderRadius: "4px",
                      transition: "width 0.4s ease",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
