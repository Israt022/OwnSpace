import prisma from "../lib/prisma";
import {
  DayOfWeek,
  RoutineEntryResponse,
  CreateRoutineEntryInput,
  UpdateRoutineEntryInput,
} from "../types";

export async function findOverlappingEntry(
  routineId: string,
  dayOfWeek: DayOfWeek,
  startTime: string,
  endTime: string,
  excludeEntryId?: string
): Promise<RoutineEntryResponse | null> {
  const entriesOnDay = await prisma.routine_entry.findMany({
    where: {
      routineId,
      dayOfWeek,
      ...(excludeEntryId ? { id: { not: excludeEntryId } } : {}),
    },
  });

  const conflict = entriesOnDay.find(
    (e) => e.startTime < endTime && e.endTime > startTime
  );
  if (!conflict) return null;

  return { ...conflict, dayOfWeek: conflict.dayOfWeek as DayOfWeek };
}

export async function addRoutineEntry(
  routineId: string,
  userId: string,
  input: CreateRoutineEntryInput
): Promise<RoutineEntryResponse | null> {
  const routine = await prisma.routine.findFirst({
    where: { id: routineId, userId },
  });
  if (!routine) return null;

  const entry = await prisma.routine_entry.create({
    data: {
      title: input.title.trim(),
      description: input.description?.trim() || null,
      category: input.category?.trim() || "General",
      dayOfWeek: input.dayOfWeek,
      startTime: input.startTime,
      endTime: input.endTime,
      location: input.location?.trim() || null,
      color: input.color || null,
      routineId,
    },
  });

  return { ...entry, dayOfWeek: entry.dayOfWeek as DayOfWeek };
}

export async function updateRoutineEntry(
  entryId: string,
  userId: string,
  input: UpdateRoutineEntryInput
): Promise<RoutineEntryResponse | null> {
  const entry = await prisma.routine_entry.findFirst({
    where: { id: entryId, routine: { userId } },
  });
  if (!entry) return null;

  const updateData: Record<string, unknown> = {};
  if (input.title !== undefined) updateData.title = input.title.trim();
  if (input.description !== undefined) updateData.description = input.description?.trim() || null;
  if (input.category !== undefined) updateData.category = input.category.trim();
  if (input.dayOfWeek !== undefined) updateData.dayOfWeek = input.dayOfWeek;
  if (input.startTime !== undefined) updateData.startTime = input.startTime;
  if (input.endTime !== undefined) updateData.endTime = input.endTime;
  if (input.location !== undefined) updateData.location = input.location?.trim() || null;
  if (input.color !== undefined) updateData.color = input.color;

  const updated = await prisma.routine_entry.update({
    where: { id: entryId },
    data: updateData,
  });

  return { ...updated, dayOfWeek: updated.dayOfWeek as DayOfWeek };
}

export async function deleteRoutineEntry(
  entryId: string,
  userId: string
): Promise<boolean> {
  const entry = await prisma.routine_entry.findFirst({
    where: { id: entryId, routine: { userId } },
  });
  if (!entry) return false;

  await prisma.routine_entry.delete({ where: { id: entryId } });
  return true;
}

