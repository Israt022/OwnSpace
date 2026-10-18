import prisma from "../lib/prisma";
import { CreateTaskInput, UpdateTaskInput, TaskResponse, DailyTaskStats, TaskPriority } from "../types";

/**
 * Fetch tasks belonging to a specific user, with optional filters.
 */
export async function getUserTasks(
  userId: string,
  filter?: {
    date?: string; // YYYY-MM-DD
    completed?: boolean;
    category?: string;
    priority?: TaskPriority;
    search?: string;
  }
): Promise<TaskResponse[]> {
  const where: Record<string, unknown> = {
    userId,
  };

  if (filter?.completed !== undefined) {
    where.completed = filter.completed;
  }

  if (filter?.category && filter.category !== "All") {
    where.category = { equals: filter.category, mode: "insensitive" };
  }

  if (filter?.priority) {
    where.priority = filter.priority;
  }

  if (filter?.search && filter.search.trim()) {
    where.OR = [
      { title: { contains: filter.search.trim(), mode: "insensitive" } },
      { description: { contains: filter.search.trim(), mode: "insensitive" } },
    ];
  }

  if (filter?.date) {
    const startOfDay = new Date(`${filter.date}T00:00:00.000Z`);
    const endOfDay = new Date(`${filter.date}T23:59:59.999Z`);

    where.OR = [
      {
        dueDate: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      {
        AND: [
          { dueDate: null },
          {
            createdAt: {
              gte: startOfDay,
              lte: endOfDay,
            },
          },
        ],
      },
    ];
  }

  const tasks = await prisma.task.findMany({
    where,
    orderBy: [
      { completed: "asc" },
      { priority: "desc" },
      { dueDate: "asc" },
      { createdAt: "desc" },
    ],
  });

  return tasks.map((t) => ({
    id: t.id,
    title: t.title,
    description: t.description,
    completed: t.completed,
    priority: t.priority as TaskPriority,
    category: t.category,
    dueDate: t.dueDate,
    dueTime: t.dueTime,
    completedAt: t.completedAt,
    createdAt: t.createdAt,
    updatedAt: t.updatedAt,
    userId: t.userId,
  }));
}

/**
 * Fetch a single task by ID for a user.
 */
export async function getTaskById(taskId: string, userId: string): Promise<TaskResponse | null> {
  const task = await prisma.task.findFirst({
    where: {
      id: taskId,
      userId,
    },
  });

  if (!task) return null;

  return {
    ...task,
    priority: task.priority as TaskPriority,
  };
}

/**
 * Create a new task for a user.
 */
export async function createTask(userId: string, input: CreateTaskInput): Promise<TaskResponse> {
  let parsedDueDate: Date | null = null;
  if (input.dueDate) {
    parsedDueDate = typeof input.dueDate === "string" ? new Date(input.dueDate) : input.dueDate;
  }

  const task = await prisma.task.create({
    data: {
      title: input.title.trim(),
      description: input.description?.trim() || null,
      priority: input.priority || "MEDIUM",
      category: input.category?.trim() || "General",
      dueDate: parsedDueDate,
      dueTime: input.dueTime || null,
      userId,
    },
  });

  return {
    ...task,
    priority: task.priority as TaskPriority,
  };
}

/**
 * Update a task for a user.
 */
export async function updateTask(
  taskId: string,
  userId: string,
  input: UpdateTaskInput
): Promise<TaskResponse | null> {
  // Ensure the task exists and belongs to the user
  const existing = await prisma.task.findFirst({
    where: { id: taskId, userId },
  });

  if (!existing) {
    return null;
  }

  const updateData: Record<string, unknown> = {};

  if (input.title !== undefined) updateData.title = input.title.trim();
  if (input.description !== undefined) updateData.description = input.description?.trim() || null;
  if (input.priority !== undefined) updateData.priority = input.priority;
  if (input.category !== undefined) updateData.category = input.category.trim();
  if (input.dueTime !== undefined) updateData.dueTime = input.dueTime;

  if (input.dueDate !== undefined) {
    updateData.dueDate = input.dueDate ? new Date(input.dueDate) : null;
  }

  if (input.completed !== undefined) {
    updateData.completed = input.completed;
    updateData.completedAt = input.completed ? new Date() : null;
  }

  const updated = await prisma.task.update({
    where: { id: taskId },
    data: updateData,
  });

  return {
    ...updated,
    priority: updated.priority as TaskPriority,
  };
}

/**
 * Delete a task for a user.
 */
export async function deleteTask(taskId: string, userId: string): Promise<boolean> {
  const existing = await prisma.task.findFirst({
    where: { id: taskId, userId },
  });

  if (!existing) {
    return false;
  }

  await prisma.task.delete({
    where: { id: taskId },
  });

  return true;
}

/**
 * Calculate daily task statistics for a user.
 */
export async function getUserDailyTaskStats(userId: string): Promise<DailyTaskStats> {
  const tasks = await prisma.task.findMany({
    where: { userId },
  });

  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;
  const pending = total - completed;
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
  const urgentOrHigh = tasks.filter(
    (t) => !t.completed && (t.priority === "HIGH" || t.priority === "URGENT")
  ).length;

  const categoryMap: Record<string, number> = {};
  tasks.forEach((t) => {
    const cat = t.category || "General";
    categoryMap[cat] = (categoryMap[cat] || 0) + 1;
  });

  const categories = Object.entries(categoryMap).map(([name, count]) => ({
    name,
    count,
  }));

  return {
    total,
    completed,
    pending,
    completionRate,
    urgentOrHigh,
    categories,
  };
}
