"use client";

import { useMemo } from "react";
import { RoutineResponse, DayOfWeek } from "@server/types";
import { DAYS_OF_WEEK, getCurrentDayOfWeek } from "@/lib/constants/routine";
import RoutineWeeklyDayCard from "./RoutineWeeklyDayCard";

interface RoutineWeeklyGridProps {
  routines: RoutineResponse[];
  onEdit: (routine: RoutineResponse) => void;
  onOpenCreateWithDay: (day: DayOfWeek) => void;
}

export default function RoutineWeeklyGrid({
  routines,
  onEdit,
  onOpenCreateWithDay,
}: RoutineWeeklyGridProps) {
  const currentDay = useMemo(() => getCurrentDayOfWeek(), []);

  const routinesByDay = useMemo(() => {
    const map: Record<DayOfWeek, RoutineResponse[]> = {
      MONDAY: [],
      TUESDAY: [],
      WEDNESDAY: [],
      THURSDAY: [],
      FRIDAY: [],
      SATURDAY: [],
      SUNDAY: [],
    };
    routines.forEach((r) => {
      if (map[r.dayOfWeek]) {
        map[r.dayOfWeek].push(r);
      }
    });
    Object.keys(map).forEach((k) => {
      map[k as DayOfWeek].sort((a, b) => a.startTime.localeCompare(b.startTime));
    });
    return map;
  }, [routines]);

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: "1rem",
        alignItems: "start",
      }}
    >
      {DAYS_OF_WEEK.map((day) => (
        <RoutineWeeklyDayCard
          key={day.key}
          day={day}
          isToday={day.key === currentDay}
          dayRoutines={routinesByDay[day.key] || []}
          onEdit={onEdit}
          onOpenCreateWithDay={onOpenCreateWithDay}
        />
      ))}
    </div>
  );
}
