import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AppShell } from "@/components/app/AppShell";

export const Route = createFileRoute("/roles")({
  component: RolesLayout,
});

function RolesLayout() {
  return (
    <AppShell>
      <Outlet />
    </AppShell>
  );
}
