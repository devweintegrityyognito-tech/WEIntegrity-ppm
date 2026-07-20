import { useSyncExternalStore } from "react";

export type UserStatus = "Active" | "Inactive";

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phoneNumber: string;
  profilePicture: string;
  dateOfBirth: string;
  password: string;
  role: string;
  status: UserStatus;
  emailVerified: boolean;
  createdDate: string;
  updatedDate: string;
}

let state: User[] = [];

const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

async function refreshUsers() {
  const res = await fetch("https://weintegrity-ppm-main.onrender.com/api/users");

  state = await res.json();

  emit();
}

export const usersStore = {
  get(): User[] {
    return state;
  },

  subscribe(listener: () => void) {
    listeners.add(listener);

    if (listeners.size === 1) {
      refreshUsers();
    }

    return () => listeners.delete(listener);
  },

  async add(input: Omit<User, "id">) {
    const res = await fetch("https://weintegrity-ppm-main.onrender.com/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(input),
    });

    await refreshUsers();

    return res;
  },

  async update(id: string, input: Omit<User, "id">) {
    await fetch(`https://weintegrity-ppm-main.onrender.com/api/users/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(input),
    });

    await refreshUsers();
  },

  async remove(id: string) {
    await fetch(`https://weintegrity-ppm-main.onrender.com/api/users/${id}`, {
      method: "DELETE",
    });

    await refreshUsers();
  },
};

export function useUsers(): User[] {
  return useSyncExternalStore(usersStore.subscribe, usersStore.get, usersStore.get);
}
