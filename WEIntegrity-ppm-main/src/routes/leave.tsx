import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app/AppShell";
import { StatCard } from "@/components/app/StatCard";
import { Badge } from "@/components/app/Badge";
import { users } from "@/lib/mock-data";
import { Plane, CalendarDays, CheckCircle2, Clock, Plus } from "lucide-react";

export const Route = createFileRoute("/leave")({
  head: () => ({ meta: [{ title: "Leave Management — Yognito" }] }),
  component: Leave,
});

const requests = [
  { id: "L-2041", emp: users[3], type: "Annual Leave", from: "Sep 24", to: "Sep 26", days: 3, status: "Pending" },
  { id: "L-2040", emp: users[4], type: "Sick Leave", from: "Sep 22", to: "Sep 22", days: 1, status: "Approved" },
  { id: "L-2039", emp: users[5], type: "Work from home", from: "Sep 21", to: "Sep 21", days: 1, status: "Approved" },
  { id: "L-2038", emp: users[2], type: "Annual Leave", from: "Oct 02", to: "Oct 06", days: 5, status: "Pending" },
  { id: "L-2037", emp: users[1], type: "Casual Leave", from: "Sep 18", to: "Sep 18", days: 1, status: "Rejected" },
];

function tone(s: string) { return s === "Approved" ? "success" : s === "Pending" ? "warning" : "danger"; }

function Leave() {
  return (
    <AppShell>
      <div className="flex items-end justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Leave Management</h1>
          <p className="text-sm text-muted-foreground mt-1">Requests, balances and approvals.</p>
        </div>
        <button className="h-9 px-3 rounded-lg bg-gradient-primary text-primary-foreground text-sm font-medium inline-flex items-center gap-1.5 shadow-elegant">
          <Plus className="h-4 w-4" /> New request
        </button>
      </div>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard label="My balance" value={14} suffix=" d" change={0} icon={Plane} tone="primary" />
        <StatCard label="Pending approvals" value={6} change={20} icon={Clock} tone="warning" />
        <StatCard label="Approved this month" value={23} change={4} icon={CheckCircle2} tone="success" />
        <StatCard label="Upcoming holidays" value={3} change={0} icon={CalendarDays} tone="info" />
      </div>

      <div className="mt-6 rounded-xl bg-card border border-border shadow-card overflow-hidden">
        <div className="px-5 py-4 border-b border-border font-semibold">Recent requests</div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/30 text-xs text-muted-foreground uppercase tracking-wider">
              <tr>
                <th className="text-left font-medium px-5 py-3">ID</th>
                <th className="text-left font-medium px-5 py-3">Employee</th>
                <th className="text-left font-medium px-5 py-3">Type</th>
                <th className="text-left font-medium px-5 py-3">Dates</th>
                <th className="text-left font-medium px-5 py-3">Days</th>
                <th className="text-left font-medium px-5 py-3">Status</th>
                <th className="text-right font-medium px-5 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((r) => (
                <tr key={r.id} className="border-t border-border hover:bg-muted/30 transition">
                  <td className="px-5 py-3 font-mono text-xs text-muted-foreground">{r.id}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2.5">
                      <img src={r.emp.avatar} className="h-7 w-7 rounded-full border border-border" alt="" />
                      <span className="font-medium">{r.emp.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3">{r.type}</td>
                  <td className="px-5 py-3 text-muted-foreground">{r.from} → {r.to}</td>
                  <td className="px-5 py-3 tabular-nums">{r.days}</td>
                  <td className="px-5 py-3"><Badge tone={tone(r.status)} dot>{r.status}</Badge></td>
                  <td className="px-5 py-3 text-right">
                    {r.status === "Pending" ? (
                      <div className="flex justify-end gap-1.5">
                        <button className="h-7 px-2.5 rounded-md text-xs font-medium bg-[oklch(0.95_0.04_155)] text-[oklch(0.4_0.14_155)] hover:opacity-90">Approve</button>
                        <button className="h-7 px-2.5 rounded-md text-xs font-medium bg-muted hover:bg-muted/70">Reject</button>
                      </div>
                    ) : <span className="text-xs text-muted-foreground">—</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppShell>
  );
}
