import { createFileRoute } from "@tanstack/react-router";
import { StoriesList } from "@/components/app/StoriesList";
import { useStories } from "@/lib/stories-store";

export const Route = createFileRoute("/stories/all")({
  component: AllStoriesPage,
});

function AllStoriesPage() {
  const stories = useStories();

  return <StoriesList stories={stories} />;
}
