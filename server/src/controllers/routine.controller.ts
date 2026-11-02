import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/session";
import {
  getUserRoutines,
  createRoutine,
  updateRoutine,
  deleteRoutine,
  getUserRoutineStats,
  findOverlappingRoutine,
  getRoutineById,
} from "../services/routine.service";
import { successResponse, errorResponse } from "../utils/api-response";
import {
  CreateRoutineInput,
  UpdateRoutineInput,
  DayOfWeek,
} from "../types";
import {
  validateCreateRoutineInput,
  validateUpdateRoutineInput,
  validateRoutineTimes,
  isValidDayOfWeek,
} from "../validators/routine.validator";

export async function getRoutinesController(req: Request): Promise<NextResponse> {
  try {
    const sessionData = await getServerSession();
    if (!sessionData || !sessionData.user) {
      return errorResponse("Unauthorized", 401);
    }

    const { searchParams } = new URL(req.url);
    const dayParam = searchParams.get("day");
    const category = searchParams.get("category") || undefined;
    const search = searchParams.get("search") || undefined;

    const dayOfWeek = dayParam && isValidDayOfWeek(dayParam.toUpperCase())
      ? (dayParam.toUpperCase() as DayOfWeek)
      : undefined;

    const routines = await getUserRoutines(sessionData.user.id, {
      dayOfWeek,
      category,
      search,
    });

    return successResponse(routines, 200);
  } catch (error) {
    console.error("Failed to fetch routines:", error);
    return errorResponse("Failed to fetch routines", 500);
  }
}

export async function createRoutineController(req: Request): Promise<NextResponse> {
  try {
    const sessionData = await getServerSession();
    if (!sessionData || !sessionData.user) {
      return errorResponse("Unauthorized", 401);
    }

    const body = (await req.json()) as CreateRoutineInput;
    const validationError = validateCreateRoutineInput(body);
    if (validationError) {
      return errorResponse(validationError, 400);
    }

    if (!body.allowOverlap) {
      const conflict = await findOverlappingRoutine(
        sessionData.user.id,
        body.dayOfWeek,
        body.startTime,
        body.endTime
      );
      if (conflict) {
        return errorResponse(
          `Time conflicts with "${conflict.title}" (${conflict.startTime} - ${conflict.endTime})`,
          409
        );
      }
    }

    const routine = await createRoutine(sessionData.user.id, body);
    return successResponse(routine, 201);
  } catch (error) {
    console.error("Failed to create routine:", error);
    return errorResponse("Failed to create routine", 500);
  }
}

export async function updateRoutineController(
  routineId: string,
  req: Request
): Promise<NextResponse> {
  try {
    const sessionData = await getServerSession();
    if (!sessionData || !sessionData.user) {
      return errorResponse("Unauthorized", 401);
    }

    const existing = await getRoutineById(routineId, sessionData.user.id);
    if (!existing) {
      return errorResponse("Routine not found or not authorized", 404);
    }

    const body = (await req.json()) as UpdateRoutineInput;
    const validationError = validateUpdateRoutineInput(body);
    if (validationError) {
      return errorResponse(validationError, 400);
    }

    const targetDay = body.dayOfWeek || existing.dayOfWeek;
    const targetStart = body.startTime || existing.startTime;
    const targetEnd = body.endTime || existing.endTime;

    const timeError = validateRoutineTimes(targetStart, targetEnd);
    if (timeError) {
      return errorResponse(timeError, 400);
    }

    if (!body.allowOverlap) {
      const conflict = await findOverlappingRoutine(
        sessionData.user.id,
        targetDay,
        targetStart,
        targetEnd,
        routineId
      );
      if (conflict) {
        return errorResponse(
          `Time conflicts with "${conflict.title}" (${conflict.startTime} - ${conflict.endTime})`,
          409
        );
      }
    }

    const updated = await updateRoutine(routineId, sessionData.user.id, body);
    return successResponse(updated, 200);
  } catch (error) {
    console.error("Failed to update routine:", error);
    return errorResponse("Failed to update routine", 500);
  }
}

export async function deleteRoutineController(routineId: string): Promise<NextResponse> {
  try {
    const sessionData = await getServerSession();
    if (!sessionData || !sessionData.user) {
      return errorResponse("Unauthorized", 401);
    }

    const success = await deleteRoutine(routineId, sessionData.user.id);
    if (!success) {
      return errorResponse("Routine not found or not authorized", 404);
    }

    return successResponse({ deleted: true }, 200);
  } catch (error) {
    console.error("Failed to delete routine:", error);
    return errorResponse("Failed to delete routine", 500);
  }
}

export async function getRoutineStatsController(): Promise<NextResponse> {
  try {
    const sessionData = await getServerSession();
    if (!sessionData || !sessionData.user) {
      return errorResponse("Unauthorized", 401);
    }

    const stats = await getUserRoutineStats(sessionData.user.id);
    return successResponse(stats, 200);
  } catch (error) {
    console.error("Failed to fetch routine stats:", error);
    return errorResponse("Failed to fetch routine stats", 500);
  }
}

