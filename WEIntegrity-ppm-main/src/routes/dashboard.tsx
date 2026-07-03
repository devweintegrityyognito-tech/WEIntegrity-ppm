import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app/AppShell";
import { StatCard } from "@/components/app/StatCard";
import { Badge, statusTone } from "@/components/app/Badge";
import { users, velocityData, productivityData, projectMixData, activity, userById } from "@/lib/mock-data";
import { FolderKanban, Users, CheckCircle2, Clock, MoreHorizontal } from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer,
  XAxis, YAxis, Tooltip, CartesianGrid, Legend,
} from "recharts";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — Yognito" }] }),
  component: Dashboard,
});

const stagger = { animate: { transition: { staggerChildren: 0.06 } } };
const fadeUp = { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 } };

function Dashboard() {
  const [apiProjects, setApiProjects] = useState<any[]>([]);

useEffect(() => {
  fetch("https://weintegrity-ppm-main.onrender.com/api/projects")
    .then((res) => res.json())
    .then((data) => setApiProjects(data))
    .catch((err) => console.error(err));
}, []);
  return (
    <AppShell>
      <div className="flex items-end justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Good afternoon, Aarav 👋</h1>
          <p className="text-sm text-muted-foreground mt-1">Here's what's happening across your portfolio today.</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            title="Time range"
            className="h-9 px-3 rounded-lg bg-card border border-border text-sm"
            >
            <option>Last 30 days</option><option>Last 7 days</option><option>This quarter</option>
          </select>
          <button className="h-9 px-3 rounded-lg bg-card border border-border text-sm font-medium hover:bg-muted/50">Export</button>
        </div>
      </div>

      <motion.div variants={stagger} initial="initial" animate="animate" className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { label: "Active Projects", value: 24, change: 12, icon: FolderKanban, tone: "primary" as const },
          { label: "Team Members", value: 176, change: 4.8, icon: Users, tone: "info" as const, suffix: "" },
          { label: "Tasks Completed", value: 1284, change: 18, icon: CheckCircle2, tone: "success" as const },
          { label: "Avg Cycle Time", value: 3.2, change: -8.4, icon: Clock, tone: "warning" as const, suffix: "d" },
        ].map((s) => (
          <motion.div key={s.label} variants={fadeUp}>
            <StatCard {...s} />
          </motion.div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 mt-6">
        <div className="xl:col-span-2 rounded-xl bg-card border border-border shadow-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-sm">Team velocity</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Story points planned vs completed across the last 6 sprints.</p>
            </div>
            <Badge tone="success" dot>+9% vs prev</Badge>
          </div>
          <div className="h-72">
            <ResponsiveContainer>
              <AreaChart data={velocityData} margin={{ top: 6, right: 8, left: -16, bottom: 0 }}>
                <defs>
                  <linearGradient id="vp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.52 0.22 264)" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="oklch(0.52 0.22 264)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="vc" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.68 0.18 295)" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="oklch(0.68 0.18 295)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0.012 255)" vertical={false} />
                <XAxis dataKey="sprint" tick={{ fontSize: 11, fill: "oklch(0.52 0.03 260)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "oklch(0.52 0.03 260)" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 10, border: "1px solid oklch(0.92 0.012 255)", fontSize: 12 }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
                <Area type="monotone" dataKey="planned" stroke="oklch(0.52 0.22 264)" fill="url(#vp)" strokeWidth={2} />
                <Area type="monotone" dataKey="completed" stroke="oklch(0.68 0.18 295)" fill="url(#vc)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl bg-card border border-border shadow-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-sm">Portfolio health</h3>
              <button title="More options">
                <MoreHorizontal className="h-4 w-4" />
              </button>
          </div>
          <div className="h-44">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={projectMixData} dataKey="value" nameKey="name" innerRadius={48} outerRadius={72} paddingAngle={3} cornerRadius={4}>
                  {projectMixData.map((d, i) => <Cell key={i} fill={d.color} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 10, border: "1px solid oklch(0.92 0.012 255)", fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 space-y-2">
            {projectMixData.map((d) => (
              <div key={d.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full" style={{ background: d.color }} /> {d.name}</div>
                <span className="text-muted-foreground font-medium">{d.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 mt-6">
        <div className="xl:col-span-2 rounded-xl bg-card border border-border shadow-card overflow-hidden">
          <div className="p-5 flex items-center justify-between border-b border-border">
            <div>
              <h3 className="font-semibold text-sm">Active projects</h3>
              <p className="text-xs text-muted-foreground mt-0.5">A live snapshot of in-flight delivery work.</p>
            </div>
            <button className="text-xs font-medium text-primary hover:underline">View all</button>
          </div>
          <div className="overflow-x-auto scrollbar-thin">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-[11px] uppercase tracking-wider text-muted-foreground bg-muted/40">
                  <th className="text-left font-medium px-5 py-2.5">Project</th>
                  <th className="text-left font-medium py-2.5">Lead</th>
                  <th className="text-left font-medium py-2.5">Status</th>
                  <th className="text-left font-medium py-2.5">Progress</th>
                  <th className="text-left font-medium py-2.5 pr-5">Due</th>
                </tr>
              </thead>
              <tbody>
                {(apiProjects || []).slice(0,5).map((p) => {
                  const lead = userById(p.lead || "u-2");
                  return (
                    <tr key={p.id} className="border-t border-border hover:bg-muted/30 transition">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-lg bg-gradient-primary grid place-items-center text-[10px] font-bold text-white">{(p.key || "WE").slice(0,2)}</div>
                          <div>
                            <div className="font-medium leading-tight">{p.name}</div>
                            <div className="text-xs text-muted-foreground leading-tight">{p.client}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <img
                            src={lead?.avatar}
                            alt={lead?.name}
                            className="h-6 w-6 rounded-full border border-border"
                          />
                          <span className="text-xs">{(lead?.name || "").split(" ")[0]}</span>
                        </div>
                      </td>
                      <td className="py-3"><Badge tone={statusTone(p.status)} dot>{p.status}</Badge></td>
                      <td className="py-3 w-48">
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 flex-1 rounded-full bg-muted overflow-hidden">
                            <div className="h-full bg-gradient-primary rounded-full" style={{ width: `${p.progress || 0}%` }} />
                          </div>
                          <span className="text-xs font-medium tabular-nums w-8 text-right">{p.progress || 0}%</span>
                        </div>
                      </td>
                      <td className="py-3 pr-5 text-xs text-muted-foreground">{new Date(p.endDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-xl bg-card border border-border shadow-card p-5">
          <h3 className="font-semibold text-sm mb-1">Recent activity</h3>
          <p className="text-xs text-muted-foreground mb-4">Latest events across your workspace.</p>
          <div className="absolute left-[11px] top-1.5 bottom-1.5 w-px bg-border" />
          <ol className="relative space-y-4 ml-2">
            {activity.map((a) => {
              const u = userById(a.user);
              return (
                <li key={a.id} className="relative flex gap-3">
                  <img
                    src={u.avatar}
                    alt={u.name}
                    className="relative h-6 w-6 rounded-full border-2 border-card z-10"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs">
                      <span className="font-semibold">{(u.name || "").split(" ")[0]}</span>{" "}
                      <span className="text-muted-foreground">{a.action}</span>{" "}
                      <span className="font-medium text-foreground">{a.target}</span>
                    </div>
                    <div className="text-[11px] text-muted-foreground mt-0.5">{a.time}</div>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>

      <div className="rounded-xl bg-card border border-border shadow-card p-5 mt-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-sm">Team productivity</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Tasks shipped and hours logged this week.</p>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <Badge tone="primary" dot>Tasks</Badge>
            <Badge tone="info" dot>Hours</Badge>
          </div>
        </div>
        <div className="h-64">
          <ResponsiveContainer>
            <BarChart data={productivityData} margin={{ top: 6, right: 8, left: -16, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0.012 255)" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: "oklch(0.52 0.03 260)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "oklch(0.52 0.03 260)" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 10, border: "1px solid oklch(0.92 0.012 255)", fontSize: 12 }} cursor={{ fill: "oklch(0.96 0.01 255)" }} />
              <Bar dataKey="tasks" fill="oklch(0.52 0.22 264)" radius={[6, 6, 0, 0]} maxBarSize={28} />
              <Bar dataKey="hours" fill="oklch(0.7 0.16 200)" radius={[6, 6, 0, 0]} maxBarSize={28} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </AppShell>
  );
}
