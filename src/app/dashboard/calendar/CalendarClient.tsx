"use client";

import { useState, useEffect } from "react";
import DashboardShell from "@/components/dashboard/shared/DashboardShell";
import CalendarView from "@/components/dashboard/user/CalendarView";
import TaskFormDialog from "@/components/dashboard/user/TaskFormDialog";
import { TaskResponse, CreateTaskInput } from "@server/types";
import { SessionUser } from "@/lib/session";

interface CalendarClientProps {
  user: SessionUser;
}

export default function CalendarClient({ user }: CalendarClientProps) {
  const [tasks, setTasks] = useState<TaskResponse[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskResponse | null>(null);
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split("T")[0]);

  const fetchTasks = async () => {
    try {
      const res = await fetch("/api/tasks");
      if (res.ok) {
        const data = await res.json();
        if (data.success) setTasks(data.data || []);
      }
    } catch (err) {
      console.error("Failed to load tasks:", err);
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

  const handleDelete = async (taskId: string) => {
    if (!confirm("Are you sure you want to delete this task?")) return;
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    try {
      await fetch(`/api/tasks/${taskId}`, { method: "DELETE" });
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

  return (
    <DashboardShell
      user={user}
      role="USER"
      title="Calendar View"
      subtitle="Track your daily schedule and upcoming task deadlines."
    >
      <CalendarView
        tasks={tasks}
        onToggle={handleToggle}
        onEdit={(t) => {
          setEditingTask(t);
          setIsDialogOpen(true);
        }}
        onDelete={handleDelete}
        onOpenCreateWithDate={(dateStr) => {
          setSelectedDate(dateStr);
          setEditingTask(null);
          setIsDialogOpen(true);
        }}
      />

      <TaskFormDialog
        isOpen={isDialogOpen}
        initialTask={editingTask}
        defaultDate={selectedDate}
        onClose={() => {
          setIsDialogOpen(false);
          setEditingTask(null);
        }}
        onSubmit={handleDialogSubmit}
      />
    </DashboardShell>
  );
}
