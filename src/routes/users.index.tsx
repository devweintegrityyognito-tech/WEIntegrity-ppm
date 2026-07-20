import { createFileRoute, Link } from "@tanstack/react-router";
import { useUsers } from "@/lib/users-store";
import { UsersList } from "@/components/app/UsersList";
import { Search, Plus, Filter, X } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/users/")({
  head: () => ({
    meta: [{ title: "Users — Yognito" }],
  }),
  component: UsersPage,
});

function UsersPage() {
  const users = useUsers();

  const [q, setQ] = useState("");
  const [role, setRole] = useState("all");
  const [status, setStatus] = useState("all");

  const roleOrder: Record<string, number> = {
    Admin: 1,
    Administrator: 1,
    "Project Manager": 2,
    "Scrum Master": 3,
    "Team Lead": 4,
    Developer: 5,
    Tester: 6,
    QA: 6,
    User: 7,
  };

  const filtered = users
    .filter((user) => {
      const search =
        `${user.firstName} ${user.lastName}`.toLowerCase().includes(q.toLowerCase()) ||
        user.username.toLowerCase().includes(q.toLowerCase()) ||
        user.email.toLowerCase().includes(q.toLowerCase());

      if (!search) return false;

      if (role !== "all" && user.role !== role) return false;

      const userStatus = user.status;

      if (status !== "all" && userStatus !== status) return false;

      return true;
    })
    .sort((a, b) => (roleOrder[a.role] ?? 999) - (roleOrder[b.role] ?? 999));

  const roles = [...new Set(users.map((u) => u.role))];

  const activeFilters = (q ? 1 : 0) + (role !== "all" ? 1 : 0) + (status !== "all" ? 1 : 0);

  return (
    <>
      <div className="flex items-end justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Users</h1>

          <p className="text-sm text-muted-foreground mt-1">
            Manage users across your organization.
          </p>
        </div>

        <Link
          to="/users/create"
          className="h-10 px-3.5 rounded-lg bg-gradient-primary text-primary-foreground text-sm font-medium inline-flex items-center gap-1.5 shadow-elegant"
        >
          <Plus className="h-4 w-4" />
          New User
        </Link>
      </div>

      <div className="rounded-xl bg-card border border-border shadow-card p-4 mt-6 mb-4">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative flex-1 min-w-50 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search users..."
              className="w-full h-10 pl-9 pr-3 rounded-lg bg-background border border-border text-sm outline-none focus:border-ring transition"
            />
          </div>

          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="h-10 px-2.5 rounded-lg border border-border bg-background text-sm"
          >
            <option value="all">All Roles</option>

            {roles.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="h-10 px-2.5 rounded-lg border border-border bg-background text-sm"
          >
            <option value="all">All Statuses</option>

            <option value="Active">Active</option>

            <option value="Inactive">Inactive</option>
          </select>

          {activeFilters > 0 && (
            <button
              onClick={() => {
                setQ("");
                setRole("all");
                setStatus("all");
              }}
              className="h-9 px-3 rounded-lg border border-border text-sm inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground hover:bg-muted/50"
            >
              <X className="h-3.5 w-3.5" />
              Clear ({activeFilters})
            </button>
          )}

          <div className="ml-auto text-xs text-muted-foreground inline-flex items-center gap-1.5">
            <Filter className="h-3.5 w-3.5" />
            {activeFilters} active filter{activeFilters === 1 ? "" : "s"}
          </div>
        </div>
      </div>

      <UsersList users={filtered} />
    </>
  );
}
