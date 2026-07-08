import { useMemo, useState } from "react";
import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, ChevronRight, Send, Clock, User as UserIcon, Activity } from "lucide-react";
import { AppShell } from "@/components/app/AppShell";
import { CheckSquare } from "lucide-react";
import { Badge, priorityTone, statusTone } from "@/components/app/Badge";
import ScrumTaskViewForm from "@/components/scrum-task/ScrumTaskViewForm";
import {
  useScrumTasks,
  scrumTasksStore,
  TASK_STATUSES,
  type TaskStatus,
} from "@/lib/scrum-tasks-store";
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
  const task = useMemo(
    () => allTasks.find((t) => t._id === taskId || t.id === taskId),
    [allTasks, taskId],
  );
  const story = task ? stories.find((s) => s.id === task.storyId) : undefined;
  const project = story ? projects.find((p) => p.id === story.projectId) : undefined;

  const [comments, setComments] = useState<Comment[]>([]);
  const [draft, setDraft] = useState("");

  if (!task) {
    return (
      <AppShell>
        <div className="rounded-xl bg-card border border-border shadow-card p-12 text-center">
          <div className="font-semibold">Task not found</div>
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

  const assignee = userById(task.assigneeId);
  const creator = userById(task.createdBy);

  const activity = [
    { id: "a1", label: `Task created by ${creator.name}`, ts: task.createdAt },
    { id: "a2", label: `Assigned to ${assignee.name}`, ts: task.createdAt },
    { id: "a3", label: `Status set to ${task.status}`, ts: task.updatedAt },
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
          Back to Scrum
        </Link>
      </div>

      <div className="space-y-6">
        <ScrumTaskViewForm task={task} />
      </div>
    </AppShell>
  );
}
