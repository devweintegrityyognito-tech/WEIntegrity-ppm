import type { Story } from "@/lib/stories-store";
import { PROJECTS, SPRINTS } from "@/lib/stories-store";
import { useUsers } from "@/lib/users-store";
import { Sparkles } from "lucide-react";

type StoryViewFormProps = {
  story: Story;
};

export default function StoryViewForm({ story }: StoryViewFormProps) {
  const project = PROJECTS.find((p) => p.id === story.projectId);
  const sprint = SPRINTS.find((s) => s.id === story.sprintId);
  const users = useUsers();
  const assignee = users.find((u) => u.id === story.assigneeId);
  return (
    <div className="rounded-xl bg-card border border-border shadow-card overflow-hidden">
      <div className="flex items-center gap-3 px-6 py-5 border-b border-border bg-muted/20">
        <div className="h-9 w-9 rounded-lg bg-gradient-primary grid place-items-center">
          <Sparkles className="h-4 w-4 text-white" />
        </div>

        <div>
          <h2 className="text-xl font-semibold">Story Details</h2>
          <p className="text-sm text-muted-foreground">View story information</p>
        </div>
      </div>
      <div className="px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">State</label>
            <input
              value={story.status}
              readOnly
              className="w-full h-10 px-3 rounded-lg border border-border bg-muted text-sm mt-1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Priority</label>
            <input
              value={story.priority}
              readOnly
              className="w-full h-10 px-3 rounded-lg border border-border bg-muted text-sm mt-1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Project</label>
            <input
              value={project?.name ?? ""}
              readOnly
              className="w-full h-10 px-3 rounded-lg border border-border bg-muted text-sm mt-1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Assigned To</label>
            <input
              value={assignee ? `${assignee.firstName} ${assignee.lastName}` : ""}
              readOnly
              className="w-full h-10 px-3 rounded-lg border border-border bg-muted text-sm mt-1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Sprint</label>
            <input
              value={sprint?.name ?? ""}
              readOnly
              className="w-full h-10 px-3 rounded-lg border border-border bg-muted text-sm mt-1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Team</label>
            <input
              value={story.team}
              readOnly
              className="w-full h-10 px-3 rounded-lg border border-border bg-muted text-sm mt-1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Business Value</label>
            <input
              value={story.businessValue ?? ""}
              readOnly
              className="w-full h-10 px-3 rounded-lg border border-border bg-muted text-sm mt-1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Story Points</label>
            <input
              value={String(story.storyPoints)}
              readOnly
              className="w-full h-10 px-3 rounded-lg border border-border bg-muted text-sm mt-1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Due Date</label>
            <input
              value={new Date(story.dueDate).toLocaleDateString()}
              readOnly
              className="w-full h-10 px-3 rounded-lg border border-border bg-muted text-sm mt-1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Reporter</label>
            <input
              value={story.reporter ?? ""}
              readOnly
              className="w-full h-10 px-3 rounded-lg border border-border bg-muted text-sm mt-1"
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium mb-2">Story Description</label>

          <textarea
            value={story.description}
            readOnly
            rows={4}
            className="w-full px-3 py-2 rounded-lg border border-border bg-muted text-sm resize-none"
          />
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium mb-2">Acceptance Criteria</label>

          <textarea
            value={story.acceptanceCriteria}
            readOnly
            rows={4}
            className="w-full px-3 py-2 rounded-lg border border-border bg-muted text-sm resize-none"
          />
        </div>
      </div>
    </div>
  );
}
