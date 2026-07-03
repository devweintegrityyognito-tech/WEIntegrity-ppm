import { useSyncExternalStore } from "react";
import { currentUser } from "./mock-data";

export type DefectSeverity = "Low" | "Medium" | "High" | "Critical";
export type DefectPriority = "Low" | "Medium" | "High" | "Critical";
export type DefectStatus = "Open" | "In Progress" | "Resolved" | "Closed" | "Reopened";

export interface Defect {
  _id?: string;
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
export const DEFECT_STATUSES: DefectStatus[] = [
  "Open",
  "In Progress",
  "Resolved",
  "Closed",
  "Reopened",
];

const now = () => new Date().toISOString();

let state: Defect[] = [];
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

async function refreshDefects() {
  const res = await fetch("http://127.0.0.1:5000/api/defects");
  state = await res.json();
  emit();
}

export const defectsStore = {
  get: () => state,
  subscribe(l: () => void) {
    listeners.add(l);
    if (listeners.size === 1) {
      refreshDefects();
    }
    return () => listeners.delete(l);
  },
  byStory(storyId: string) {
    return state.filter((d) => d.storyId === storyId);
  },
  async add(
    input: Omit<
      Defect,
      "id" | "createdAt" | "updatedAt" | "reportedBy" | "resolvedDate" | "createdDate"
    > & {
      reportedBy?: string;
      resolvedDate?: string | null;
      createdDate?: string;
    },
  ) {
    await fetch("http://127.0.0.1:5000/api/defects", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(input),
    });
    await refreshDefects();
  },
  update(id: string, patch: Partial<Defect>) {
    state = state.map((d) => {
      if (d.id !== id) return d;
      const merged = { ...d, ...patch, updatedAt: now() };
      if (
        patch.status &&
        (patch.status === "Resolved" || patch.status === "Closed") &&
        !merged.resolvedDate
      ) {
        merged.resolvedDate = now();
      }
      if (patch.status && patch.status === "Reopened") {
        merged.resolvedDate = null;
      }
      return merged;
    });
    emit();
  },
  async remove(id: string) {
    await fetch(`http://127.0.0.1:5000/api/defects/${id}`, {
      method: "DELETE",
    });
    await refreshDefects();
  },
};
export function useDefects(storyId?: string): Defect[] {
  const all = useSyncExternalStore(defectsStore.subscribe, defectsStore.get, defectsStore.get);
  return storyId ? all.filter((d) => d.storyId === storyId) : all;
}
