import { createFileRoute, Link } from "@tanstack/react-router";
import { useRoles } from "@/lib/roles-store";
import { RolesList } from "@/components/app/RolesList";
import { Search, Plus, Filter, X } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/roles/")({
  head: () => ({
    meta: [{ title: "Roles — Yognito" }],
  }),
  component: RolesPage,
});

function RolesPage() {
  const roles = useRoles();

  const [q, setQ] = useState("");
  const [roleType, setRoleType] = useState("all");
  const [status, setStatus] = useState("all");

  const filtered = roles
    .filter((role) => {
      const search =
        role.roleName.toLowerCase().includes(q.toLowerCase()) ||
        role.roleCode.toLowerCase().includes(q.toLowerCase()) ||
        role.description.toLowerCase().includes(q.toLowerCase());

      if (!search) return false;

      if (roleType !== "all" && role.roleType !== roleType) return false;

      if (status !== "all" && role.status !== status) return false;

      return true;
    })
    .sort((a, b) => a.priority - b.priority);

  const roleTypes = [...new Set(roles.map((r) => r.roleType))];

  const activeFilters = (q ? 1 : 0) + (roleType !== "all" ? 1 : 0) + (status !== "all" ? 1 : 0);

  return (
    <>
      <div className="flex items-end justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Roles</h1>

          <p className="text-sm text-muted-foreground mt-1">
            Manage roles across your organization.
          </p>
        </div>

        <Link
          to="/roles/create"
          className="h-10 px-3.5 rounded-lg bg-gradient-primary text-primary-foreground text-sm font-medium inline-flex items-center gap-1.5 shadow-elegant"
        >
          <Plus className="h-4 w-4" />
          New Role
        </Link>
      </div>

      <div className="rounded-xl bg-card border border-border shadow-card p-4 mt-6 mb-4">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative flex-1 min-w-50 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search roles..."
              className="w-full h-10 pl-9 pr-3 rounded-lg bg-background border border-border text-sm outline-none focus:border-ring transition"
            />
          </div>
          <select
            value={roleType}
            onChange={(e) => setRoleType(e.target.value)}
            className="h-10 px-2.5 rounded-lg border border-border bg-background text-sm"
          >
            <option value="all">All Role Types</option>

            {roleTypes.map((type) => (
              <option key={type} value={type}>
                {type}
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
                setRoleType("all");
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

      <RolesList roles={filtered} />
    </>
  );
}
