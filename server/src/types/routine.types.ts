export type DayOfWeek =
  | "MONDAY"
  | "TUESDAY"
  | "WEDNESDAY"
  | "THURSDAY"
  | "FRIDAY"
  | "SATURDAY"
  | "SUNDAY";

export interface RoutineResponse {
  id: string;
  title: string;
  description: string | null;
  dayOfWeek: DayOfWeek;
  startTime: string; // "HH:mm"
  endTime: string;   // "HH:mm"
  category: string;
  reminder: boolean;
  color: string | null;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

export interface CreateRoutineInput {
  title: string;
  description?: string | null;
  dayOfWeek: DayOfWeek;
  startTime: string;
  endTime: string;
  category?: string;
  reminder?: boolean;
  color?: string | null;
  allowOverlap?: boolean;
}

export interface UpdateRoutineInput {
  title?: string;
  description?: string | null;
  dayOfWeek?: DayOfWeek;
  startTime?: string;
  endTime?: string;
  category?: string;
  reminder?: boolean;
  color?: string | null;
  allowOverlap?: boolean;
}

export interface RoutineFilter {
  dayOfWeek?: DayOfWeek;
  category?: string;
  search?: string;
}

export interface RoutineStats {
  total: number;
  byDay: Record<DayOfWeek, number>;
  categories: { name: string; count: number }[];
  todayCount: number;
  totalWeeklyMinutes: number;
}

