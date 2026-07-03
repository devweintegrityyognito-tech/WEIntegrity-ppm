import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { Plus, BookOpen, User as UserIcon } from "lucide-react";
import { AppShell } from "@/components/app/AppShell";

export const Route = createFileRoute("/stories")({
  head: () => ({ meta: [{ title: "Stories — Yognito" }] }),
  component: StoriesLayout,
});

function StoriesLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isCreate = pathname.startsWith("/stories/create");

  const tabs = [
    { to: "/stories/all", label: "All Stories", icon: BookOpen },
    { to: "/stories/my", label: "My Stories", icon: UserIcon },
  ];

  return (
    <AppShell>
      <div className="flex items-end justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Stories</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Backlog & in-flight work items across your projects
          </p>
        </div>
        {!isCreate && (
          <Link
            to="/stories/create"
            className="h-9 px-3.5 rounded-lg bg-gradient-primary text-primary-foreground text-sm font-medium inline-flex items-center gap-1.5 shadow-elegant hover:opacity-95"
          >
            <Plus className="h-4 w-4" /> New Story
          </Link>
        )}
      </div>

      {!isCreate && (
        <div className="border-b border-border mb-5">
          <div className="flex items-center gap-1">
            {tabs.map((t) => {
              const active = pathname === t.to;
              const Icon = t.icon;
              return (
                <Link
                  key={t.to}
                  to={t.to}
                  className={`relative inline-flex items-center gap-2 px-4 h-10 text-sm font-medium transition ${
                    active ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {t.label}
                  {active && (
                    <span className="absolute left-0 right-0 -bottom-px h-0.5 bg-gradient-primary rounded-full" />
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      )}

      <Outlet />
    </AppShell>
  );
}
