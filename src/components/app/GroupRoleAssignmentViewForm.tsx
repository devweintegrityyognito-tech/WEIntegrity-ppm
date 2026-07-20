import { Sparkles } from "lucide-react";
import type { GroupRoleAssignment } from "@/lib/group-role-assignments-store";

type GroupRoleAssignmentViewFormProps = {
  assignment: GroupRoleAssignment;
};

export default function GroupRoleAssignmentViewForm({
  assignment,
}: GroupRoleAssignmentViewFormProps) {
  return (
    <div className="rounded-xl bg-card border border-border shadow-card overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-border bg-muted/20">
        <div className="h-9 w-9 rounded-lg bg-gradient-primary grid place-items-center">
          <Sparkles className="h-4 w-4 text-white" />
        </div>

        <div>
          <h2 className="text-xl font-semibold">Group Role Assignment Details</h2>

          <p className="text-sm text-muted-foreground">View group role assignment information</p>
        </div>
      </div>

      <div className="px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Group</label>

            <input
              value={assignment.groupName || ""}
              readOnly
              className="w-full h-10 px-3 rounded-lg border border-border bg-muted text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Role</label>

            <input
              value={assignment.roleName || ""}
              readOnly
              className="w-full h-10 px-3 rounded-lg border border-border bg-muted text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Status</label>

            <input
              value={assignment.status || ""}
              readOnly
              className="w-full h-10 px-3 rounded-lg border border-border bg-muted text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Effective From</label>

            <input
              value={assignment.effectiveFrom || ""}
              readOnly
              className="w-full h-10 px-3 rounded-lg border border-border bg-muted text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Effective To</label>

            <input
              value={assignment.effectiveTo || ""}
              readOnly
              className="w-full h-10 px-3 rounded-lg border border-border bg-muted text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Assignment Reason</label>

            <textarea
              value={assignment.assignmentReason || ""}
              readOnly
              rows={3}
              className="w-full px-3 py-2 rounded-lg border border-border bg-muted text-sm resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Assigned By</label>

            <input
              value={assignment.createdBy || ""}
              readOnly
              className="w-full h-10 px-3 rounded-lg border border-border bg-muted text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Assigned Date</label>

            <input
              value={assignment.createdDate || ""}
              readOnly
              className="w-full h-10 px-3 rounded-lg border border-border bg-muted text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Updated By</label>

            <input
              value={assignment.updatedBy || ""}
              readOnly
              className="w-full h-10 px-3 rounded-lg border border-border bg-muted text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Updated Date</label>

            <input
              value={assignment.updatedDate || ""}
              readOnly
              className="w-full h-10 px-3 rounded-lg border border-border bg-muted text-sm"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
