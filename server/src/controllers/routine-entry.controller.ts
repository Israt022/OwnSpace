import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/session";
import {
  addRoutineEntry,
  updateRoutineEntry,
  deleteRoutineEntry,
  findOverlappingEntry,
} from "../services/routine-entry.service";
import { getRoutineById } from "../services/routine.service";
import { successResponse, errorResponse } from "../utils/api-response";
import { CreateRoutineEntryInput, UpdateRoutineEntryInput } from "../types";
import {
  validateCreateEntryInput,
  validateUpdateEntryInput,
  validateRoutineTimes,
} from "../validators/routine.validator";

export async function createEntryController(
  routineId: string,
  req: Request
): Promise<NextResponse> {
  try {
    const sessionData = await getServerSession();
    if (!sessionData?.user) return errorResponse("Unauthorized", 401);

    const routine = await getRoutineById(routineId, sessionData.user.id);
    if (!routine) return errorResponse("Routine not found or not authorized", 404);

    const body = (await req.json()) as CreateRoutineEntryInput;
    const validationError = validateCreateEntryInput(body);
    if (validationError) return errorResponse(validationError, 400);

    if (!body.allowOverlap) {
      const conflict = await findOverlappingEntry(
        routineId,
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

    const entry = await addRoutineEntry(routineId, sessionData.user.id, body);
    return successResponse(entry, 201);
  } catch (error) {
    console.error("Failed to add routine entry:", error);
    return errorResponse("Failed to add routine entry", 500);
  }
}

export async function updateEntryController(
  entryId: string,
  req: Request
): Promise<NextResponse> {
  try {
    const sessionData = await getServerSession();
    if (!sessionData?.user) return errorResponse("Unauthorized", 401);

    const body = (await req.json()) as UpdateRoutineEntryInput;
    const validationError = validateUpdateEntryInput(body);
    if (validationError) return errorResponse(validationError, 400);

    if (body.startTime && body.endTime) {
      const timeError = validateRoutineTimes(body.startTime, body.endTime);
      if (timeError) return errorResponse(timeError, 400);
    }

    const updated = await updateRoutineEntry(entryId, sessionData.user.id, body);
    if (!updated) return errorResponse("Entry not found or not authorized", 404);

    return successResponse(updated, 200);
  } catch (error) {
    console.error("Failed to update routine entry:", error);
    return errorResponse("Failed to update routine entry", 500);
  }
}

export async function deleteEntryController(entryId: string): Promise<NextResponse> {
  try {
    const sessionData = await getServerSession();
    if (!sessionData?.user) return errorResponse("Unauthorized", 401);

    const success = await deleteRoutineEntry(entryId, sessionData.user.id);
    if (!success) return errorResponse("Entry not found or not authorized", 404);

    return successResponse({ deleted: true }, 200);
  } catch (error) {
    console.error("Failed to delete routine entry:", error);
    return errorResponse("Failed to delete routine entry", 500);
  }
}
