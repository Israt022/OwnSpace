"use client";

import { useState, useEffect, useMemo } from "react";
import { Plus } from "lucide-react";
import DashboardShell from "@/components/dashboard/shared/DashboardShell";
import TaskFilters from "@/components/dashboard/user/TaskFilters";
import TaskList from "@/components/dashboard/user/TaskList";
import TaskFormDialog from "@/components/dashboard/user/TaskFormDialog";
import ConfirmDialog from "@/components/dashboard/shared/ConfirmDialog";
import { TaskResponse, CreateTaskInput } from "@server/types";
import { SessionUser } from "@/lib/session";

const CATEGORIES = ["All", "Work", "Personal", "Study", "Health", "Fitness", "General"];

interface TasksClientProps {
  user: SessionUser;
}

export default function TasksClient({ user }: TasksClientProps) {
  const [tasks, setTasks] = useState<TaskResponse[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "completed">("all");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  // Dialogs
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskResponse | null>(null);
  const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null);

  const fetchTasks = async () => {
    try {
      const res = await fetch("/api/tasks");
      if (res.ok) {
        const data = await res.json();
        if (data.success) setTasks(data.data || []);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleToggle = async (task: TaskResponse) => {
    const updated = !task.completed;
    setTasks((prev) =>
      prev.map((t) => (t.id === task.id ? { ...t, completed: updated } : t))
    );
    try {
      await fetch(`/api/tasks/${task.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: updated }),
      });
      fetchTasks();
    } catch {
      fetchTasks();
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingTaskId) return;
    const id = deletingTaskId;
    setDeletingTaskId(null);
    setTasks((prev) => prev.filter((t) => t.id !== id));
    try {
      await fetch(`/api/tasks/${id}`, { method: "DELETE" });
      fetchTasks();
    } catch {
      fetchTasks();
    }
  };

  const handleDialogSubmit = async (input: CreateTaskInput) => {
    if (editingTask) {
      await fetch(`/api/tasks/${editingTask.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
    } else {
      await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
    }
    fetchTasks();
  };

  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      if (statusFilter === "pending" && t.completed) return false;
      if (statusFilter === "completed" && !t.completed) return false;
      if (categoryFilter !== "All" && t.category.toLowerCase() !== categoryFilter.toLowerCase()) {
        return false;
      }
      if (priorityFilter !== "ALL" && t.priority !== priorityFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = t.title.toLowerCase().includes(q);
        const matchesDesc = t.description?.toLowerCase().includes(q) ?? false;
        if (!matchesTitle && !matchesDesc) return false;
      }
      return true;
    });
  }, [tasks, statusFilter, categoryFilter, priorityFilter, searchQuery]);

  return (
    <DashboardShell
      user={user}
      role="USER"
      title="Tasks Manager"
      subtitle="Organize, schedule, and complete your daily goals."
      actions={
        <button
          onClick={() => {
            setEditingTask(null);
            setIsDialogOpen(true);
          }}
          className="hero-btn-primary"
          style={{ padding: "0.55rem 1.15rem", fontSize: "0.875rem" }}
        >
          <Plus size={16} /> New Task
        </button>
      }
    >
      <TaskFilters
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        categoryFilter={categoryFilter}
        onCategoryChange={setCategoryFilter}
        priorityFilter={priorityFilter}
        onPriorityChange={setPriorityFilter}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        categories={CATEGORIES}
      />

      <TaskList
        tasks={filteredTasks}
        loading={loading}
        onToggle={handleToggle}
        onEdit={(t) => {
          setEditingTask(t);
          setIsDialogOpen(true);
        }}
        onDelete={(id) => setDeletingTaskId(id)}
        onOpenCreate={() => {
          setEditingTask(null);
          setIsDialogOpen(true);
        }}
        hasFilters={Boolean(searchQuery || categoryFilter !== "All" || priorityFilter !== "ALL" || statusFilter !== "all")}
      />

      <TaskFormDialog
        isOpen={isDialogOpen}
        initialTask={editingTask}
        onClose={() => {
          setIsDialogOpen(false);
          setEditingTask(null);
        }}
        onSubmit={handleDialogSubmit}
      />

      <ConfirmDialog
        isOpen={Boolean(deletingTaskId)}
        title="Delete Task"
        message="Are you sure you want to permanently delete this task? This action cannot be undone."
        confirmLabel="Delete Task"
        isDestructive={true}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeletingTaskId(null)}
      />
    </DashboardShell>
  );
}
