import { useState, useEffect, useCallback, useMemo } from "react";
import {
  RoutineResponse,
  CreateRoutineInput,
  UpdateRoutineInput,
  CreateRoutineEntryInput,
  UpdateRoutineEntryInput,
  DayOfWeek,
} from "@server/types";
import {
  fetchUserRoutines,
  createRoutineApi,
  updateRoutineApi,
  deleteRoutineApi,
  createEntryApi,
  updateEntryApi,
  deleteEntryApi,
} from "../api/routine";
import { getCurrentDayOfWeek } from "../constants/routine";

export function useRoutines() {
  const [routines, setRoutines] = useState<RoutineResponse[]>([]);
  const [activeRoutineId, setActiveRoutineId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState<DayOfWeek | "ALL">(() => getCurrentDayOfWeek());
  const [dayStartOption, setDayStartOption] = useState<"MONDAY" | "SATURDAY">("MONDAY");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  const loadData = useCallback(async (selectId?: string) => {
    try {
      const list = await fetchUserRoutines();
      setRoutines(list);
      setActiveRoutineId((prev) => {
        if (selectId && list.some((r) => r.id === selectId)) return selectId;
        if (prev && list.some((r) => r.id === prev)) return prev;
        const defaultRoutine = list.find((r) => r.isDefault);
        return defaultRoutine ? defaultRoutine.id : (list[0]?.id ?? null);
      });
    } catch (err) {
      console.error("Failed to load routines:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;
    fetchUserRoutines()
      .then((list) => {
        if (!ignore) {
          setRoutines(list);
          const defaultRoutine = list.find((r) => r.isDefault);
          setActiveRoutineId(defaultRoutine ? defaultRoutine.id : (list[0]?.id ?? null));
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!ignore) {
          console.error("Failed to load routines on mount:", err);
          setLoading(false);
        }
      });
    return () => {
      ignore = true;
    };
  }, []);

  const activeRoutine = useMemo(() => {
    return routines.find((r) => r.id === activeRoutineId);
  }, [routines, activeRoutineId]);

  const filteredEntries = useMemo(() => {
    if (!activeRoutine) return [];
    return activeRoutine.entries.filter((entry) => {
      const matchDay = selectedDay === "ALL" || entry.dayOfWeek === selectedDay;
      const matchCat = categoryFilter === "All" || entry.category === categoryFilter;
      const matchSearch =
        !searchQuery.trim() ||
        entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (entry.description && entry.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (entry.location && entry.location.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchDay && matchCat && matchSearch;
    });
  }, [activeRoutine, selectedDay, categoryFilter, searchQuery]);

  const handleCreateRoutine = async (input: CreateRoutineInput) => {
    const res = await createRoutineApi(input);
    if (!res.success || !res.data) throw new Error(res.error || "Failed to create routine");
    await loadData(res.data.id);
    return res.data;
  };

  const handleUpdateRoutine = async (id: string, input: UpdateRoutineInput) => {
    const res = await updateRoutineApi(id, input);
    if (!res.success) throw new Error(res.error || "Failed to update routine");
    await loadData(id);
    return res.data;
  };

  const handleDeleteRoutine = async (id: string) => {
    const success = await deleteRoutineApi(id);
    if (!success) throw new Error("Failed to delete routine");
    await loadData();
  };

  const handleAddEntry = async (input: CreateRoutineEntryInput) => {
    if (!activeRoutineId) throw new Error("No active routine selected");
    const res = await createEntryApi(activeRoutineId, input);
    if (!res.success || !res.data) throw new Error(res.error || "Failed to add entry");
    await loadData(activeRoutineId);
    return res.data;
  };

  const handleUpdateEntry = async (entryId: string, input: UpdateRoutineEntryInput) => {
    const res = await updateEntryApi(entryId, input);
    if (!res.success) throw new Error(res.error || "Failed to update entry");
    await loadData(activeRoutineId ?? undefined);
    return res.data;
  };

  const handleDeleteEntry = async (entryId: string) => {
    const success = await deleteEntryApi(entryId);
    if (!success) throw new Error("Failed to delete entry");
    await loadData(activeRoutineId ?? undefined);
  };

  return {
    routines,
    activeRoutine,
    activeRoutineId,
    setActiveRoutineId,
    loading,
    selectedDay,
    setSelectedDay,
    dayStartOption,
    setDayStartOption,
    searchQuery,
    setSearchQuery,
    categoryFilter,
    setCategoryFilter,
    filteredEntries,
    refresh: loadData,
    createRoutine: handleCreateRoutine,
    updateRoutine: handleUpdateRoutine,
    deleteRoutine: handleDeleteRoutine,
    addEntry: handleAddEntry,
    updateEntry: handleUpdateEntry,
    deleteEntry: handleDeleteEntry,
  };
}
