import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Hash, Loader2, Plus, Sparkles } from "lucide-react";
import { toast } from "sonner";
import {
  storiesStore, PRIORITIES, STATUSES, ASSIGNEES, SPRINTS, PROJECTS, TEAMS, STORY_TYPES,
  type StoryPriority, type StoryStatus, type StoryType,
} from "@/lib/stories-store";
import { currentUser } from "@/lib/mock-data";

export const Route = createFileRoute("/stories/create")({
  head: () => ({ meta: [{ title: "Create Story — Yognito" }] }),
  component: CreateStoryPage,
});

function CreateStoryPage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [projectId, setProjectId] = useState(PROJECTS[0].id);
  const [team, setTeam] = useState(TEAMS[0]);
  const [assigneeId, setAssigneeId] = useState(currentUser.id);
  const [priority, setPriority] = useState<StoryPriority>("Medium");
  const [type, setType] = useState<StoryType>("Story");
  const [storyPoints, setStoryPoints] = useState(3);
  const [dueDate, setDueDate] = useState(() => {
    const d = new Date(); d.setDate(d.getDate() + 7);
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
    if (!dueDate) e.dueDate = "Deadline is required";
    if (!description.trim()) e.description = "Description is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) {
      toast.error("Please fix the highlighted fields");
      return;
    }
    setSubmitting(true);

fetch("http://127.0.0.1:5000/api/stories", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    title: title.trim(),
    description: description.trim(),
    acceptanceCriteria: acceptanceCriteria.trim(),
    priority,
    status,
    assigneeId,
    sprintId: SPRINTS[0].id,
    projectId,
    team,
    type,
    dueDate: new Date(dueDate).toISOString(),
    storyPoints,
    labels: [],
  }),
})
  .then((res) => res.json())
  .then((created) => {
    toast.success(`Story ${created.key} created`, {
      description: created.title,
    });

    setSubmitting(false);

    navigate({
      to: "/stories/all",
    });
  })
  .catch((err) => {
    console.error(err);
    toast.error("Failed to create story");
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
      <Link
        to="/stories/all"
        className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mb-4"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Back to stories
      </Link>

      <form onSubmit={submit} className="space-y-5">
        <div className="rounded-xl bg-card border border-border shadow-card overflow-hidden">
          <div className="flex items-center gap-3 px-6 py-4 border-b border-border bg-muted/20">
            <div className="h-9 w-9 rounded-lg bg-gradient-primary grid place-items-center">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <div>
              <div className="font-semibold leading-tight">Create story</div>
              <div className="text-xs text-muted-foreground">A new work item in the backlog</div>
            </div>
          </div>

          <div className="px-6 py-6 space-y-5">
            <Field label="Short description" required error={errors.title}>
              <input
                value={title}
                onChange={(e) => { setTitle(e.target.value); if (errors.title) setErrors({ ...errors, title: "" }); }}
                maxLength={140}
                placeholder="e.g. Implement OAuth2 login flow"
                className={`w-full h-10 px-3 rounded-lg border bg-background text-sm outline-none focus:border-ring transition ${errors.title ? "border-[oklch(0.7_0.2_25)]" : "border-border"}`}
              />
            </Field>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Project" required error={errors.projectId}>
                <FormSelect value={projectId} onChange={setProjectId}
                  options={PROJECTS.map((p) => ({ value: p.id, label: `${p.key} · ${p.name}` }))} />
              </Field>
              <Field label="Assigned team">
                <FormSelect value={team} onChange={setTeam}
                  options={TEAMS.map((t) => ({ value: t, label: t }))} />
              </Field>

              <Field label="Assigned to" required error={errors.assigneeId}>
                <FormSelect value={assigneeId} onChange={setAssigneeId}
                  options={ASSIGNEES.map((u) => ({ value: u.id, label: `${u.name} · ${u.title}` }))} />
              </Field>
              <Field label="Priority" required>
                <FormSelect value={priority} onChange={(v) => setPriority(v as StoryPriority)}
                  options={PRIORITIES.map((p) => ({ value: p, label: p }))} />
              </Field>

              <Field label="Type" required>
                <FormSelect value={type} onChange={(v) => setType(v as StoryType)}
                  options={STORY_TYPES.map((t) => ({ value: t, label: t }))} />
              </Field>
              <Field label="Story points">
                <div className="relative">
                  <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  <input type="number" min={0} max={100} value={storyPoints}
                    onChange={(e) => setStoryPoints(Math.max(0, Math.min(100, Number(e.target.value) || 0)))}
                    className="w-full h-10 pl-9 pr-3 rounded-lg border border-border bg-background text-sm outline-none focus:border-ring" />
                </div>
              </Field>

              <Field label="Deadline" required error={errors.dueDate}>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)}
                    className={`w-full h-10 pl-9 pr-3 rounded-lg border bg-background text-sm outline-none focus:border-ring ${errors.dueDate ? "border-[oklch(0.7_0.2_25)]" : "border-border"}`} />
                </div>
              </Field>
              <Field label="Initial status">
                <div className="h-10 px-3 rounded-lg border border-border bg-muted/40 text-sm flex items-center text-muted-foreground">
                  {status} <span className="ml-2 text-[10px] uppercase tracking-wider">default</span>
                </div>
              </Field>
            </div>

            <Field label="Description" required error={errors.description}>
              <textarea
                value={description}
                onChange={(e) => { setDescription(e.target.value); if (errors.description) setErrors({ ...errors, description: "" }); }}
                rows={4} maxLength={2000}
                placeholder="Describe the problem, context, and links to specs…"
                className={`w-full px-3 py-2 rounded-lg border bg-background text-sm outline-none focus:border-ring transition resize-none ${errors.description ? "border-[oklch(0.7_0.2_25)]" : "border-border"}`}
              />
            </Field>

            <Field label="Acceptance criteria" hint="Use the Given / When / Then format">
              <textarea
                value={acceptanceCriteria}
                onChange={(e) => setAcceptanceCriteria(e.target.value)}
                rows={4} maxLength={2000}
                placeholder={"Given …\nWhen …\nThen …"}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm outline-none focus:border-ring transition resize-none font-mono"
              />
            </Field>
          </div>

          <div className="px-6 py-4 border-t border-border flex items-center justify-end gap-2 bg-muted/20">
            <Link
              to="/stories/all"
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
                <><Loader2 className="h-4 w-4 animate-spin" /> Creating…</>
              ) : (
                <><Plus className="h-4 w-4" /> Create Story</>
              )}
            </button>
          </div>
        </div>
      </form>
    </motion.div>
  );
}

function Field({
  label, hint, required, error, children,
}: { label: string; hint?: string; required?: boolean; error?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs font-medium text-foreground">
          {label}{required && <span className="text-[oklch(0.5_0.2_25)] ml-0.5">*</span>}
        </span>
        {hint && <span className="text-[10px] text-muted-foreground">{hint}</span>}
      </div>
      {children}
      {error && <div className="text-[11px] text-[oklch(0.5_0.2_25)] mt-1">{error}</div>}
    </label>
  );
}

function FormSelect({
  value, onChange, options,
}: { value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)}
      className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm outline-none focus:border-ring transition cursor-pointer">
      {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  );
}