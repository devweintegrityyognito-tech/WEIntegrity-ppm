import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AppShell } from "@/components/app/AppShell";

export const Route = createFileRoute("/users")({
  component: UsersLayout,
});

function UsersLayout() {
  return (
    <AppShell>
      <Outlet />
    </AppShell>
  );
}
