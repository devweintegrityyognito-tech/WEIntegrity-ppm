import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app/AppShell";
import { Badge, statusTone } from "@/components/app/Badge";
import { burndownData, tasks, userById } from "@/lib/mock-data";
import { useSprints, sprintsStore, SPRINT_STATUSES, type SprintStatus } from "@/lib/sprints-store";
import { ModalSlideOver } from "@/routes/stories.$storyId";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
} from "recharts";
import { Calendar, Target, Zap, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

export const Route = createFileRoute("/sprints")({
  head: () => ({ meta: [{ title: "Sprints — Yognito" }] }),
  component: SprintsPage,
});

function SprintsPage() {
  const sprints = useSprints();
  const [open, setOpen] = useState(false);
  const active = sprints.find((s) => s.status === "Active") ?? sprints[0];
  const activeTasks = active ? tasks.filter((t) => t.sprintId === active.id) : [];
  const done = activeTasks.filter((t) => t.status === "Done").length;
  const totalPts = activeTasks.reduce((s, t) => s + t.storyPoints, 0);
  const donePts = activeTasks
    .filter((t) => t.status === "Done")
    .reduce((s, t) => s + t.storyPoints, 0);

  return (
    <AppShell>
      <div className="flex items-end justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Sprint planning</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Track sprint goals, capacity and burndown in real time.
          </p>
        </div>
        <button
          onClick={() => setOpen(true)}
          className="h-9 px-3.5 rounded-lg bg-gradient-primary text-primary-foreground text-sm font-medium shadow-elegant"
        >
          Plan new sprint
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl bg-gradient-hero text-white p-6 shadow-elegant overflow-hidden relative"
      >
        <div className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="relative flex flex-wrap items-start justify-between gap-6">
          <div className="max-w-xl">
            <div className="flex items-center gap-2 text-xs text-white/70 uppercase tracking-wider">
              <Zap className="h-3.5 w-3.5" /> Active sprint
            </div>
            <h2 className="text-2xl font-semibold mt-1.5">{active?.sprintName}</h2>
            <p className="mt-2 text-white/80 text-sm">{active?.sprintGoal}</p>
            <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-xs">
              <span className="inline-flex items-center gap-1.5 text-white/80">
                <Calendar className="h-3.5 w-3.5" />{" "}
                {new Date(active.startDate).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}{" "}
                →{" "}
                {new Date(active.endDate).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </span>
              <span className="inline-flex items-center gap-1.5 text-white/80">
                <Target className="h-3.5 w-3.5" /> Capacity {active.capacity} pts
              </span>
              <span className="inline-flex items-center gap-1.5 text-white/80">
                <CheckCircle2 className="h-3.5 w-3.5" /> {done} / {activeTasks.length} issues done
              </span>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3 min-w-70">
            {[
              { l: "Velocity", v: `${donePts} pts` },
              { l: "Remaining", v: `${totalPts - donePts} pts` },
              { l: "Days left", v: "4" },
            ].map((s) => (
              <div
                key={s.l}
                className="rounded-xl bg-white/10 backdrop-blur border border-white/15 p-3"
              >
                <div className="text-[11px] text-white/60 uppercase tracking-wider">{s.l}</div>
                <div className="text-xl font-semibold mt-1">{s.v}</div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 mt-6">
        <div className="xl:col-span-2 rounded-xl bg-card border border-border shadow-card p-5">
          <h3 className="font-semibold text-sm">Sprint burndown</h3>
          <p className="text-xs text-muted-foreground mt-0.5 mb-3">
            Ideal vs actual remaining work over the sprint timeline.
          </p>
          <div className="h-72">
            <ResponsiveContainer>
              <AreaChart data={burndownData} margin={{ top: 6, right: 8, left: -16, bottom: 0 }}>
                <defs>
                  <linearGradient id="bd" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.52 0.22 264)" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="oklch(0.52 0.22 264)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="oklch(0.92 0.012 255)"
                  vertical={false}
                />
                <XAxis
                  dataKey="day"
                  tick={{ fontSize: 11, fill: "oklch(0.52 0.03 260)" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "oklch(0.52 0.03 260)" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: 10,
                    border: "1px solid oklch(0.92 0.012 255)",
                    fontSize: 12,
                  }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
                <Area
                  type="monotone"
                  dataKey="actual"
                  name="Actual remaining"
                  stroke="oklch(0.52 0.22 264)"
                  fill="url(#bd)"
                  strokeWidth={2.5}
                />
                <Line
                  type="monotone"
                  dataKey="ideal"
                  name="Ideal"
                  stroke="oklch(0.7 0.03 260)"
                  strokeDasharray="4 4"
                  strokeWidth={2}
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl bg-card border border-border shadow-card p-5">
          <h3 className="font-semibold text-sm mb-3">Sprint history</h3>
          <div className="space-y-3">
            {sprints.map((s) => (
              <div
                key={s.id}
                className="p-3 rounded-lg border border-border hover:bg-muted/30 transition"
              >
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium">{s.sprintName}</div>
                  <Badge tone={statusTone(s.status)} dot>
                    {s.status}
                  </Badge>
                </div>
                <div className="mt-1 text-xs text-muted-foreground">{s.sprintGoal}</div>
                <div className="mt-2.5 flex items-center justify-between text-[11px]">
                  <span className="text-muted-foreground">
                    {new Date(s.startDate).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}{" "}
                    –{" "}
                    {new Date(s.endDate).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                  <span className="font-semibold tabular-nums">
                    {s.velocity}/{s.capacity} pts
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <ModalSlideOver open={open} onClose={() => setOpen(false)} title="Plan new sprint">
        <CreateSprintForm onDone={() => setOpen(false)} />
      </ModalSlideOver>
    </AppShell>
  );
}

function CreateSprintForm({ onDone }: { onDone: () => void }) {
  const [sprintName, setName] = useState("");
  const [sprintGoal, setGoal] = useState("");
  const today = new Date().toISOString().slice(0, 10);
  const [startDate, setStart] = useState(today);
  const [endDate, setEnd] = useState(today);
  const [status, setStatus] = useState<SprintStatus>("Planned");
  const [capacity, setCapacity] = useState(40);

  const inputCls =
    "w-full h-9 px-3 rounded-lg bg-background border border-border text-sm outline-none focus:border-ring transition";

  return (
    <form
      className="space-y-3.5"
      onSubmit={(e) => {
        e.preventDefault();
        if (!sprintName.trim()) return;
        sprintsStore.add({
          sprintName: sprintName.trim(),
          sprintGoal,
          startDate: new Date(startDate).toISOString(),
          endDate: new Date(endDate).toISOString(),
          status,
          capacity: Number(capacity) || 0,
        });
        onDone();
      }}
    >
      <label className="block">
        <div className="text-[11px] uppercase tracking-wider text-muted-foreground mb-1">
          Sprint name *
        </div>
        <input
          value={sprintName}
          onChange={(e) => setName(e.target.value)}
          required
          className={inputCls}
        />
      </label>
      <label className="block">
        <div className="text-[11px] uppercase tracking-wider text-muted-foreground mb-1">Goal</div>
        <textarea
          value={sprintGoal}
          onChange={(e) => setGoal(e.target.value)}
          rows={2}
          className={inputCls}
        />
      </label>
      <div className="grid grid-cols-2 gap-3">
        <label className="block">
          <div className="text-[11px] uppercase tracking-wider text-muted-foreground mb-1">
            Start
          </div>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStart(e.target.value)}
            className={inputCls}
          />
        </label>
        <label className="block">
          <div className="text-[11px] uppercase tracking-wider text-muted-foreground mb-1">End</div>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEnd(e.target.value)}
            className={inputCls}
          />
        </label>
        <label className="block">
          <div className="text-[11px] uppercase tracking-wider text-muted-foreground mb-1">
            Status
          </div>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as SprintStatus)}
            className={inputCls}
          >
            {SPRINT_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <div className="text-[11px] uppercase tracking-wider text-muted-foreground mb-1">
            Capacity (pts)
          </div>
          <input
            type="number"
            min={0}
            value={capacity}
            onChange={(e) => setCapacity(Number(e.target.value))}
            className={inputCls}
          />
        </label>
      </div>
      <div className="pt-2 flex justify-end">
        <button
          type="submit"
          className="h-9 px-4 rounded-lg bg-gradient-primary text-primary-foreground text-sm font-medium shadow-elegant"
        >
          Create sprint
        </button>
      </div>
    </form>
  );
}
