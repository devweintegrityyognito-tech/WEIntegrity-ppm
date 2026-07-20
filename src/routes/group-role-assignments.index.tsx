import { createFileRoute, Link } from "@tanstack/react-router";
import { Search, Plus, Filter, X } from "lucide-react";
import { useState } from "react";
import { useGroupRoleAssignments } from "@/lib/group-role-assignments-store";
import GroupRoleAssignmentsList from "@/components/app/GroupRoleAssignmentsList";

export const Route = createFileRoute("/group-role-assignments/")({
  head: () => ({
    meta: [{ title: "Group Role Assignments — Yognito" }],
  }),
  component: GroupRoleAssignmentsPage,
});

function GroupRoleAssignmentsPage() {
  const assignments = useGroupRoleAssignments();

  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");

  const filtered = assignments.filter((assignment) => {
    const search =
      assignment.groupName.toLowerCase().includes(q.toLowerCase()) ||
      assignment.roleName.toLowerCase().includes(q.toLowerCase());

    if (!search) return false;

    if (status !== "all" && assignment.status !== status) return false;

    return true;
  });

  const activeFilters = (q ? 1 : 0) + (status !== "all" ? 1 : 0);

  return (
    <>
      <div className="flex items-end justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Group Role Assignments</h1>

          <p className="text-sm text-muted-foreground mt-1">Assign roles to groups.</p>
        </div>

        <Link
          to="/group-role-assignments/create"
          className="h-10 px-3.5 rounded-lg bg-gradient-primary text-primary-foreground text-sm font-medium inline-flex items-center gap-1.5 shadow-elegant"
        >
          <Plus className="h-4 w-4" />
          New Assignment
        </Link>
      </div>

      <div className="rounded-xl bg-card border border-border shadow-card p-4 mt-6 mb-4">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative flex-1 min-w-50 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search assignments..."
              className="w-full h-10 pl-9 pr-3 rounded-lg bg-background border border-border text-sm outline-none focus:border-ring"
            />
          </div>

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
                setStatus("all");
              }}
              className="h-9 px-3 rounded-lg border border-border text-sm inline-flex items-center gap-1.5"
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

      <GroupRoleAssignmentsList assignments={filtered} />
    </>
  );
}
