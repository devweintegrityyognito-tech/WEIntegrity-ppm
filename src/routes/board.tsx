import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app/AppShell";
import { Badge, priorityTone } from "@/components/app/Badge";
import { tasks as initialTasks, userById, Task } from "@/lib/mock-data";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import { Plus, MoreHorizontal, MessageSquare, Paperclip, Calendar } from "lucide-react";
import { useMemo, useState } from "react";

export const Route = createFileRoute("/board")({
  head: () => ({ meta: [{ title: "Board — Yognito" }] }),
  component: BoardPage,
});

const columns: { id: Task["status"]; label: string; tone: string }[] = [
  { id: "Backlog", label: "Backlog", tone: "bg-muted-foreground/40" },
  { id: "Todo", label: "To do", tone: "bg-[oklch(0.65_0.14_230)]" },
  { id: "In Progress", label: "In progress", tone: "bg-primary" },
  { id: "Review", label: "Review", tone: "bg-[oklch(0.78_0.16_75)]" },
  { id: "Testing", label: "Testing", tone: "bg-[oklch(0.68_0.18_295)]" },
  { id: "Done", label: "Done", tone: "bg-[oklch(0.68_0.16_155)]" },
];

function BoardPage() {
  const [items, setItems] = useState(initialTasks);

  const byCol = useMemo(() => {
    const m: Record<string, Task[]> = {};
    columns.forEach((c) => (m[c.id] = []));
    items.forEach((t) => m[t.status]?.push(t));
    return m;
  }, [items]);

  const move = (task: Task, dir: 1 | -1) => {
    const idx = columns.findIndex((c) => c.id === task.status);
    const next = columns[Math.min(columns.length - 1, Math.max(0, idx + dir))];
    setItems((arr) => arr.map((t) => (t.id === task.id ? { ...t, status: next.id } : t)));
  };

  return (
    <AppShell>
      <div className="flex items-end justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Board · ATLAS Sprint 23</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Drag through columns to reorder, click chevrons to advance status.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex -space-x-2">
            {["u-2", "u-4", "u-5", "u-8"].map((id) => (
              <img
                key={id}
                src={userById(id).avatar}
                className="h-8 w-8 rounded-full border-2 border-background"
              />
            ))}
          </div>
          <button className="h-9 px-3.5 rounded-lg bg-gradient-primary text-primary-foreground text-sm font-medium inline-flex items-center gap-1.5 shadow-elegant">
            <Plus className="h-4 w-4" /> Add issue
          </button>
        </div>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin -mx-2 px-2">
        {columns.map((col) => (
          <div key={col.id} className="w-80 shrink-0">
            <div className="flex items-center justify-between mb-3 px-1">
              <div className="flex items-center gap-2">
                <span className={`h-2 w-2 rounded-full ${col.tone}`} />
                <span className="text-sm font-semibold">{col.label}</span>
                <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full tabular-nums">
                  {byCol[col.id].length}
                </span>
              </div>
              <button className="text-muted-foreground hover:text-foreground">
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <Reorder.Group
              axis="y"
              values={byCol[col.id]}
              onReorder={(reordered) => {
                setItems((all) => {
                  const others = all.filter((t) => t.status !== col.id);
                  return [...others, ...reordered];
                });
              }}
              className="space-y-2.5 min-h-[200px] p-1 rounded-xl"
            >
              <AnimatePresence>
                {byCol[col.id].map((t) => {
                  const a = userById(t.assignee);
                  return (
                    <Reorder.Item key={t.id} value={t} className="list-none">
                      <motion.div
                        layout
                        initial={{ opacity: 0, scale: 0.97 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.97 }}
                        whileHover={{ y: -2 }}
                        className="rounded-xl bg-card border border-border shadow-card p-3.5 cursor-grab active:cursor-grabbing"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <Badge tone={priorityTone(t.priority)}>{t.priority}</Badge>
                          <button className="text-muted-foreground hover:text-foreground">
                            <MoreHorizontal className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="mt-2 text-sm font-medium leading-snug">{t.title}</div>
                        <div className="mt-2 flex items-center gap-1.5 flex-wrap">
                          {t.tags.map((tag) => (
                            <span
                              key={tag}
                              className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                        <div className="mt-3 pt-3 border-t border-border flex items-center justify-between">
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <span className="font-mono">{t.key}</span>
                            <span className="inline-flex items-center gap-1">
                              <MessageSquare className="h-3 w-3" /> 4
                            </span>
                            <span className="inline-flex items-center gap-1">
                              <Paperclip className="h-3 w-3" /> 2
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => move(t, -1)}
                              className="text-xs px-1 text-muted-foreground hover:text-foreground"
                            >
                              ‹
                            </button>
                            <img
                              src={a.avatar}
                              title={a.name}
                              className="h-6 w-6 rounded-full border border-border"
                            />
                            <button
                              onClick={() => move(t, 1)}
                              className="text-xs px-1 text-muted-foreground hover:text-foreground"
                            >
                              ›
                            </button>
                          </div>
                        </div>
                        <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground">
                          <span className="inline-flex items-center gap-1">
                            <Calendar className="h-3 w-3" />{" "}
                            {new Date(t.dueDate).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                          <span className="font-semibold text-primary">{t.storyPoints} pts</span>
                        </div>
                      </motion.div>
                    </Reorder.Item>
                  );
                })}
              </AnimatePresence>
            </Reorder.Group>
          </div>
        ))}
      </div>
    </AppShell>
  );
}
