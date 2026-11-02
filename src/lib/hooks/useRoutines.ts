import { useState, useEffect, useCallback, useMemo } from "react";
import { RoutineResponse, RoutineStats, DayOfWeek, CreateRoutineInput, UpdateRoutineInput } from "@server/types";
import {
  fetchRoutines,
  fetchRoutineStats,
  createRoutineApi,
  updateRoutineApi,
  deleteRoutineApi,
} from "../api/routine";
import { getCurrentDayOfWeek } from "../constants/routine";

export function useRoutines() {
  const [routines, setRoutines] = useState<RoutineResponse[]>([]);
  const [stats, setStats] = useState<RoutineStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState<DayOfWeek | "ALL">(() => getCurrentDayOfWeek());
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"timeline" | "weekly">("timeline");
  const [actionError, setActionError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    try {
      const [list, statsData] = await Promise.all([
        fetchRoutines(),
        fetchRoutineStats(),
      ]);
      setRoutines(list);
      setStats(statsData);
      setActionError(null);
    } catch (err) {
      console.error("Failed to load routines:", err);
      setActionError("Failed to load routines.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;

    Promise.all([fetchRoutines(), fetchRoutineStats()])
      .then(([list, statsData]) => {
        if (!ignore) {
          setRoutines(list);
          setStats(statsData);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!ignore) {
          console.error("Failed to load routines:", err);
          setActionError("Failed to load routines.");
          setLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, []);

  const filteredRoutines = useMemo(() => {
    return routines.filter((r) => {
      const matchDay = selectedDay === "ALL" || r.dayOfWeek === selectedDay;
      const matchCat = categoryFilter === "All" || r.category === categoryFilter;
      const matchSearch =
        !searchQuery.trim() ||
        r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (r.description && r.description.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchDay && matchCat && matchSearch;
    });
  }, [routines, selectedDay, categoryFilter, searchQuery]);

  const createRoutine = async (input: CreateRoutineInput) => {
    setActionError(null);
    const res = await createRoutineApi(input);
    if (!res.success) {
      throw new Error(res.error || "Failed to create routine");
    }
    await loadData();
    return res.data;
  };

  const updateRoutine = async (id: string, input: UpdateRoutineInput) => {
    setActionError(null);
    const res = await updateRoutineApi(id, input);
    if (!res.success) {
      throw new Error(res.error || "Failed to update routine");
    }
    await loadData();
    return res.data;
  };

  const deleteRoutine = async (id: string) => {
    setActionError(null);
    const success = await deleteRoutineApi(id);
    if (!success) {
      throw new Error("Failed to delete routine");
    }
    await loadData();
  };

  return {
    routines,
    filteredRoutines,
    stats,
    loading,
    actionError,
    selectedDay,
    setSelectedDay,
    categoryFilter,
    setCategoryFilter,
    searchQuery,
    setSearchQuery,
    viewMode,
    setViewMode,
    refresh: loadData,
    createRoutine,
    updateRoutine,
    deleteRoutine,
  };
}
