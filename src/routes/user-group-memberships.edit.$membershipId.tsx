import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2, Pencil } from "lucide-react";
import { toast } from "sonner";

import {
  userGroupMembershipsStore,
  type MembershipStatus,
  type MembershipType,
} from "@/lib/user-group-memberships-store";

import { useUsers } from "@/lib/users-store";
import { useTeams } from "@/lib/teams-store";

export const Route = createFileRoute("/user-group-memberships/edit/$membershipId")({
  component: EditUserGroupMembershipPage,
});

function EditUserGroupMembershipPage() {
  const navigate = useNavigate();

  const { membershipId } = Route.useParams();

  const users = useUsers();
  const teams = useTeams();

  const [userId, setUserId] = useState("");
  const [groupId, setGroupId] = useState("");

  const [membershipType, setMembershipType] = useState<MembershipType>("Primary");

  const [status, setStatus] = useState<MembershipStatus>("Active");

  const [effectiveFrom, setEffectiveFrom] = useState("");
  const [effectiveTo, setEffectiveTo] = useState("");

  const [createdBy, setCreatedBy] = useState("");
  const [createdDate, setCreatedDate] = useState("");

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function loadMembership() {
      try {
        const res = await fetch(`https://weintegrity-ppm-main.onrender.com/api/user-group-memberships/${membershipId}`);

        const membership = await res.json();

        setUserId(membership.userId || "");
        setGroupId(membership.groupId || "");

        setMembershipType(membership.membershipType || "Primary");

        setStatus(membership.status || "Active");

        setEffectiveFrom(membership.effectiveFrom || "");

        setEffectiveTo(membership.effectiveTo || "");

        setCreatedBy(membership.createdBy || "");

        setCreatedDate(membership.createdDate || "");
      } catch (err) {
        console.error(err);

        toast.error("Failed to load membership");
      }
    }

    loadMembership();
  }, [membershipId]);

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();

    if (!userId || !groupId || !effectiveFrom) {
      toast.error("Please fill all required fields.");

      return;
    }

    setSubmitting(true);

    try {
      await userGroupMembershipsStore.update(membershipId, {
        userId,
        groupId,
        membershipType,
        status,
        effectiveFrom,
        effectiveTo,
        createdBy,
        createdDate,
        updatedBy: "Admin",
        updatedDate: "",
      });

      toast.success("Membership updated successfully");

      navigate({
        to: "/user-group-memberships",
      });
    } catch (err) {
      console.error(err);

      toast.error("Failed to update membership");
    } finally {
      setSubmitting(false);
    }
  }
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="max-w-4xl mx-auto"
    >
      <Link
        to="/user-group-memberships"
        className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mb-4"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to User Group Memberships
      </Link>

      <form onSubmit={handleUpdate} className="space-y-5">
        <div className="rounded-xl bg-card border border-border shadow-card overflow-hidden">
          <div className="flex items-center gap-3 px-6 py-4 border-b border-border bg-muted/20">
            <div>
              <div className="font-semibold leading-tight">Update User Group Membership</div>

              <div className="text-xs text-muted-foreground">Update membership information</div>
            </div>
          </div>

          <div className="px-6 py-6 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="User" required>
                <FormSelect
                  value={userId}
                  onChange={setUserId}
                  options={users.map((user) => ({
                    value: user.id,
                    label: `${user.firstName} ${user.lastName}`,
                  }))}
                />
              </Field>

              <Field label="Group" required>
                <FormSelect
                  value={groupId}
                  onChange={setGroupId}
                  options={teams.map((team) => ({
                    value: team.id,
                    label: team.name,
                  }))}
                />
              </Field>

              <Field label="Membership Type" required>
                <FormSelect
                  value={membershipType}
                  onChange={(value) => setMembershipType(value as MembershipType)}
                  options={[
                    { value: "Primary", label: "Primary" },
                    { value: "Secondary", label: "Secondary" },
                    { value: "Guest", label: "Guest" },
                  ]}
                />
              </Field>

              <Field label="Status" required>
                <FormSelect
                  value={status}
                  onChange={(value) => setStatus(value as MembershipStatus)}
                  options={[
                    { value: "Active", label: "Active" },
                    { value: "Inactive", label: "Inactive" },
                  ]}
                />
              </Field>

              <Field label="Effective From" required>
                <input
                  type="date"
                  value={effectiveFrom}
                  onChange={(e) => setEffectiveFrom(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm outline-none focus:border-ring"
                />
              </Field>

              <Field label="Effective To">
                <input
                  type="date"
                  value={effectiveTo}
                  onChange={(e) => setEffectiveTo(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm outline-none focus:border-ring"
                />
              </Field>
            </div>
          </div>

          <div className="px-6 py-4 border-t border-border bg-muted/20 flex justify-end gap-2">
            <Link
              to="/user-group-memberships"
              className="h-9 px-4 rounded-lg border border-border inline-flex items-center text-sm"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={submitting}
              className="h-9 px-4 rounded-lg bg-gradient-primary text-primary-foreground inline-flex items-center gap-2 text-sm"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Pencil className="h-4 w-4" />
                  Update Membership
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </motion.div>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <div className="mb-1.5 text-xs font-medium">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </div>

      {children}
    </label>
  );
}

function FormSelect({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm outline-none focus:border-ring"
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
