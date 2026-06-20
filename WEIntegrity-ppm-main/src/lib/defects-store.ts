import { useSyncExternalStore } from "react";
import { currentUser } from "./mock-data";

export type DefectSeverity = "Low" | "Medium" | "High" | "Critical";
export type DefectPriority = "Low" | "Medium" | "High" | "Critical";
export type DefectStatus = "Open" | "In Progress" | "Resolved" | "Closed" | "Reopened";

export interface Defect {
  id: string;
  storyId: string;
  defectTitle: string;
  defectDescription: string;
  severity: DefectSeverity;
  priority: DefectPriority;
  status: DefectStatus;
  reportedBy: string;
  assignedTo: string;
  createdDate: string;
  resolvedDate: string | null;
  createdAt: string;
  updatedAt: string;
}

export const DEFECT_SEVERITIES: DefectSeverity[] = ["Low", "Medium", "High", "Critical"];
export const DEFECT_PRIORITIES: DefectPriority[] = ["Low", "Medium", "High", "Critical"];
export const DEFECT_STATUSES: DefectStatus[] = ["Open", "In Progress", "Resolved", "Closed", "Reopened"];

const now = () => new Date().toISOString();

let state: Defect[] = [];
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

export const defectsStore = {
  get: () => state,
  subscribe(l: () => void) {
    listeners.add(l);
    return () => listeners.delete(l);
  },
  byStory(storyId: string) {
    return state.filter((d) => d.storyId === storyId);
  },
  add(input: Omit<Defect, "id" | "createdAt" | "updatedAt" | "reportedBy" | "resolvedDate" | "createdDate"> & {
    reportedBy?: string;
    resolvedDate?: string | null;
    createdDate?: string;
  }) {
    const next: Defect = {
      ...input,
      reportedBy: input.reportedBy ?? currentUser.id,
      createdDate: input.createdDate ?? now(),
      resolvedDate: input.resolvedDate ?? null,
      id: `df-${Date.now()}`,
      createdAt: now(),
      updatedAt: now(),
    };
    state = [next, ...state];
    emit();
    return next;
  },
  update(id: string, patch: Partial<Defect>) {
    state = state.map((d) => {
      if (d.id !== id) return d;
      const merged = { ...d, ...patch, updatedAt: now() };
      if (patch.status && (patch.status === "Resolved" || patch.status === "Closed") && !merged.resolvedDate) {
        merged.resolvedDate = now();
      }
      if (patch.status && patch.status === "Reopened") {
        merged.resolvedDate = null;
      }
      return merged;
    });
    emit();
  },
  remove(id: string) {
    state = state.filter((d) => d.id !== id);
    emit();
  },
};

export function useDefects(storyId?: string): Defect[] {
  const all = useSyncExternalStore(defectsStore.subscribe, defectsStore.get, defectsStore.get);
  return storyId ? all.filter((d) => d.storyId === storyId) : all;
}
