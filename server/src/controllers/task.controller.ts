import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/session";
import {
  getUserTasks,
  createTask,
  updateTask,
  deleteTask,
  getUserDailyTaskStats,
} from "../services/task.service";
import { successResponse, errorResponse } from "../utils/api-response";
import { CreateTaskInput, UpdateTaskInput, TaskPriority } from "../types";

/**
 * Controller to fetch all tasks for the logged in user with query filtering.
 */
export async function getTasksController(req: Request): Promise<NextResponse> {
  try {
    const sessionData = await getServerSession();
    if (!sessionData || !sessionData.user) {
      return errorResponse("Unauthorized", 401);
    }

    const { searchParams } = new URL(req.url);
    const date = searchParams.get("date") || undefined;
    const category = searchParams.get("category") || undefined;
    const priority = (searchParams.get("priority") as TaskPriority) || undefined;
    const search = searchParams.get("search") || undefined;
    const completedParam = searchParams.get("completed");

    let completed: boolean | undefined = undefined;
    if (completedParam === "true") completed = true;
    if (completedParam === "false") completed = false;

    const tasks = await getUserTasks(sessionData.user.id, {
      date,
      category,
      priority,
      search,
      completed,
    });

    return successResponse(tasks, 200);
  } catch (error) {
    console.error("Failed to fetch tasks:", error);
    return errorResponse("Failed to fetch tasks", 500);
  }
}

/**
 * Controller to create a new task.
 */
export async function createTaskController(req: Request): Promise<NextResponse> {
  try {
    const sessionData = await getServerSession();
    if (!sessionData || !sessionData.user) {
      return errorResponse("Unauthorized", 401);
    }

    const body = (await req.json()) as CreateTaskInput;

    if (!body.title || !body.title.trim()) {
      return errorResponse("Task title is required", 400);
    }

    const task = await createTask(sessionData.user.id, {
      title: body.title,
      description: body.description,
      priority: body.priority,
      category: body.category,
      dueDate: body.dueDate,
      dueTime: body.dueTime,
    });

    return successResponse(task, 201);
  } catch (error) {
    console.error("Failed to create task:", error);
    return errorResponse("Failed to create task", 500);
  }
}

/**
 * Controller to update an existing task.
 */
export async function updateTaskController(
  taskId: string,
  req: Request
): Promise<NextResponse> {
  try {
    const sessionData = await getServerSession();
    if (!sessionData || !sessionData.user) {
      return errorResponse("Unauthorized", 401);
    }

    const body = (await req.json()) as UpdateTaskInput;
    const updated = await updateTask(taskId, sessionData.user.id, body);

    if (!updated) {
      return errorResponse("Task not found or not authorized", 404);
    }

    return successResponse(updated, 200);
  } catch (error) {
    console.error("Failed to update task:", error);
    return errorResponse("Failed to update task", 500);
  }
}

/**
 * Controller to delete a task.
 */
export async function deleteTaskController(
  taskId: string
): Promise<NextResponse> {
  try {
    const sessionData = await getServerSession();
    if (!sessionData || !sessionData.user) {
      return errorResponse("Unauthorized", 401);
    }

    const success = await deleteTask(taskId, sessionData.user.id);
    if (!success) {
      return errorResponse("Task not found or not authorized", 404);
    }

    return successResponse({ deleted: true }, 200);
  } catch (error) {
    console.error("Failed to delete task:", error);
    return errorResponse("Failed to delete task", 500);
  }
}

/**
 * Controller to fetch daily stats for user.
 */
export async function getTaskStatsController(): Promise<NextResponse> {
  try {
    const sessionData = await getServerSession();
    if (!sessionData || !sessionData.user) {
      return errorResponse("Unauthorized", 401);
    }

    const stats = await getUserDailyTaskStats(sessionData.user.id);
    return successResponse(stats, 200);
  } catch (error) {
    console.error("Failed to fetch task stats:", error);
    return errorResponse("Failed to fetch task stats", 500);
  }
}
