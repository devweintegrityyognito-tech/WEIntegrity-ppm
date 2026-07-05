import { createFileRoute, Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Hash, Loader2, Plus, Sparkles } from "lucide-react";
import { toast } from "sonner";
import {
  PRIORITIES,
  ASSIGNEES,
  SPRINTS,
  PROJECTS,
  TEAMS,
  STORY_TYPES,
  type StoryPriority,
  type StoryStatus,
  type StoryType,
} from "@/lib/stories-store";
import { currentUser } from "@/lib/mock-data";

export const Route = createFileRoute("/tasks/create")({
  validateSearch: (search: Record<string, unknown>) => ({
    storyId: typeof search.storyId === "string" ? search.storyId : "",
  }),
  head: () => ({ meta: [{ title: "Create Scrum Task - Yognito" }] }),
  component: CreateTaskPage,
});

function CreateTaskPage() {
  const navigate = useNavigate();
  const { storyId } = useSearch({ from: "/tasks/create" });
  const [title, setTitle] = useState("");
  const [projectId, setProjectId] = useState(PROJECTS[0].id);
  const [sprintId, setSprintId] = useState(SPRINTS[0].id);
  const [team, setTeam] = useState(TEAMS[0]);
  const [assigneeId, setAssigneeId] = useState(currentUser.id);
  const [priority, setPriority] = useState<StoryPriority>("Medium");
  const [type, setType] = useState<StoryType>("Story");
  const [originalEstimate, setOriginalEstimate] = useState(8);
  const [remainingHours, setRemainingHours] = useState(8);
  const [actualHoursSpent, setActualHoursSpent] = useState(0);
  const [dueDate, setDueDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().slice(0, 10);
  });
  const [description, setDescription] = useState("");
  const [acceptanceCriteria, setAcceptanceCriteria] = useState("");
  const [status] = useState<StoryStatus>("Todo");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const e: Record<string, string> = {};

    if (!title.trim()) e.title = "Short description is required";
    else if (title.length > 140) e.title = "Keep it under 140 characters";

    if (!projectId) e.projectId = "Select a project";
    if (!assigneeId) e.assigneeId = "Select an assignee";
    if (!description.trim()) e.description = "Description is required";

    if (!acceptanceCriteria.trim()) e.acceptanceCriteria = "Acceptance Criteria is required";

    if (!sprintId) e.sprintId = "Select a Sprint";

    if (originalEstimate === 0) e.originalEstimate = "Estimate must be greater than 0";

    if (originalEstimate < 0) e.originalEstimate = "Estimate cannot be negative";

    if (remainingHours === 0) e.remainingHours = "Remaining Hours must be greater than 0";

    if (remainingHours < 0) e.remainingHours = "Remaining Hours cannot be negative";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) {
      toast.error("Please fill all the required fields.");
      return;
    }
    setSubmitting(true);

    fetch("https://weintegrity-ppm-main.onrender.com/api/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        storyId,
        title: title.trim(),
        description: description.trim(),
        acceptanceCriteria: acceptanceCriteria.trim(),
        priority,
        status,
        assigneeId,
        sprintId,
        projectId,
        team,
        type,
        dueDate: new Date(dueDate).toISOString(),
        originalEstimate,
        remainingHours,
        actualHoursSpent,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        toast.success("Scrum Task created successfully");

        setSubmitting(false);
        navigate({
          to: "/stories/$storyId",
          params: { storyId: storyId! },
        });
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to Create Scrum Task");
        setSubmitting(false);
      });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="max-w-4xl mx-auto"
    >
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
        <Link to="/dashboard" className="hover:text-foreground">
          Home
        </Link>

        <span>&gt;</span>

        <Link to="/stories/$storyId" params={{ storyId }} className="hover:text-foreground">
          Stories
        </Link>

        <span>&gt;</span>

        <span className="text-foreground font-medium"> Create Scrum Task </span>
      </div>
      <form onSubmit={submit} className="space-y-5">
        <div className="rounded-xl bg-card border border-border shadow-card overflow-hidden">
          <div className="flex items-center gap-3 px-6 py-4 border-b border-border bg-muted/20">
            <div className="h-9 w-9 rounded-lg bg-gradient-primary grid place-items-center">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <div>
              <div className="font-semibold leading-tight">Create Scrum Task</div>
              <div className="text-xs text-muted-foreground">
                Create a Scrum Task for this Story
              </div>
            </div>
          </div>

          <div className="px-6 py-6 space-y-5">
            <Field label="Short description" required error={errors.title}>
              <input
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (errors.title) setErrors({ ...errors, title: "" });
                }}
                maxLength={140}
                placeholder="e.g. Implement OAuth2 login flow"
                className={`w-full h-10 px-3 rounded-lg border bg-background text-sm outline-none focus:border-ring transition ${errors.title ? "border-[oklch(0.7_0.2_25)]" : "border-border"}`}
              />
            </Field>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Project" required error={errors.projectId}>
                <FormSelect
                  value={projectId}
                  onChange={setProjectId}
                  options={PROJECTS.map((p) => ({ value: p.id, label: `${p.key} · ${p.name}` }))}
                />
              </Field>
              <Field label="Sprint" required error={errors.sprintId}>
                <FormSelect
                  value={sprintId}
                  onChange={setSprintId}
                  options={SPRINTS.map((s) => ({
                    value: s.id,
                    label: s.name,
                  }))}
                />
              </Field>
              <Field label="Assigned team">
                <FormSelect
                  value={team}
                  onChange={setTeam}
                  options={TEAMS.map((t) => ({ value: t, label: t }))}
                />
              </Field>

              <Field label="Assigned to" required error={errors.assigneeId}>
                <FormSelect
                  value={assigneeId}
                  onChange={setAssigneeId}
                  options={ASSIGNEES.map((u) => ({ value: u.id, label: `${u.name} · ${u.title}` }))}
                />
              </Field>
              <Field label="Priority" required>
                <FormSelect
                  value={priority}
                  onChange={(v) => setPriority(v as StoryPriority)}
                  options={PRIORITIES.map((p) => ({ value: p, label: p }))}
                />
              </Field>

              <Field label="Type" required>
                <FormSelect
                  value={type}
                  onChange={(v) => setType(v as StoryType)}
                  options={STORY_TYPES.map((t) => ({ value: t, label: t }))}
                />
              </Field>

              <Field label="Original Estimate (Hours)" required>
                <div className="relative">
                  <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

                  <input
                    type="number"
                    min={0}
                    value={originalEstimate}
                    onChange={(e) => {
                      const value = Number(e.target.value);
                      setOriginalEstimate(value);
                      setRemainingHours(value);
                    }}
                    className="w-full h-10 pl-9 pr-3 rounded-lg border border-border bg-background"
                  />
                </div>
              </Field>

              <Field label="Remaining Hours" required>
                <div className="relative">
                  <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="number"
                    min={0}
                    value={remainingHours}
                    onChange={(e) => setRemainingHours(Number(e.target.value))}
                    className="w-full h-10 pl-9 pr-3 rounded-lg border border-border bg-background"
                  />
                </div>
              </Field>

              <Field label="Actual Hours Spent">
                <div className="relative">
                  <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="number"
                    min={0}
                    value={actualHoursSpent}
                    onChange={(e) => setActualHoursSpent(Number(e.target.value))}
                    className="w-full h-10 pl-9 pr-3 rounded-lg border border-border bg-background"
                  />
                </div>
              </Field>

              <Field label="Deadline" required error={errors.dueDate}>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className={`w-full h-10 pl-9 pr-3 rounded-lg border bg-background text-sm outline-none focus:border-ring ${errors.dueDate ? "border-[oklch(0.7_0.2_25)]" : "border-border"}`}
                  />
                </div>
              </Field>
              <Field label="Initial status">
                <div className="h-10 px-3 rounded-lg border border-border bg-muted/40 text-sm flex items-center text-muted-foreground">
                  {status}{" "}
                  <span className="ml-2 text-[10px] uppercase tracking-wider">default</span>
                </div>
              </Field>
            </div>

            <Field label="Description" required error={errors.description}>
              <textarea
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  if (errors.description) setErrors({ ...errors, description: "" });
                }}
                rows={4}
                maxLength={2000}
                placeholder="Describe the problem, context, and links to specs…"
                className={`w-full px-3 py-2 rounded-lg border bg-background text-sm outline-none focus:border-ring transition resize-none ${errors.description ? "border-[oklch(0.7_0.2_25)]" : "border-border"}`}
              />
            </Field>

            <Field
              label="Acceptance criteria"
              required
              error={errors.acceptanceCriteria}
              hint="Use the Given / When / Then format"
            >
              <textarea
                value={acceptanceCriteria}
                onChange={(e) => {
                  setAcceptanceCriteria(e.target.value);

                  if (errors.acceptanceCriteria) {
                    setErrors({
                      ...errors,
                      acceptanceCriteria: "",
                    });
                  }
                }}
                rows={4}
                maxLength={2000}
                placeholder={"Given …\nWhen …\nThen …"}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm outline-none focus:border-ring transition resize-none font-mono"
              />
            </Field>
          </div>

          <div className="px-6 py-4 border-t border-border flex items-center justify-end gap-2 bg-muted/20">
            <Link
              to="/stories/$storyId"
              params={{ storyId }}
              className="h-9 px-4 rounded-lg border border-border text-sm font-medium hover:bg-muted inline-flex items-center"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="h-9 px-4 rounded-lg bg-gradient-primary text-primary-foreground text-sm font-medium shadow-elegant hover:opacity-95 inline-flex items-center gap-1.5 disabled:opacity-70"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Creating…
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" /> Create Scrum Task
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
