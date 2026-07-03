import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app/AppShell";
import { StatCard } from "@/components/app/StatCard";
import { Badge } from "@/components/app/Badge";
import { users } from "@/lib/mock-data";
import { Users, CalendarCheck, Plane, UserPlus, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

export const Route = createFileRoute("/hr")({
  head: () => ({ meta: [{ title: "HR Dashboard — Yognito" }] }),
  component: HRDashboard,
});

const headcount = [
  { m: "Apr", v: 112 },
  { m: "May", v: 116 },
  { m: "Jun", v: 119 },
  { m: "Jul", v: 121 },
  { m: "Aug", v: 123 },
  { m: "Sep", v: 124 },
];
const attendanceTrend = [
  { d: "Mon", present: 118, leave: 4 },
  { d: "Tue", present: 120, leave: 3 },
  { d: "Wed", present: 117, leave: 5 },
  { d: "Thu", present: 119, leave: 4 },
  { d: "Fri", present: 115, leave: 7 },
  { d: "Sat", present: 64, leave: 2 },
];

function HRDashboard() {
  return (
    <AppShell>
      <div className="flex items-end justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">HR Operations</h1>
          <p className="text-sm text-muted-foreground mt-1">
            People metrics, attendance and workforce health.
          </p>
        </div>
        <Badge tone="info">Sep 2026 cycle · 124 employees</Badge>
      </div>

      <motion.div
        initial="initial"
        animate="animate"
        variants={{ animate: { transition: { staggerChildren: 0.06 } } }}
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4"
      >
        <StatCard label="Headcount" value={124} change={1.6} icon={Users} tone="primary" />
        <StatCard
          label="Present today"
          value={114}
          change={2.4}
          icon={CalendarCheck}
          tone="success"
        />
        <StatCard label="On leave" value={7} change={-12} icon={Plane} tone="warning" />
        <StatCard label="Open positions" value={12} change={9.1} icon={UserPlus} tone="info" />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-6">
        <div className="lg:col-span-2 rounded-xl bg-card border border-border shadow-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="font-semibold">Weekly attendance</div>
              <div className="text-xs text-muted-foreground">Last 6 working days</div>
            </div>
            <Badge tone="success">
              <TrendingUp className="h-3 w-3 mr-1 inline" /> 96.4% avg
            </Badge>
          </div>
          <div className="h-64">
            <ResponsiveContainer>
              <BarChart data={attendanceTrend}>
                <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="d" tickLine={false} axisLine={false} fontSize={11} />
                <YAxis tickLine={false} axisLine={false} fontSize={11} />
                <Tooltip
                  contentStyle={{
                    borderRadius: 10,
                    border: "1px solid hsl(var(--border))",
                    background: "hsl(var(--popover))",
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="present" fill="oklch(0.55 0.18 265)" radius={[6, 6, 0, 0]} />
                <Bar dataKey="leave" fill="oklch(0.78 0.16 75)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl bg-card border border-border shadow-card p-5">
          <div className="font-semibold">Headcount growth</div>
          <div className="text-xs text-muted-foreground mb-3">Trailing 6 months</div>
          <div className="h-64">
            <ResponsiveContainer>
              <AreaChart data={headcount}>
                <defs>
                  <linearGradient id="hc" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.55 0.18 265)" stopOpacity={0.45} />
                    <stop offset="100%" stopColor="oklch(0.55 0.18 265)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="m" tickLine={false} axisLine={false} fontSize={11} />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  fontSize={11}
                  domain={["dataMin - 2", "dataMax + 2"]}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: 10,
                    border: "1px solid hsl(var(--border))",
                    background: "hsl(var(--popover))",
                    fontSize: 12,
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="v"
                  stroke="oklch(0.55 0.18 265)"
                  strokeWidth={2}
                  fill="url(#hc)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-xl bg-card border border-border shadow-card overflow-hidden">
        <div className="px-5 py-4 border-b border-border flex items-center justify-between">
          <div className="font-semibold">Recently onboarded</div>
          <button className="text-xs text-primary hover:underline">View all</button>
        </div>
        <div className="divide-y divide-border">
          {users.slice(0, 5).map((u) => (
            <div key={u.id} className="px-5 py-3 flex items-center gap-3">
              <img
                src={u.avatar}
                className="h-9 w-9 rounded-full border border-border"
                alt={u.name}
              />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">{u.name}</div>
                <div className="text-xs text-muted-foreground truncate">
                  {u.title} · {u.team}
                </div>
              </div>
              <Badge tone="info">{u.role}</Badge>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
