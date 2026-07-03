import { useMemo, useState } from "react";
import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, ChevronRight, Send, Clock, Activity, Bug } from "lucide-react";
import { AppShell } from "@/components/app/AppShell";
import { Badge, priorityTone, statusTone } from "@/components/app/Badge";
import { useDefects, defectsStore, DEFECT_STATUSES, type DefectStatus } from "@/lib/defects-store";
import { useStories } from "@/lib/stories-store";
import { useScrumTasks } from "@/lib/scrum-tasks-store";
import { userById, currentUser } from "@/lib/mock-data";

export const Route = createFileRoute("/defects/$defectId")({
  head: () => ({ meta: [{ title: "Defect Detail — Yognito" }] }),
  component: DefectDetail,
});

type Comment = { id: string; author: string; text: string; ts: string };

function DefectDetail() {
  const { defectId } = useParams({ from: "/defects/$defectId" });
  const all = useDefects();
  const stories = useStories();
  const tasks = useScrumTasks();
  const defect = useMemo(() => all.find((d) => d.id === defectId), [all, defectId]);
  const story = defect ? stories.find((s) => s.id === defect.storyId) : undefined;
  const relatedTask = defect ? tasks.find((t) => t.storyId === defect.storyId) : undefined;

  const [comments, setComments] = useState<Comment[]>([]);
  const [draft, setDraft] = useState("");
  const [resolution, setResolution] = useState("");

  if (!defect) {
    return (
      <AppShell>
        <div className="rounded-xl bg-card border border-border shadow-card p-12 text-center">
          <div className="font-semibold">Defect not found</div>
          <Link
            to="/stories/all"
            className="inline-flex items-center gap-1.5 mt-3 text-sm text-primary hover:underline"
          >
            <ArrowLeft className="h-4 w-4" /> Back to stories
          </Link>
        </div>
      </AppShell>
    );
  }

  const reporter = userById(defect.reportedBy);
  const assignee = userById(defect.assignedTo);

  const activity = [
    { id: "a1", label: `Defect reported by ${reporter.name}`, ts: defect.createdDate },
    { id: "a2", label: `Assigned to ${assignee.name}`, ts: defect.createdDate },
    { id: "a3", label: `Status updated to ${defect.status}`, ts: defect.updatedAt },
    ...(defect.resolvedDate
      ? [{ id: "a4", label: `Marked ${defect.status}`, ts: defect.resolvedDate }]
      : []),
  ];

  return (
    <AppShell>
      <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3">
        <Link to="/dashboard" className="hover:text-foreground">
          Home
        </Link>
        <ChevronRight className="h-3 w-3" />
        <Link to="/stories/all" className="hover:text-foreground">
          Stories
        </Link>
        {story && (
          <>
            <ChevronRight className="h-3 w-3" />
            <Link
              to="/stories/$storyId"
              params={{ storyId: story.id }}
              className="hover:text-foreground truncate max-w-50"
            >
              {story.key}
            </Link>
          </>
        )}
        <ChevronRight className="h-3 w-3" />
        <span className="text-foreground font-medium">Defect</span>
      </nav>

      <div className="flex items-start justify-between flex-wrap gap-3 mb-5">
        <div className="min-w-0">
          <div className="font-mono text-xs text-muted-foreground inline-flex items-center gap-1.5">
            <Bug className="h-3.5 w-3.5" /> {defect.id.toUpperCase()}
          </div>
          <h1 className="text-2xl font-semibold tracking-tight mt-1">{defect.defectTitle}</h1>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Badge tone={priorityTone(defect.severity)}>Severity: {defect.severity}</Badge>
            <Badge tone={priorityTone(defect.priority)}>Priority: {defect.priority}</Badge>
            <Badge
              tone={statusTone(
                defect.status === "Resolved" || defect.status === "Closed" ? "Done" : "In Progress",
              )}
              dot
            >
              {defect.status}
            </Badge>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <div className="xl:col-span-2 space-y-5">
          <div className="rounded-xl bg-card border border-border shadow-card p-5">
            <h3 className="font-semibold text-sm mb-2">Description</h3>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
              {defect.defectDescription || "No description provided."}
            </p>
          </div>

          <div className="rounded-xl bg-card border border-border shadow-card p-5">
            <h3 className="font-semibold text-sm mb-2">Resolution</h3>
            <textarea
              value={resolution}
              onChange={(e) => setResolution(e.target.value)}
              rows={3}
              placeholder={
                defect.status === "Resolved" || defect.status === "Closed"
                  ? "Describe the resolution…"
                  : "Pending — defect not yet resolved."
              }
              className="w-full px-3 py-2 rounded-lg bg-background border border-border text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/20 transition"
            />
          </div>

          <div className="rounded-xl bg-card border border-border shadow-card p-5">
            <h3 className="font-semibold text-sm mb-3">Comments</h3>
            <div className="space-y-3 mb-4">
              {comments.length === 0 && (
                <div className="text-xs text-muted-foreground py-6 text-center border border-dashed border-border rounded-lg">
                  No comments yet.
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
                        <span className="text-muted-foreground ml-2">
                          {new Date(c.ts).toLocaleString()}
                        </span>
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
                setComments((prev) => [
                  ...prev,
                  {
                    id: `c-${Date.now()}`,
                    author: currentUser.id,
                    text: draft.trim(),
                    ts: new Date().toISOString(),
                  },
                ]);
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
              <button
                type="submit"
                disabled={!draft.trim()}
                className="h-9 px-3 rounded-lg bg-gradient-primary text-primary-foreground text-xs font-medium shadow-elegant inline-flex items-center gap-1.5 disabled:opacity-40"
              >
                <Send className="h-3.5 w-3.5" /> Post
              </button>
            </form>
          </div>

          <div className="rounded-xl bg-card border border-border shadow-card p-5">
            <h3 className="font-semibold text-sm mb-3 inline-flex items-center gap-2">
              <Activity className="h-4 w-4" /> Activity Timeline
            </h3>
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
                value={defect.status}
                onChange={(e) =>
                  defectsStore.update(defect.id, { status: e.target.value as DefectStatus })
                }
                className="text-xs h-7 px-2 rounded border border-border bg-background cursor-pointer"
              >
                {DEFECT_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </DetailRow>
            <DetailRow label="Severity">
              <Badge tone={priorityTone(defect.severity)}>{defect.severity}</Badge>
            </DetailRow>
            <DetailRow label="Priority">
              <Badge tone={priorityTone(defect.priority)}>{defect.priority}</Badge>
            </DetailRow>
            <DetailRow label="Reporter">
              <span className="inline-flex items-center gap-1.5">
                <img src={reporter.avatar} className="h-5 w-5 rounded-full border border-border" />
                <span className="text-xs">{reporter.name}</span>
              </span>
            </DetailRow>
            <DetailRow label="Assigned to">
              <span className="inline-flex items-center gap-1.5">
                <img src={assignee.avatar} className="h-5 w-5 rounded-full border border-border" />
                <span className="text-xs">{assignee.name}</span>
              </span>
            </DetailRow>
            <DetailRow label="Created">
              <span className="text-xs">{new Date(defect.createdDate).toLocaleDateString()}</span>
            </DetailRow>
            <DetailRow label="Resolved">
              <span className="text-xs">
                {defect.resolvedDate ? new Date(defect.resolvedDate).toLocaleDateString() : "—"}
              </span>
            </DetailRow>
          </div>

          <div className="rounded-xl bg-card border border-border shadow-card p-5">
            <h3 className="font-semibold text-sm mb-3">References</h3>
            <div className="space-y-2 text-sm">
              <div>
                <div className="text-[11px] uppercase tracking-wider text-muted-foreground">
                  Related Story
                </div>
                {story ? (
                  <Link
                    to="/stories/$storyId"
                    params={{ storyId: story.id }}
                    className="text-primary hover:underline"
                  >
                    {story.key} · {story.title}
                  </Link>
                ) : (
                  <span className="text-muted-foreground">—</span>
                )}
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-wider text-muted-foreground">
                  Related Task
                </div>
                {relatedTask ? (
                  <Link
                    to="/tasks/$taskId"
                    params={{ taskId: relatedTask.id }}
                    className="text-primary hover:underline"
                  >
                    {relatedTask.title}
                  </Link>
                ) : (
                  <span className="text-muted-foreground">—</span>
                )}
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
