"use client";

import { useState, useEffect, useMemo, ChangeEvent, FormEvent } from "react";
import {
  CheckCircle2,
  Circle,
  Plus,
  Search,
  Calendar,
  Clock,
  Trash2,
  Edit3,
  X,
  Sparkles,
  TrendingUp,
  AlertCircle,
  Check,
  Tag,
  Flag,
  Flame,
} from "lucide-react";
import { TaskResponse, DailyTaskStats, TaskPriority } from "@server/types";
import { SessionUser } from "@/lib/session";

interface UserDashboardProps {
  user: SessionUser;
}

const CATEGORIES = ["All", "Work", "Personal", "Study", "Health", "Fitness", "General"];

export default function UserDashboard({ user }: UserDashboardProps) {
  const [tasks, setTasks] = useState<TaskResponse[]>([]);
  const [stats, setStats] = useState<DailyTaskStats | null>(null);
  const [loading, setLoading] = useState(true);

  // Filters
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "completed">("all");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  // New task form state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<TaskPriority>("MEDIUM");
  const [category, setCategory] = useState("Work");
  const [dueTime, setDueTime] = useState("");
  const [dueDate, setDueDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [submitting, setSubmitting] = useState(false);

  // Editing state
  const [editingTask, setEditingTask] = useState<TaskResponse | null>(null);

  // Motivational quote based on time
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  }, []);

  const todayFormatted = useMemo(() => {
    return new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date());
  }, []);

  // Fetch tasks and stats
  const fetchTasksAndStats = async () => {
    try {
      const [tasksRes, statsRes] = await Promise.all([
        fetch("/api/tasks"),
        fetch("/api/tasks/stats"),
      ]);

      if (tasksRes.ok) {
        const tasksJson = await tasksRes.json();
        if (tasksJson.success) setTasks(tasksJson.data || []);
      }

      if (statsRes.ok) {
        const statsJson = await statsRes.json();
        if (statsJson.success) setStats(statsJson.data || null);
      }
    } catch (err) {
      console.error("Failed to load dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasksAndStats();
  }, []);

  // Handle task completion toggle
  const handleToggleComplete = async (task: TaskResponse) => {
    const updatedCompleted = !task.completed;
    // Optimistic update
    setTasks((prev) =>
      prev.map((t) =>
        t.id === task.id
          ? {
              ...t,
              completed: updatedCompleted,
              completedAt: updatedCompleted ? new Date() : null,
            }
          : t
      )
    );

    try {
      const res = await fetch(`/api/tasks/${task.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: updatedCompleted }),
      });

      if (!res.ok) {
        // Revert on failure
        fetchTasksAndStats();
      } else {
        // Refresh stats
        const statsRes = await fetch("/api/tasks/stats");
        if (statsRes.ok) {
          const statsJson = await statsRes.json();
          if (statsJson.success) setStats(statsJson.data);
        }
      }
    } catch {
      fetchTasksAndStats();
    }
  };

  // Handle task creation
  const handleCreateTask = async (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          priority,
          category,
          dueDate: dueDate ? new Date(dueDate).toISOString() : null,
          dueTime: dueTime || null,
        }),
      });

      if (res.ok) {
        setTitle("");
        setDescription("");
        setPriority("MEDIUM");
        setDueTime("");
        setIsFormOpen(false);
        await fetchTasksAndStats();
      }
    } catch (err) {
      console.error("Error creating task:", err);
    } finally {
      setSubmitting(false);
    }
  };

  // Handle update task
  const handleUpdateTask = async (e: FormEvent) => {
    e.preventDefault();
    if (!editingTask || !editingTask.title.trim()) return;

    setSubmitting(true);
    try {
      const res = await fetch(`/api/tasks/${editingTask.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: editingTask.title,
          description: editingTask.description,
          priority: editingTask.priority,
          category: editingTask.category,
          dueDate: editingTask.dueDate,
          dueTime: editingTask.dueTime,
        }),
      });

      if (res.ok) {
        setEditingTask(null);
        await fetchTasksAndStats();
      }
    } catch (err) {
      console.error("Error updating task:", err);
    } finally {
      setSubmitting(false);
    }
  };

  // Handle delete task
  const handleDeleteTask = async (taskId: string) => {
    if (!confirm("Are you sure you want to delete this task?")) return;

    // Optimistic delete
    setTasks((prev) => prev.filter((t) => t.id !== taskId));

    try {
      await fetch(`/api/tasks/${taskId}`, {
        method: "DELETE",
      });
      fetchTasksAndStats();
    } catch (err) {
      console.error("Error deleting task:", err);
      fetchTasksAndStats();
    }
  };

  // Filtered tasks calculation
  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      // Status filter
      if (statusFilter === "pending" && t.completed) return false;
      if (statusFilter === "completed" && !t.completed) return false;

      // Category filter
      if (categoryFilter !== "All" && t.category.toLowerCase() !== categoryFilter.toLowerCase()) {
        return false;
      }

      // Priority filter
      if (priorityFilter !== "ALL" && t.priority !== priorityFilter) {
        return false;
      }

      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = t.title.toLowerCase().includes(query);
        const matchesDesc = t.description?.toLowerCase().includes(query) ?? false;
        if (!matchesTitle && !matchesDesc) return false;
      }

      return true;
    });
  }, [tasks, statusFilter, categoryFilter, priorityFilter, searchQuery]);

  return (
    <div className="dashboard-container animate-in">
      {/* ── Top Header Bar ────────────────────────────────────────────── */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: "1.5rem",
          flexWrap: "wrap",
          marginBottom: "2rem",
        }}
      >
        <div>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              fontSize: "0.8125rem",
              fontWeight: 600,
              color: "var(--color-brand-500)",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              marginBottom: "0.5rem",
            }}
          >
            <Sparkles size={16} />
            <span>Daily Focus Workspace</span>
          </div>
          <h1
            style={{
              fontSize: "clamp(1.75rem, 3.5vw, 2.25rem)",
              fontWeight: 800,
              color: "var(--foreground)",
              letterSpacing: "-0.025em",
              margin: "0 0 0.35rem",
            }}
          >
            {greeting}, {user.name.split(" ")[0]}!
          </h1>
          <p
            style={{
              color: "var(--muted-foreground)",
              fontSize: "0.9375rem",
              margin: 0,
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <Calendar size={15} />
            {todayFormatted} • Build your streak today
          </p>
        </div>

        {/* Action Button */}
        <button
          onClick={() => setIsFormOpen((prev) => !prev)}
          id="btn-open-add-task"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.75rem 1.35rem",
            background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
            color: "#ffffff",
            borderRadius: "0.75rem",
            fontWeight: 600,
            fontSize: "0.9375rem",
            border: "none",
            cursor: "pointer",
            boxShadow: "0 4px 14px rgba(99, 102, 241, 0.35)",
            transition: "transform 0.15s, box-shadow 0.15s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-1px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          <Plus size={18} strokeWidth={2.5} />
          {isFormOpen ? "Close Form" : "Create Task"}
        </button>
      </div>

      {/* ── Key Statistics Cards ────────────────────────────────────────── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
          gap: "1.25rem",
          marginBottom: "2rem",
        }}
      >
        {/* Progress Rate Card */}
        <div className="stat-card">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "0.5rem",
            }}
          >
            <span style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--muted-foreground)" }}>
              Completion Rate
            </span>
            <TrendingUp size={18} style={{ color: "var(--color-brand-500)" }} />
          </div>
          <div style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--foreground)", marginBottom: "0.5rem" }}>
            {stats?.completionRate ?? 0}%
          </div>
          {/* Progress bar */}
          <div
            style={{
              width: "100%",
              height: "6px",
              background: "var(--muted)",
              borderRadius: "4px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${stats?.completionRate ?? 0}%`,
                height: "100%",
                background: "linear-gradient(90deg, #6366f1, #22c55e)",
                borderRadius: "4px",
                transition: "width 0.4s ease",
              }}
            />
          </div>
        </div>

        {/* Total Tasks Card */}
        <div className="stat-card">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "0.5rem",
            }}
          >
            <span style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--muted-foreground)" }}>
              Total Tasks
            </span>
            <Tag size={18} style={{ color: "var(--foreground)" }} />
          </div>
          <div style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--foreground)" }}>
            {stats?.total ?? 0}
          </div>
          <span style={{ fontSize: "0.75rem", color: "var(--muted-foreground)" }}>
            Planned across all lists
          </span>
        </div>

        {/* Completed Card */}
        <div className="stat-card">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "0.5rem",
            }}
          >
            <span style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--muted-foreground)" }}>
              Completed
            </span>
            <CheckCircle2 size={18} style={{ color: "#22c55e" }} />
          </div>
          <div style={{ fontSize: "1.75rem", fontWeight: 800, color: "#22c55e" }}>
            {stats?.completed ?? 0}
          </div>
          <span style={{ fontSize: "0.75rem", color: "var(--muted-foreground)" }}>
            Great job staying on track!
          </span>
        </div>

        {/* High / Urgent Priority Card */}
        <div className="stat-card">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "0.5rem",
            }}
          >
            <span style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--muted-foreground)" }}>
              High & Urgent Focus
            </span>
            <AlertCircle size={18} style={{ color: "#ef4444" }} />
          </div>
          <div style={{ fontSize: "1.75rem", fontWeight: 800, color: "#ef4444" }}>
            {stats?.urgentOrHigh ?? 0}
          </div>
          <span style={{ fontSize: "0.75rem", color: "var(--muted-foreground)" }}>
            Tasks requiring immediate focus
          </span>
        </div>
      </div>

      {/* ── Expandable Task Creator ────────────────────────────────────── */}
      {isFormOpen && (
        <div
          className="glass-card animate-in"
          style={{
            padding: "1.75rem",
            marginBottom: "2rem",
            borderRadius: "1rem",
            border: "1.5px solid var(--color-brand-400)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
            <h3 style={{ fontSize: "1.125rem", fontWeight: 700, margin: 0, color: "var(--foreground)" }}>
              Add a New Daily Task
            </h3>
            <button
              onClick={() => setIsFormOpen(false)}
              style={{ background: "none", border: "none", cursor: "pointer", color: "var(--muted-foreground)" }}
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleCreateTask}>
            {/* Title */}
            <div style={{ marginBottom: "1rem" }}>
              <label className="input-label" htmlFor="task-title-input">
                Task Title *
              </label>
              <input
                id="task-title-input"
                type="text"
                placeholder="e.g., Complete project quarterly roadmap review"
                value={title}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
                className="input-field"
                required
                autoFocus
              />
            </div>

            {/* Description */}
            <div style={{ marginBottom: "1rem" }}>
              <label className="input-label" htmlFor="task-desc-input">
                Notes & Description (Optional)
              </label>
              <textarea
                id="task-desc-input"
                placeholder="Add sub-items, links, or specific targets..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="input-field"
                rows={2}
                style={{ resize: "vertical" }}
              />
            </div>

            {/* Grid for priority, category, time */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
                gap: "1rem",
                marginBottom: "1.5rem",
              }}
            >
              {/* Priority */}
              <div>
                <label className="input-label" htmlFor="task-priority-select">
                  Priority
                </label>
                <select
                  id="task-priority-select"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as TaskPriority)}
                  className="input-field"
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="URGENT">Urgent ⚡</option>
                </select>
              </div>

              {/* Category */}
              <div>
                <label className="input-label" htmlFor="task-category-select">
                  Category
                </label>
                <select
                  id="task-category-select"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="input-field"
                >
                  {CATEGORIES.filter((c) => c !== "All").map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Due Date */}
              <div>
                <label className="input-label" htmlFor="task-date-input">
                  Due Date
                </label>
                <input
                  id="task-date-input"
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="input-field"
                />
              </div>

              {/* Due Time */}
              <div>
                <label className="input-label" htmlFor="task-time-input">
                  Target Time
                </label>
                <input
                  id="task-time-input"
                  type="time"
                  value={dueTime}
                  onChange={(e) => setDueTime(e.target.value)}
                  className="input-field"
                />
              </div>
            </div>

            {/* Buttons */}
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem" }}>
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="hero-btn-secondary"
                style={{ padding: "0.6rem 1.25rem", fontSize: "0.875rem" }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="hero-btn-primary"
                style={{ padding: "0.6rem 1.5rem", fontSize: "0.875rem" }}
              >
                {submitting ? "Saving…" : "Save Task"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── Filters & Search Control Bar ──────────────────────────────── */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          marginBottom: "1.5rem",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          {/* Status Tabs */}
          <div
            style={{
              display: "inline-flex",
              padding: "0.25rem",
              borderRadius: "0.625rem",
              background: "var(--muted)",
              border: "1px solid var(--border)",
            }}
          >
            {(["all", "pending", "completed"] as const).map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                style={{
                  padding: "0.45rem 1rem",
                  fontSize: "0.8125rem",
                  fontWeight: 600,
                  borderRadius: "0.5rem",
                  border: "none",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                  background: statusFilter === status ? "var(--card)" : "transparent",
                  color: statusFilter === status ? "var(--foreground)" : "var(--muted-foreground)",
                  boxShadow: statusFilter === status ? "var(--shadow-sm)" : "none",
                }}
              >
                {status === "all" ? "All Tasks" : status === "pending" ? "Pending" : "Completed"}
              </button>
            ))}
          </div>

          {/* Search box */}
          <div style={{ position: "relative", minWidth: "260px" }}>
            <Search
              size={16}
              style={{
                position: "absolute",
                left: "0.85rem",
                top: "50%",
                transform: "translateY(-50%)",
                color: "var(--muted-foreground)",
              }}
            />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field"
              style={{
                paddingLeft: "2.4rem",
                paddingRight: searchQuery ? "2rem" : "1rem",
                fontSize: "0.875rem",
                height: "2.5rem",
              }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                style={{
                  position: "absolute",
                  right: "0.75rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "var(--muted-foreground)",
                }}
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Category Pills & Priority Selector */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "0.75rem",
          }}
        >
          {/* Categories */}
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", alignItems: "center" }}>
            <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--muted-foreground)", marginRight: "0.25rem" }}>
              Category:
            </span>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`category-pill ${categoryFilter === cat ? "active" : ""}`}
                style={{ cursor: "pointer" }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Priority filter */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Flag size={14} style={{ color: "var(--muted-foreground)" }} />
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="input-field"
              style={{ fontSize: "0.8125rem", padding: "0.25rem 0.65rem", width: "auto", height: "2.2rem" }}
            >
              <option value="ALL">All Priorities</option>
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="URGENT">Urgent</option>
            </select>
          </div>
        </div>
      </div>

      {/* ── Task List ─────────────────────────────────────────────────── */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {loading && (
          <div style={{ padding: "3rem", textAlign: "center", color: "var(--muted-foreground)" }}>
            <div className="spinner" style={{ margin: "0 auto 1rem" }} />
            Loading your tasks…
          </div>
        )}

        {!loading && filteredTasks.length === 0 && (
          <div
            className="glass-card"
            style={{
              padding: "3.5rem 2rem",
              textAlign: "center",
              borderRadius: "1rem",
            }}
          >
            <div
              style={{
                width: "3.5rem",
                height: "3.5rem",
                borderRadius: "50%",
                background: "var(--muted)",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--color-brand-500)",
                marginBottom: "1rem",
              }}
            >
              <CheckCircle2 size={28} />
            </div>
            <h3 style={{ fontSize: "1.25rem", fontWeight: 700, margin: "0 0 0.5rem", color: "var(--foreground)" }}>
              {searchQuery || categoryFilter !== "All" || priorityFilter !== "ALL"
                ? "No matching tasks found"
                : "All clear for today!"}
            </h3>
            <p style={{ color: "var(--muted-foreground)", fontSize: "0.9375rem", margin: "0 0 1.5rem" }}>
              {searchQuery || categoryFilter !== "All" || priorityFilter !== "ALL"
                ? "Try adjusting your filters or search keywords."
                : "You don't have any pending tasks right now. Ready to tackle something new?"}
            </p>
            <button
              onClick={() => setIsFormOpen(true)}
              className="hero-btn-primary"
              style={{ padding: "0.65rem 1.5rem", fontSize: "0.875rem" }}
            >
              <Plus size={16} /> Add a Task
            </button>
          </div>
        )}

        {!loading &&
          filteredTasks.map((task) => (
            <div
              key={task.id}
              className={`task-item ${task.completed ? "completed" : ""}`}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "0.875rem",
                  justifyContent: "space-between",
                }}
              >
                {/* Left side: checkbox + title/description/tags */}
                <div style={{ display: "flex", alignItems: "flex-start", gap: "0.875rem", flex: 1 }}>
                  {/* Checkbox */}
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => handleToggleComplete(task)}
                    className="custom-checkbox"
                    aria-label={`Mark "${task.title}" as ${task.completed ? "incomplete" : "complete"}`}
                    style={{ marginTop: "0.2rem" }}
                  />

                  <div style={{ flex: 1, minWidth: 0 }}>
                    {/* Title */}
                    <div
                      style={{
                        fontSize: "1rem",
                        fontWeight: 600,
                        color: "var(--foreground)",
                        textDecoration: task.completed ? "line-through" : "none",
                        marginBottom: "0.3rem",
                        wordBreak: "break-word",
                      }}
                    >
                      {task.title}
                    </div>

                    {/* Description */}
                    {task.description && (
                      <p
                        style={{
                          fontSize: "0.875rem",
                          color: "var(--muted-foreground)",
                          margin: "0 0 0.5rem",
                          whiteSpace: "pre-wrap",
                          wordBreak: "break-word",
                        }}
                      >
                        {task.description}
                      </p>
                    )}

                    {/* Metadata tags */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        flexWrap: "wrap",
                        marginTop: "0.4rem",
                      }}
                    >
                      {/* Priority Badge */}
                      <span className={`priority-badge priority-${task.priority.toLowerCase()}`}>
                        {task.priority}
                      </span>

                      {/* Category Badge */}
                      <span
                        style={{
                          fontSize: "0.75rem",
                          fontWeight: 500,
                          padding: "0.15rem 0.55rem",
                          borderRadius: "0.375rem",
                          background: "var(--muted)",
                          color: "var(--foreground)",
                          border: "1px solid var(--border)",
                        }}
                      >
                        {task.category}
                      </span>

                      {/* Target Time */}
                      {task.dueTime && (
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.25rem",
                            fontSize: "0.75rem",
                            color: "var(--muted-foreground)",
                          }}
                        >
                          <Clock size={12} />
                          {task.dueTime}
                        </span>
                      )}

                      {/* Completed stamp */}
                      {task.completed && task.completedAt && (
                        <span
                          style={{
                            fontSize: "0.75rem",
                            color: "#22c55e",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.25rem",
                          }}
                        >
                          <Check size={12} /> Completed
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right side: Action icons */}
                <div style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
                  <button
                    onClick={() => setEditingTask(task)}
                    title="Edit task"
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: "0.35rem",
                      borderRadius: "0.375rem",
                      color: "var(--muted-foreground)",
                      transition: "color 0.15s, background-color 0.15s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = "var(--color-brand-500)";
                      e.currentTarget.style.background = "var(--muted)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = "var(--muted-foreground)";
                      e.currentTarget.style.background = "none";
                    }}
                  >
                    <Edit3 size={16} />
                  </button>

                  <button
                    onClick={() => handleDeleteTask(task.id)}
                    title="Delete task"
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: "0.35rem",
                      borderRadius: "0.375rem",
                      color: "var(--muted-foreground)",
                      transition: "color 0.15s, background-color 0.15s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = "#ef4444";
                      e.currentTarget.style.background = "rgba(239, 68, 68, 0.1)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = "var(--muted-foreground)";
                      e.currentTarget.style.background = "none";
                    }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
      </div>

      {/* ── Edit Task Modal ────────────────────────────────────────────── */}
      {editingTask && (
        <div className="modal-overlay" onClick={() => setEditingTask(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1.25rem",
              }}
            >
              <h3 style={{ fontSize: "1.125rem", fontWeight: 700, margin: 0, color: "var(--foreground)" }}>
                Edit Task
              </h3>
              <button
                onClick={() => setEditingTask(null)}
                style={{ background: "none", border: "none", cursor: "pointer", color: "var(--muted-foreground)" }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleUpdateTask}>
              {/* Title */}
              <div style={{ marginBottom: "1rem" }}>
                <label className="input-label" htmlFor="edit-task-title">
                  Title
                </label>
                <input
                  id="edit-task-title"
                  type="text"
                  value={editingTask.title}
                  onChange={(e) =>
                    setEditingTask((prev) => (prev ? { ...prev, title: e.target.value } : null))
                  }
                  className="input-field"
                  required
                />
              </div>

              {/* Description */}
              <div style={{ marginBottom: "1rem" }}>
                <label className="input-label" htmlFor="edit-task-desc">
                  Notes
                </label>
                <textarea
                  id="edit-task-desc"
                  value={editingTask.description || ""}
                  onChange={(e) =>
                    setEditingTask((prev) =>
                      prev ? { ...prev, description: e.target.value } : null
                    )
                  }
                  className="input-field"
                  rows={2}
                />
              </div>

              {/* Priority & Category */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "1rem",
                  marginBottom: "1rem",
                }}
              >
                <div>
                  <label className="input-label" htmlFor="edit-task-priority">
                    Priority
                  </label>
                  <select
                    id="edit-task-priority"
                    value={editingTask.priority}
                    onChange={(e) =>
                      setEditingTask((prev) =>
                        prev ? { ...prev, priority: e.target.value as TaskPriority } : null
                      )
                    }
                    className="input-field"
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="URGENT">Urgent</option>
                  </select>
                </div>

                <div>
                  <label className="input-label" htmlFor="edit-task-cat">
                    Category
                  </label>
                  <select
                    id="edit-task-cat"
                    value={editingTask.category}
                    onChange={(e) =>
                      setEditingTask((prev) =>
                        prev ? { ...prev, category: e.target.value } : null
                      )
                    }
                    className="input-field"
                  >
                    {CATEGORIES.filter((c) => c !== "All").map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Target Time */}
              <div style={{ marginBottom: "1.5rem" }}>
                <label className="input-label" htmlFor="edit-task-time">
                  Target Time
                </label>
                <input
                  id="edit-task-time"
                  type="time"
                  value={editingTask.dueTime || ""}
                  onChange={(e) =>
                    setEditingTask((prev) =>
                      prev ? { ...prev, dueTime: e.target.value } : null
                    )
                  }
                  className="input-field"
                />
              </div>

              {/* Action Buttons */}
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem" }}>
                <button
                  type="button"
                  onClick={() => setEditingTask(null)}
                  className="hero-btn-secondary"
                  style={{ padding: "0.6rem 1.25rem", fontSize: "0.875rem" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="hero-btn-primary"
                  style={{ padding: "0.6rem 1.5rem", fontSize: "0.875rem" }}
                >
                  {submitting ? "Updating…" : "Update Task"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
