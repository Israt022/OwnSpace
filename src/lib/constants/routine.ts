import { DayOfWeek } from "@server/types";

export interface DayOption {
  key: DayOfWeek;
  shortLabel: string;
  fullLabel: string;
}

export const DAYS_OF_WEEK: DayOption[] = [
  { key: "MONDAY", shortLabel: "Mon", fullLabel: "Monday" },
  { key: "TUESDAY", shortLabel: "Tue", fullLabel: "Tuesday" },
  { key: "WEDNESDAY", shortLabel: "Wed", fullLabel: "Wednesday" },
  { key: "THURSDAY", shortLabel: "Thu", fullLabel: "Thursday" },
  { key: "FRIDAY", shortLabel: "Fri", fullLabel: "Friday" },
  { key: "SATURDAY", shortLabel: "Sat", fullLabel: "Saturday" },
  { key: "SUNDAY", shortLabel: "Sun", fullLabel: "Sunday" },
];

export const ROUTINE_CATEGORIES = [
  "Study",
  "Work",
  "Fitness",
  "Health",
  "Personal",
  "Deep Work",
  "Reading",
  "General",
] as const;

export const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  Study: { bg: "rgba(99, 102, 241, 0.12)", text: "#6366f1", border: "rgba(99, 102, 241, 0.3)" },
  Work: { bg: "rgba(59, 130, 246, 0.12)", text: "#3b82f6", border: "rgba(59, 130, 246, 0.3)" },
  Fitness: { bg: "rgba(16, 185, 129, 0.12)", text: "#10b981", border: "rgba(16, 185, 129, 0.3)" },
  Health: { bg: "rgba(20, 184, 166, 0.12)", text: "#14b8a6", border: "rgba(20, 184, 166, 0.3)" },
  Personal: { bg: "rgba(236, 72, 153, 0.12)", text: "#ec4899", border: "rgba(236, 72, 153, 0.3)" },
  "Deep Work": { bg: "rgba(168, 85, 247, 0.12)", text: "#a855f7", border: "rgba(168, 85, 247, 0.3)" },
  Reading: { bg: "rgba(245, 158, 11, 0.12)", text: "#f59e0b", border: "rgba(245, 158, 11, 0.3)" },
  General: { bg: "rgba(107, 114, 128, 0.12)", text: "#6b7280", border: "rgba(107, 114, 128, 0.3)" },
};

export function formatTime12Hour(time24: string): string {
  if (!time24 || !time24.includes(":")) return time24;
  const [hStr, mStr] = time24.split(":");
  let hour = parseInt(hStr, 10);
  const minutes = mStr || "00";
  const ampm = hour >= 12 ? "PM" : "AM";
  hour = hour % 12;
  if (hour === 0) hour = 12;
  return `${hour}:${minutes} ${ampm}`;
}

export function calculateDuration(startTime: string, endTime: string): string {
  const [startH, startM] = startTime.split(":").map(Number);
  const [endH, endM] = endTime.split(":").map(Number);
  const startTotal = startH * 60 + startM;
  const endTotal = endH * 60 + endM;
  const diff = endTotal - startTotal;
  if (diff <= 0) return "0 mins";
  const hrs = Math.floor(diff / 60);
  const mins = diff % 60;
  if (hrs > 0 && mins > 0) return `${hrs}h ${mins}m`;
  if (hrs > 0) return `${hrs}h`;
  return `${mins}m`;
}

export function getCurrentDayOfWeek(): DayOfWeek {
  const dayIndex = new Date().getDay();
  const map: DayOfWeek[] = [
    "SUNDAY",
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
    "SATURDAY",
  ];
  return map[dayIndex] || "MONDAY";
}

export function getRoutineStatus(
  day: DayOfWeek,
  startTime: string,
  endTime: string
): "active" | "upcoming" | "passed" {
  const today = getCurrentDayOfWeek();
  if (day !== today) return "upcoming";

  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const [sH, sM] = startTime.split(":").map(Number);
  const [eH, eM] = endTime.split(":").map(Number);
  const startMin = sH * 60 + sM;
  const endMin = eH * 60 + eM;

  if (currentMinutes >= startMin && currentMinutes < endMin) {
    return "active";
  }
  if (currentMinutes < startMin) {
    return "upcoming";
  }
  return "passed";
}

