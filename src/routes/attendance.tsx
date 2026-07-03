import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app/AppShell";
import { Badge } from "@/components/app/Badge";
import { Clock, LogIn, LogOut, Coffee, Plus } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

export const Route = createFileRoute("/attendance")({
  head: () => ({ meta: [{ title: "Attendance — Yognito" }] }),
  component: AttendancePage,
});

// Build a 5-week calendar grid for May 2026
function buildCalendar() {
  const year = 2026,
    month = 4; // May
  const first = new Date(year, month, 1);
  const startDay = first.getDay(); // 0=Sun
  const days: {
    date: number | null;
    status?: "present" | "leave" | "wfh" | "absent" | "weekend";
  }[] = [];
  for (let i = 0; i < startDay; i++) days.push({ date: null });
  for (let d = 1; d <= 31; d++) {
    const dow = new Date(year, month, d).getDay();
    let status: any = "present";
    if (dow === 0 || dow === 6) status = "weekend";
    else if ([6, 14].includes(d)) status = "wfh";
    else if ([12].includes(d)) status = "leave";
    else if ([22].includes(d)) status = "absent";
    if (d > 23) status = null; // future
    days.push({ date: d, status: status ?? undefined });
  }
  return days;
}

function AttendancePage() {
  const cal = buildCalendar();
  const [checkedIn, setCheckedIn] = useState(true);

  const statusColor: Record<string, string> = {
    present: "bg-[oklch(0.68_0.16_155)]",
    wfh: "bg-[oklch(0.65_0.14_230)]",
    leave: "bg-[oklch(0.78_0.16_75)]",
    absent: "bg-destructive",
    weekend: "bg-muted",
  };

  return (
    <AppShell>
      <div className="flex items-end justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Attendance</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Track check-ins, leaves and work hours for May 2026.
          </p>
        </div>
        <button className="h-9 px-3.5 rounded-lg border border-border bg-card text-sm font-medium inline-flex items-center gap-1.5 hover:bg-muted/50">
          <Plus className="h-4 w-4" /> Request leave
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl bg-gradient-hero text-white p-6 shadow-elegant relative overflow-hidden"
        >
          <div className="absolute -top-16 -right-16 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
          <div className="relative">
            <div className="text-xs text-white/70 uppercase tracking-wider">
              Today · Tue, May 19
            </div>
            <div className="mt-1 text-3xl font-semibold tabular-nums">9:14 AM</div>
            <div className="mt-1 text-sm text-white/80">Checked in at 9:02 AM · 4h 12m logged</div>

            <button
              onClick={() => setCheckedIn(!checkedIn)}
              className={`mt-5 w-full h-11 rounded-xl font-semibold text-sm inline-flex items-center justify-center gap-2 transition ${checkedIn ? "bg-white text-foreground hover:bg-white/90" : "bg-white text-primary hover:bg-white/90"}`}
            >
              {checkedIn ? (
                <>
                  <LogOut className="h-4 w-4" /> Check out
                </>
              ) : (
                <>
                  <LogIn className="h-4 w-4" /> Check in
                </>
              )}
            </button>

            <div className="mt-4 grid grid-cols-3 gap-2 text-center">
              {[
                { l: "Today", v: "4h 12m" },
                { l: "This week", v: "32h 40m" },
                { l: "This month", v: "138h" },
              ].map((s) => (
                <div
                  key={s.l}
                  className="rounded-lg bg-white/10 backdrop-blur border border-white/15 py-2"
                >
                  <div className="text-[10px] text-white/60 uppercase tracking-wider">{s.l}</div>
                  <div className="text-sm font-semibold mt-0.5">{s.v}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        <div className="xl:col-span-2 rounded-xl bg-card border border-border shadow-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-sm">May 2026</h3>
            <div className="flex items-center gap-3 text-[11px]">
              {[
                ["Present", "bg-[oklch(0.68_0.16_155)]"],
                ["WFH", "bg-[oklch(0.65_0.14_230)]"],
                ["Leave", "bg-[oklch(0.78_0.16_75)]"],
                ["Absent", "bg-destructive"],
              ].map(([l, c]) => (
                <span key={l} className="inline-flex items-center gap-1.5 text-muted-foreground">
                  <span className={`h-2 w-2 rounded-full ${c}`} /> {l}
                </span>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-7 gap-1.5 text-center text-[11px] text-muted-foreground mb-2">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
              <div key={d} className="font-medium">
                {d}
              </div>
            ))}
          </div>
          <motion.div
            initial="h"
            animate="s"
            variants={{ s: { transition: { staggerChildren: 0.012 } } }}
            className="grid grid-cols-7 gap-1.5"
          >
            {cal.map((cell, i) => (
              <motion.div
                key={i}
                variants={{ h: { opacity: 0, scale: 0.9 }, s: { opacity: 1, scale: 1 } }}
                className={`aspect-square rounded-lg border border-border p-1.5 flex flex-col items-start justify-between text-xs ${cell.date === 19 ? "ring-2 ring-primary" : ""} ${cell.date == null ? "opacity-0" : "bg-card hover:bg-muted/30 transition"}`}
              >
                <span className="font-medium">{cell.date}</span>
                {cell.status && (
                  <span className={`h-2 w-2 rounded-full ${statusColor[cell.status]}`} />
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      <div className="rounded-xl bg-card border border-border shadow-card mt-6 overflow-hidden">
        <div className="p-5 border-b border-border flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-sm">Recent activity</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Latest check-ins, breaks and leave events.
            </p>
          </div>
          <button className="text-xs text-primary font-medium hover:underline">View all</button>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-[11px] uppercase tracking-wider text-muted-foreground bg-muted/40">
              <th className="text-left font-medium px-5 py-2.5">Date</th>
              <th className="text-left font-medium py-2.5">Type</th>
              <th className="text-left font-medium py-2.5">Check-in</th>
              <th className="text-left font-medium py-2.5">Check-out</th>
              <th className="text-left font-medium py-2.5">Hours</th>
              <th className="text-left font-medium py-2.5 pr-5">Status</th>
            </tr>
          </thead>
          <tbody>
            {[
              {
                d: "May 19",
                t: "Office",
                in: "09:02",
                out: "—",
                h: "in progress",
                s: "Present",
                tone: "success" as const,
                Icon: LogIn,
              },
              {
                d: "May 18",
                t: "Office",
                in: "08:58",
                out: "18:21",
                h: "9h 23m",
                s: "Present",
                tone: "success" as const,
                Icon: Clock,
              },
              {
                d: "May 15",
                t: "Remote",
                in: "09:12",
                out: "17:50",
                h: "8h 38m",
                s: "WFH",
                tone: "info" as const,
                Icon: Coffee,
              },
              {
                d: "May 14",
                t: "Remote",
                in: "08:45",
                out: "18:10",
                h: "9h 25m",
                s: "WFH",
                tone: "info" as const,
                Icon: Coffee,
              },
              {
                d: "May 12",
                t: "Leave",
                in: "—",
                out: "—",
                h: "—",
                s: "PTO",
                tone: "warning" as const,
                Icon: LogOut,
              },
            ].map((r, i) => (
              <tr key={i} className="border-t border-border hover:bg-muted/30">
                <td className="px-5 py-3 text-sm font-medium">{r.d}</td>
                <td className="py-3 text-xs">
                  <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                    <r.Icon className="h-3.5 w-3.5" /> {r.t}
                  </span>
                </td>
                <td className="py-3 text-xs tabular-nums">{r.in}</td>
                <td className="py-3 text-xs tabular-nums">{r.out}</td>
                <td className="py-3 text-xs tabular-nums">{r.h}</td>
                <td className="py-3 pr-5">
                  <Badge tone={r.tone} dot>
                    {r.s}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppShell>
  );
}
