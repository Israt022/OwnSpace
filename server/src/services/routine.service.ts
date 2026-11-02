import prisma from "../lib/prisma";
import {
  CreateRoutineInput,
  UpdateRoutineInput,
  RoutineResponse,
  RoutineFilter,
  RoutineStats,
  DayOfWeek,
} from "../types";
import { timeToMinutes } from "../validators/routine.validator";

export async function getUserRoutines(
  userId: string,
  filter?: RoutineFilter
): Promise<RoutineResponse[]> {
  const where: Record<string, unknown> = { userId };

  if (filter?.dayOfWeek) {
    where.dayOfWeek = filter.dayOfWeek;
  }

  if (filter?.category && filter.category !== "All") {
    where.category = { equals: filter.category, mode: "insensitive" };
  }

  if (filter?.search && filter.search.trim()) {
    where.OR = [
      { title: { contains: filter.search.trim(), mode: "insensitive" } },
      { description: { contains: filter.search.trim(), mode: "insensitive" } },
    ];
  }

  const routines = await prisma.routine.findMany({
    where,
    orderBy: [{ startTime: "asc" }, { createdAt: "asc" }],
  });

  return routines.map((r) => ({
    ...r,
    dayOfWeek: r.dayOfWeek as DayOfWeek,
  }));
}

export async function getRoutineById(
  routineId: string,
  userId: string
): Promise<RoutineResponse | null> {
  const routine = await prisma.routine.findFirst({
    where: { id: routineId, userId },
  });
  if (!routine) return null;
  return { ...routine, dayOfWeek: routine.dayOfWeek as DayOfWeek };
}

export async function findOverlappingRoutine(
  userId: string,
  dayOfWeek: DayOfWeek,
  startTime: string,
  endTime: string,
  excludeRoutineId?: string
): Promise<RoutineResponse | null> {
  const routinesOnDay = await prisma.routine.findMany({
    where: {
      userId,
      dayOfWeek,
      ...(excludeRoutineId ? { id: { not: excludeRoutineId } } : {}),
    },
  });

  const conflict = routinesOnDay.find((r) => {
    return r.startTime < endTime && r.endTime > startTime;
  });

  if (!conflict) return null;
  return { ...conflict, dayOfWeek: conflict.dayOfWeek as DayOfWeek };
}

export async function createRoutine(
  userId: string,
  input: CreateRoutineInput
): Promise<RoutineResponse> {
  const created = await prisma.routine.create({
    data: {
      title: input.title.trim(),
      description: input.description?.trim() || null,
      dayOfWeek: input.dayOfWeek,
      startTime: input.startTime,
      endTime: input.endTime,
      category: input.category?.trim() || "General",
      reminder: input.reminder ?? false,
      color: input.color || null,
      userId,
    },
  });
  return { ...created, dayOfWeek: created.dayOfWeek as DayOfWeek };
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

  const updateData: Record<string, unknown> = {};
  if (input.title !== undefined) updateData.title = input.title.trim();
  if (input.description !== undefined) {
    updateData.description = input.description?.trim() || null;
  }
  if (input.dayOfWeek !== undefined) updateData.dayOfWeek = input.dayOfWeek;
  if (input.startTime !== undefined) updateData.startTime = input.startTime;
  if (input.endTime !== undefined) updateData.endTime = input.endTime;
  if (input.category !== undefined) updateData.category = input.category.trim();
  if (input.reminder !== undefined) updateData.reminder = input.reminder;
  if (input.color !== undefined) updateData.color = input.color;

  const updated = await prisma.routine.update({
    where: { id: routineId },
    data: updateData,
  });

  return { ...updated, dayOfWeek: updated.dayOfWeek as DayOfWeek };
}

export async function deleteRoutine(
  routineId: string,
  userId: string
): Promise<boolean> {
  const existing = await prisma.routine.findFirst({
    where: { id: routineId, userId },
  });
  if (!existing) return false;

  await prisma.routine.delete({
    where: { id: routineId },
  });
  return true;
}

export async function getUserRoutineStats(userId: string): Promise<RoutineStats> {
  const routines = await prisma.routine.findMany({
    where: { userId },
  });

  const byDay: Record<DayOfWeek, number> = {
    MONDAY: 0,
    TUESDAY: 0,
    WEDNESDAY: 0,
    THURSDAY: 0,
    FRIDAY: 0,
    SATURDAY: 0,
    SUNDAY: 0,
  };

  const catMap: Record<string, number> = {};
  let totalWeeklyMinutes = 0;

  for (const r of routines) {
    const day = r.dayOfWeek as DayOfWeek;
    if (byDay[day] !== undefined) byDay[day] += 1;

    const cat = r.category || "General";
    catMap[cat] = (catMap[cat] || 0) + 1;

    const duration = timeToMinutes(r.endTime) - timeToMinutes(r.startTime);
    if (duration > 0) totalWeeklyMinutes += duration;
  }

  const jsDay = new Date().getDay();
  // 0 is Sunday, 1 is Monday, etc.
  const dayMap: DayOfWeek[] = [
    "SUNDAY",
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
    "SATURDAY",
  ];
  const currentDay = dayMap[jsDay] || "MONDAY";
  const todayCount = byDay[currentDay] || 0;

  return {
    total: routines.length,
    byDay,
    categories: Object.entries(catMap).map(([name, count]) => ({ name, count })),
    todayCount,
    totalWeeklyMinutes,
  };
}
