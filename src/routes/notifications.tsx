import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app/AppShell";
import { notifications } from "@/lib/mock-data";
import { Bell, MessageSquare, Zap, Rocket, FileBarChart, CheckCheck } from "lucide-react";
import { motion } from "framer-motion";

export const Route = createFileRoute("/notifications")({
  head: () => ({ meta: [{ title: "Notifications — Yognito" }] }),
  component: NotificationsPage,
});

const icons: Record<string, any> = {
  task: Bell,
  sprint: Zap,
  comment: MessageSquare,
  deploy: Rocket,
  report: FileBarChart,
};

function NotificationsPage() {
  return (
    <AppShell>
      <div className="flex items-end justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Notifications</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Stay up to date with sprint, task and deployment activity.
          </p>
        </div>
        <button className="h-9 px-3 rounded-lg border border-border bg-card text-sm font-medium inline-flex items-center gap-1.5 hover:bg-muted/50">
          <CheckCheck className="h-4 w-4" /> Mark all as read
        </button>
      </div>

      <div className="flex gap-2 mb-5">
        {["All", "Mentions", "Tasks", "Sprints", "Deploys"].map((t, i) => (
          <button
            key={t}
            className={`h-8 px-3.5 rounded-full text-xs font-medium border transition ${i === 0 ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border hover:bg-muted/50"}`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="rounded-xl bg-card border border-border shadow-card overflow-hidden">
        {notifications.map((n, idx) => {
          const Icon = icons[n.type] ?? Bell;
          return (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.04 }}
              className={`group flex items-start gap-4 px-5 py-4 border-b border-border last:border-0 hover:bg-muted/40 transition ${n.unread ? "bg-primary/[0.03]" : ""}`}
            >
              <div
                className={`h-10 w-10 rounded-lg grid place-items-center shrink-0 ${n.unread ? "bg-gradient-primary text-white" : "bg-muted text-muted-foreground"}`}
              >
                <Icon className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <div className="font-medium text-sm">{n.title}</div>
                  {n.unread && <span className="h-1.5 w-1.5 rounded-full bg-primary" />}
                </div>
                <div className="text-sm text-muted-foreground mt-0.5">{n.desc}</div>
                <div className="text-[11px] text-muted-foreground/70 mt-1">{n.time}</div>
              </div>
              <button className="opacity-0 group-hover:opacity-100 text-xs text-primary font-medium hover:underline transition">
                View
              </button>
            </motion.div>
          );
        })}
      </div>
    </AppShell>
  );
}
