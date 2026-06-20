import { createFileRoute } from "@tanstack/react-router";
import { StoriesList } from "@/components/app/StoriesList";
import { useState, useEffect } from "react";

export const Route = createFileRoute("/stories/all")({
  component: AllStoriesPage,
});

function AllStoriesPage() {
  const [apiStories, setApiStories] = useState<any[]>([]);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/stories")
      .then((res) => res.json())
      .then((data) => setApiStories(data))
      .catch((err) => console.error(err));
  }, []);

  return <StoriesList stories={apiStories} />;
}