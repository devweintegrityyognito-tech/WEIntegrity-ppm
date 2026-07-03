import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app/AppShell";
import { Badge } from "@/components/app/Badge";
import { motion } from "framer-motion";
import { Plus, MapPin, Briefcase } from "lucide-react";

export const Route = createFileRoute("/recruitment")({
  head: () => ({ meta: [{ title: "Recruitment — Yognito" }] }),
  component: Recruitment,
});

const stages = [
  { key: "Applied", count: 47, tone: "muted" as const },
  { key: "Screening", count: 18, tone: "info" as const },
  { key: "Interview", count: 12, tone: "primary" as const },
  { key: "Offer", count: 4, tone: "warning" as const },
  { key: "Hired", count: 2, tone: "success" as const },
];

const candidates: Record<string, { name: string; role: string; loc: string; tag: string }[]> = {
  Applied: [
    { name: "Riya Anand", role: "Senior Frontend Engineer", loc: "Bengaluru", tag: "Remote OK" },
    { name: "Kabir Mehta", role: "Product Designer", loc: "Mumbai", tag: "5y exp" },
    { name: "Lara Costa", role: "Data Engineer", loc: "Lisbon", tag: "Remote" },
  ],
  Screening: [
    { name: "Noah Becker", role: "Engineering Manager", loc: "Berlin", tag: "8y exp" },
    { name: "Asha Rao", role: "Backend Engineer", loc: "Hyderabad", tag: "Go/Rust" },
  ],
  Interview: [
    { name: "Ivy Chen", role: "Staff Frontend Engineer", loc: "Singapore", tag: "Round 3" },
    { name: "Omar Haddad", role: "DevOps Lead", loc: "Dubai", tag: "Round 2" },
  ],
  Offer: [
    { name: "Maya Iyer", role: "Senior Product Manager", loc: "Bengaluru", tag: "Offer sent" },
  ],
  Hired: [
    { name: "Jonas Weber", role: "Solutions Architect", loc: "Munich", tag: "Joining Oct 1" },
  ],
};

const positions = [
  { title: "Senior Frontend Engineer", team: "Platform", loc: "Remote · IN", apps: 24 },
  { title: "Product Designer", team: "Growth", loc: "Mumbai", apps: 18 },
  { title: "Engineering Manager", team: "Platform", loc: "Bengaluru", apps: 11 },
  { title: "Data Engineer", team: "Data", loc: "Remote", apps: 9 },
];

function Recruitment() {
  return (
    <AppShell>
      <div className="flex items-end justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Recruitment</h1>
          <p className="text-sm text-muted-foreground mt-1">Hiring pipeline and open positions.</p>
        </div>
        <button className="h-9 px-3 rounded-lg bg-gradient-primary text-primary-foreground text-sm font-medium inline-flex items-center gap-1.5 shadow-elegant">
          <Plus className="h-4 w-4" /> Post a job
        </button>
      </div>

      {/* Pipeline */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
        {stages.map((s) => (
          <div key={s.key} className="rounded-xl bg-card border border-border shadow-card p-4">
            <div className="text-xs text-muted-foreground uppercase tracking-wider">{s.key}</div>
            <div className="mt-1 flex items-end justify-between">
              <div className="text-2xl font-semibold tabular-nums">{s.count}</div>
              <Badge tone={s.tone}>candidates</Badge>
            </div>
          </div>
        ))}
      </div>

      {/* Kanban-style pipeline */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-3 mb-6">
        {stages.map((s) => (
          <div key={s.key} className="rounded-xl bg-muted/30 border border-border p-3">
            <div className="flex items-center justify-between mb-3 px-1">
              <div className="text-xs font-semibold uppercase tracking-wider text-foreground/70">
                {s.key}
              </div>
              <span className="text-xs text-muted-foreground tabular-nums">{s.count}</span>
            </div>
            <div className="space-y-2">
              {(candidates[s.key] || []).map((c, i) => (
                <motion.div
                  key={c.name}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="rounded-lg bg-card border border-border p-3 shadow-sm hover:shadow-card hover:border-primary/40 transition cursor-pointer"
                >
                  <div className="text-sm font-medium truncate">{c.name}</div>
                  <div className="text-[11px] text-muted-foreground truncate mt-0.5">{c.role}</div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-[11px] text-muted-foreground inline-flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {c.loc}
                    </span>
                    <Badge tone="info">{c.tag}</Badge>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Open positions */}
      <div className="rounded-xl bg-card border border-border shadow-card overflow-hidden">
        <div className="px-5 py-4 border-b border-border flex items-center justify-between">
          <div className="font-semibold">Open positions</div>
          <Badge tone="primary">{positions.length} active</Badge>
        </div>
        <div className="divide-y divide-border">
          {positions.map((p) => (
            <div
              key={p.title}
              className="px-5 py-4 flex items-center gap-4 hover:bg-muted/30 transition"
            >
              <div className="h-9 w-9 rounded-lg bg-gradient-primary/10 text-primary grid place-items-center">
                <Briefcase className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold">{p.title}</div>
                <div className="text-xs text-muted-foreground">
                  {p.team} · {p.loc}
                </div>
              </div>
              <div className="text-xs text-muted-foreground tabular-nums">{p.apps} applicants</div>
              <button className="text-xs font-medium text-primary hover:underline">
                View pipeline
              </button>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
