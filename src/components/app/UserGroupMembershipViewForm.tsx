import { Sparkles } from "lucide-react";
import type { UserGroupMembership } from "@/lib/user-group-memberships-store";

type UserGroupMembershipViewFormProps = {
  membership: UserGroupMembership;
};

export default function UserGroupMembershipViewForm({
  membership,
}: UserGroupMembershipViewFormProps) {
  return (
    <div className="rounded-xl bg-card border border-border shadow-card overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-border bg-muted/20">
        <div className="h-9 w-9 rounded-lg bg-gradient-primary grid place-items-center">
          <Sparkles className="h-4 w-4 text-white" />
        </div>

        <div>
          <h2 className="text-xl font-semibold">User Group Membership Details</h2>

          <p className="text-sm text-muted-foreground">View membership information</p>
        </div>
      </div>

      <div className="px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">User</label>

            <input
              value={membership.userName}
              readOnly
              className="w-full h-10 px-3 rounded-lg border border-border bg-muted text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Group</label>

            <input
              value={membership.groupName}
              readOnly
              className="w-full h-10 px-3 rounded-lg border border-border bg-muted text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Membership Type</label>

            <input
              value={membership.membershipType}
              readOnly
              className="w-full h-10 px-3 rounded-lg border border-border bg-muted text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Status</label>

            <input
              value={membership.status}
              readOnly
              className="w-full h-10 px-3 rounded-lg border border-border bg-muted text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Effective From</label>

            <input
              value={membership.effectiveFrom || ""}
              readOnly
              className="w-full h-10 px-3 rounded-lg border border-border bg-muted text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Effective To</label>

            <input
              value={membership.effectiveTo || ""}
              readOnly
              className="w-full h-10 px-3 rounded-lg border border-border bg-muted text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Created By</label>

            <input
              value={membership.createdBy || ""}
              readOnly
              className="w-full h-10 px-3 rounded-lg border border-border bg-muted text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Created Date</label>

            <input
              value={membership.createdDate || ""}
              readOnly
              className="w-full h-10 px-3 rounded-lg border border-border bg-muted text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Updated By</label>

            <input
              value={membership.updatedBy || ""}
              readOnly
              className="w-full h-10 px-3 rounded-lg border border-border bg-muted text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Updated Date</label>

            <input
              value={membership.updatedDate || ""}
              readOnly
              className="w-full h-10 px-3 rounded-lg border border-border bg-muted text-sm"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
