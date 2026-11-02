import {
  RoutineResponse,
  RoutineEntryResponse,
  CreateRoutineInput,
  UpdateRoutineInput,
  CreateRoutineEntryInput,
  UpdateRoutineEntryInput,
} from "@server/types";

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export async function fetchUserRoutines(): Promise<RoutineResponse[]> {
  const res = await fetch("/api/routines");
  if (!res.ok) throw new Error("Failed to load routines");
  const json: ApiResponse<RoutineResponse[]> = await res.json();
  return json.data || [];
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
  const res = await fetch(`/api/routines/${id}`, { method: "DELETE" });
  const json: ApiResponse<{ deleted: boolean }> = await res.json();
  return Boolean(res.ok && json.success);
}

export async function createEntryApi(
  routineId: string,
  input: CreateRoutineEntryInput
): Promise<{ success: boolean; data?: RoutineEntryResponse; error?: string }> {
  const res = await fetch(`/api/routines/${routineId}/entries`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  const json: ApiResponse<RoutineEntryResponse> = await res.json();
  if (!res.ok || !json.success) {
    return { success: false, error: json.message || "Failed to add entry" };
  }
  return { success: true, data: json.data };
}

export async function updateEntryApi(
  entryId: string,
  input: UpdateRoutineEntryInput
): Promise<{ success: boolean; data?: RoutineEntryResponse; error?: string }> {
  const res = await fetch(`/api/routines/entries/${entryId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  const json: ApiResponse<RoutineEntryResponse> = await res.json();
  if (!res.ok || !json.success) {
    return { success: false, error: json.message || "Failed to update entry" };
  }
  return { success: true, data: json.data };
}

export async function deleteEntryApi(entryId: string): Promise<boolean> {
  const res = await fetch(`/api/routines/entries/${entryId}`, { method: "DELETE" });
  const json: ApiResponse<{ deleted: boolean }> = await res.json();
  return Boolean(res.ok && json.success);
}
