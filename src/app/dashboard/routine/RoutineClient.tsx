"use client";

import { useState } from "react";
import DashboardShell from "@/components/dashboard/shared/DashboardShell";
import { RoutineResponse, RoutineEntryResponse, DayOfWeek } from "@server/types";
import { SessionUser } from "@/lib/session";
import { useRoutines } from "@/lib/hooks/useRoutines";
import RoutineTopBar from "@/components/dashboard/routine/RoutineTopBar";
import TimetableGrid from "@/components/dashboard/routine/TimetableGrid";
import TimetableDayView from "@/components/dashboard/routine/TimetableDayView";
import RoutineTimetableEmpty from "@/components/dashboard/routine/RoutineTimetableEmpty";
import RoutineModals from "@/components/dashboard/routine/RoutineModals";

interface RoutineClientProps {
  user: SessionUser;
}

export default function RoutineClient({ user }: RoutineClientProps) {
  const {
    routines,
    activeRoutine,
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
    createRoutine,
    updateRoutine,
    deleteRoutine,
    addEntry,
    updateEntry,
    deleteEntry,
  } = useRoutines();

  const [viewMode, setViewMode] = useState<"timetable" | "day">("timetable");
  const [isRoutineModalOpen, setIsRoutineModalOpen] = useState(false);
  const [editingRoutine, setEditingRoutine] = useState<RoutineResponse | null>(null);

  const [isEntryModalOpen, setIsEntryModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<RoutineEntryResponse | null>(null);
  const [defaultDay, setDefaultDay] = useState<DayOfWeek>("MONDAY");
  const [defaultStartTime, setDefaultStartTime] = useState<string>("09:00");

  const [deletingRoutineId, setDeletingRoutineId] = useState<string | null>(null);
  const [deletingEntryId, setDeletingEntryId] = useState<string | null>(null);

  const handleOpenAddEntry = (day?: DayOfWeek, time?: string) => {
    setEditingEntry(null);
    if (day) setDefaultDay(day);
    if (time) setDefaultStartTime(time);
    setIsEntryModalOpen(true);
  };

  return (
    <DashboardShell
      user={user}
      role="USER"
      title="Routine Timetable"
      subtitle="Recurring weekly timetable for university classes and study routines."
    >
      <RoutineTopBar
        routines={routines}
        activeRoutine={activeRoutine}
        onSelectRoutine={setActiveRoutineId}
        onOpenCreateRoutine={() => { setEditingRoutine(null); setIsRoutineModalOpen(true); }}
        onOpenEditRoutine={(r) => { setEditingRoutine(r); setIsRoutineModalOpen(true); }}
        onDeleteRoutine={(id) => setDeletingRoutineId(id)}
        onOpenAddEntry={() => handleOpenAddEntry()}
        dayStartOption={dayStartOption}
        onToggleDayStart={setDayStartOption}
        viewMode={viewMode}
        onToggleViewMode={setViewMode}
      />

      {loading ? (
        <div style={{ padding: "4rem", textAlign: "center", color: "var(--muted-foreground)" }}>
          Loading timetable…
        </div>
      ) : !activeRoutine ? (
        <RoutineTimetableEmpty
          hasRoutines={false}
          onAction={() => {
            setEditingRoutine(null);
            setIsRoutineModalOpen(true);
          }}
        />
      ) : activeRoutine.entries.length === 0 ? (
        <RoutineTimetableEmpty
          hasRoutines={true}
          onAction={() => handleOpenAddEntry()}
        />
      ) : viewMode === "timetable" ? (
        <TimetableGrid
          entries={filteredEntries}
          dayStartOption={dayStartOption}
          onEditEntry={(entry) => {
            setEditingEntry(entry);
            setIsEntryModalOpen(true);
          }}
          onDeleteEntry={(id) => setDeletingEntryId(id)}
          onOpenAddEntryWithSlot={(day, time) => handleOpenAddEntry(day, time)}
        />
      ) : (
        <TimetableDayView
          entries={filteredEntries}
          selectedDay={selectedDay}
          onSelectDay={setSelectedDay}
          dayStartOption={dayStartOption}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          categoryFilter={categoryFilter}
          onSelectCategory={setCategoryFilter}
          onEditEntry={(entry) => {
            setEditingEntry(entry);
            setIsEntryModalOpen(true);
          }}
          onDeleteEntry={(id) => setDeletingEntryId(id)}
          onOpenAddEntryWithDay={(day) => handleOpenAddEntry(day)}
        />
      )}

      <RoutineModals
        isRoutineModalOpen={isRoutineModalOpen}
        editingRoutine={editingRoutine}
        onCloseRoutineModal={() => { setIsRoutineModalOpen(false); setEditingRoutine(null); }}
        onSubmitRoutineModal={async (input) => {
          if (editingRoutine) await updateRoutine(editingRoutine.id, input);
          else await createRoutine(input);
        }}
        isEntryModalOpen={isEntryModalOpen}
        editingEntry={editingEntry}
        defaultDay={defaultDay}
        defaultStartTime={defaultStartTime}
        onCloseEntryModal={() => { setIsEntryModalOpen(false); setEditingEntry(null); }}
        onSubmitEntryModal={async (input) => {
          if (editingEntry) await updateEntry(editingEntry.id, input);
          else await addEntry(input);
        }}
        deletingRoutineId={deletingRoutineId}
        deletingEntryId={deletingEntryId}
        onCloseDeleteRoutine={() => setDeletingRoutineId(null)}
        onCloseDeleteEntry={() => setDeletingEntryId(null)}
        onDeleteRoutine={deleteRoutine}
        onDeleteEntry={deleteEntry}
      />
    </DashboardShell>
  );
}
