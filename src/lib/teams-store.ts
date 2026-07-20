import { useSyncExternalStore } from "react";

export type TeamStatus = "Active" | "Inactive";

export interface Team {
  id: string;
  code: string;
  name: string;
  department: string;
  lead: string;
  members: number;
  projects: number;
  stories: number;
  status: TeamStatus;
  groupType: string;
  visibility: string;
  parentGroup: string;
  description: string;
}

let state: Team[] = [];

const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

async function refreshTeams() {
  const res = await fetch("https://weintegrity-ppm-main.onrender.com/api/teams");

  state = await res.json();

  emit();
}

export const teamsStore = {
  get(): Team[] {
    return state;
  },

  subscribe(listener: () => void) {
    listeners.add(listener);

    if (listeners.size === 1) {
      refreshTeams();
    }

    return () => listeners.delete(listener);
  },

  add(input: Omit<Team, "id" | "code">) {
    return fetch("https://weintegrity-ppm-main.onrender.com/api/teams", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(input),
    });
  },

  async update(id: string, input: Omit<Team, "id">) {
    await fetch(`https://weintegrity-ppm-main.onrender.com/api/teams/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(input),
    });

    await refreshTeams();
  },

  async remove(id: string) {
    await fetch(`https://weintegrity-ppm-main.onrender.com/api/teams/${id}`, {
      method: "DELETE",
    });

    await refreshTeams();
  },
};

export function useTeams(): Team[] {
  return useSyncExternalStore(teamsStore.subscribe, teamsStore.get, teamsStore.get);
}
