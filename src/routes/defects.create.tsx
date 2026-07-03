import { createFileRoute, Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { Loader2, Plus, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { ASSIGNEES, PROJECTS, TEAMS } from "@/lib/stories-store";
import {
  DEFECT_PRIORITIES,
  DEFECT_SEVERITIES,
  DEFECT_STATUSES,
  type DefectPriority,
  type DefectSeverity,
  type DefectStatus,
} from "@/lib/defects-store";
import { currentUser } from "@/lib/mock-data";

export const Route = createFileRoute("/defects/create")({
  validateSearch: (search: Record<string, unknown>) => ({
    storyId: typeof search.storyId === "string" ? search.storyId : "",
  }),
  head: () => ({ meta: [{ title: "Create Defect - Yognito" }] }),
  component: CreateDefectPage,
});

function CreateDefectPage() {
  const navigate = useNavigate();
  const { storyId } = useSearch({ from: "/defects/create" });
  console.log("DEFECT CREATE storyId:", storyId);
  const [defectTitle, setDefectTitle] = useState("");
  const [projectId, setProjectId] = useState(PROJECTS[0].id);
  const [team, setTeam] = useState(TEAMS[0]);
  const [assigneeId, setAssigneeId] = useState(currentUser.id);
  const [priority, setPriority] = useState<DefectPriority>("Medium");
  const [severity, setSeverity] = useState<DefectSeverity>("Medium");
  const [defectDescription, setDefectDescription] = useState("");
  const [status] = useState<DefectStatus>("Open");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [environment, setEnvironment] = useState("Development");
  const [stepsToReproduce, setStepsToReproduce] = useState("");
  const [expectedResult, setExpectedResult] = useState("");
  const [actualResult, setActualResult] = useState("");
  const [dueDate, setDueDate] = useState("");

  const validate = () => {
    const e: Record<string, string> = {};
    if (!defectTitle.trim()) e.title = "Short description is required";
    else if (defectTitle.length > 140) e.title = "Keep it under 140 characters";
    if (!projectId) e.projectId = "Select a project";
    if (!assigneeId) e.assigneeId = "Select an assignee";
    if (!defectDescription.trim()) e.description = "Description is required";
    if (!stepsToReproduce.trim()) e.stepsToReproduce = "Please fill all the required fields.";

    if (!expectedResult.trim()) e.expectedResult = "Please fill all the required fields.";

    if (!actualResult.trim()) e.actualResult = "Please fill all the required fields.";
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
    console.log("Story ID received:", storyId);

    fetch("http://127.0.0.1:5000/api/defects", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        storyId,
        defectTitle: defectTitle.trim(),
        defectDescription: defectDescription.trim(),
        severity,
        priority,
        status,
        assignedTo: assigneeId,
        environment,
        stepsToReproduce,
        expectedResult,
        actualResult,
        dueDate,
        projectId,
        team,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Defect created:", data);
        toast.success("Defect created successfully");

        setSubmitting(false);
        console.log("Navigating to story:", storyId);
        navigate({
          to: "/stories/$storyId",
          params: { storyId: storyId! },
        });
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to Create Defect");
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

        <span className="text-foreground font-medium"> Create Defect </span>
      </div>
      <form onSubmit={submit} className="space-y-5">
        <div className="rounded-xl bg-card border border-border shadow-card overflow-hidden">
          <div className="flex items-center gap-3 px-6 py-4 border-b border-border bg-muted/20">
            <div className="h-9 w-9 rounded-lg bg-gradient-primary grid place-items-center">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <div>
              <div className="font-semibold leading-tight">Create Defect</div>
              <div className="text-xs text-muted-foreground">Create a Defect for this Story</div>
            </div>
          </div>

          <div className="px-6 py-6 space-y-5">
            <Field label="Defect Title" required error={errors.title}>
              <input
                value={defectTitle}
                onChange={(e) => {
                  setDefectTitle(e.target.value);
                  if (errors.title) setErrors({ ...errors, title: "" });
                }}
                maxLength={140}
                placeholder="e.g. Login button crashes application"
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
                  onChange={(v) => setPriority(v as DefectPriority)}
                  options={DEFECT_PRIORITIES.map((p) => ({ value: p, label: p }))}
                />
              </Field>

              <Field label="Severity" required>
                <FormSelect
                  value={severity}
                  onChange={(v) => setSeverity(v as DefectSeverity)}
                  options={DEFECT_SEVERITIES.map((s) => ({ value: s, label: s }))}
                />
              </Field>

              <Field label="Environment" required error={errors.environment}>
                <FormSelect
                  value={environment}
                  onChange={setEnvironment}
                  options={[
                    { value: "Development", label: "Development" },
                    { value: "QA", label: "QA" },
                    { value: "UAT", label: "UAT" },
                    { value: "Production", label: "Production" },
                  ]}
                />
              </Field>

              <Field label="Initial status">
                <div className="h-10 px-3 rounded-lg border border-border bg-muted/40 text-sm flex items-center text-muted-foreground">
                  {status}{" "}
                  <span className="ml-2 text-[10px] uppercase tracking-wider">default</span>
                </div>
              </Field>
            </div>

            <Field label="Due Date">
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm outline-none focus:border-ring transition"
              />
            </Field>

            <Field label="Defect Description" required error={errors.description}>
              <textarea
                value={defectDescription}
                onChange={(e) => {
                  setDefectDescription(e.target.value);
                  if (errors.description) setErrors({ ...errors, description: "" });
                }}
                rows={4}
                maxLength={2000}
                placeholder="Describe the problem, context, and links to specs…"
                className={`w-full px-3 py-2 rounded-lg border bg-background text-sm outline-none focus:border-ring transition resize-none ${errors.description ? "border-[oklch(0.7_0.2_25)]" : "border-border"}`}
              />
            </Field>
            <Field label="Steps to Reproduce" required error={errors.stepsToReproduce}>
              <textarea
                value={stepsToReproduce}
                onChange={(e) => {
                  setStepsToReproduce(e.target.value);
                  if (errors.stepsToReproduce) setErrors({ ...errors, stepsToReproduce: "" });
                }}
                rows={4}
                className={`w-full px-3 py-2 rounded-lg border bg-background text-sm outline-none resize-none ${
                  errors.stepsToReproduce ? "border-[oklch(0.7_0.2_25)]" : "border-border"
                }`}
              />
            </Field>
            <Field label="Expected Result" required error={errors.expectedResult}>
              <textarea
                value={expectedResult}
                onChange={(e) => {
                  setExpectedResult(e.target.value);
                  if (errors.expectedResult) setErrors({ ...errors, expectedResult: "" });
                }}
                rows={4}
                className={`w-full px-3 py-2 rounded-lg border bg-background text-sm outline-none resize-none ${
                  errors.expectedResult ? "border-[oklch(0.7_0.2_25)]" : "border-border"
                }`}
              />
            </Field>
            <Field label="Actual Result" required error={errors.actualResult}>
              <textarea
                value={actualResult}
                onChange={(e) => {
                  setActualResult(e.target.value);
                  if (errors.actualResult) setErrors({ ...errors, actualResult: "" });
                }}
                rows={4}
                className={`w-full px-3 py-2 rounded-lg border bg-background text-sm outline-none resize-none ${
                  errors.actualResult ? "border-[oklch(0.7_0.2_25)]" : "border-border"
                }`}
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
                  <Plus className="h-4 w-4" /> Create Defect
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
