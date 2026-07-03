import { Link, useRouterState } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  FolderKanban,
  Trello,
  Zap,
  Users,
  CalendarCheck,
  UserCog,
  BarChart3,
  Bell,
  Settings,
  LogOut,
  Sparkles,
  Plane,
  Wallet,
  UserPlus,
  BookOpen,
  Puzzle,
} from "lucide-react";
import { useWorkspace } from "@/lib/workspace";
const ppmNav = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/projects", label: "Projects", icon: FolderKanban },
  { to: "/stories/all", label: "Stories", icon: BookOpen },
  { to: "/board", label: "Board", icon: Trello },
  { to: "/sprints", label: "Sprints", icon: Zap },
  { to: "/team", label: "Team", icon: Users },
  { to: "/reports", label: "Reports", icon: BarChart3 },
  { to: "/notifications", label: "Notifications", icon: Bell },
];

const hrNav = [
  { to: "/hr", label: "HR Dashboard", icon: LayoutDashboard },
  { to: "/employees", label: "Employees", icon: UserCog },
  { to: "/attendance", label: "Attendance", icon: CalendarCheck },
  { to: "/leave", label: "Leave", icon: Plane },
  { to: "/payroll", label: "Payroll", icon: Wallet },
  { to: "/recruitment", label: "Recruitment", icon: UserPlus },
  { to: "/notifications", label: "Notifications", icon: Bell },
];

export function Sidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { workspace } = useWorkspace();
  const nav = workspace === "hr" ? hrNav : ppmNav;

  return (
    <aside className="hidden lg:flex w-64 flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border h-screen sticky top-0">
      <div className="px-5 py-5 flex items-center gap-2.5 border-b border-sidebar-border">
        <div className="h-9 w-9 rounded-lg bg-gradient-primary grid place-items-center shadow-glow">
          <Sparkles className="h-5 w-5 text-white" />
        </div>
        <div>
          <div className="text-sm font-semibold tracking-tight">Yognito</div>
          <div className="text-[11px] text-sidebar-foreground/60">
            {workspace === "hr" ? "HRMS Suite" : "PPM Platform"}
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto scrollbar-thin">
        <div className="px-2 text-[10px] font-semibold uppercase tracking-wider text-sidebar-foreground/40 mb-2">
          {workspace === "hr" ? "Human Resources" : "Workspace"}
        </div>
        {nav.map((item) => {
          const active = pathname === item.to || pathname.startsWith(item.to + "/");
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                active
                  ? "bg-sidebar-accent text-white"
                  : "text-sidebar-foreground/75 hover:bg-sidebar-accent/60 hover:text-white"
              }`}
            >
              {active && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r-full bg-gradient-primary"
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                />
              )}
              <Icon className="h-[18px] w-[18px] shrink-0" />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}

        <div className="px-2 text-[10px] font-semibold uppercase tracking-wider text-sidebar-foreground/40 mt-6 mb-2">
          Account
        </div>
        <Link
          to="/plugins"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-sidebar-foreground/75 hover:bg-sidebar-accent/60 hover:text-white"
        >
          <Puzzle className="h-[18px] w-[18px]" />
          <span className="font-medium">Plugins</span>
        </Link>
        <Link
          to="/settings"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-sidebar-foreground/75 hover:bg-sidebar-accent/60 hover:text-white"
        >
          <Settings className="h-[18px] w-[18px]" />
          <span className="font-medium">Settings</span>
        </Link>
        <Link
          to="/login"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-sidebar-foreground/75 hover:bg-sidebar-accent/60 hover:text-white"
        >
          <LogOut className="h-[18px] w-[18px]" />
          <span className="font-medium">Sign out</span>
        </Link>
      </nav>

      <div className="m-3 p-4 rounded-xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10">
        <div className="text-xs font-semibold text-white">Upgrade to Enterprise</div>
        <div className="text-[11px] text-sidebar-foreground/60 mt-1">
          SSO, audit logs & priority support.
        </div>
        <button className="mt-3 w-full text-xs font-medium bg-white text-sidebar py-1.5 rounded-md hover:bg-white/90 transition">
          Contact sales
        </button>
      </div>
    </aside>
  );
}
