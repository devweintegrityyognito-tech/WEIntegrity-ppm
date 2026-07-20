import type { Team } from "@/lib/teams-store";
import { Sparkles } from "lucide-react";

type GroupViewFormProps = {
  team: Team;
};

export default function GroupViewForm({ team }: GroupViewFormProps) {
  return (
    <div className="rounded-xl bg-card border border-border shadow-card overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-border bg-muted/20">
        <div className="h-9 w-9 rounded-lg bg-gradient-primary grid place-items-center">
          <Sparkles className="h-4 w-4 text-white" />
        </div>

        <div>
          <h2 className="text-xl font-semibold">Group Details</h2>
          <p className="text-sm text-muted-foreground">View group information</p>
        </div>
      </div>

      <div className="px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Group Name</label>
            <input
              value={team.name}
              readOnly
              className="w-full h-10 px-3 rounded-lg border border-border bg-muted text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Group Code</label>
            <input
              value={team.code}
              readOnly
              className="w-full h-10 px-3 rounded-lg border border-border bg-muted text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Department</label>
            <input
              value={team.department}
              readOnly
              className="w-full h-10 px-3 rounded-lg border border-border bg-muted text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Group Lead</label>
            <input
              value={team.lead}
              readOnly
              className="w-full h-10 px-3 rounded-lg border border-border bg-muted text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Group Type</label>
            <input
              value={team.groupType ?? ""}
              readOnly
              className="w-full h-10 px-3 rounded-lg border border-border bg-muted text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Parent Group</label>
            <input
              value={team.parentGroup || ""}
              readOnly
              className="w-full h-10 px-3 rounded-lg border border-border bg-muted text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Visibility</label>
            <input
              value={team.visibility ?? ""}
              readOnly
              className="w-full h-10 px-3 rounded-lg border border-border bg-muted text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Status</label>
            <input
              value={team.status ?? "Active"}
              readOnly
              className="w-full h-10 px-3 rounded-lg border border-border bg-muted text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Members</label>
            <input
              value={String(team.members)}
              readOnly
              className="w-full h-10 px-3 rounded-lg border border-border bg-muted text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Projects</label>
            <input
              value={String(team.projects)}
              readOnly
              className="w-full h-10 px-3 rounded-lg border border-border bg-muted text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Stories</label>
            <input
              value={String(team.stories)}
              readOnly
              className="w-full h-10 px-3 rounded-lg border border-border bg-muted text-sm"
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium mb-2">Description</label>

          <textarea
            value={team.description || ""}
            readOnly
            rows={4}
            className="w-full px-3 py-2 rounded-lg border border-border bg-muted text-sm resize-none"
          />
        </div>
      </div>
    </div>
  );
}
