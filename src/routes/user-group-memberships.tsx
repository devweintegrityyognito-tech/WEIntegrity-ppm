import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AppShell } from "@/components/app/AppShell";

export const Route = createFileRoute("/user-group-memberships")({
  component: UserGroupMembershipsLayout,
});

function UserGroupMembershipsLayout() {
  return (
    <AppShell>
      <Outlet />
    </AppShell>
  );
}
