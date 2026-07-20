import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AppShell } from "@/components/app/AppShell";

export const Route = createFileRoute("/permissions")({
  component: PermissionsLayout,
});

function PermissionsLayout() {
  return (
    <AppShell>
      <Outlet />
    </AppShell>
  );
}
