import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2, Plus, Sparkles } from "lucide-react";
import { toast } from "sonner";

import {
  userGroupMembershipsStore,
  type MembershipType,
  type MembershipStatus,
} from "@/lib/user-group-memberships-store";

export const Route = createFileRoute("/user-group-memberships/create")({
  head: () => ({
    meta: [{ title: "Create User Group Membership — Yognito" }],
  }),
  component: CreateUserGroupMembershipPage,
});

interface User {
  id: string;
  firstName: string;
  lastName: string;
}

interface Team {
  id: string;
  name: string;
}

function CreateUserGroupMembershipPage() {
  const navigate = useNavigate();

  const [users, setUsers] = useState<User[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);

  const [userId, setUserId] = useState("");
  const [groupId, setGroupId] = useState("");

  const [membershipType, setMembershipType] = useState<MembershipType>("Primary");

  const [status, setStatus] = useState<MembershipStatus>("Active");

  const [effectiveFrom, setEffectiveFrom] = useState("");
  const [effectiveTo, setEffectiveTo] = useState("");

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadUsers();
    loadTeams();
  }, []);

  async function loadUsers() {
    try {
      const res = await fetch("https://weintegrity-ppm-main.onrender.com/api/users");
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load users");
    }
  }

  async function loadTeams() {
    try {
      const res = await fetch("https://weintegrity-ppm-main.onrender.com/api/teams");
      const data = await res.json();
      setTeams(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load groups");
    }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();

    if (!userId || !groupId) {
      toast.error("Please select User and Group.");
      return;
    }

    if (effectiveFrom && effectiveTo && new Date(effectiveTo) < new Date(effectiveFrom)) {
      toast.error("Effective To cannot be earlier than Effective From.");
      return;
    }

    setSubmitting(true);

    try {
      const res = await userGroupMembershipsStore.add({
        userId,
        groupId,
        membershipType,
        status,
        effectiveFrom,
        effectiveTo,
        createdBy: "",
        createdDate: "",
        updatedBy: "",
        updatedDate: "",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message);
      }

      toast.success("Membership created successfully");

      navigate({
        to: "/user-group-memberships",
      });
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : "Failed to create membership");
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

      <form onSubmit={handleCreate} className="space-y-5">
        <div className="rounded-xl bg-card border border-border shadow-card overflow-hidden">
          {/* Header */}
          <div className="flex items-center gap-3 px-6 py-4 border-b border-border bg-muted/20">
            <div className="h-9 w-9 rounded-lg bg-gradient-primary grid place-items-center">
              <Sparkles className="h-4 w-4 text-white" />
            </div>

            <div>
              <div className="font-semibold leading-tight">Create User Group Membership</div>

              <div className="text-xs text-muted-foreground">Assign a user to a group.</div>
            </div>
          </div>

          {/* Body */}
          <div className="px-6 py-6 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="User" required>
                <FormSelect
                  value={userId}
                  onChange={setUserId}
                  options={[
                    { value: "", label: "Select User" },
                    ...users.map((u) => ({
                      value: u.id,
                      label: `${u.firstName} ${u.lastName}`,
                    })),
                  ]}
                />
              </Field>

              <Field label="Group" required>
                <FormSelect
                  value={groupId}
                  onChange={setGroupId}
                  options={[
                    { value: "", label: "Select Group" },
                    ...teams.map((g) => ({
                      value: g.id,
                      label: g.name,
                    })),
                  ]}
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

              <Field label="Effective From">
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

          {/* Footer */}
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
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  Create Membership
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </motion.div>
  );
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
      <label className="block">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-medium text-foreground">
            {label}
            {required && <span className="text-[oklch(0.5_0.2_25)] ml-0.5">*</span>}
          </span>

          {hint && <span className="text-[10px] text-muted-foreground">{hint}</span>}
        </div>

        {children}

        {error && <div className="text-[11px] text-[oklch(0.5_0.2_25)] mt-1">{error}</div>}
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
}
