import { DayOfWeek } from "@server/types";

export interface DayOption {
  key: DayOfWeek;
  shortLabel: string;
  fullLabel: string;
}

export const DAYS_MONDAY_START: DayOption[] = [
  { key: "MONDAY", shortLabel: "Mon", fullLabel: "Monday" },
  { key: "TUESDAY", shortLabel: "Tue", fullLabel: "Tuesday" },
  { key: "WEDNESDAY", shortLabel: "Wed", fullLabel: "Wednesday" },
  { key: "THURSDAY", shortLabel: "Thu", fullLabel: "Thursday" },
  { key: "FRIDAY", shortLabel: "Fri", fullLabel: "Friday" },
  { key: "SATURDAY", shortLabel: "Sat", fullLabel: "Saturday" },
  { key: "SUNDAY", shortLabel: "Sun", fullLabel: "Sunday" },
];

export const DAYS_SATURDAY_START: DayOption[] = [
  { key: "SATURDAY", shortLabel: "Sat", fullLabel: "Saturday" },
  { key: "SUNDAY", shortLabel: "Sun", fullLabel: "Sunday" },
  { key: "MONDAY", shortLabel: "Mon", fullLabel: "Monday" },
  { key: "TUESDAY", shortLabel: "Tue", fullLabel: "Tuesday" },
  { key: "WEDNESDAY", shortLabel: "Wed", fullLabel: "Wednesday" },
  { key: "THURSDAY", shortLabel: "Thu", fullLabel: "Thursday" },
  { key: "FRIDAY", shortLabel: "Fri", fullLabel: "Friday" },
];

export const TIMETABLE_CATEGORIES = [
  "Lecture",
  "Lab",
  "Class",
  "Study",
  "Fitness",
  "Work",
  "Deep Work",
  "General",
] as const;

export const CATEGORY_STYLES: Record<string, { bg: string; text: string; border: string }> = {
  Lecture: { bg: "rgba(99, 102, 241, 0.14)", text: "#6366f1", border: "rgba(99, 102, 241, 0.4)" },
  Lab: { bg: "rgba(14, 165, 233, 0.14)", text: "#0ea5e9", border: "rgba(14, 165, 233, 0.4)" },
  Class: { bg: "rgba(168, 85, 247, 0.14)", text: "#a855f7", border: "rgba(168, 85, 247, 0.4)" },
  Study: { bg: "rgba(16, 185, 129, 0.14)", text: "#10b981", border: "rgba(16, 185, 129, 0.4)" },
  Fitness: { bg: "rgba(245, 158, 11, 0.14)", text: "#f59e0b", border: "rgba(245, 158, 11, 0.4)" },
  Work: { bg: "rgba(59, 130, 246, 0.14)", text: "#3b82f6", border: "rgba(59, 130, 246, 0.4)" },
  "Deep Work": { bg: "rgba(236, 72, 153, 0.14)", text: "#ec4899", border: "rgba(236, 72, 153, 0.4)" },
  General: { bg: "rgba(107, 114, 128, 0.14)", text: "#6b7280", border: "rgba(107, 114, 128, 0.4)" },
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
  const diff = (endH * 60 + endM) - (startH * 60 + startM);
  if (diff <= 0) return "0m";
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

export function getHoursRange(earliestHour = 8, latestHour = 18): number[] {
  const hours: number[] = [];
  for (let h = earliestHour; h <= latestHour; h++) {
    hours.push(h);
  }
  return hours;
}
