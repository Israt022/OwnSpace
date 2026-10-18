export type TaskPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export interface TaskResponse {
  id: string;
  title: string;
  description: string | null;
  completed: boolean;
  priority: TaskPriority;
  category: string;
  dueDate: Date | null;
  dueTime: string | null;
  completedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

export interface CreateTaskInput {
  title: string;
  description?: string | null;
  priority?: TaskPriority;
  category?: string;
  dueDate?: string | Date | null;
  dueTime?: string | null;
}

export interface UpdateTaskInput {
  title?: string;
  description?: string | null;
  completed?: boolean;
  priority?: TaskPriority;
  category?: string;
  dueDate?: string | Date | null;
  dueTime?: string | null;
}

export interface DailyTaskStats {
  total: number;
  completed: number;
  pending: number;
  completionRate: number;
  urgentOrHigh: number;
  categories: { name: string; count: number }[];
}
