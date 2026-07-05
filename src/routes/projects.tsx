import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app/AppShell";
import { Badge, statusTone, priorityTone } from "@/components/app/Badge";
import { userById } from "@/lib/mock-data";
import { motion } from "framer-motion";
import { Plus, Filter, LayoutGrid, List, Search, Calendar } from "lucide-react";
import { useState, useEffect } from "react";

export const Route = createFileRoute("/projects")({
  head: () => ({ meta: [{ title: "Projects — Yognito" }] }),
  component: ProjectsPage,
});

function ProjectsPage() {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [q, setQ] = useState("");

  const [apiProjects, setApiProjects] = useState<any[]>([]);
  useEffect(() => {
    fetch("https://weintegrity-ppm-main.onrender.com/api/projects")
      .then((res) => res.json())
      .then((data) => {
        setApiProjects(data);
      })
      .catch((err) => console.error(err));
  }, []);

  const filtered = apiProjects.filter(
    (p) =>
      p.name.toLowerCase().includes(q.toLowerCase()) ||
      (p.client || "").toLowerCase().includes(q.toLowerCase()),
  );

  return (
    <AppShell>
      <div className="flex items-end justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Projects</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {apiProjects.length} projects·{" "}
            {apiProjects.filter((p) => p.status !== "Completed").length} active
          </p>
        </div>
        <button className="h-9 px-3.5 rounded-lg bg-gradient-primary text-primary-foreground text-sm font-medium inline-flex items-center gap-1.5 shadow-elegant hover:opacity-95">
          <Plus className="h-4 w-4" /> New project
        </button>
      </div>

      <div className="flex items-center gap-2 mb-5 flex-wrap">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search projects…"
            className="w-full h-9 pl-9 pr-3 rounded-lg bg-card border border-border text-sm outline-none focus:border-ring transition"
          />
        </div>
        <button className="h-9 px-3 rounded-lg border border-border bg-card text-sm inline-flex items-center gap-1.5 hover:bg-muted/50">
          <Filter className="h-3.5 w-3.5" /> Filter
        </button>
        <div className="ml-auto flex items-center bg-muted rounded-lg p-0.5">
          <button
            onClick={() => setView("grid")}
            className={`h-8 w-8 grid place-items-center rounded-md ${view === "grid" ? "bg-card shadow-sm" : "text-muted-foreground"}`}
          >
            <LayoutGrid className="h-4 w-4" />
          </button>
          <button
            onClick={() => setView("list")}
            className={`h-8 w-8 grid place-items-center rounded-md ${view === "list" ? "bg-card shadow-sm" : "text-muted-foreground"}`}
          >
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>

      {view === "grid" ? (
        <motion.div
          initial="hidden"
          animate="show"
          variants={{ show: { transition: { staggerChildren: 0.05 } } }}
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
        >
          {filtered.map((p) => {
            const lead = userById(p.lead || "u-2");
            return (
              <motion.div
                key={p._id}
                variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
                whileHover={{ y: -3 }}
                className="group rounded-xl bg-card border border-border shadow-card p-5 hover:shadow-elegant transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-gradient-primary grid place-items-center text-xs font-bold text-white">
                      {(p.key || "WE").slice(0, 2)}
                    </div>
                    <div>
                      <div className="font-semibold leading-tight">{p.name}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        {p.client || "Internal"}· {p.key}
                      </div>
                    </div>
                  </div>
                  <Badge tone={priorityTone(p.priority || "Medium")}>{p.priority}</Badge>
                </div>

                <div className="mt-4 flex items-center gap-2 flex-wrap">
                  <Badge tone={statusTone(p.status)} dot>
                    {p.status}
                  </Badge>
                  {(p.tags || []).slice(0, 2).map((t: string) => (
                    <Badge key={t} tone="muted">
                      #{t}
                    </Badge>
                  ))}
                </div>

                <div className="mt-4">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-semibold tabular-nums">{p.progress || 0}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${p.progress || 0}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      className="h-full bg-gradient-primary rounded-full"
                    />
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
                  <div className="flex -space-x-2">
                    {[p.lead || "u-2", ...(p.members || [])].slice(0, 4).map((id) => {
                      const u = userById(id);

                      if (!u) return null;
                      return (
                        <img
                          key={id}
                          src={u.avatar}
                          title={u.name}
                          className="h-7 w-7 rounded-full border-2 border-card"
                        />
                      );
                    })}
                    {(p.members || []).length > 3 && (
                      <div className="h-7 w-7 rounded-full border-2 border-card bg-muted grid place-items-center text-[10px] font-semibold">
                        +{(p.members || []).length - 3}
                      </div>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground inline-flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(p.endDate || "2026-12-31").toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-2 text-xs">
                  <span className="text-muted-foreground">Lead:</span>
                  <img src={lead.avatar} alt={lead.name} className="h-5 w-5 rounded-full" />
                  <span className="font-medium">{lead.name}</span>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      ) : (
        <div className="rounded-xl bg-card border border-border shadow-card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[11px] uppercase tracking-wider text-muted-foreground bg-muted/40">
                <th className="text-left font-medium px-5 py-2.5">Project</th>
                <th className="text-left font-medium py-2.5">Status</th>
                <th className="text-left font-medium py-2.5">Priority</th>
                <th className="text-left font-medium py-2.5">Progress</th>
                <th className="text-left font-medium py-2.5">Team</th>
                <th className="text-left font-medium py-2.5">Budget</th>
                <th className="text-left font-medium py-2.5 pr-5">Due</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p._id} className="border-t border-border hover:bg-muted/30">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="h-8 w-8 rounded-lg bg-gradient-primary grid place-items-center text-[10px] font-bold text-white">
                        {(p.key || "WE").slice(0, 2)}
                      </div>
                      <div>
                        <div className="font-medium leading-tight">{p.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {p.client || "Internal"}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3">
                    <Badge tone={statusTone(p.status)} dot>
                      {p.status}
                    </Badge>
                  </td>
                  <td className="py-3">
                    <Badge tone={priorityTone(p.priority || "Medium")}>
                      {p.priority || "Medium"}
                    </Badge>
                  </td>
                  <td className="py-3 w-44">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 flex-1 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full bg-gradient-primary"
                          style={{ width: `${p.progress || 0}%` }}
                        />
                      </div>
                      <span className="text-xs tabular-nums w-8 text-right">
                        {p.progress || 0}%
                      </span>
                    </div>
                  </td>
                  <td className="py-3">
                    <div className="flex -space-x-2">
                      {(p.members || []).slice(0, 3).map((id: string) => {
                        const u = userById(id);

                        if (!u) return null;
                        return (
                          <img
                            key={id}
                            src={u.avatar}
                            alt={u.name}
                            className="h-6 w-6 rounded-full border-2 border-card"
                          />
                        );
                      })}
                    </div>
                  </td>
                  <td className="py-3 text-xs tabular-nums">
                    ${((p.spent || 0) / 1000).toFixed(0)}k / ${((p.budget || 0) / 1000).toFixed(0)}k
                  </td>
                  <td className="py-3 pr-5 text-xs text-muted-foreground">
                    {new Date(p.endDate || "2026-12-31").toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AppShell>
  );
}
