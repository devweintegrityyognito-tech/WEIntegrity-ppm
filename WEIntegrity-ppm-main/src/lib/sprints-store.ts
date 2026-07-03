import { useSyncExternalStore } from "react";
import { sprints as seedSprints, currentUser } from "./mock-data";

export type SprintStatus = "Planned" | "Active" | "Completed";

export interface Sprint {
  id: string;
  sprintName: string;
  sprintGoal: string;
  startDate: string;
  endDate: string;
  status: SprintStatus;
  velocity: number;
  capacity: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

const now = () => new Date().toISOString();

let state: Sprint[] = seedSprints.map((s) => ({
  id: s.id,
  sprintName: s.name,
  sprintGoal: s.goal,
  startDate: s.startDate,
  endDate: s.endDate,
  status: s.status,
  velocity: s.velocity,
  capacity: s.capacity,
  createdBy: currentUser.id,
  createdAt: now(),
  updatedAt: now(),
}));

const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

export const sprintsStore = {
  get: () => state,
  subscribe(l: () => void) {
    listeners.add(l);
    return () => listeners.delete(l);
  },
  add(input: Omit<Sprint, "id" | "createdAt" | "updatedAt" | "createdBy" | "velocity"> & { createdBy?: string; velocity?: number }) {
    const next: Sprint = {
      id: `s-${Date.now()}`,
      sprintName: input.sprintName,
      sprintGoal: input.sprintGoal,
      startDate: input.startDate,
      endDate: input.endDate,
      status: input.status,
      capacity: input.capacity,
      velocity: input.velocity ?? 0,
      createdBy: input.createdBy ?? currentUser.id,
      createdAt: now(),
      updatedAt: now(),
    };
    state = [next, ...state];
    emit();
    return next;
  },
  update(id: string, patch: Partial<Sprint>) {
    state = state.map((s) => (s.id === id ? { ...s, ...patch, updatedAt: now() } : s));
    emit();
  },
  remove(id: string) {
    state = state.filter((s) => s.id !== id);
    emit();
  },
};

export const SPRINT_STATUSES: SprintStatus[] = ["Planned", "Active", "Completed"];

export function useSprints(): Sprint[] {
  return useSyncExternalStore(sprintsStore.subscribe, sprintsStore.get, sprintsStore.get);
}
