"use client";

import ConfirmDialog from "@/components/dashboard/shared/ConfirmDialog";

interface RoutineConfirmDialogsProps {
  deletingRoutineId: string | null;
  deletingEntryId: string | null;
  isProcessing: boolean;
  onConfirmDeleteRoutine: () => Promise<void>;
  onCancelDeleteRoutine: () => void;
  onConfirmDeleteEntry: () => Promise<void>;
  onCancelDeleteEntry: () => void;
}

export default function RoutineConfirmDialogs({
  deletingRoutineId,
  deletingEntryId,
  isProcessing,
  onConfirmDeleteRoutine,
  onCancelDeleteRoutine,
  onConfirmDeleteEntry,
  onCancelDeleteEntry,
}: RoutineConfirmDialogsProps) {
  return (
    <>
      <ConfirmDialog
        isOpen={Boolean(deletingRoutineId)}
        title="Delete Routine"
        message="Are you sure you want to delete this routine? All scheduled entries in this timetable will be removed."
        confirmLabel="Delete Routine"
        isDestructive
        isLoading={isProcessing}
        onConfirm={onConfirmDeleteRoutine}
        onCancel={onCancelDeleteRoutine}
      />

      <ConfirmDialog
        isOpen={Boolean(deletingEntryId)}
        title="Delete Activity"
        message="Are you sure you want to delete this weekly recurring activity?"
        confirmLabel="Delete"
        isDestructive
        isLoading={isProcessing}
        onConfirm={onConfirmDeleteEntry}
        onCancel={onCancelDeleteEntry}
      />
    </>
  );
}

