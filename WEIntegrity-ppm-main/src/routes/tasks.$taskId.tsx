import { useMemo, useState } from "react";
import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, ChevronRight, Send, Clock, User as UserIcon, Activity } from "lucide-react";
import { AppShell } from "@/components/app/AppShell";
import { Badge, priorityTone, statusTone } from "@/components/app/Badge";
import { useScrumTasks, scrumTasksStore, TASK_STATUSES, type TaskStatus } from "@/lib/scrum-tasks-store";
import { useStories } from "@/lib/stories-store";
import { userById, projects, currentUser } from "@/lib/mock-data";

export const Route = createFileRoute("/tasks/$taskId")({
  head: () => ({ meta: [{ title: "Task Detail — Yognito" }] }),
  component: TaskDetail,
});

type Comment = { id: string; author: string; text: string; ts: string };

function TaskDetail() {
  const { taskId } = useParams({ from: "/tasks/$taskId" });
  const allTasks = useScrumTasks();
  const stories = useStories();
  const task = useMemo(() => allTasks.find((t) => t.id === taskId), [allTasks, taskId]);
  const story = task ? stories.find((s) => s.id === task.storyId) : undefined;
  const project = story ? projects.find((p) => p.id === story.projectId) : undefined;

  const [comments, setComments] = useState<Comment[]>([]);
  const [draft, setDraft] = useState("");

  if (!task) {
    return (
      <AppShell>
        <div className="rounded-xl bg-card border border-border shadow-card p-12 text-center">
          <div className="font-semibold">Task not found</div>
          <Link to="/stories/all" className="inline-flex items-center gap-1.5 mt-3 text-sm text-primary hover:underline">
            <ArrowLeft className="h-4 w-4" /> Back to stories
          </Link>
        </div>
      </AppShell>
    );
  }

  const assignee = userById(task.assignee);
  const creator = userById(task.createdBy);

  const activity = [
    { id: "a1", label: `Task created by ${creator.name}`, ts: task.createdAt },
    { id: "a2", label: `Assigned to ${assignee.name}`, ts: task.createdAt },
    { id: "a3", label: `Status set to ${task.status}`, ts: task.updatedAt },
  ];

  return (
    <AppShell>
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3">
        <Link to="/dashboard" className="hover:text-foreground">Home</Link>
        <ChevronRight className="h-3 w-3" />
        <Link to="/stories/all" className="hover:text-foreground">Stories</Link>
        {story && (
          <>
            <ChevronRight className="h-3 w-3" />
            <Link to="/stories/$storyId" params={{ storyId: story.id }} className="hover:text-foreground truncate max-w-[200px]">
              {story.key}
            </Link>
          </>
        )}
        <ChevronRight className="h-3 w-3" />
        <span className="text-foreground font-medium">Task</span>
      </nav>

      <div className="flex items-start justify-between flex-wrap gap-3 mb-5">
        <div className="min-w-0">
          <div className="font-mono text-xs text-muted-foreground">{task.id.toUpperCase()}</div>
          <h1 className="text-2xl font-semibold tracking-tight mt-1">{task.title}</h1>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Badge tone={priorityTone(task.priority)}>{task.priority}</Badge>
            <Badge tone={statusTone(task.status === "Done" ? "Done" : task.status === "In Progress" ? "In Progress" : task.status === "Blocked" ? "Review" : "Todo")} dot>
              {task.status}
            </Badge>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <div className="xl:col-span-2 space-y-5">
          <div className="rounded-xl bg-card border border-border shadow-card p-5">
            <h3 className="font-semibold text-sm mb-2">Description</h3>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
              {task.description || "No description provided."}
            </p>
          </div>

          {/* Comments */}
          <div className="rounded-xl bg-card border border-border shadow-card p-5">
            <h3 className="font-semibold text-sm mb-3">Comments</h3>
            <div className="space-y-3 mb-4">
              {comments.length === 0 && (
                <div className="text-xs text-muted-foreground py-6 text-center border border-dashed border-border rounded-lg">
                  No comments yet. Be the first to add one.
                </div>
              )}
              {comments.map((c) => {
                const u = userById(c.author);
                return (
                  <div key={c.id} className="flex gap-3">
                    <img src={u.avatar} className="h-8 w-8 rounded-full border border-border" />
                    <div className="flex-1">
                      <div className="text-xs">
                        <span className="font-medium text-foreground">{u.name}</span>
                        <span className="text-muted-foreground ml-2">{new Date(c.ts).toLocaleString()}</span>
                      </div>
                      <div className="text-sm mt-0.5 whitespace-pre-wrap">{c.text}</div>
                    </div>
                  </div>
                );
              })}
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!draft.trim()) return;
                setComments((prev) => [...prev, { id: `c-${Date.now()}`, author: currentUser.id, text: draft.trim(), ts: new Date().toISOString() }]);
                setDraft("");
              }}
              className="flex items-center gap-2"
            >
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Write a comment…"
                className="flex-1 h-9 px-3 rounded-lg bg-background border border-border text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/20 transition"
              />
              <button type="submit" disabled={!draft.trim()} className="h-9 px-3 rounded-lg bg-gradient-primary text-primary-foreground text-xs font-medium shadow-elegant inline-flex items-center gap-1.5 disabled:opacity-40">
                <Send className="h-3.5 w-3.5" /> Post
              </button>
            </form>
          </div>

          {/* Activity */}
          <div className="rounded-xl bg-card border border-border shadow-card p-5">
            <h3 className="font-semibold text-sm mb-3 inline-flex items-center gap-2"><Activity className="h-4 w-4" /> Activity</h3>
            <ol className="relative border-l border-border ml-2 space-y-3">
              {activity.map((a) => (
                <li key={a.id} className="ml-4">
                  <span className="absolute -left-1.5 mt-1.5 h-3 w-3 rounded-full bg-primary border-2 border-background" />
                  <div className="text-sm">{a.label}</div>
                  <div className="text-[11px] text-muted-foreground inline-flex items-center gap-1 mt-0.5">
                    <Clock className="h-3 w-3" /> {new Date(a.ts).toLocaleString()}
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <aside className="space-y-3">
          <div className="rounded-xl bg-card border border-border shadow-card p-5">
            <h3 className="font-semibold text-sm mb-3">Details</h3>
            <DetailRow label="Status">
              <select
                value={task.status}
                onChange={(e) => scrumTasksStore.update(task.id, { status: e.target.value as TaskStatus })}
                className="text-xs h-7 px-2 rounded border border-border bg-background cursor-pointer"
              >
                {TASK_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </DetailRow>
            <DetailRow label="Priority"><Badge tone={priorityTone(task.priority)}>{task.priority}</Badge></DetailRow>
            <DetailRow label="Assignee">
              <span className="inline-flex items-center gap-1.5">
                <img src={assignee.avatar} className="h-5 w-5 rounded-full border border-border" />
                <span className="text-xs">{assignee.name}</span>
              </span>
            </DetailRow>
            <DetailRow label="Estimated"><span className="text-xs tabular-nums">{task.estimatedHours}h</span></DetailRow>
            <DetailRow label="Actual"><span className="text-xs tabular-nums">{task.actualHours}h</span></DetailRow>
            <DetailRow label="Start"><span className="text-xs">{task.startDate ? new Date(task.startDate).toLocaleDateString() : "—"}</span></DetailRow>
            <DetailRow label="Due"><span className="text-xs">{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "—"}</span></DetailRow>
            <DetailRow label="Created"><span className="text-xs">{new Date(task.createdAt).toLocaleDateString()}</span></DetailRow>
          </div>

          <div className="rounded-xl bg-card border border-border shadow-card p-5">
            <h3 className="font-semibold text-sm mb-3">References</h3>
            <div className="space-y-2 text-sm">
              <div>
                <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Story</div>
                {story ? (
                  <Link to="/stories/$storyId" params={{ storyId: story.id }} className="text-primary hover:underline">
                    {story.key} · {story.title}
                  </Link>
                ) : <span className="text-muted-foreground">—</span>}
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Project</div>
                <span>{project ? `${project.key} · ${project.name}` : "—"}</span>
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Created by</div>
                <span className="inline-flex items-center gap-1.5">
                  <UserIcon className="h-3.5 w-3.5 text-muted-foreground" /> {creator.name}
                </span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </AppShell>
  );
}

function DetailRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-1.5 text-sm border-b border-border last:border-0">
      <span className="text-muted-foreground text-xs">{label}</span>
      <span className="font-medium">{children}</span>
    </div>
  );
}
