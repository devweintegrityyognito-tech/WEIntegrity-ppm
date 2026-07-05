import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { StoriesList } from "@/components/app/StoriesList";
import { currentUser } from "@/lib/mock-data";
import { useStories } from "@/lib/stories-store";

export const Route = createFileRoute("/stories/my")({
  component: MyStoriesPage,
});

function MyStoriesPage() {
  const stories = useStories();

  const mine = stories.filter((s) => s.assigneeId === currentUser.id);

  return (
    <StoriesList
      stories={mine}
      totalCount={mine.length}
      emptyTitle="No stories assigned to you"
      emptyDescription="When a teammate assigns you a story, it'll appear here. Create one to get started."
      emptyAction={
        <Link
          to="/stories/create"
          className="inline-flex items-center gap-1.5 h-9 px-4 rounded-lg bg-gradient-primary text-primary-foreground text-sm font-medium shadow-elegant hover:opacity-95"
        >
          <Plus className="h-4 w-4" /> Create story
        </Link>
      }
    />
  );
}
