export type DayOfWeek =
  | "MONDAY"
  | "TUESDAY"
  | "WEDNESDAY"
  | "THURSDAY"
  | "FRIDAY"
  | "SATURDAY"
  | "SUNDAY";

export interface RoutineEntryResponse {
  id: string;
  title: string;
  description: string | null;
  category: string;
  dayOfWeek: DayOfWeek;
  startTime: string; // "HH:mm" (24h)
  endTime: string;   // "HH:mm" (24h)
  location: string | null;
  color: string | null;
  routineId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface RoutineResponse {
  id: string;
  name: string;
  description: string | null;
  color: string | null;
  isDefault: boolean;
  userId: string;
  entries: RoutineEntryResponse[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateRoutineInput {
  name: string;
  description?: string | null;
  color?: string | null;
  isDefault?: boolean;
}

export interface UpdateRoutineInput {
  name?: string;
  description?: string | null;
  color?: string | null;
  isDefault?: boolean;
}

export interface CreateRoutineEntryInput {
  title: string;
  description?: string | null;
  category?: string;
  dayOfWeek: DayOfWeek;
  startTime: string; // "HH:mm"
  endTime: string;   // "HH:mm"
  location?: string | null;
  color?: string | null;
  allowOverlap?: boolean;
}

export interface UpdateRoutineEntryInput {
  title?: string;
  description?: string | null;
  category?: string;
  dayOfWeek?: DayOfWeek;
  startTime?: string;
  endTime?: string;
  location?: string | null;
  color?: string | null;
  allowOverlap?: boolean;
}
