"use client";

import { useState } from "react";
import {
  RoutineResponse,
  RoutineEntryResponse,
  DayOfWeek,
  CreateRoutineInput,
  CreateRoutineEntryInput,
} from "@server/types";
import RoutineEntryDialog from "./RoutineEntryDialog";
import RoutineManageDialog from "./RoutineManageDialog";
import RoutineConfirmDialogs from "./RoutineConfirmDialogs";

interface RoutineModalsProps {
  isRoutineModalOpen: boolean;
  editingRoutine: RoutineResponse | null;
  onCloseRoutineModal: () => void;
  onSubmitRoutineModal: (input: CreateRoutineInput) => Promise<void>;

  isEntryModalOpen: boolean;
  editingEntry: RoutineEntryResponse | null;
  defaultDay: DayOfWeek;
  defaultStartTime: string;
  onCloseEntryModal: () => void;
  onSubmitEntryModal: (input: CreateRoutineEntryInput) => Promise<void>;

  deletingRoutineId: string | null;
  deletingEntryId: string | null;
  onCloseDeleteRoutine: () => void;
  onCloseDeleteEntry: () => void;
  onDeleteRoutine: (id: string) => Promise<void>;
  onDeleteEntry: (id: string) => Promise<void>;
}

export default function RoutineModals({
  isRoutineModalOpen,
  editingRoutine,
  onCloseRoutineModal,
  onSubmitRoutineModal,
  isEntryModalOpen,
  editingEntry,
  defaultDay,
  defaultStartTime,
  onCloseEntryModal,
  onSubmitEntryModal,
  deletingRoutineId,
  deletingEntryId,
  onCloseDeleteRoutine,
  onCloseDeleteEntry,
  onDeleteRoutine,
  onDeleteEntry,
}: RoutineModalsProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleConfirmDeleteRoutine = async () => {
    if (!deletingRoutineId) return;
    setIsProcessing(true);
    try {
      await onDeleteRoutine(deletingRoutineId);
      onCloseDeleteRoutine();
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirmDeleteEntry = async () => {
    if (!deletingEntryId) return;
    setIsProcessing(true);
    try {
      await onDeleteEntry(deletingEntryId);
      onCloseDeleteEntry();
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <RoutineManageDialog
        isOpen={isRoutineModalOpen}
        initialRoutine={editingRoutine}
        onClose={onCloseRoutineModal}
        onSubmit={onSubmitRoutineModal}
      />

      <RoutineEntryDialog
        isOpen={isEntryModalOpen}
        initialEntry={editingEntry}
        defaultDay={defaultDay}
        defaultStartTime={defaultStartTime}
        onClose={onCloseEntryModal}
        onSubmit={onSubmitEntryModal}
      />

      <RoutineConfirmDialogs
        deletingRoutineId={deletingRoutineId}
        deletingEntryId={deletingEntryId}
        isProcessing={isProcessing}
        onConfirmDeleteRoutine={handleConfirmDeleteRoutine}
        onCancelDeleteRoutine={onCloseDeleteRoutine}
        onConfirmDeleteEntry={handleConfirmDeleteEntry}
        onCancelDeleteEntry={onCloseDeleteEntry}
      />
    </>
  );
}
