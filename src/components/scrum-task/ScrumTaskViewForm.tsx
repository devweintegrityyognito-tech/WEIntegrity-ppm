import { useUsers } from "@/lib/users-store";
import type { ScrumTask } from "@/lib/scrum-tasks-store";
import { Sparkles } from "lucide-react";
interface ScrumTaskViewFormProps {
  task: ScrumTask;
}

export default function ScrumTaskViewForm({ task }: ScrumTaskViewFormProps) {
  const users = useUsers();
  const assignee = users.find((u) => u.id === task.assigneeId);
  const creator = users.find((u) => u.id === task.createdBy);
  return (
    <div className="rounded-xl bg-card border border-border shadow-card overflow-hidden">
      <div className="flex items-center gap-3 px-6 py-5 border-b border-border bg-muted/20">
        <div className="h-9 w-9 rounded-lg bg-gradient-primary grid place-items-center">
          <Sparkles className="h-4 w-4 text-white" />
        </div>

        <div>
          <h2 className="text-xl font-semibold">Scrum Task Details</h2>

          <p className="text-sm text-muted-foreground">View scrum task information</p>
        </div>
      </div>

      <div className="p-6 space-y-5">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium mb-2">Title</label>

          <input
            value={task.title}
            readOnly
            className="w-full h-10 px-3 rounded-lg border border-border bg-muted text-sm"
          />
        </div>

        {/* Row 1 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Assigned To</label>
            <input
              value={assignee ? `${assignee.firstName} ${assignee.lastName}` : ""}
              readOnly
              className="w-full h-10 px-3 rounded-lg border border-border bg-muted text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Priority</label>
            <input
              value={task.priority}
              readOnly
              className="w-full h-10 px-3 rounded-lg border border-border bg-muted text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Status</label>
            <input
              value={task.status}
              readOnly
              className="w-full h-10 px-3 rounded-lg border border-border bg-muted text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Original Estimate (Hours)</label>
            <input
              value={task.originalEstimate}
              readOnly
              className="w-full h-10 px-3 rounded-lg border border-border bg-muted text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Remaining Hours</label>
            <input
              value={task.remainingHours}
              readOnly
              className="w-full h-10 px-3 rounded-lg border border-border bg-muted text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Actual Hours</label>
            <input
              value={task.actualHoursSpent}
              readOnly
              className="w-full h-10 px-3 rounded-lg border border-border bg-muted text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Start Date</label>
            <input
              value={task.startDate ? new Date(task.startDate).toLocaleDateString() : "—"}
              readOnly
              className="w-full h-10 px-3 rounded-lg border border-border bg-muted text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Due Date</label>
            <input
              value={new Date(task.dueDate).toLocaleDateString()}
              readOnly
              className="w-full h-10 px-3 rounded-lg border border-border bg-muted text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Created By</label>
            <input
              value={creator ? `${creator.firstName} ${creator.lastName} (${creator.role})` : ""}
              readOnly
              className="w-full h-10 px-3 rounded-lg border border-border bg-muted text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Created On</label>
            <input
              value={task.createdAt ? new Date(task.createdAt).toLocaleDateString() : "—"}
              readOnly
              className="w-full h-10 px-3 rounded-lg border border-border bg-muted text-sm"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Description</label>

          <textarea
            value={task.description}
            readOnly
            rows={6}
            className="w-full px-3 py-2 rounded-lg border border-border bg-muted text-sm resize-none"
          />
        </div>
      </div>
    </div>
  );
}
