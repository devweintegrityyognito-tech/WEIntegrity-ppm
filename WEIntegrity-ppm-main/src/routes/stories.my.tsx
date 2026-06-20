import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { StoriesList } from "@/components/app/StoriesList";
import { currentUser } from "@/lib/mock-data";
import { useMemo, useState, useEffect } from "react";

export const Route = createFileRoute("/stories/my")({
  component: MyStoriesPage,
});

function MyStoriesPage() {

  const [apiStories, setApiStories] = useState<any[]>([]);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/stories")
      .then((res) => res.json())
      .then((data) => setApiStories(data))
      .catch((err) => console.error(err));
  }, []);

  const mine = useMemo(
    () => apiStories.filter((s) => s.assigneeId === currentUser.id),
    [apiStories],
  );

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
