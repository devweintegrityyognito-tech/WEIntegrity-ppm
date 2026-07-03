import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app/AppShell";
import { StatCard } from "@/components/app/StatCard";
import { Badge } from "@/components/app/Badge";
import { users } from "@/lib/mock-data";
import { Wallet, TrendingUp, Receipt, Download } from "lucide-react";
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

export const Route = createFileRoute("/payroll")({
  head: () => ({ meta: [{ title: "Payroll — Yognito" }] }),
  component: Payroll,
});

const cycle = [
  { m: "Apr", v: 41.2 },
  { m: "May", v: 42.6 },
  { m: "Jun", v: 43.8 },
  { m: "Jul", v: 44.5 },
  { m: "Aug", v: 45.9 },
  { m: "Sep", v: 47.3 },
];

function Payroll() {
  return (
    <AppShell>
      <div className="flex items-end justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Payroll</h1>
          <p className="text-sm text-muted-foreground mt-1">September 2026 cycle · closes Sep 28</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="h-9 px-3 rounded-lg border border-border text-sm inline-flex items-center gap-1.5 hover:bg-muted/50">
            <Download className="h-3.5 w-3.5" /> Export
          </button>
          <button className="h-9 px-3 rounded-lg bg-gradient-primary text-primary-foreground text-sm font-medium shadow-elegant">
            Run payroll
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          label="Gross payout (Sep)"
          value={47.3}
          prefix="₹"
          suffix="L"
          change={3.1}
          icon={Wallet}
          tone="primary"
        />
        <StatCard
          label="Net payable"
          value={39.6}
          prefix="₹"
          suffix="L"
          change={2.8}
          icon={Receipt}
          tone="info"
        />
        <StatCard
          label="Pending approvals"
          value={3}
          change={-25}
          icon={TrendingUp}
          tone="warning"
        />
        <StatCard
          label="Headcount in scope"
          value={124}
          change={1.6}
          icon={Wallet}
          tone="success"
        />
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 rounded-xl bg-card border border-border shadow-card p-5">
          <div className="font-semibold">Monthly payout trend</div>
          <div className="text-xs text-muted-foreground mb-3">Trailing 6 months (₹ Lakhs)</div>
          <div className="h-64">
            <ResponsiveContainer>
              <AreaChart data={cycle}>
                <defs>
                  <linearGradient id="py" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.55 0.18 265)" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="oklch(0.55 0.18 265)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="m" tickLine={false} axisLine={false} fontSize={11} />
                <YAxis tickLine={false} axisLine={false} fontSize={11} />
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
                  fill="url(#py)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl bg-card border border-border shadow-card p-5">
          <div className="font-semibold mb-3">Breakdown</div>
          {[
            { l: "Base salaries", v: "₹ 36.2 L", pct: 76 },
            { l: "Bonuses & incentives", v: "₹ 4.8 L", pct: 10 },
            { l: "Reimbursements", v: "₹ 2.1 L", pct: 4 },
            { l: "Statutory contributions", v: "₹ 4.2 L", pct: 10 },
          ].map((b) => (
            <div key={b.l} className="mb-3 last:mb-0">
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-foreground/80">{b.l}</span>
                <span className="font-semibold tabular-nums">{b.v}</span>
              </div>
              <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                <div className="h-full bg-gradient-primary" style={{ width: `${b.pct}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 rounded-xl bg-card border border-border shadow-card overflow-hidden">
        <div className="px-5 py-4 border-b border-border font-semibold">Recent payslips</div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/30 text-xs text-muted-foreground uppercase tracking-wider">
              <tr>
                <th className="text-left font-medium px-5 py-3">Employee</th>
                <th className="text-left font-medium px-5 py-3">Cycle</th>
                <th className="text-left font-medium px-5 py-3">Gross</th>
                <th className="text-left font-medium px-5 py-3">Net</th>
                <th className="text-left font-medium px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {users.slice(0, 6).map((u, i) => (
                <tr key={u.id} className="border-t border-border hover:bg-muted/30 transition">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={u.avatar}
                        className="h-7 w-7 rounded-full border border-border"
                        alt=""
                      />
                      <span className="font-medium">{u.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-muted-foreground">Sep 2026</td>
                  <td className="px-5 py-3 tabular-nums">
                    ₹ {(85000 + i * 6500).toLocaleString()}
                  </td>
                  <td className="px-5 py-3 tabular-nums">
                    ₹ {(72000 + i * 5400).toLocaleString()}
                  </td>
                  <td className="px-5 py-3">
                    <Badge tone={i < 4 ? "success" : "warning"} dot>
                      {i < 4 ? "Processed" : "Pending"}
                    </Badge>
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
