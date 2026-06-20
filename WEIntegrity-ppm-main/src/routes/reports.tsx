import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app/AppShell";
import { StatCard } from "@/components/app/StatCard";
import { velocityData, productivityData, headcountData, projectMixData } from "@/lib/mock-data";
import { TrendingUp, Target, Timer, BadgeCheck } from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer,
  XAxis, YAxis, Tooltip, CartesianGrid,
} from "recharts";
import { motion } from "framer-motion";

export const Route = createFileRoute("/reports")({
  head: () => ({ meta: [{ title: "Reports — Yognito" }] }),
  component: ReportsPage,
});

const fadeUp = { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 } };

function ReportsPage() {
  return (
    <AppShell>
      <div className="flex items-end justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Reports & analytics</h1>
          <p className="text-sm text-muted-foreground mt-1">Portfolio-wide performance, delivery and headcount insights.</p>
        </div>
        <div className="flex items-center gap-2">
          <select className="h-9 px-3 rounded-lg bg-card border border-border text-sm"><option>Q2 2026</option><option>Q1 2026</option></select>
          <button className="h-9 px-3.5 rounded-lg bg-gradient-primary text-primary-foreground text-sm font-medium shadow-elegant">Export PDF</button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard label="Delivery rate" value={94} suffix="%" change={3.2} icon={BadgeCheck} tone="success" />
        <StatCard label="Velocity" value={48} suffix=" pts" change={6.7} icon={TrendingUp} tone="primary" />
        <StatCard label="Avg lead time" value={5.4} suffix="d" change={-12} icon={Timer} tone="info" />
        <StatCard label="Goals on track" value={87} suffix="%" change={4.1} icon={Target} tone="warning" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 mt-6">
        <motion.div {...fadeUp} className="rounded-xl bg-card border border-border shadow-card p-5">
          <h3 className="font-semibold text-sm">Velocity trend</h3>
          <p className="text-xs text-muted-foreground mt-0.5 mb-3">Planned vs completed story points by sprint.</p>
          <div className="h-72">
            <ResponsiveContainer>
              <BarChart data={velocityData} margin={{ top: 6, right: 8, left: -16, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0.012 255)" vertical={false} />
                <XAxis dataKey="sprint" tick={{ fontSize: 11, fill: "oklch(0.52 0.03 260)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "oklch(0.52 0.03 260)" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 10, border: "1px solid oklch(0.92 0.012 255)", fontSize: 12 }} cursor={{ fill: "oklch(0.96 0.01 255)" }} />
                <Bar dataKey="planned" fill="oklch(0.85 0.06 264)" radius={[6, 6, 0, 0]} maxBarSize={24} />
                <Bar dataKey="completed" fill="oklch(0.52 0.22 264)" radius={[6, 6, 0, 0]} maxBarSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div {...fadeUp} transition={{ delay: 0.05 }} className="rounded-xl bg-card border border-border shadow-card p-5">
          <h3 className="font-semibold text-sm">Headcount growth</h3>
          <p className="text-xs text-muted-foreground mt-0.5 mb-3">Monthly active employees across the company.</p>
          <div className="h-72">
            <ResponsiveContainer>
              <AreaChart data={headcountData} margin={{ top: 6, right: 8, left: -16, bottom: 0 }}>
                <defs>
                  <linearGradient id="hc" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.68 0.18 295)" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="oklch(0.68 0.18 295)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0.012 255)" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "oklch(0.52 0.03 260)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "oklch(0.52 0.03 260)" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 10, border: "1px solid oklch(0.92 0.012 255)", fontSize: 12 }} />
                <Area type="monotone" dataKey="count" stroke="oklch(0.68 0.18 295)" fill="url(#hc)" strokeWidth={2.5} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div {...fadeUp} transition={{ delay: 0.1 }} className="rounded-xl bg-card border border-border shadow-card p-5">
          <h3 className="font-semibold text-sm">Weekly productivity</h3>
          <p className="text-xs text-muted-foreground mt-0.5 mb-3">Tasks shipped vs hours logged.</p>
          <div className="h-72">
            <ResponsiveContainer>
              <LineChart data={productivityData} margin={{ top: 6, right: 8, left: -16, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0.012 255)" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: "oklch(0.52 0.03 260)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "oklch(0.52 0.03 260)" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 10, border: "1px solid oklch(0.92 0.012 255)", fontSize: 12 }} />
                <Line type="monotone" dataKey="tasks" stroke="oklch(0.52 0.22 264)" strokeWidth={2.5} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="hours" stroke="oklch(0.7 0.16 200)" strokeWidth={2.5} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div {...fadeUp} transition={{ delay: 0.15 }} className="rounded-xl bg-card border border-border shadow-card p-5">
          <h3 className="font-semibold text-sm">Portfolio health mix</h3>
          <p className="text-xs text-muted-foreground mt-0.5 mb-3">Distribution of projects by current status.</p>
          <div className="h-72">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={projectMixData} dataKey="value" nameKey="name" outerRadius={100} paddingAngle={3} cornerRadius={4} label={{ fontSize: 11 }}>
                  {projectMixData.map((d, i) => <Cell key={i} fill={d.color} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 10, border: "1px solid oklch(0.92 0.012 255)", fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </AppShell>
  );
}
