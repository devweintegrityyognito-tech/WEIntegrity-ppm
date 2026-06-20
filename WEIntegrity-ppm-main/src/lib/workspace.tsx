import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { isPluginInstalled } from "@/lib/plugin-store";
export type Workspace = "ppm" | "hr";

type Ctx = {
  workspace: Workspace;
  setWorkspace: (w: Workspace) => void;
};

const WorkspaceContext = createContext<Ctx>({ workspace: "ppm", setWorkspace: () => {} });

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const [workspace, setWorkspaceState] = useState<Workspace>("ppm");

useEffect(() => {
  if (typeof window === "undefined") return;

  const saved = window.localStorage.getItem(
    "yognito.workspace"
  ) as Workspace | null;

  if (saved === "hr") {
    if (isPluginInstalled("hr")) {
      setWorkspaceState("hr");
    } else {
      setWorkspaceState("ppm");

      window.localStorage.setItem(
        "yognito.workspace",
        "ppm"
      );
    }
  }

  if (saved === "ppm") {
    setWorkspaceState("ppm");
  }
}, []);
  const setWorkspace = (w: Workspace) => {
    setWorkspaceState(w);
    if (typeof window !== "undefined") window.localStorage.setItem("yognito.workspace", w);
  };

  return <WorkspaceContext.Provider value={{ workspace, setWorkspace }}>{children}</WorkspaceContext.Provider>;
}

export const useWorkspace = () => useContext(WorkspaceContext);

// Allowed top-level route prefixes per workspace
export const PPM_ROUTES = ["/dashboard", "/projects", "/stories", "/board", "/sprints", "/team", "/reports", "/plugins"];
export const HR_ROUTES = ["/hr", "/employees", "/leave", "/payroll", "/recruitment"];
export const SHARED_ROUTES = [
  "/",
  "/login",

  "/notifications",
  "/plugins",
  "/settings",

  "/attendance",
];

export function isRouteAllowed(workspace: Workspace, pathname: string): boolean {
  if (SHARED_ROUTES.some((r) => pathname === r || pathname.startsWith(r + "/"))) return true;
  const allowed = workspace === "hr" ? HR_ROUTES : PPM_ROUTES;
  return allowed.some((r) => pathname === r || pathname.startsWith(r + "/"));
}
