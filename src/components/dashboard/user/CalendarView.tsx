"use client";

import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon, Clock, Check } from "lucide-react";
import { TaskResponse } from "@server/types";
import TaskItem from "./TaskItem";

interface CalendarViewProps {
  tasks: TaskResponse[];
  onToggle: (task: TaskResponse) => void;
  onEdit: (task: TaskResponse) => void;
  onDelete: (taskId: string) => void;
  onOpenCreateWithDate: (dateStr: string) => void;
}

export default function CalendarView({
  tasks,
  onToggle,
  onEdit,
  onDelete,
  onOpenCreateWithDate,
}: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [selectedDateStr, setSelectedDateStr] = useState(() => new Date().toISOString().split("T")[0]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthName = currentDate.toLocaleString("default", { month: "long" });

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  // Calendar matrix calculation
  const calendarDays = useMemo(() => {
    const firstDayIndex = new Date(year, month, 1).getDay();
    const lastDayOfMonth = new Date(year, month + 1, 0).getDate();
    const days: { day: number; dateStr: string; isCurrentMonth: boolean }[] = [];

    // Previous month padding
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const d = prevMonthLastDay - i;
      const m = month === 0 ? 12 : month;
      const y = month === 0 ? year - 1 : year;
      const dateStr = `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      days.push({ day: d, dateStr, isCurrentMonth: false });
    }

    // Current month days
    for (let i = 1; i <= lastDayOfMonth; i++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(i).padStart(2, "0")}`;
      days.push({ day: i, dateStr, isCurrentMonth: true });
    }

    return days;
  }, [year, month]);

  // Task map by date
  const tasksByDate = useMemo(() => {
    const map: Record<string, TaskResponse[]> = {};
    tasks.forEach((t) => {
      const dateKey = t.dueDate
        ? new Date(t.dueDate).toISOString().split("T")[0]
        : new Date(t.createdAt).toISOString().split("T")[0];
      if (!map[dateKey]) map[dateKey] = [];
      map[dateKey].push(t);
    });
    return map;
  }, [tasks]);

  const selectedDayTasks = tasksByDate[selectedDateStr] || [];
  const completedCount = selectedDayTasks.filter((t) => t.completed).length;

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1.5rem" }}>
      {/* Calendar Grid Card */}
      <div className="glass-card" style={{ padding: "1.5rem", borderRadius: "1rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
          <h2 style={{ fontSize: "1.125rem", fontWeight: 700, margin: 0, color: "var(--foreground)" }}>
            {monthName} {year}
          </h2>
          <div style={{ display: "flex", gap: "0.25rem" }}>
            <button onClick={prevMonth} className="hero-btn-secondary" style={{ padding: "0.35rem 0.6rem" }} aria-label="Previous month">
              <ChevronLeft size={16} />
            </button>
            <button onClick={nextMonth} className="hero-btn-secondary" style={{ padding: "0.35rem 0.6rem" }} aria-label="Next month">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Days of week header */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "0.25rem", textAlign: "center", marginBottom: "0.5rem" }}>
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <span key={day} style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--muted-foreground)" }}>
              {day}
            </span>
          ))}
        </div>

        {/* Calendar days cells */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "0.35rem" }}>
          {calendarDays.map((d, idx) => {
            const isSelected = d.dateStr === selectedDateStr;
            const dayTasks = tasksByDate[d.dateStr] || [];
            const hasTasks = dayTasks.length > 0;
            const allDone = hasTasks && dayTasks.every((t) => t.completed);

            return (
              <button
                key={idx}
                onClick={() => setSelectedDateStr(d.dateStr)}
                style={{
                  height: "44px",
                  borderRadius: "0.5rem",
                  border: isSelected ? "2px solid var(--color-brand-500)" : "1px solid var(--border)",
                  background: isSelected ? "rgba(99, 102, 241, 0.12)" : d.isCurrentMonth ? "var(--card)" : "var(--muted)",
                  color: d.isCurrentMonth ? "var(--foreground)" : "var(--muted-foreground)",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                  transition: "all 0.15s ease",
                }}
              >
                <span style={{ fontSize: "0.8125rem", fontWeight: isSelected ? 700 : 500 }}>{d.day}</span>
                {hasTasks && (
                  <span
                    style={{
                      width: "5px",
                      height: "5px",
                      borderRadius: "50%",
                      backgroundColor: allDone ? "#22c55e" : "#6366f1",
                      marginTop: "2px",
                    }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Day Task List Card */}
      <div className="glass-card" style={{ padding: "1.5rem", borderRadius: "1rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
          <div>
            <h3 style={{ margin: 0, fontSize: "1.125rem", fontWeight: 700, color: "var(--foreground)" }}>
              {selectedDateStr}
            </h3>
            <p style={{ margin: "0.2rem 0 0", fontSize: "0.8125rem", color: "var(--muted-foreground)" }}>
              {selectedDayTasks.length} tasks planned • {completedCount} completed
            </p>
          </div>
          <button
            onClick={() => onOpenCreateWithDate(selectedDateStr)}
            className="hero-btn-primary"
            style={{ padding: "0.45rem 0.85rem", fontSize: "0.8125rem" }}
          >
            <Plus size={14} /> Add Task
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
          {selectedDayTasks.length === 0 ? (
            <div style={{ padding: "2.5rem 1rem", textAlign: "center", color: "var(--muted-foreground)" }}>
              <CalendarIcon size={28} style={{ margin: "0 auto 0.5rem", opacity: 0.5 }} />
              <p style={{ margin: 0, fontWeight: 600 }}>No tasks for this date</p>
              <p style={{ margin: "0.25rem 0 0", fontSize: "0.8125rem" }}>Click &quot;Add Task&quot; above to plan ahead.</p>
            </div>
          ) : (
            selectedDayTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onToggle={onToggle}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
