import { useSyncExternalStore } from "react";
import { currentUser } from "./mock-data";

export type TaskStatus = "Todo" | "In Progress" | "Blocked" | "Done";
export type TaskPriority = "Low" | "Medium" | "High" | "Critical";

export interface ScrumTask {
  id: string;
  storyId: string;
  title: string;
  description: string;
  assignee: string;
  status: TaskStatus;
  priority: TaskPriority;
  estimatedHours: number;
  actualHours: number;
  startDate: string;
  dueDate: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export const TASK_STATUSES: TaskStatus[] = ["Todo", "In Progress", "Blocked", "Done"];
export const TASK_PRIORITIES: TaskPriority[] = ["Low", "Medium", "High", "Critical"];

const now = () => new Date().toISOString();

let state: ScrumTask[] = [];
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

export const scrumTasksStore = {
  get: () => state,
  subscribe(l: () => void) {
    listeners.add(l);
    return () => listeners.delete(l);
  },
  byStory(storyId: string) {
    return state.filter((t) => t.storyId === storyId);
  },
  add(input: Omit<ScrumTask, "id" | "createdAt" | "updatedAt" | "createdBy" | "actualHours"> & { createdBy?: string; actualHours?: number }) {
    const next: ScrumTask = {
      ...input,
      actualHours: input.actualHours ?? 0,
      createdBy: input.createdBy ?? currentUser.id,
      id: `tk-${Date.now()}`,
      createdAt: now(),
      updatedAt: now(),
    };
    state = [next, ...state];
    emit();
    return next;
  },
  update(id: string, patch: Partial<ScrumTask>) {
    state = state.map((t) => (t.id === id ? { ...t, ...patch, updatedAt: now() } : t));
    emit();
  },
  remove(id: string) {
    state = state.filter((t) => t.id !== id);
    emit();
  },
};

export function useScrumTasks(storyId?: string): ScrumTask[] {
  const all = useSyncExternalStore(scrumTasksStore.subscribe, scrumTasksStore.get, scrumTasksStore.get);
  return storyId ? all.filter((t) => t.storyId === storyId) : all;
}
