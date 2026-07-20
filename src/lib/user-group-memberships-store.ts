import { useSyncExternalStore } from "react";

export type MembershipType = "Primary" | "Secondary" | "Guest";
export type MembershipStatus = "Active" | "Inactive";

export interface UserGroupMembership {
  id: string;

  userId: string;
  userName: string;

  groupId: string;
  groupName: string;

  membershipType: MembershipType;
  status: MembershipStatus;

  effectiveFrom: string;
  effectiveTo: string;

  createdBy: string;
  createdDate: string;
  updatedBy: string;
  updatedDate: string;
}

export type UserGroupMembershipInput = {
  userId: string;
  groupId: string;
  membershipType: MembershipType;
  status: MembershipStatus;
  effectiveFrom: string;
  effectiveTo: string;
  createdBy: string;
  createdDate: string;
  updatedBy: string;
  updatedDate: string;
};

let state: UserGroupMembership[] = [];

const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

async function refreshUserGroupMemberships() {
  const res = await fetch("https://weintegrity-ppm-main.onrender.com/api/user-group-memberships");

  state = await res.json();

  emit();
}

export const userGroupMembershipsStore = {
  get(): UserGroupMembership[] {
    return state;
  },

  subscribe(listener: () => void) {
    listeners.add(listener);

    if (listeners.size === 1) {
      refreshUserGroupMemberships();
    }

    return () => listeners.delete(listener);
  },

  async add(input: UserGroupMembershipInput) {
    const res = await fetch("https://weintegrity-ppm-main.onrender.com/api/user-group-memberships", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(input),
    });

    await refreshUserGroupMemberships();

    return res;
  },

  async update(id: string, input: UserGroupMembershipInput) {
    await fetch(`https://weintegrity-ppm-main.onrender.com/api/user-group-memberships/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(input),
    });

    await refreshUserGroupMemberships();
  },

  async remove(id: string) {
    await fetch(`https://weintegrity-ppm-main.onrender.com/api/user-group-memberships/${id}`, {
      method: "DELETE",
    });

    await refreshUserGroupMemberships();
  },
};

export function useUserGroupMemberships(): UserGroupMembership[] {
  return useSyncExternalStore(
    userGroupMembershipsStore.subscribe,
    userGroupMembershipsStore.get,
    userGroupMembershipsStore.get,
  );
}
