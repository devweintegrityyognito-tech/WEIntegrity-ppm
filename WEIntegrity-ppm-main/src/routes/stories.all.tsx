import { createFileRoute } from "@tanstack/react-router";
import { StoriesList } from "@/components/app/StoriesList";
import { useState, useEffect } from "react";

export const Route = createFileRoute("/stories/all")({
  component: AllStoriesPage,
});

function AllStoriesPage() {
  const [apiStories, setApiStories] = useState<any[]>([]);

  useEffect(() => {
    fetch("https://weintegrity-ppm-main.onrender.com/api/stories")
      .then((res) => res.json())
      .then((data) => setApiStories(data))
      .catch((err) => console.error(err));
  }, []);

  return <StoriesList stories={apiStories} />;
}