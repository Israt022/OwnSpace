import prisma from "../lib/prisma";
import {
  DayOfWeek,
  RoutineResponse,
  CreateRoutineInput,
  UpdateRoutineInput,
} from "../types";

export async function getUserRoutines(userId: string): Promise<RoutineResponse[]> {
  const routines = await prisma.routine.findMany({
    where: { userId },
    include: {
      entries: {
        orderBy: [{ startTime: "asc" }, { createdAt: "asc" }],
      },
    },
    orderBy: [{ isDefault: "desc" }, { createdAt: "asc" }],
  });

  return routines.map((r) => ({
    ...r,
    entries: r.entries.map((e) => ({
      ...e,
      dayOfWeek: e.dayOfWeek as DayOfWeek,
    })),
  }));
}

export async function getRoutineById(
  routineId: string,
  userId: string
): Promise<RoutineResponse | null> {
  const routine = await prisma.routine.findFirst({
    where: { id: routineId, userId },
    include: {
      entries: {
        orderBy: [{ startTime: "asc" }, { createdAt: "asc" }],
      },
    },
  });

  if (!routine) return null;
  return {
    ...routine,
    entries: routine.entries.map((e) => ({
      ...e,
      dayOfWeek: e.dayOfWeek as DayOfWeek,
    })),
  };
}

export async function createRoutine(
  userId: string,
  input: CreateRoutineInput
): Promise<RoutineResponse> {
  const existingCount = await prisma.routine.count({ where: { userId } });
  const isDefault = input.isDefault ?? existingCount === 0;

  if (isDefault && existingCount > 0) {
    await prisma.routine.updateMany({
      where: { userId },
      data: { isDefault: false },
    });
  }

  const created = await prisma.routine.create({
    data: {
      name: input.name.trim(),
      description: input.description?.trim() || null,
      color: input.color || null,
      isDefault,
      userId,
    },
    include: { entries: true },
  });

  return { ...created, entries: [] };
}

export async function updateRoutine(
  routineId: string,
  userId: string,
  input: UpdateRoutineInput
): Promise<RoutineResponse | null> {
  const existing = await prisma.routine.findFirst({
    where: { id: routineId, userId },
  });
  if (!existing) return null;

  if (input.isDefault) {
    await prisma.routine.updateMany({
      where: { userId },
      data: { isDefault: false },
    });
  }

  const updateData: Record<string, unknown> = {};
  if (input.name !== undefined) updateData.name = input.name.trim();
  if (input.description !== undefined) updateData.description = input.description?.trim() || null;
  if (input.color !== undefined) updateData.color = input.color;
  if (input.isDefault !== undefined) updateData.isDefault = input.isDefault;

  const updated = await prisma.routine.update({
    where: { id: routineId },
    data: updateData,
    include: {
      entries: {
        orderBy: [{ startTime: "asc" }, { createdAt: "asc" }],
      },
    },
  });

  return {
    ...updated,
    entries: updated.entries.map((e) => ({
      ...e,
      dayOfWeek: e.dayOfWeek as DayOfWeek,
    })),
  };
}

export async function deleteRoutine(
  routineId: string,
  userId: string
): Promise<boolean> {
  const existing = await prisma.routine.findFirst({
    where: { id: routineId, userId },
  });
  if (!existing) return false;

  await prisma.routine.delete({ where: { id: routineId } });
  return true;
}
