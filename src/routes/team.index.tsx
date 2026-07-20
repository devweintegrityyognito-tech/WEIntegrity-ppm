import { createFileRoute } from "@tanstack/react-router";
import { useTeams } from "@/lib/teams-store";
import { Search, Plus, Filter, X } from "lucide-react";
import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { TeamsList } from "@/components/app/TeamsList";

export const Route = createFileRoute("/team/")({
  head: () => ({ meta: [{ title: "Team — Yognito" }] }),
  component: TeamPage,
});

function TeamPage() {
  const teams = useTeams();

  const [q, setQ] = useState("");
  const [department, setDepartment] = useState("all");
  const [status, setStatus] = useState("all");
  const [lead, setLead] = useState("all");
  const [projects, setProjects] = useState("all");

  const filtered = teams.filter((team) => {
    const search =
      team.name.toLowerCase().includes(q.toLowerCase()) ||
      team.lead.toLowerCase().includes(q.toLowerCase()) ||
      team.department.toLowerCase().includes(q.toLowerCase());

    if (!search) return false;

    if (department !== "all" && team.department !== department) return false;

    if (status !== "all" && team.status !== status) return false;

    if (lead !== "all" && team.lead !== lead) return false;

    if (projects !== "all" && String(team.projects) !== projects) return false;

    return true;
  });

  const departments = [...new Set(teams.map((t) => t.department))];
  const leads = [...new Set(teams.map((t) => t.lead))];

  const activeFilters =
    (q ? 1 : 0) +
    (department !== "all" ? 1 : 0) +
    (status !== "all" ? 1 : 0) +
    (lead !== "all" ? 1 : 0) +
    (projects !== "all" ? 1 : 0);

  return (
    <>
      <div className="flex items-end justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Groups</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage groups across your organization.
          </p>
        </div>
        <Link
          to="/team/create"
          className="h-10 px-3.5 rounded-lg bg-gradient-primary text-primary-foreground text-sm font-medium inline-flex items-center gap-1.5 shadow-elegant"
        >
          <Plus className="h-4 w-4" />
          New Group
        </Link>
      </div>

      <div className="rounded-xl bg-card border border-border shadow-card p-4 mt-6 mb-4">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative flex-1 min-w-50 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search groups..."
              className="w-full h-10 pl-9 pr-3 rounded-lg bg-background border border-border text-sm outline-none focus:border-ring transition"
            />
          </div>

          <select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="h-10 px-2.5 rounded-lg border border-border bg-background text-sm outline-none focus:border-ring transition cursor-pointer"
          >
            <option value="all">All Departments</option>

            {departments.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="h-10 min-w-30 rounded-lg border border-border bg-background px-4 text-sm"
          >
            <option value="all">All Statuses</option>

            <option value="Active">Active</option>

            <option value="Inactive">Inactive</option>
          </select>

          <select
            value={lead}
            onChange={(e) => setLead(e.target.value)}
            className="h-10 min-w-30 rounded-lg border border-border bg-background px-4 text-sm"
          >
            <option value="all">All Leads</option>

            {leads.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>

          <select
            value={projects}
            onChange={(e) => setProjects(e.target.value)}
            className="h-10 min-w-30 rounded-lg border border-border bg-background px-4 text-sm"
          >
            <option value="all">All Projects</option>

            <option value="0">0 Projects</option>

            <option value="1">1 Project</option>

            <option value="2">2 Projects</option>

            <option value="3">3 Projects</option>

            <option value="4">4 Projects</option>

            <option value="5">5+ Projects</option>
          </select>

          {activeFilters > 0 && (
            <button
              onClick={() => {
                setQ("");
                setDepartment("all");
                setStatus("all");
                setLead("all");
                setProjects("all");
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
      <TeamsList teams={filtered} />
    </>
  );
}
