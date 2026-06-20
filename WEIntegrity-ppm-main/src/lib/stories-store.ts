import { useSyncExternalStore } from "react";
import { tasks, sprints, users, projects, userById } from "./mock-data";

export type StoryPriority = "Low" | "Medium" | "High" | "Critical";
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
  team: string;
  type: StoryType;
  acceptanceCriteria: string;
  dueDate: string; // ISO
  storyPoints: number;
  labels: string[];
  createdAt: string;
}

// Seed from existing tasks so the module feels integrated with the rest of the platform.
const seed: Story[] = tasks.map((t, i) => ({
  id: `st-${i + 1}`,
  key: `YOG-${1000 + i}`,
  title: t.title,
  description: `${t.title}. Owned by ${userById(t.assignee).name} (${userById(t.assignee).team}). Priority ${t.priority.toLowerCase()} · ${t.storyPoints} story points · tagged ${t.tags.map((x) => `#${x}`).join(" ")}.`,
  priority: t.priority,
  status: t.status,
  assigneeId: t.assignee,
  sprintId: t.sprintId ?? sprints[0].id,
  projectId: t.projectId,
  team: userById(t.assignee).team,
  type: (t.type === "Epic" ? "Epic" : t.type) as StoryType,
  acceptanceCriteria: [
    `Given a user working on "${t.title}",`,
    `When the ${t.type.toLowerCase()} is delivered to ${userById(t.assignee).team},`,
    `Then ${t.tags.join(" and ")} requirements are validated and signed off.`,
  ].join("\n"),
  dueDate: t.dueDate,
  storyPoints: t.storyPoints,
  labels: t.tags,
  createdAt: new Date(Date.now() - i * 86400000).toISOString(),
}));

let state: Story[] = [...seed];
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

export const storiesStore = {
  get(): Story[] {
    return state;
  },
  subscribe(l: () => void) {
    listeners.add(l);
    return () => listeners.delete(l);
  },
  add(input: Omit<Story, "id" | "key" | "createdAt">) {
    const next: Story = {
      ...input,
      id: `st-${Date.now()}`,
      key: `YOG-${1000 + state.length + 1}`,
      createdAt: new Date().toISOString(),
    };
    state = [next, ...state];
    emit();
    return next;
  },
  updateStatus(id: string, status: StoryStatus) {
    state = state.map((s) => (s.id === id ? { ...s, status } : s));
    emit();
  },
  remove(id: string) {
    state = state.filter((s) => s.id !== id);
    emit();
  },
};

export function useStories(): Story[] {
  return useSyncExternalStore(
    storiesStore.subscribe,
    storiesStore.get,
    storiesStore.get,
  );
}

export const PRIORITIES: StoryPriority[] = ["Low", "Medium", "High", "Critical"];
export const STATUSES: StoryStatus[] = ["Backlog", "Todo", "In Progress", "Review", "Testing", "Done"];
export const STORY_TYPES: StoryType[] = ["Story", "Task", "Bug", "Epic", "Spike"];
export const ASSIGNEES = users;
export const SPRINTS = sprints;
export const PROJECTS = projects;
export const TEAMS = Array.from(new Set(users.map((u) => u.team)));
