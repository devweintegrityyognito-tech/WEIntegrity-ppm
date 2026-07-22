import { useMemo, useState } from "react";
import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, ChevronRight, Send, Clock, Activity, Bug } from "lucide-react";
import { AppShell } from "@/components/app/AppShell";
import { Badge, priorityTone, statusTone } from "@/components/app/Badge";
import { useDefects, defectsStore, DEFECT_STATUSES, type DefectStatus } from "@/lib/defects-store";
import { useStories } from "@/lib/stories-store";
import { useScrumTasks } from "@/lib/scrum-tasks-store";
import { currentUser } from "@/lib/mock-data";
import { useUsers } from "@/lib/users-store";
import DefectViewForm from "@/components/defect/DefectViewForm";

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
  const users = useUsers();
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

  const reporter = users.find((u) => u.id === defect.reportedBy);
  const assignee = users.find((u) => u.id === defect.assignedTo);

  const activity = [
    {
      id: "a1",
      label: `Defect reported by ${reporter ? `${reporter.firstName} ${reporter.lastName}` : ""}`,
      ts: defect.createdDate,
    },
    {
      id: "a2",
      label: `Assigned to ${assignee ? `${assignee.firstName} ${assignee.lastName}` : ""}`,
      ts: defect.createdDate,
    },
    {
      id: "a3",
      label: `Status updated to ${defect.status}`,
      ts: defect.updatedAt,
    },
    ...(defect.resolvedDate
      ? [{ id: "a4", label: `Marked ${defect.status}`, ts: defect.resolvedDate }]
      : []),
  ];

  return (
    <AppShell>
      <div className="flex items-start justify-between flex-wrap gap-3 mb-5">
        <Link
          to="/stories/$storyId"
          params={{ storyId: story!.id }}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Defects
        </Link>
      </div>

      <div className="space-y-6">
        <DefectViewForm defect={defect} />
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
