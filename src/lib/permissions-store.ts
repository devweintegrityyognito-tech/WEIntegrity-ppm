import { useSyncExternalStore } from "react";

export type PermissionStatus = "Active" | "Inactive";

export interface Permission {
  id: string;
  permissionName: string;
  permissionCode: string;
  moduleName: string;
  resourceName: string;
  action: string;
  description: string;
  status: PermissionStatus;
  systemPermission: boolean;
  createdBy: string;
  createdDate: string;
  updatedBy: string;
  updatedDate: string;
}

let state: Permission[] = [];

const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

async function refreshPermissions() {
  const res = await fetch("https://weintegrity-ppm-main.onrender.com/api/permissions");

  state = await res.json();

  emit();
}

export const permissionsStore = {
  get(): Permission[] {
    return state;
  },

  subscribe(listener: () => void) {
    listeners.add(listener);

    if (listeners.size === 1) {
      refreshPermissions();
    }

    return () => listeners.delete(listener);
  },

  async add(input: Omit<Permission, "id">) {
    const res = await fetch("https://weintegrity-ppm-main.onrender.com/api/permissions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(input),
    });

    await refreshPermissions();

    return res;
  },

  async update(id: string, input: Omit<Permission, "id">) {
    await fetch(`https://weintegrity-ppm-main.onrender.com/api/permissions/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(input),
    });

    await refreshPermissions();
  },

  async remove(id: string) {
    await fetch(`https://weintegrity-ppm-main.onrender.com/api/permissions/${id}`, {
      method: "DELETE",
    });

    await refreshPermissions();
  },
};

export function usePermissions(): Permission[] {
  return useSyncExternalStore(
    permissionsStore.subscribe,
    permissionsStore.get,
    permissionsStore.get,
  );
}
