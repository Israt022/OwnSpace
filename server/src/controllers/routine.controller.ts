import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/session";
import {
  getUserRoutines,
  getRoutineById,
  createRoutine,
  updateRoutine,
  deleteRoutine,
} from "../services/routine.service";
import { successResponse, errorResponse } from "../utils/api-response";
import { CreateRoutineInput, UpdateRoutineInput } from "../types";
import {
  validateCreateRoutineInput,
  validateUpdateRoutineInput,
} from "../validators/routine.validator";

export async function getRoutinesController(): Promise<NextResponse> {
  try {
    const sessionData = await getServerSession();
    if (!sessionData?.user) return errorResponse("Unauthorized", 401);

    const routines = await getUserRoutines(sessionData.user.id);
    return successResponse(routines, 200);
  } catch (error) {
    console.error("Failed to fetch routines:", error);
    return errorResponse("Failed to fetch routines", 500);
  }
}

export async function getRoutineByIdController(routineId: string): Promise<NextResponse> {
  try {
    const sessionData = await getServerSession();
    if (!sessionData?.user) return errorResponse("Unauthorized", 401);

    const routine = await getRoutineById(routineId, sessionData.user.id);
    if (!routine) return errorResponse("Routine not found or not authorized", 404);

    return successResponse(routine, 200);
  } catch (error) {
    console.error("Failed to fetch routine:", error);
    return errorResponse("Failed to fetch routine", 500);
  }
}

export async function createRoutineController(req: Request): Promise<NextResponse> {
  try {
    const sessionData = await getServerSession();
    if (!sessionData?.user) return errorResponse("Unauthorized", 401);

    const body = (await req.json()) as CreateRoutineInput;
    const validationError = validateCreateRoutineInput(body);
    if (validationError) return errorResponse(validationError, 400);

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
    if (!sessionData?.user) return errorResponse("Unauthorized", 401);

    const body = (await req.json()) as UpdateRoutineInput;
    const validationError = validateUpdateRoutineInput(body);
    if (validationError) return errorResponse(validationError, 400);

    const updated = await updateRoutine(routineId, sessionData.user.id, body);
    if (!updated) return errorResponse("Routine not found or not authorized", 404);

    return successResponse(updated, 200);
  } catch (error) {
    console.error("Failed to update routine:", error);
    return errorResponse("Failed to update routine", 500);
  }
}

export async function deleteRoutineController(routineId: string): Promise<NextResponse> {
  try {
    const sessionData = await getServerSession();
    if (!sessionData?.user) return errorResponse("Unauthorized", 401);

    const success = await deleteRoutine(routineId, sessionData.user.id);
    if (!success) return errorResponse("Routine not found or not authorized", 404);

    return successResponse({ deleted: true }, 200);
  } catch (error) {
    console.error("Failed to delete routine:", error);
    return errorResponse("Failed to delete routine", 500);
  }
}
