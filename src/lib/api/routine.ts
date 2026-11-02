import {
  RoutineResponse,
  CreateRoutineInput,
  UpdateRoutineInput,
  RoutineStats,
} from "@server/types";

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export async function fetchRoutines(
  day?: string,
  category?: string,
  search?: string
): Promise<RoutineResponse[]> {
  const params = new URLSearchParams();
  if (day && day !== "ALL") params.append("day", day);
  if (category && category !== "All") params.append("category", category);
  if (search?.trim()) params.append("search", search.trim());

  const query = params.toString() ? `?${params.toString()}` : "";
  const res = await fetch(`/api/routines${query}`);
  if (!res.ok) throw new Error("Failed to load routines");
  const json: ApiResponse<RoutineResponse[]> = await res.json();
  return json.data || [];
}

export async function fetchRoutineStats(): Promise<RoutineStats | null> {
  const res = await fetch("/api/routines/stats");
  if (!res.ok) return null;
  const json: ApiResponse<RoutineStats> = await res.json();
  return json.data || null;
}

export async function createRoutineApi(
  input: CreateRoutineInput
): Promise<{ success: boolean; data?: RoutineResponse; error?: string }> {
  const res = await fetch("/api/routines", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  const json: ApiResponse<RoutineResponse> = await res.json();
  if (!res.ok || !json.success) {
    return { success: false, error: json.message || "Failed to create routine" };
  }
  return { success: true, data: json.data };
}

export async function updateRoutineApi(
  id: string,
  input: UpdateRoutineInput
): Promise<{ success: boolean; data?: RoutineResponse; error?: string }> {
  const res = await fetch(`/api/routines/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  const json: ApiResponse<RoutineResponse> = await res.json();
  if (!res.ok || !json.success) {
    return { success: false, error: json.message || "Failed to update routine" };
  }
  return { success: true, data: json.data };
}

export async function deleteRoutineApi(id: string): Promise<boolean> {
  const res = await fetch(`/api/routines/${id}`, {
    method: "DELETE",
  });
  const json: ApiResponse<{ deleted: boolean }> = await res.json();
  return Boolean(res.ok && json.success);
}

