import { useRouterState, Link, useNavigate } from "@tanstack/react-router";
import { Search, Bell, Plus, HelpCircle, ChevronRight, Grid3X3 } from "lucide-react";
import { currentUser, notifications } from "@/lib/mock-data";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useWorkspace } from "@/lib/workspace";
import { isPluginInstalled } from "@/lib/plugin-store";

function useBreadcrumbs() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const parts = pathname.split("/").filter(Boolean);
  const routeLabels: Record<string, string> = {
    dashboard: "Dashboard",
    team: "Groups",
    stories: "Stories",
    projects: "Projects",
    sprints: "Sprints",
    board: "Board",
    reports: "Reports",
    notifications: "Notifications",
    settings: "Settings",
    defects: "Defects",
    employees: "Employees",
  };
  return (parts.length ? parts : ["dashboard"]).map(
    (part) => routeLabels[part] ?? part.replace(/-/g, " "),
  );
}

export function Topbar() {
  const crumbs = useBreadcrumbs();

  const { workspace, setWorkspace } = useWorkspace();

  const navigate = useNavigate();

  const [openNotif, setOpenNotif] = useState(false);

  const [openScope, setOpenScope] = useState(false);

  const hrInstalled = typeof window !== "undefined" ? isPluginInstalled("hr") : false;

  const unread = notifications.filter((n) => n.unread).length;
  return (
    <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="flex items-center gap-4 px-6 h-14">
        <nav className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Link to="/dashboard" className="hover:text-foreground transition">
            Home
          </Link>
          {crumbs.map((c, i) => {
            const path =
              c === "Stories"
                ? "/stories/all"
                : c === "Groups"
                  ? "/team"
                  : "/" +
                    crumbs
                      .slice(0, i + 1)
                      .map((x) => x.toLowerCase())
                      .join("/");

            return (
              <span key={i} className="flex items-center gap-1.5">
                <ChevronRight className="h-3.5 w-3.5 opacity-50" />

                {i === crumbs.length - 1 ? (
                  <span className="text-foreground font-medium capitalize">{c}</span>
                ) : (
                  <Link to={path} className="capitalize hover:text-foreground transition">
                    {c}
                  </Link>
                )}
              </span>
            );
          })}
        </nav>

        <div className="flex-1 max-w-md ml-auto relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            placeholder="Search projects, tasks, people…"
            className="w-full h-9 pl-9 pr-12 rounded-lg bg-muted/50 border border-transparent focus:border-ring focus:bg-card text-sm outline-none transition"
          />
          <kbd className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-mono px-1.5 py-0.5 rounded bg-background border border-border text-muted-foreground">
            ⌘K
          </kbd>
        </div>

        <div className="flex items-center gap-1.5">
          <button className="h-9 w-9 grid place-items-center rounded-lg hover:bg-muted text-muted-foreground">
            <HelpCircle className="h-4 w-4" />
          </button>
          <div className="relative">
            <button
              onClick={() => setOpenNotif((v) => !v)}
              className="relative h-9 w-9 grid place-items-center rounded-lg hover:bg-muted text-muted-foreground"
            >
              <Bell className="h-4 w-4" />
              {unread > 0 && (
                <span className="absolute top-1.5 right-1.5 h-4 min-w-4 px-1 rounded-full bg-destructive text-[10px] font-semibold text-destructive-foreground grid place-items-center">
                  {unread}
                </span>
              )}
            </button>
            <AnimatePresence>
              {openNotif && (
                <motion.div
                  initial={{ opacity: 0, y: -6, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.98 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-96 rounded-xl bg-popover border border-border shadow-card overflow-hidden z-50"
                >
                  <div className="px-4 py-3 flex items-center justify-between border-b border-border">
                    <div className="font-semibold text-sm">Notifications</div>
                    <button className="text-xs text-primary hover:underline">Mark all read</button>
                  </div>
                  <div className="max-h-96 overflow-y-auto scrollbar-thin">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        className="px-4 py-3 flex gap-3 hover:bg-muted/50 transition border-b border-border last:border-0"
                      >
                        <div
                          className={`h-2 w-2 rounded-full mt-2 shrink-0 ${n.unread ? "bg-primary" : "bg-muted-foreground/30"}`}
                        />
                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-medium truncate">{n.title}</div>
                          <div className="text-xs text-muted-foreground truncate">{n.desc}</div>
                          <div className="text-[11px] text-muted-foreground/70 mt-0.5">
                            {n.time}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div className="relative">
            <button
              onClick={() => setOpenScope((v) => !v)}
              className="h-9 w-9 grid place-items-center rounded-lg hover:bg-muted text-muted-foreground"
            >
              <Grid3X3 className="h-4 w-4" />
            </button>

            <AnimatePresence>
              {openScope && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="absolute right-0 mt-2 w-48 rounded-xl bg-popover border border-border shadow-card overflow-hidden z-50"
                >
                  <button
                    onClick={() => {
                      setWorkspace("ppm");
                      setOpenScope(false);

                      navigate({
                        to: "/dashboard",
                      });
                    }}
                    className={`w-full px-4 py-3 text-left hover:bg-muted text-sm ${
                      workspace === "ppm" ? "bg-muted" : ""
                    }`}
                  >
                    PPM
                  </button>

                  {hrInstalled && (
                    <button
                      onClick={() => {
                        setWorkspace("hr");
                        setOpenScope(false);

                        navigate({
                          to: "/hr",
                        });
                      }}
                      className={`w-full px-4 py-3 text-left hover:bg-muted text-sm ${
                        workspace === "hr" ? "bg-muted" : ""
                      }`}
                    >
                      HR
                    </button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div className="ml-2 flex items-center gap-2.5 pl-2 border-l border-border">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="h-8 w-8 rounded-full border border-border"
            />
            <div className="hidden md:block">
              <div className="text-xs font-semibold leading-tight">{currentUser.name}</div>
              <div className="text-[10px] text-muted-foreground leading-tight">
                {currentUser.role}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
