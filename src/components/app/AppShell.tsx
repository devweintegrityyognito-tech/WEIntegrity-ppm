import { ReactNode, useEffect } from "react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { motion } from "framer-motion";
import { ChatbotWidget } from "./ChatbotWidget";
import { useWorkspace, isRouteAllowed } from "@/lib/workspace";
import { isPluginInstalled } from "@/lib/plugin-store";
import { useRouterState, useNavigate } from "@tanstack/react-router";

export function AppShell({ children }: { children: ReactNode }) {
  const { workspace, setWorkspace } = useWorkspace();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();

  useEffect(() => {
    // HR routes
    const hrRoutes = ["/hr", "/employees", "/attendance", "/leave", "/payroll", "/recruitment"];

    const accessingHRRoute = hrRoutes.some(
      (route) => pathname === route || pathname.startsWith(route + "/"),
    );

    // User trying to access HR but HR module isn't installed
    if (accessingHRRoute && !isPluginInstalled("hr")) {
      setWorkspace("ppm");

      navigate({
        to: "/dashboard",
        replace: true,
      });

      return;
    }

    // Existing workspace protection
    if (!isRouteAllowed(workspace, pathname)) {
      // If user enters HR routes manually and HR is installed,
      // automatically switch workspace to HR
      if (accessingHRRoute && isPluginInstalled("hr")) {
        setWorkspace("hr");

        navigate({
          to: pathname,
          replace: true,
        });

        return;
      }

      navigate({
        to: workspace === "hr" ? "/hr" : "/dashboard",
        replace: true,
      });
    }
  }, [workspace, pathname, navigate, setWorkspace]);
  return (
    <div className="min-h-screen flex bg-background">
      <Sidebar />
      <div className="flex-1 min-w-0 flex flex-col">
        <Topbar />
        <motion.main
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="flex-1 px-6 py-6 max-w-400 w-full mx-auto"
        >
          {children}
        </motion.main>
      </div>
      <ChatbotWidget />
    </div>
  );
}
