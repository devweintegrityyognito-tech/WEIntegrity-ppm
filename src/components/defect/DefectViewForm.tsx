import type { Defect } from "@/lib/defects-store";
import { useUsers } from "@/lib/users-store";
import { Sparkles } from "lucide-react";

type DefectViewFormProps = {
  defect: Defect;
};

export default function DefectViewForm({ defect }: DefectViewFormProps) {
  const users = useUsers();
  const reporter = users.find((u) => u.id === defect.reportedBy);
  const assignee = users.find((u) => u.id === defect.assignedTo);
  return (
    <div className="rounded-xl bg-card border border-border shadow-card overflow-hidden">
      <div className="flex items-center gap-3 px-6 py-5 border-b border-border bg-muted/20">
        <div className="h-9 w-9 rounded-lg bg-gradient-primary grid place-items-center">
          <Sparkles className="h-4 w-4 text-white" />
        </div>

        <div>
          <h2 className="text-xl font-semibold">Defect Details</h2>

          <p className="text-sm text-muted-foreground">View defect information</p>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Title</label>
            <input
              value={defect.defectTitle}
              readOnly
              className="w-full h-10 px-3 rounded-lg border border-border bg-muted text-sm mt-1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Priority</label>
            <input
              value={defect.priority}
              readOnly
              className="w-full h-10 px-3 rounded-lg border border-border bg-muted text-sm mt-1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Severity</label>
            <input
              value={defect.severity}
              readOnly
              className="w-full h-10 px-3 rounded-lg border border-border bg-muted text-sm mt-1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Status</label>
            <input
              value={defect.status}
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
            <label className="block text-sm font-medium mb-2">Reported By</label>
            <input
              value={reporter ? `${reporter.firstName} ${reporter.lastName}` : ""}
              readOnly
              className="w-full h-10 px-3 rounded-lg border border-border bg-muted text-sm mt-1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Environment</label>
            <input
              value={defect.environment ?? ""}
              readOnly
              className="w-full h-10 px-3 rounded-lg border border-border bg-muted text-sm mt-1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Due Date</label>
            <input
              value={defect.dueDate ?? ""}
              readOnly
              className="w-full h-10 px-3 rounded-lg border border-border bg-muted text-sm mt-1"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">Defect Description</label>
            <textarea
              value={defect.defectDescription}
              readOnly
              rows={4}
              className="w-full px-3 py-2 rounded-lg border border-border bg-muted text-sm resize-none"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">Steps To Reproduce</label>
            <textarea
              value={defect.stepsToReproduce ?? ""}
              readOnly
              rows={4}
              className="w-full px-3 py-2 rounded-lg border border-border bg-muted text-sm resize-none"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">Expected Result</label>
            <textarea
              value={defect.expectedResult ?? ""}
              readOnly
              rows={4}
              className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-muted text-sm resize-none"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">Actual Result</label>
            <textarea
              value={defect.actualResult ?? ""}
              readOnly
              rows={4}
              className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-muted text-sm resize-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
