import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "@tanstack/react-router";
import { Loader2, Pencil, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { teamsStore, useTeams, type Team, type TeamStatus } from "@/lib/teams-store";

type GroupEditFormProps = {
  team: Team;
};

export default function GroupEditForm({ team }: GroupEditFormProps) {
  const navigate = useNavigate();
  const teams = useTeams();
  const [name, setName] = useState(team.name);
  const [department, setDepartment] = useState(team.department);
  const [groupType, setGroupType] = useState(team.groupType);
  const [lead, setLead] = useState(team.lead);
  const [parentGroup, setParentGroup] = useState(team.parentGroup);
  const [visibility, setVisibility] = useState(team.visibility);
  const [status, setStatus] = useState<TeamStatus>(team.status);
  const [description, setDescription] = useState(team.description);

  const [submitting, setSubmitting] = useState(false);

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();

    if (!name.trim() || !lead.trim()) {
      toast.error("Please fill all required fields.");
      return;
    }

    if (parentGroup === team.name) {
      toast.error("A group cannot be its own parent.");
      return;
    }

    setSubmitting(true);

    try {
      await teamsStore.update(team.id, {
        code: team.code,
        name: name.trim(),
        department,
        lead: lead.trim(),
        members: team.members,
        projects: team.projects,
        stories: team.stories,
        status,
        groupType,
        visibility,
        parentGroup,
        description,
      });

      toast.success("Group updated successfully");

      navigate({
        to: "/team",
      });
    } catch {
      toast.error("Failed to update group");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <motion.form
      onSubmit={handleUpdate}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-5"
    >
      <div className="rounded-xl bg-card border border-border shadow-card overflow-hidden">
        {/* Header */}

        <div className="flex items-center gap-3 px-6 py-4 border-b border-border bg-muted/20">
          <div className="h-9 w-9 rounded-lg bg-gradient-primary grid place-items-center">
            <Sparkles className="h-4 w-4 text-white" />
          </div>

          <div>
            <div className="font-semibold leading-tight">Update Group</div>

            <div className="text-xs text-muted-foreground">Update group information</div>
          </div>
        </div>

        {/* Body */}

        <div className="px-6 py-6 space-y-5">
          <div>
            <label className="block text-sm font-medium mb-2">
              Group Name
              <span className="text-[oklch(0.5_0.2_25)] ml-0.5">*</span>
            </label>

            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm outline-none focus:border-ring"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Group Code</label>

              <input
                value={team.code}
                readOnly
                className="w-full h-10 px-3 rounded-lg border border-border bg-muted/40 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Department
                <span className="text-[oklch(0.5_0.2_25)] ml-0.5">*</span>
              </label>

              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm outline-none focus:border-ring"
              >
                <option>Engineering</option>
                <option>Product</option>
                <option>QA</option>
                <option>HR</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Group Type
                <span className="text-[oklch(0.5_0.2_25)] ml-0.5">*</span>
              </label>

              <select
                value={groupType}
                onChange={(e) => setGroupType(e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm outline-none focus:border-ring"
              >
                <option>Department</option>
                <option>Team</option>
                <option>Project</option>
                <option>Security Group</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Group Lead
                <span className="text-[oklch(0.5_0.2_25)] ml-0.5">*</span>
              </label>

              <select
                value={lead}
                onChange={(e) => setLead(e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm outline-none focus:border-ring"
              >
                <option>Ibrahim Vali</option>
                <option>Mansoor Pasha Mohammad</option>
                <option>Aarav Sharma</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Parent Group</label>

              <select
                value={parentGroup}
                onChange={(e) => setParentGroup(e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm outline-none focus:border-ring"
              >
                <option value="">None</option>

                {teams
                  .filter((t) => t.id !== team.id)
                  .map((t) => (
                    <option key={t.id} value={t.name}>
                      {t.name}
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Visibility
                <span className="text-[oklch(0.5_0.2_25)] ml-0.5">*</span>
              </label>

              <select
                value={visibility}
                onChange={(e) => setVisibility(e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm outline-none focus:border-ring"
              >
                <option>Public</option>
                <option>Private</option>
                <option>Restricted</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Status
                <span className="text-[oklch(0.5_0.2_25)] ml-0.5">*</span>
              </label>

              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as TeamStatus)}
                className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm outline-none focus:border-ring"
              >
                <option>Active</option>
                <option>Inactive</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Description</label>

            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-ring resize-none"
            />
          </div>
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
                Updating...
              </>
            ) : (
              <>
                <Pencil className="h-4 w-4" />
                Update Group
              </>
            )}
          </button>
        </div>
      </div>
    </motion.form>
  );
}
