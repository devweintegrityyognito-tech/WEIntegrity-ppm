import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2, Plus, Sparkles } from "lucide-react";
import { toast } from "sonner";

import {
  groupRoleAssignmentsStore,
  type GroupRoleAssignmentStatus,
} from "@/lib/group-role-assignments-store";

export const Route = createFileRoute("/group-role-assignments/create")({
  head: () => ({
    meta: [{ title: "Create Group Role Assignment — Yognito" }],
  }),
  component: CreateGroupRoleAssignmentPage,
});

interface Team {
  id: string;
  name: string;
}

interface Role {
  id: string;
  name: string;
}

function CreateGroupRoleAssignmentPage() {
  const navigate = useNavigate();

  const [teams, setTeams] = useState<Team[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);

  const [groupId, setGroupId] = useState("");
  const [roleId, setRoleId] = useState("");

  const [status, setStatus] = useState<GroupRoleAssignmentStatus>("Active");

  const [effectiveFrom, setEffectiveFrom] = useState("");
  const [effectiveTo, setEffectiveTo] = useState("");

  const [assignmentReason, setAssignmentReason] = useState("");

  const [submitting, setSubmitting] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    loadGroups();
    loadRoles();
  }, []);

  async function loadGroups() {
    try {
      const res = await fetch("https://weintegrity-ppm-main.onrender.com/api/teams");
      const data = await res.json();
      setTeams(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load groups");
    }
  }

  async function loadRoles() {
    try {
      const res = await fetch("https://weintegrity-ppm-main.onrender.com/api/roles");
      const data = await res.json();
      setRoles(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load roles");
    }
  }

  function validate() {
    const e: Record<string, string> = {};

    if (!groupId) {
      e.groupId = "Please select a Group.";
    }

    if (!roleId) {
      e.roleId = "Please select a Role.";
    }

    if (effectiveFrom && effectiveTo && new Date(effectiveTo) < new Date(effectiveFrom)) {
      e.effectiveTo = "Effective To cannot be earlier than Effective From.";
    }

    setErrors(e);

    if (Object.keys(e).length > 0) {
      toast.error("Please correct the highlighted fields.");
      return false;
    }

    return true;
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();

    if (!validate()) return;

    setSubmitting(true);

    try {
      await groupRoleAssignmentsStore.add({
        groupId,
        roleId,
        status,
        effectiveFrom,
        effectiveTo,
        assignmentReason: assignmentReason.trim(),
      });

      toast.success("Group Role Assignment created successfully.");

      navigate({
        to: "/group-role-assignments",
      });
    } catch (err) {
      console.error(err);

      toast.error(err instanceof Error ? err.message : "Failed to create Group Role Assignment.");
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
        to="/group-role-assignments"
        className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mb-4"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to Group Role Assignments
      </Link>

      <form onSubmit={handleCreate} className="space-y-5">
        <div className="rounded-xl bg-card border border-border shadow-card overflow-hidden">
          {/* Header */}

          <div className="flex items-center gap-3 px-6 py-4 border-b border-border bg-muted/20">
            <div className="h-9 w-9 rounded-lg bg-gradient-primary grid place-items-center">
              <Sparkles className="h-4 w-4 text-white" />
            </div>

            <div>
              <div className="font-semibold leading-tight">Create Group Role Assignment</div>

              <div className="text-xs text-muted-foreground">Assign a role to a group.</div>
            </div>
          </div>

          {/* Body */}

          <div className="px-6 py-6 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Group" required error={errors.groupId}>
                <FormSelect
                  value={groupId}
                  onChange={setGroupId}
                  options={[
                    {
                      value: "",
                      label: "Select Group",
                    },
                    ...teams.map((team) => ({
                      value: team.id,
                      label: team.name,
                    })),
                  ]}
                />
              </Field>

              <Field label="Role" required error={errors.roleId}>
                <FormSelect
                  value={roleId}
                  onChange={setRoleId}
                  options={[
                    {
                      value: "",
                      label: "Select Role",
                    },
                    ...roles.map((role) => ({
                      value: role.id,
                      label: role.name,
                    })),
                  ]}
                />
              </Field>

              <Field label="Status">
                <FormSelect
                  value={status}
                  onChange={(value) => setStatus(value as GroupRoleAssignmentStatus)}
                  options={[
                    {
                      value: "Active",
                      label: "Active",
                    },
                    {
                      value: "Inactive",
                      label: "Inactive",
                    },
                  ]}
                />
              </Field>

              <Field label="Effective From">
                <input
                  type="date"
                  value={effectiveFrom}
                  onChange={(e) => setEffectiveFrom(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm outline-none focus:border-ring"
                />
              </Field>

              <Field label="Effective To" error={errors.effectiveTo}>
                <input
                  type="date"
                  value={effectiveTo}
                  onChange={(e) => setEffectiveTo(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm outline-none focus:border-ring"
                />
              </Field>
            </div>

            <Field label="Assignment Reason">
              <textarea
                value={assignmentReason}
                onChange={(e) => setAssignmentReason(e.target.value)}
                rows={4}
                maxLength={500}
                placeholder="Enter assignment reason..."
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm outline-none focus:border-ring transition resize-none"
              />
            </Field>
          </div>

          {/* Footer */}

          <div className="px-6 py-4 border-t border-border bg-muted/20 flex justify-end gap-2">
            <Link
              to="/group-role-assignments"
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
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  Create Assignment
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
  hint,
  required,
  error,
  children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="block">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs font-medium text-foreground">
          {label}
          {required && <span className="ml-0.5 text-[oklch(0.5_0.2_25)]">*</span>}
        </span>

        {hint && <span className="text-[10px] text-muted-foreground">{hint}</span>}
      </div>

      {children}

      {error && <div className="mt-1 text-[11px] text-[oklch(0.5_0.2_25)]">{error}</div>}
    </div>
  );
}

function FormSelect({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (value: string) => void;
  options: {
    value: string;
    label: string;
  }[];
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm outline-none focus:border-ring transition cursor-pointer"
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
