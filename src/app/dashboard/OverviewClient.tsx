"use client";

import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import DashboardShell from "@/components/dashboard/shared/DashboardShell";
import OverviewStats from "@/components/dashboard/user/OverviewStats";
import TodayTasks from "@/components/dashboard/user/TodayTasks";
import TaskFormDialog from "@/components/dashboard/user/TaskFormDialog";
import { TaskResponse, DailyTaskStats, CreateTaskInput } from "@server/types";
import { SessionUser } from "@/lib/session";

interface OverviewClientProps {
  user: SessionUser;
}

export default function OverviewClient({ user }: OverviewClientProps) {
  const [tasks, setTasks] = useState<TaskResponse[]>([]);
  const [stats, setStats] = useState<DailyTaskStats | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskResponse | null>(null);

  const fetchData = async () => {
    try {
      const [tasksRes, statsRes] = await Promise.all([
        fetch("/api/tasks"),
        fetch("/api/tasks/stats"),
      ]);
      if (tasksRes.ok) {
        const data = await tasksRes.json();
        if (data.success) setTasks(data.data || []);
      }
      if (statsRes.ok) {
        const data = await statsRes.json();
        if (data.success) setStats(data.data || null);
      }
    } catch (err) {
      console.error("Failed to load overview data:", err);
    }
  };

  useEffect(() => {
    fetchData();
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
      fetchData();
    } catch {
      fetchData();
    }
  };

  const handleDelete = async (taskId: string) => {
    if (!confirm("Are you sure you want to delete this task?")) return;
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    try {
      await fetch(`/api/tasks/${taskId}`, { method: "DELETE" });
      fetchData();
    } catch {
      fetchData();
    }
  };

  const handleQuickAdd = async (title: string) => {
    await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, priority: "MEDIUM", category: "Work" }),
    });
    fetchData();
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
    fetchData();
  };

  return (
    <DashboardShell
      user={user}
      role="USER"
      title={`Welcome back, ${user.name.split(" ")[0]}`}
      subtitle="Here is what is on your daily radar today."
      actions={
        <button
          onClick={() => {
            setEditingTask(null);
            setIsDialogOpen(true);
          }}
          className="hero-btn-primary"
          style={{ padding: "0.55rem 1.15rem", fontSize: "0.875rem" }}
        >
          <Plus size={16} /> Add Task
        </button>
      }
    >
      <OverviewStats stats={stats} />
      <TodayTasks
        tasks={tasks}
        onToggle={handleToggle}
        onEdit={(t) => {
          setEditingTask(t);
          setIsDialogOpen(true);
        }}
        onDelete={handleDelete}
        onQuickAdd={handleQuickAdd}
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
    </DashboardShell>
  );
}
