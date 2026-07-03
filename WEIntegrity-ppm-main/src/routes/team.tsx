import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app/AppShell";
import { Badge } from "@/components/app/Badge";
import { users } from "@/lib/mock-data";
import { Search, UserPlus, Mail, MoreHorizontal } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

export const Route = createFileRoute("/team")({
  head: () => ({ meta: [{ title: "Team — Yognito" }] }),
  component: TeamPage,
});

function TeamPage() {
  const [q, setQ] = useState("");
  const filtered = users.filter((u) => u.name.toLowerCase().includes(q.toLowerCase()) || u.title.toLowerCase().includes(q.toLowerCase()));

  return (
    <AppShell>
      <div className="flex items-end justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Team directory</h1>
          <p className="text-sm text-muted-foreground mt-1">{users.length} members across 8 teams</p>
        </div>
        <button className="h-9 px-3.5 rounded-lg bg-gradient-primary text-primary-foreground text-sm font-medium inline-flex items-center gap-1.5 shadow-elegant">
          <UserPlus className="h-4 w-4" /> Invite member
        </button>
      </div>

      <div className="relative max-w-sm mb-5">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name or title…" className="w-full h-9 pl-9 pr-3 rounded-lg bg-card border border-border text-sm outline-none focus:border-ring" />
      </div>

      <motion.div initial="h" animate="s" variants={{ s: { transition: { staggerChildren: 0.04 } } }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((u) => (
          <motion.div key={u.id} variants={{ h: { opacity: 0, y: 8 }, s: { opacity: 1, y: 0 } }}
            whileHover={{ y: -2 }}
            className="relative rounded-xl bg-card border border-border shadow-card p-5">
            <button className="absolute top-3 right-3 text-muted-foreground hover:text-foreground"><MoreHorizontal className="h-4 w-4" /></button>
            <div className="flex items-center gap-3">
              <div className="relative">
                <img src={u.avatar} className="h-14 w-14 rounded-full border border-border" />
                <span className={`absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-card ${u.status === "online" ? "bg-[oklch(0.68_0.16_155)]" : u.status === "away" ? "bg-[oklch(0.78_0.16_75)]" : "bg-muted-foreground/50"}`} />
              </div>
              <div className="min-w-0">
                <div className="font-semibold leading-tight truncate">{u.name}</div>
                <div className="text-xs text-muted-foreground mt-0.5 truncate">{u.title}</div>
                <div className="mt-1.5"><Badge tone={u.role === "Admin" ? "primary" : u.role === "Manager" ? "info" : "muted"}>{u.role}</Badge></div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-border flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Team · <span className="text-foreground font-medium">{u.team}</span></span>
              <a href={`mailto:${u.email}`} className="inline-flex items-center gap-1 text-primary hover:underline"><Mail className="h-3 w-3" /> Email</a>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </AppShell>
  );
}
