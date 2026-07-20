import { useSyncExternalStore } from "react";

export type RoleStatus = "Active" | "Inactive";

export interface Role {
  id: string;
  roleName: string;
  roleCode: string;
  description: string;
  roleType: string;
  status: RoleStatus;
  systemRole: boolean;
  priority: number;
  createdBy: string;
  createdDate: string;
  updatedBy: string;
  updatedDate: string;
}

let state: Role[] = [];

const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

async function refreshRoles() {
  const res = await fetch("https://weintegrity-ppm-main.onrender.com/api/roles");

  state = await res.json();

  emit();
}

export const rolesStore = {
  get(): Role[] {
    return state;
  },

  subscribe(listener: () => void) {
    listeners.add(listener);

    if (listeners.size === 1) {
      refreshRoles();
    }

    return () => listeners.delete(listener);
  },

  async add(input: Omit<Role, "id">) {
    const res = await fetch("https://weintegrity-ppm-main.onrender.com/api/roles", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(input),
    });

    await refreshRoles();

    return res;
  },

  async update(id: string, input: Omit<Role, "id">) {
    await fetch(`https://weintegrity-ppm-main.onrender.com/api/roles/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(input),
    });

    await refreshRoles();
  },

  async remove(id: string) {
    await fetch(`https://weintegrity-ppm-main.onrender.com/api/roles/${id}`, {
      method: "DELETE",
    });

    await refreshRoles();
  },
};

export function useRoles(): Role[] {
  return useSyncExternalStore(rolesStore.subscribe, rolesStore.get, rolesStore.get);
}
