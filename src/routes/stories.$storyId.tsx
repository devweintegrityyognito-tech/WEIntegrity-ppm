import { useStories } from "@/lib/stories-store";
import { useScrumTasks } from "@/lib/scrum-tasks-store";
import { useDefects } from "@/lib/defects-store";
import { useState } from "react";
import { createFileRoute, Link, useNavigate, useParams } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Plus,
  Pencil,
  Trash2,
  Bug,
  ListChecks,
  X,
  Calendar,
  User as UserIcon,
} from "lucide-react";
import { Badge, priorityTone, statusTone } from "@/components/app/Badge";
import {
  scrumTasksStore,
  TASK_STATUSES,
  TASK_PRIORITIES,
  type ScrumTask,
  type TaskStatus,
  type TaskPriority,
} from "@/lib/scrum-tasks-store";
import {
  DEFECT_SEVERITIES,
  DEFECT_PRIORITIES,
  DEFECT_STATUSES,
  type Defect,
  type DefectSeverity,
  type DefectPriority,
  type DefectStatus,
} from "@/lib/defects-store";
import { useSprints } from "@/lib/sprints-store";
import { users, userById } from "@/lib/mock-data";
import type { Story } from "@/lib/stories-store";

export const Route = createFileRoute("/stories/$storyId")({
  head: () => ({ meta: [{ title: "Story Detail — Yognito" }] }),
  component: StoryDetail,
});

function StoryDetail() {
  const { storyId } = useParams({ from: "/stories/$storyId" });
  const sprints = useSprints();
  const [tab, setTab] = useState<"tasks" | "defects">("tasks");
  const stories = useStories();
  const allTasks = useScrumTasks();
  const allDefects = useDefects();
  const story = stories.find((s) => s.id === storyId || s._id === storyId);
  const sprint = sprints.find((s) => s.id === story?.sprintId);
  const tasks = allTasks.filter((t) => t.storyId === storyId);
  const defects = allDefects.filter((d) => d.storyId === storyId);

  if (!story) {
    return (
      <div className="rounded-xl bg-card border border-border shadow-card p-12 text-center">
        <div className="font-semibold">Story not found</div>
        <Link
          to="/stories/all"
          className="inline-flex items-center gap-1.5 mt-3 text-sm text-primary hover:underline"
        >
          <ArrowLeft className="h-4 w-4" /> Back to stories
        </Link>
      </div>
    );
  }

  return (
    <>
      <Link
        to="/stories/all"
        className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mb-3"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Stories
      </Link>

      <div className="flex items-start justify-between flex-wrap gap-3 mb-5">
        <div className="min-w-0">
          <div className="font-mono text-xs text-muted-foreground">{story.key}</div>
          <h1 className="text-2xl font-semibold tracking-tight mt-1">{story.title}</h1>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Badge tone={priorityTone(story.priority)}>{story.priority}</Badge>
            <Badge tone={statusTone(story.status)} dot>
              {story.status}
            </Badge>
            {sprint && (
              <span className="text-xs text-muted-foreground inline-flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" /> {sprint.sprintName}
              </span>
            )}
            <span className="text-xs text-muted-foreground inline-flex items-center gap-1.5">
              <UserIcon className="h-3.5 w-3.5" /> {userById(story.assigneeId).name}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <div className="xl:col-span-2 space-y-5">
          <div className="rounded-xl bg-card border border-border shadow-card p-5">
            <h3 className="font-semibold text-sm mb-2">Description</h3>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
              {story.description || "No description provided."}
            </p>
            {story.acceptanceCriteria && (
              <>
                <h4 className="font-semibold text-xs mt-4 mb-1.5 uppercase tracking-wider text-muted-foreground">
                  Acceptance criteria
                </h4>
                <p className="text-sm whitespace-pre-wrap">{story.acceptanceCriteria}</p>
              </>
            )}
          </div>

          <div className="rounded-xl bg-card border border-border shadow-card overflow-hidden">
            <div className="border-b border-border flex items-center px-3">
              <TabBtn
                active={tab === "tasks"}
                onClick={() => setTab("tasks")}
                icon={<ListChecks className="h-4 w-4" />}
                count={tasks.length}
              >
                Scrum Tasks
              </TabBtn>
              <TabBtn
                active={tab === "defects"}
                onClick={() => setTab("defects")}
                icon={<Bug className="h-4 w-4" />}
                count={defects.length}
              >
                Defects
              </TabBtn>
            </div>
            <div className="p-5">
              {tab === "tasks" ? (
                <>
                  <TasksPanel storyId={story._id || story.id} tasks={tasks} />
                </>
              ) : (
                <DefectsPanel storyId={story._id || story.id} defects={defects} />
              )}
            </div>
          </div>
        </div>

        <aside className="space-y-3">
          <div className="rounded-xl bg-card border border-border shadow-card p-5">
            <h3 className="font-semibold text-sm mb-3">Details</h3>
            <DetailRow label="Type" value={story.type} />
            <DetailRow label="Story points" value={String(story.storyPoints)} />
            <DetailRow label="Team" value={story.team} />
            <DetailRow label="Due date" value={new Date(story.dueDate).toLocaleDateString()} />
            <DetailRow label="Created" value={new Date(story.createdAt).toLocaleDateString()} />
            {story.labels.length > 0 && (
              <div className="mt-3">
                <div className="text-[11px] uppercase tracking-wider text-muted-foreground mb-1.5">
                  Labels
                </div>
                <div className="flex flex-wrap gap-1">
                  {story.labels.map((l) => (
                    <span
                      key={l}
                      className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground"
                    >
                      #{l}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </aside>
      </div>
    </>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-1.5 text-sm border-b border-border last:border-0">
      <span className="text-muted-foreground text-xs">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

function TabBtn({
  active,
  onClick,
  icon,
  children,
  count,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  children: React.ReactNode;
  count: number;
}) {
  return (
    <button
      onClick={onClick}
      className={`relative inline-flex items-center gap-2 px-4 h-11 text-sm font-medium transition ${
        active ? "text-foreground" : "text-muted-foreground hover:text-foreground"
      }`}
    >
      {icon}
      {children}
      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground tabular-nums">
        {count}
      </span>
      {active && (
        <span className="absolute left-0 right-0 -bottom-px h-0.5 bg-gradient-primary rounded-full" />
      )}
    </button>
  );
}

/* ============================ Tasks ============================ */

function TasksPanel({ storyId, tasks }: { storyId: string; tasks: ScrumTask[] }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Defect | null>(null);

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div className="text-xs text-muted-foreground">
          {tasks.length} task{tasks.length === 1 ? "" : "s"}
        </div>
        <button
          onClick={() => navigate({ to: "/tasks/create", search: { storyId: storyId } })}
          className="h-8 px-3 rounded-lg bg-gradient-primary text-primary-foreground text-xs font-medium inline-flex items-center gap-1.5 shadow-elegant"
        >
          <Plus className="h-3.5 w-3.5" /> New Task
        </button>
      </div>

      {tasks.length === 0 ? (
        <div className="py-10 text-center text-sm text-muted-foreground">No scrum tasks yet.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-175">
            <thead>
              <tr className="text-[11px] uppercase tracking-wider text-muted-foreground bg-muted/40">
                <th className="text-left font-medium py-2.5 pl-3">Title</th>
                <th className="text-left font-medium py-2.5 w-30">Priority</th>
                <th className="text-left font-medium py-2.5 w-35">Status</th>
                <th className="text-left font-medium py-2.5 w-40">Assignee</th>
                <th className="text-right font-medium py-2.5 w-20">Est/Act</th>
                <th className="text-left font-medium py-2.5 w-27.5 pl-3">Due</th>
                <th className="w-20" />
              </tr>
            </thead>
            <tbody>
              <AnimatePresence initial={false}>
                {tasks.map((t) => (
                  <motion.tr
                    key={t.id}
                    layout
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="border-t border-border hover:bg-muted/30 group"
                  >
                    <td className="py-2.5 pl-3 font-medium">
                      <Link
                        to="/tasks/$taskId"
                        params={{ taskId: t.id }}
                        className="text-primary hover:underline"
                      >
                        {t.title}
                      </Link>
                    </td>

                    <td className="py-2.5">
                      <Badge tone={priorityTone(t.priority)}>{t.priority}</Badge>
                    </td>
                    <td className="py-2.5">
                      <select
                        value={t.status}
                        onChange={(e) => {
                          console.log("Status changed:", t.id, e.target.value);
                        }}
                        className="text-xs h-7 px-2 rounded border border-border bg-background cursor-pointer"
                      >
                        {TASK_STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="py-2.5">
                      <div className="flex items-center gap-2">
                        <img
                          src={userById(t.assignee).avatar}
                          className="h-6 w-6 rounded-full border border-border"
                        />
                        <span className="text-xs truncate max-w-30">
                          {userById(t.assignee).name}
                        </span>
                      </div>
                    </td>
                    <td className="py-2.5 text-right text-xs tabular-nums">
                      {t.actualHours}/{t.estimatedHours}h
                    </td>
                    <td className="py-2.5 pl-3 text-xs">
                      {t.dueDate
                        ? new Date(t.dueDate).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })
                        : "—"}
                    </td>
                    <td className="py-2.5 pr-3 text-right">
                      <div className="inline-flex opacity-0 group-hover:opacity-100 transition">
                        <button
                          onClick={() => {}}
                          className="h-7 w-7 grid place-items-center rounded-md hover:bg-muted text-muted-foreground hover:text-foreground"
                          title="Edit"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={async () => {
                            await fetch(`https://weintegrity-ppm-main.onrender.com/api/tasks/${t.id}`, {
                              method: "DELETE",
                            });
                            window.location.reload();
                          }}
                          className="h-7 w-7 grid place-items-center rounded-md hover:bg-muted text-muted-foreground hover:text-foreground"
                          title="Delete"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function TaskForm({
  storyId,
  initial,
  onSubmit,
}: {
  storyId: string;
  initial: ScrumTask | null;
  onSubmit: (
    data: Omit<ScrumTask, "id" | "createdAt" | "updatedAt" | "createdBy"> & { storyId: string },
  ) => void;
}) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [assignee, setAssignee] = useState(initial?.assignee ?? users[0].id);
  const [status, setStatus] = useState<TaskStatus>(initial?.status ?? "Todo");
  const [priority, setPriority] = useState<TaskPriority>(initial?.priority ?? "Medium");
  const [estimatedHours, setEst] = useState(initial?.estimatedHours ?? 4);
  const [actualHours, setAct] = useState(initial?.actualHours ?? 0);
  const [startDate, setStart] = useState(
    initial?.startDate?.slice(0, 10) ?? new Date().toISOString().slice(0, 10),
  );
  const [dueDate, setDue] = useState(initial?.dueDate?.slice(0, 10) ?? "");

  return (
    <form
      className="space-y-3.5"
      onSubmit={(e) => {
        e.preventDefault();
        if (!title.trim()) return;
        onSubmit({
          storyId,
          title: title.trim(),
          description,
          assignee,
          status,
          priority,
          estimatedHours: Number(estimatedHours) || 0,
          actualHours: Number(actualHours) || 0,
          startDate: startDate ? new Date(startDate).toISOString() : new Date().toISOString(),
          dueDate: dueDate ? new Date(dueDate).toISOString() : "",
        });
      }}
    >
      <Field label="Title *">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className={inputCls}
        />
      </Field>
      <Field label="Description">
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className={inputCls}
        />
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Assignee">
          <select
            value={assignee}
            onChange={(e) => setAssignee(e.target.value)}
            className={inputCls}
          >
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Status">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as TaskStatus)}
            className={inputCls}
          >
            {TASK_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Priority">
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as TaskPriority)}
            className={inputCls}
          >
            {TASK_PRIORITIES.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Estimated (h)">
          <input
            type="number"
            min={0}
            value={estimatedHours}
            onChange={(e) => setEst(Number(e.target.value))}
            className={inputCls}
          />
        </Field>
        <Field label="Actual (h)">
          <input
            type="number"
            min={0}
            value={actualHours}
            onChange={(e) => setAct(Number(e.target.value))}
            className={inputCls}
          />
        </Field>
        <Field label="Start">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStart(e.target.value)}
            className={inputCls}
          />
        </Field>
        <Field label="Due">
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDue(e.target.value)}
            className={inputCls}
          />
        </Field>
      </div>
      <div className="pt-2 flex justify-end gap-2">
        <button
          type="submit"
          className="h-9 px-4 rounded-lg bg-gradient-primary text-primary-foreground text-sm font-medium shadow-elegant"
        >
          {initial ? "Save changes" : "Create task"}
        </button>
      </div>
    </form>
  );
}

/* ============================ Defects ============================ */

function DefectsPanel({ storyId, defects }: { storyId: string; defects: Defect[] }) {
  const navigate = useNavigate();
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div className="text-xs text-muted-foreground">
          {defects.length} defect{defects.length === 1 ? "" : "s"}
        </div>
        <button
          onClick={() => {
            console.log("Navigate storyId =", storyId);
            window.location.href = `/defects/create?storyId=${storyId}`;
          }}
          className="h-8 px-3 rounded-lg bg-gradient-primary text-primary-foreground text-xs font-medium inline-flex items-center gap-1.5 shadow-elegant"
        >
          <Plus className="h-3.5 w-3.5" /> New Defect
        </button>
      </div>

      {defects.length === 0 ? (
        <div className="py-10 text-center text-sm text-muted-foreground">No defects reported.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-175">
            <thead>
              <tr className="text-[11px] uppercase tracking-wider text-muted-foreground bg-muted/40">
                <th className="text-left font-medium py-2.5 pl-3">Title</th>
                <th className="text-left font-medium py-2.5 w-27.5">Severity</th>
                <th className="text-left font-medium py-2.5 w-27.5">Priority</th>
                <th className="text-left font-medium py-2.5 w-35">Status</th>
                <th className="text-left font-medium py-2.5 w-40">Assigned to</th>
                <th className="text-left font-medium py-2.5 w-27.5 pl-3">Reported</th>
                <th className="w-20" />
              </tr>
            </thead>
            <tbody>
              <AnimatePresence initial={false}>
                {defects.map((d) => (
                  <motion.tr
                    key={d._id || d.id}
                    layout
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="border-t border-border hover:bg-muted/30 group"
                  >
                    <td className="py-2.5 pl-3 font-medium">
                      <Link
                        to="/defects/$defectId"
                        params={{ defectId: d._id || d.id }}
                        className="text-primary hover:underline"
                      >
                        {d.defectTitle}
                      </Link>
                    </td>

                    <td className="py-2.5">
                      <Badge tone={priorityTone(d.severity)}>{d.severity}</Badge>
                    </td>
                    <td className="py-2.5">
                      <Badge tone={priorityTone(d.priority)}>{d.priority}</Badge>
                    </td>
                    <td className="py-2.5">
                      <select
                        value={d.status}
                        onChange={(e) => {
                          console.log("Status changed:", d.id, e.target.value);
                        }}
                        className="text-xs h-7 px-2 rounded border border-border bg-background cursor-pointer"
                      >
                        {DEFECT_STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="py-2.5">
                      <div className="flex items-center gap-2">
                        <img
                          src={userById(d.assignedTo).avatar}
                          className="h-6 w-6 rounded-full border border-border"
                        />
                        <span className="text-xs truncate max-w-30">
                          {userById(d.assignedTo).name}
                        </span>
                      </div>
                    </td>
                    <td className="py-2.5 pl-3 text-xs">
                      {new Date(d.createdDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td className="py-2.5 pr-3 text-right">
                      <div className="inline-flex opacity-0 group-hover:opacity-100 transition">
                        <button
                          onClick={() => {
                            console.log("Edit Defect clicked");
                          }}
                          className="h-7 w-7 grid place-items-center rounded-md hover:bg-muted text-muted-foreground hover:text-foreground"
                          title="Edit"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            fetch(`https://weintegrity-ppm-main.onrender.com/api/defects/${d._id || d.id}`, {
                              method: "DELETE",
                            }).then(() => window.location.reload());
                          }}
                          className="h-7 w-7 grid place-items-center rounded-md hover:bg-muted text-muted-foreground hover:text-foreground"
                          title="Delete"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function DefectForm({
  storyId,
  initial,
  onSubmit,
}: {
  storyId: string;
  initial: Defect | null;
  onSubmit: (
    data: Partial<Defect> & {
      storyId: string;
      defectTitle: string;
      defectDescription: string;
      severity: DefectSeverity;
      priority: DefectPriority;
      status: DefectStatus;
      assignedTo: string;
    },
  ) => void;
}) {
  const [defectTitle, setTitle] = useState(initial?.defectTitle ?? "");
  const [defectDescription, setDescription] = useState(initial?.defectDescription ?? "");
  const [severity, setSeverity] = useState<DefectSeverity>(initial?.severity ?? "Medium");
  const [priority, setPriority] = useState<DefectPriority>(initial?.priority ?? "Medium");
  const [status, setStatus] = useState<DefectStatus>(initial?.status ?? "Open");
  const [assignedTo, setAssignedTo] = useState(initial?.assignedTo ?? users[0].id);

  return (
    <form
      className="space-y-3.5"
      onSubmit={(e) => {
        e.preventDefault();
        if (!defectTitle.trim()) return;
        onSubmit({
          storyId,
          defectTitle: defectTitle.trim(),
          defectDescription,
          severity,
          priority,
          status,
          assignedTo,
        });
      }}
    >
      <Field label="Title *">
        <input
          value={defectTitle}
          onChange={(e) => setTitle(e.target.value)}
          required
          className={inputCls}
        />
      </Field>
      <Field label="Description">
        <textarea
          value={defectDescription}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className={inputCls}
        />
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Severity">
          <select
            value={severity}
            onChange={(e) => setSeverity(e.target.value as DefectSeverity)}
            className={inputCls}
          >
            {DEFECT_SEVERITIES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Priority">
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as DefectPriority)}
            className={inputCls}
          >
            {DEFECT_PRIORITIES.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Status">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as DefectStatus)}
            className={inputCls}
          >
            {DEFECT_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Assigned to">
          <select
            value={assignedTo}
            onChange={(e) => setAssignedTo(e.target.value)}
            className={inputCls}
          >
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name}
              </option>
            ))}
          </select>
        </Field>
      </div>
      <div className="pt-2 flex justify-end gap-2">
        <button
          type="submit"
          className="h-9 px-4 rounded-lg bg-gradient-primary text-primary-foreground text-sm font-medium shadow-elegant"
        >
          {initial ? "Save changes" : "Create defect"}
        </button>
      </div>
    </form>
  );
}

/* ============================ Shared ============================ */

const inputCls =
  "w-full h-9 px-3 rounded-lg bg-background border border-border text-sm outline-none focus:border-ring transition";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="text-[11px] uppercase tracking-wider text-muted-foreground mb-1">{label}</div>
      {children}
    </label>
  );
}

export function ModalSlideOver({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/40 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed top-0 right-0 bottom-0 w-full sm:w-120 bg-card border-l border-border z-50 shadow-2xl overflow-y-auto"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 260 }}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-border sticky top-0 bg-card z-10">
              <h2 className="font-semibold text-sm">{title}</h2>
              <button
                onClick={onClose}
                className="h-8 w-8 grid place-items-center rounded-md hover:bg-muted text-muted-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="p-5">{children}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
