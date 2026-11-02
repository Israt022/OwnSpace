import {
  DayOfWeek,
  CreateRoutineInput,
  UpdateRoutineInput,
  CreateRoutineEntryInput,
  UpdateRoutineEntryInput,
} from "../types";

const VALID_DAYS: DayOfWeek[] = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
];

const TIME_REGEX = /^([01]\d|2[0-3]):([0-5]\d)$/;

export function isValidTimeFormat(time: string): boolean {
  return TIME_REGEX.test(time);
}

export function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

export function isValidDayOfWeek(day: unknown): day is DayOfWeek {
  return typeof day === "string" && VALID_DAYS.includes(day as DayOfWeek);
}

export function validateRoutineTimes(startTime: string, endTime: string): string | null {
  if (!isValidTimeFormat(startTime)) {
    return "Start time must be in HH:mm 24-hour format (e.g. 09:00)";
  }
  if (!isValidTimeFormat(endTime)) {
    return "End time must be in HH:mm 24-hour format (e.g. 10:30)";
  }
  if (timeToMinutes(endTime) <= timeToMinutes(startTime)) {
    return "End time must be strictly later than start time";
  }
  return null;
}

export function validateCreateRoutineInput(input: CreateRoutineInput): string | null {
  if (!input.name || !input.name.trim()) {
    return "Routine name is required";
  }
  if (input.name.trim().length > 80) {
    return "Routine name must be 80 characters or less";
  }
  return null;
}

export function validateUpdateRoutineInput(input: UpdateRoutineInput): string | null {
  if (input.name !== undefined && !input.name.trim()) {
    return "Routine name cannot be empty";
  }
  if (input.name && input.name.trim().length > 80) {
    return "Routine name must be 80 characters or less";
  }
  return null;
}

export function validateCreateEntryInput(input: CreateRoutineEntryInput): string | null {
  if (!input.title || !input.title.trim()) {
    return "Activity title or subject is required";
  }
  if (input.title.trim().length > 100) {
    return "Activity title must be 100 characters or less";
  }
  if (!isValidDayOfWeek(input.dayOfWeek)) {
    return "Invalid day of week specified";
  }
  const timeErr = validateRoutineTimes(input.startTime, input.endTime);
  if (timeErr) return timeErr;
  return null;
}

export function validateUpdateEntryInput(input: UpdateRoutineEntryInput): string | null {
  if (input.title !== undefined && !input.title.trim()) {
    return "Activity title cannot be empty";
  }
  if (input.dayOfWeek !== undefined && !isValidDayOfWeek(input.dayOfWeek)) {
    return "Invalid day of week specified";
  }
  if (input.startTime !== undefined || input.endTime !== undefined) {
    if (input.startTime && !isValidTimeFormat(input.startTime)) {
      return "Start time must be in HH:mm format";
    }
    if (input.endTime && !isValidTimeFormat(input.endTime)) {
      return "End time must be in HH:mm format";
    }
  }
  return null;
}
