import { useSyncExternalStore } from "react";
import { currentUser } from "./mock-data";

export type TaskStatus = "Todo" | "In Progress" | "Blocked" | "Done";
export type TaskPriority = "Low" | "Medium" | "High" | "Critical";

export interface ScrumTask {
  _id?: string;
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

async function refreshTasks() {
  const res = await fetch("http://127.0.0.1:5000/api/tasks");
  state = await res.json();
  emit();
}

export const scrumTasksStore = {
  get: () => state,
  subscribe(l: () => void) {
    listeners.add(l);
    if (listeners.size === 1) {
      refreshTasks();
    }
    return () => listeners.delete(l);
  },
  byStory(storyId: string) {
    return state.filter((t) => t.storyId === storyId);
  },
  async add(
    input: Omit<ScrumTask, "id" | "createdAt" | "updatedAt" | "createdBy" | "actualHours"> & {
      createdBy?: string;
      actualHours?: number;
    },
  ) {
    await fetch("http://127.0.0.1:5000/api/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(input),
    });
    await refreshTasks();
  },
  update(id: string, patch: Partial<ScrumTask>) {
    state = state.map((t) => (t.id === id ? { ...t, ...patch, updatedAt: now() } : t));
    emit();
  },
  async remove(id: string) {
    await fetch(`http://127.0.0.1:5000/api/tasks/${id}`, {
      method: "DELETE",
    });
    await refreshTasks();
  },
};

export function useScrumTasks(storyId?: string): ScrumTask[] {
  const all = useSyncExternalStore(
    scrumTasksStore.subscribe,
    scrumTasksStore.get,
    scrumTasksStore.get,
  );
  return storyId ? all.filter((t) => t.storyId === storyId) : all;
}
