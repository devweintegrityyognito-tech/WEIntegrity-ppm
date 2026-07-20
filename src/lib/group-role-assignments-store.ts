import { useSyncExternalStore } from "react";

export type GroupRoleAssignmentStatus = "Active" | "Inactive";

export interface GroupRoleAssignment {
  id: string;

  groupId: string;
  groupName: string;

  roleId: string;
  roleName: string;

  status: GroupRoleAssignmentStatus;

  effectiveFrom: string;
  effectiveTo: string;

  assignmentReason: string;

  createdBy: string;
  createdDate: string;
  updatedBy: string;
  updatedDate: string;
}

export type GroupRoleAssignmentInput = {
  groupId: string;
  roleId: string;
  status: GroupRoleAssignmentStatus;
  effectiveFrom: string;
  effectiveTo: string;
  assignmentReason: string;
};

let state: GroupRoleAssignment[] = [];

const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

async function refreshGroupRoleAssignments() {
  const res = await fetch("https://weintegrity-ppm-main.onrender.com/api/group-role-assignments");

  state = await res.json();

  emit();
}

export const groupRoleAssignmentsStore = {
  get(): GroupRoleAssignment[] {
    return state;
  },

  subscribe(listener: () => void) {
    listeners.add(listener);

    if (listeners.size === 1) {
      refreshGroupRoleAssignments();
    }

    return () => listeners.delete(listener);
  },

  async add(input: GroupRoleAssignmentInput) {
    const res = await fetch("https://weintegrity-ppm-main.onrender.com/api/group-role-assignments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(input),
    });

    await refreshGroupRoleAssignments();

    return res;
  },

  async update(id: string, input: GroupRoleAssignmentInput) {
    await fetch(`https://weintegrity-ppm-main.onrender.com/api/group-role-assignments/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(input),
    });

    await refreshGroupRoleAssignments();
  },

  async remove(id: string) {
    await fetch(`https://weintegrity-ppm-main.onrender.com/api/group-role-assignments/${id}`, {
      method: "DELETE",
    });

    await refreshGroupRoleAssignments();
  },
};

export function useGroupRoleAssignments(): GroupRoleAssignment[] {
  return useSyncExternalStore(
    groupRoleAssignmentsStore.subscribe,
    groupRoleAssignmentsStore.get,
    groupRoleAssignmentsStore.get,
  );
}
