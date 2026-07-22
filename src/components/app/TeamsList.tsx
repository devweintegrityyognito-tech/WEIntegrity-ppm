import { Badge } from "@/components/app/Badge";
import { Pencil, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { Team, teamsStore } from "@/lib/teams-store";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";

interface TeamsListProps {
  teams: Team[];
}

export function TeamsList({ teams }: TeamsListProps) {
  const PAGE_SIZE = 8;

  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(teams.length / PAGE_SIZE));

  const safePage = Math.min(page, totalPages);

  const pagedTeams = teams.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);
  return (
    <div className="rounded-xl bg-card border border-border shadow-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-[11px] uppercase tracking-wider text-muted-foreground bg-muted/40">
              <th className="px-5 py-3 text-left font-medium">Group</th>
              <th className="px-5 py-3 text-left font-medium">Group Lead</th>
              <th className="px-5 py-3 text-left font-medium">Department</th>
              <th className="px-5 py-3 text-center font-medium">Members</th>
              <th className="px-5 py-3 text-center font-medium">Projects</th>
              <th className="px-5 py-3 text-center font-medium">Stories</th>
              <th className="px-5 py-3 text-left font-medium">Status</th>
              <th className="w-16 px-4 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>

          <tbody>
            {pagedTeams.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-16 text-center text-sm text-muted-foreground">
                  No groups found.
                </td>
              </tr>
            ) : (
              pagedTeams.map((team) => (
                <tr
                  key={team.id}
                  className="group border-t border-border hover:bg-muted/30 transition-colors cursor-pointer"
                >
                  <td className="px-5 py-4">
                    <Link to="/team/$teamId" params={{ teamId: team.id }} className="block">
                      <div className="font-medium hover:text-primary">{team.name}</div>

                      <div className="text-xs text-muted-foreground">{team.code}</div>
                    </Link>
                  </td>

                  <td className="px-5 py-4">{team.lead}</td>

                  <td className="px-5 py-4">{team.department}</td>

                  <td className="px-5 py-4 text-center">{team.members}</td>

                  <td className="px-5 py-4 text-center">{team.projects}</td>

                  <td className="px-5 py-4 text-center">{team.stories}</td>

                  <td className="px-5 py-4">
                    <Badge tone={team.status === "Active" ? "success" : "muted"}>
                      {team.status}
                    </Badge>
                  </td>

                  <td className="px-4 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        to="/team/edit/$teamId"
                        params={{ teamId: team.id }}
                        onClick={(e) => e.stopPropagation()}
                        title="Edit"
                        className="h-7 w-7 grid place-items-center rounded-md hover:bg-muted"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Link>

                      <button
                        onClick={async (e) => {
                          e.stopPropagation();

                          try {
                            await teamsStore.remove(team.id);

                            toast.success("Group deleted successfully");
                          } catch (error) {
                            console.error(error);

                            toast.error("Failed to delete group");
                          }
                        }}
                        title="Delete"
                        className="h-7 w-7 grid place-items-center rounded-md hover:bg-muted"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between px-5 py-3 border-t border-border bg-muted/20">
        <div className="text-xs text-muted-foreground">
          Showing <span className="font-medium text-foreground">{pagedTeams.length}</span> of{" "}
          <span className="font-medium text-foreground">{teams.length}</span>
        </div>

        <div className="flex items-center gap-1">
          <button
            disabled={safePage === 1}
            onClick={() => setPage(safePage - 1)}
            className="h-8 w-8 grid place-items-center rounded-md border border-border disabled:opacity-40 hover:bg-muted"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <div className="text-xs px-3 tabular-nums">
            Page {safePage} / {totalPages}
          </div>

          <button
            disabled={safePage === totalPages}
            onClick={() => setPage(safePage + 1)}
            className="h-8 w-8 grid place-items-center rounded-md border border-border disabled:opacity-40 hover:bg-muted"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
