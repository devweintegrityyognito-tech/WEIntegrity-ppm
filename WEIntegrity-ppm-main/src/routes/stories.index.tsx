import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/stories/")({
  component: () => <Navigate to="/stories/all" replace />,
});
