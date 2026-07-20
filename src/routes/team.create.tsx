import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2, Plus, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { teamsStore, type TeamStatus } from "@/lib/teams-store";

export const Route = createFileRoute("/team/create")({
  head: () => ({ meta: [{ title: "Create Group — Yognito" }] }),
  component: CreateTeamPage,
});

function CreateTeamPage() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [department, setDepartment] = useState("Engineering");
  const [groupType, setGroupType] = useState("Team");
  const [lead, setLead] = useState("");
  const [parentGroup, setParentGroup] = useState("");
  const [visibility, setVisibility] = useState("Public");
  const [status, setStatus] = useState<TeamStatus>("Active");
  const [description, setDescription] = useState("");

  const [errors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();

    if (!name.trim() || !lead.trim()) {
      toast.error("Please fill all required fields.");
      return;
    }

    const existingTeams = teamsStore.get();

    const duplicate = existingTeams.find(
      (t) => t.name.trim().toLowerCase() === name.trim().toLowerCase(),
    );

    if (duplicate) {
      toast.error("Group name already exists");
      return;
    }

    setSubmitting(true);

    try {
      const res = await teamsStore.add({
        name: name.trim(),
        department,
        lead: lead.trim(),
        groupType,
        visibility,
        parentGroup,
        description,
        members: 0,
        projects: 0,
        stories: 0,
        status,
      });

      const created = await res.json();

      if (!res.ok) {
        throw new Error(created.message);
      }

      toast.success(`Group ${created.code} created`);

      navigate({
        to: "/team",
      });
    } catch (err) {
      console.error(err);
      toast.error("Failed to create group");
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
        to="/team"
        className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mb-4"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Back to Groups
      </Link>
      <form onSubmit={handleCreate} className="space-y-5">
        <div className="rounded-xl bg-card border border-border shadow-card overflow-hidden">
          {/* Header */}
          <div className="flex items-center gap-3 px-6 py-4 border-b border-border bg-muted/20">
            <div className="h-9 w-9 rounded-lg bg-gradient-primary grid place-items-center">
              <Sparkles className="h-4 w-4 text-white" />
            </div>

            <div>
              <div className="font-semibold leading-tight">Create Group</div>

              <div className="text-xs text-muted-foreground">Create a new organization group</div>
            </div>
          </div>

          {/* Body */}
          <div className="px-6 py-6 space-y-5">
            {/* Group Name */}
            <Field label="Group Name" required>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter Group Name"
                maxLength={100}
                className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm outline-none focus:border-ring"
              />
            </Field>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Group Code">
                <input
                  value="Auto Generated"
                  disabled
                  className="w-full h-10 px-3 rounded-lg border border-border bg-muted/40 text-sm"
                />
              </Field>

              <Field label="Department" required>
                <FormSelect
                  value={department}
                  onChange={setDepartment}
                  options={[
                    { value: "Engineering", label: "Engineering" },
                    { value: "Product", label: "Product" },
                    { value: "QA", label: "QA" },
                    { value: "HR", label: "HR" },
                  ]}
                />
              </Field>

              <Field label="Group Type" required>
                <FormSelect
                  value={groupType}
                  onChange={setGroupType}
                  options={[
                    { value: "Department", label: "Department" },
                    { value: "Team", label: "Team" },
                    { value: "Project", label: "Project" },
                    { value: "Security Group", label: "Security Group" },
                  ]}
                />
              </Field>

              <Field label="Group Lead" required>
                <FormSelect
                  value={lead}
                  onChange={setLead}
                  options={[
                    { value: "", label: "Select Group Lead" },
                    { value: "Ibrahim Vali", label: "Ibrahim Vali" },
                    { value: "Mansoor Pasha Mohammad", label: "Mansoor Pasha Mohammad" },
                    { value: "Aarav Sharma", label: "Aarav Sharma" },
                  ]}
                />
              </Field>

              <Field label="Parent Group">
                <FormSelect
                  value={parentGroup}
                  onChange={setParentGroup}
                  options={[
                    { value: "", label: "None" },
                    { value: "Engineering", label: "Engineering" },
                    { value: "QA", label: "QA" },
                    { value: "HR", label: "HR" },
                  ]}
                />
              </Field>

              <Field label="Visibility" required>
                <FormSelect
                  value={visibility}
                  onChange={setVisibility}
                  options={[
                    { value: "Public", label: "Public" },
                    { value: "Private", label: "Private" },
                    { value: "Restricted", label: "Restricted" },
                  ]}
                />
              </Field>

              <Field label="Status" required>
                <div className="h-10 px-3 rounded-lg border border-border bg-muted/40 flex items-center text-sm">
                  {status}
                </div>
              </Field>
            </div>

            <Field label="Description">
              <textarea
                rows={4}
                maxLength={500}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter group description..."
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-ring resize-none"
              />
            </Field>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-border bg-muted/20 flex justify-end gap-2">
            <Link
              to="/team"
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
                  Create Group
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
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm outline-none focus:border-ring transition cursor-pointer"
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}
