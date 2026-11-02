"use client";

import { useState } from "react";
import DashboardShell from "@/components/dashboard/shared/DashboardShell";
import ConfirmDialog from "@/components/dashboard/shared/ConfirmDialog";
import { RoutineResponse, DayOfWeek, CreateRoutineInput } from "@server/types";
import { SessionUser } from "@/lib/session";
import { useRoutines } from "@/lib/hooks/useRoutines";
import RoutineHeader from "@/components/dashboard/routine/RoutineHeader";
import RoutineStatsBar from "@/components/dashboard/routine/RoutineStatsBar";
import RoutineDaySelector from "@/components/dashboard/routine/RoutineDaySelector";
import RoutineTimeline from "@/components/dashboard/routine/RoutineTimeline";
import RoutineWeeklyGrid from "@/components/dashboard/routine/RoutineWeeklyGrid";
import RoutineFormDialog from "@/components/dashboard/routine/RoutineFormDialog";

interface RoutineClientProps {
  user: SessionUser;
}

export default function RoutineClient({ user }: RoutineClientProps) {
  const {
    routines,
    filteredRoutines,
    stats,
    loading,
    selectedDay,
    setSelectedDay,
    categoryFilter,
    setCategoryFilter,
    searchQuery,
    setSearchQuery,
    viewMode,
    setViewMode,
    createRoutine,
    updateRoutine,
    deleteRoutine,
  } = useRoutines();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRoutine, setEditingRoutine] = useState<RoutineResponse | null>(null);
  const [targetDay, setTargetDay] = useState<DayOfWeek>("MONDAY");

  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleOpenCreate = (day?: DayOfWeek) => {
    setEditingRoutine(null);
    setTargetDay(day || (selectedDay === "ALL" ? "MONDAY" : selectedDay));
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (routine: RoutineResponse) => {
    setEditingRoutine(routine);
    setIsDialogOpen(true);
  };

  const handleFormSubmit = async (input: CreateRoutineInput) => {
    if (editingRoutine) {
      await updateRoutine(editingRoutine.id, input);
    } else {
      await createRoutine(input);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingId) return;
    setIsDeleting(true);
    try {
      await deleteRoutine(deletingId);
      setDeletingId(null);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <DashboardShell
      user={user}
      role="USER"
      title="Routine Planner"
      subtitle="Manage your daily and weekly productivity schedule."
    >
      <RoutineHeader
        viewMode={viewMode}
        onToggleViewMode={setViewMode}
        onOpenCreate={() => handleOpenCreate()}
      />

      <RoutineStatsBar stats={stats} routines={routines} />

      {viewMode === "timeline" ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <RoutineDaySelector
            selectedDay={selectedDay}
            onSelectDay={setSelectedDay}
            dayCounts={stats?.byDay ?? {
              MONDAY: 0, TUESDAY: 0, WEDNESDAY: 0, THURSDAY: 0, FRIDAY: 0, SATURDAY: 0, SUNDAY: 0
            }}
            totalCount={routines.length}
          />

          {loading ? (
            <div style={{ padding: "3rem", textAlign: "center", color: "var(--muted-foreground)" }}>
              Loading routines…
            </div>
          ) : (
            <RoutineTimeline
              routines={filteredRoutines}
              selectedDay={selectedDay}
              categoryFilter={categoryFilter}
              onSelectCategory={setCategoryFilter}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onEdit={handleOpenEdit}
              onDelete={(id) => setDeletingId(id)}
              onOpenCreate={() => handleOpenCreate()}
            />
          )}
        </div>
      ) : (
        <RoutineWeeklyGrid
          routines={routines}
          onEdit={handleOpenEdit}
          onOpenCreateWithDay={(day) => handleOpenCreate(day)}
        />
      )}

      <RoutineFormDialog
        isOpen={isDialogOpen}
        initialRoutine={editingRoutine}
        defaultDay={targetDay}
        onClose={() => {
          setIsDialogOpen(false);
          setEditingRoutine(null);
        }}
        onSubmit={handleFormSubmit}
      />

      <ConfirmDialog
        isOpen={Boolean(deletingId)}
        title="Delete Routine"
        message="Are you sure you want to delete this routine? This action cannot be undone."
        confirmLabel="Delete"
        isDestructive
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeletingId(null)}
      />
    </DashboardShell>
  );
}

