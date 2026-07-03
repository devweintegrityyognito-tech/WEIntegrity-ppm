import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app/AppShell";
import { Badge } from "@/components/app/Badge";
import { users } from "@/lib/mock-data";
import { Search, Filter, Plus, MoreHorizontal, Mail, Phone } from "lucide-react";
import { motion } from "framer-motion";

export const Route = createFileRoute("/employees")({
  head: () => ({ meta: [{ title: "Employees — Yognito" }] }),
  component: Employees,
});

function Employees() {
  return (
    <AppShell>
      <div className="flex items-end justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Employees</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Workforce directory and lifecycle management.
          </p>
        </div>
        <button className="h-9 px-3 rounded-lg bg-gradient-primary text-primary-foreground text-sm font-medium inline-flex items-center gap-1.5 shadow-elegant">
          <Plus className="h-4 w-4" /> Add employee
        </button>
      </div>

      <div className="rounded-xl bg-card border border-border shadow-card overflow-hidden">
        <div className="px-4 py-3 border-b border-border flex items-center gap-2 flex-wrap">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              placeholder="Search by name, team, role…"
              className="w-full h-9 pl-9 pr-3 rounded-lg bg-muted/50 border border-transparent focus:border-ring focus:bg-card text-sm outline-none transition"
            />
          </div>
          <button className="h-9 px-3 rounded-lg border border-border text-sm inline-flex items-center gap-1.5 hover:bg-muted/50">
            <Filter className="h-3.5 w-3.5" /> Filter
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/30 text-xs text-muted-foreground uppercase tracking-wider">
              <tr>
                <th className="text-left font-medium px-5 py-3">Employee</th>
                <th className="text-left font-medium px-5 py-3">Title</th>
                <th className="text-left font-medium px-5 py-3">Team</th>
                <th className="text-left font-medium px-5 py-3">Role</th>
                <th className="text-left font-medium px-5 py-3">Status</th>
                <th className="text-left font-medium px-5 py-3">Contact</th>
                <th className="w-10"></th>
              </tr>
            </thead>
            <tbody>
              {users.map((u, i) => (
                <motion.tr
                  key={u.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="border-t border-border hover:bg-muted/30 transition"
                >
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={u.avatar}
                        className="h-8 w-8 rounded-full border border-border"
                        alt={u.name}
                      />
                      <div>
                        <div className="font-medium">{u.name}</div>
                        <div className="text-xs text-muted-foreground">{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-foreground/80">{u.title}</td>
                  <td className="px-5 py-3 text-foreground/80">{u.team}</td>
                  <td className="px-5 py-3">
                    <Badge tone="primary">{u.role}</Badge>
                  </td>
                  <td className="px-5 py-3">
                    <Badge
                      tone={
                        u.status === "online"
                          ? "success"
                          : u.status === "away"
                            ? "warning"
                            : "muted"
                      }
                      dot
                    >
                      {u.status}
                    </Badge>
                  </td>
                  <td className="px-5 py-3 text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Mail className="h-3.5 w-3.5" />
                      <Phone className="h-3.5 w-3.5" />
                    </div>
                  </td>
                  <td className="px-2 py-3 text-muted-foreground">
                    <MoreHorizontal className="h-4 w-4" />
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppShell>
  );
}
