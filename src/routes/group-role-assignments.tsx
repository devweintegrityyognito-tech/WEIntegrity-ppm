import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AppShell } from "@/components/app/AppShell";

export const Route = createFileRoute("/group-role-assignments")({
  component: GroupRoleAssignmentsLayout,
});

function GroupRoleAssignmentsLayout() {
  return (
    <AppShell>
      <Outlet />
    </AppShell>
  );
}
