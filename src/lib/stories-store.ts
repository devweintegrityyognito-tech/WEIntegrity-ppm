import { useSyncExternalStore } from "react";
import { sprints, projects } from "./mock-data";

export type StoryPriority = "Low" | "Medium" | "High" | "Critical";
export type BusinessValue = "Low" | "Medium" | "High";
export type StoryStatus = "Backlog" | "Todo" | "In Progress" | "Review" | "Testing" | "Done";
export type StoryType = "Story" | "Task" | "Bug" | "Epic" | "Spike";

export interface Story {
  _id?: string;
  id: string;
  key: string;
  title: string;
  description: string;
  priority: StoryPriority;
  status: StoryStatus;
  assigneeId: string;
  sprintId: string;
  projectId: string;
  epicId?: string;
  team: string;
  type: StoryType;
  acceptanceCriteria: string;
  reporter?: string;
  businessValue?: BusinessValue;
  dueDate: string; // ISO
  storyPoints: number;
  labels: string[];
  createdAt: string;
}

let state: Story[] = [];
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

async function refreshStories() {
  const res = await fetch("https://weintegrity-ppm-main.onrender.com/api/stories");
  state = await res.json();
  emit();
}

export const storiesStore = {
  get(): Story[] {
    return state;
  },
  subscribe(l: () => void) {
    listeners.add(l);
    if (listeners.size === 1) {
      refreshStories();
    }
    return () => listeners.delete(l);
  },
  add(input: Omit<Story, "id" | "key" | "createdAt">) {
    return fetch("https://weintegrity-ppm-main.onrender.com/api/stories", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(input),
    });
  },
  updateStatus(id: string, status: StoryStatus) {
    return fetch(`https://weintegrity-ppm-main.onrender.com/api/stories/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    });
  },
  async remove(id: string) {
    await fetch(`https://weintegrity-ppm-main.onrender.com/api/stories/${id}`, {
      method: "DELETE",
    });
    await refreshStories();
  },
};

export function useStories(): Story[] {
  return useSyncExternalStore(storiesStore.subscribe, storiesStore.get, storiesStore.get);
}

export const PRIORITIES: StoryPriority[] = ["Low", "Medium", "High", "Critical"];
export const STATUSES = ["Backlog", "Ready", "In Progress", "In Review", "Done"];
export const STORY_TYPES: StoryType[] = ["Story", "Task", "Bug", "Epic", "Spike"];
export const SPRINTS = sprints;
export const PROJECTS = projects;
export const EPICS = [
  { id: "epic-1", name: "User Management" },
  { id: "epic-2", name: "Authentication" },
  { id: "epic-3", name: "Project Management" },
];
export const BUSINESS_VALUES: BusinessValue[] = ["Low", "Medium", "High"];
