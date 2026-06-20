import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import {
  availablePlugins,
  installPlugin,
  uninstallPlugin,
  isPluginInstalled,
  getInstalledPlugins,
} from "@/lib/plugin-store";
import { useWorkspace } from "@/lib/workspace";

export const Route = createFileRoute("/plugins")({
  component: PluginsPage,
});
function PluginsPage() {
  const [, forceUpdate] = useState(0);
  const [selectedCategory, setSelectedCategory] =
  useState("All Modules");

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("Name");
  const navigate = useNavigate();

  const { setWorkspace } = useWorkspace();

  return (
    <div className="max-w-4xl mx-auto">
       <div className="flex items-center justify-between mb-2">
          <h1 className="text-3xl font-bold">
            Plugins
          </h1>

          <span className="text-sm text-muted-foreground">
            Yognito Marketplace
          </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">

        <div className="rounded-xl border border-border bg-card p-6 shadow-card">
          <div className="text-sm text-muted-foreground">
            Installed Modules
          </div>

          <div className="text-3xl font-bold mt-2">
            {getInstalledPlugins().length}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 shadow-card">
          <div className="text-sm text-muted-foreground">
            Available Modules
          </div>

          <div className="text-3xl font-bold mt-2">
            {availablePlugins.length}
          </div>
        </div>

      </div>

        <div className="space-y-6">
        <div className="mb-6 flex flex-wrap gap-4 items-end">
          <input
            type="text"
            placeholder="Search plugins..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 min-w-[350px] px-4 py-2 rounded-lg border border-border bg-background"
          />

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 rounded-lg border border-border bg-background"
          >
            <option>All Modules</option>
            <option>Core Business</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 rounded-lg border border-border bg-background"
          >
            <option>Name</option>
            <option>Installed</option>
            <option>Version</option>
          </select>
        </div>
   

     {availablePlugins
      .filter(
        (plugin) =>
          plugin.name
            .toLowerCase()
            .includes(search.toLowerCase())
      )
      .filter(
        (plugin) =>
          selectedCategory === "All Modules" ||
          plugin.category === selectedCategory
      )
      .sort((a, b) => {
        if (sortBy === "Installed") {
          return Number(isPluginInstalled(b.id))
            - Number(isPluginInstalled(a.id));
        }

        if (sortBy === "Version") {
          return b.version.localeCompare(a.version);
        }

        return a.name.localeCompare(b.name);
      })
      .map((plugin) => {
          const installed = isPluginInstalled(plugin.id);

          return (
            <div
              key={plugin.id}
              className="rounded-xl border border-border bg-card p-6 shadow-card"
            >
           <div className="flex items-center gap-3">
              <div className="text-3xl">
                {plugin.icon}
              </div>

              <div>
                <h2 className="text-xl font-semibold">
                  {plugin.name}
                </h2>

              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-muted-foreground">
                  v{plugin.version}
                </span>

                <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs">
                  Stable
                </span>
              </div>
              </div>
            </div>

            <div className="mt-4">
              <p className="text-sm text-muted-foreground">
                {plugin.description}
              </p>

              <div className="mt-2">
                <span className="px-3 py-1 rounded-full bg-muted text-xs">
                  {plugin.category}
                </span>
              </div>
            </div>

            <div className="mt-4">
              {installed ? (
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-medium">
                  ✓ Installed
                </span>
              ) : (
                <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-sm">
                  Not Installed
                </span>
              )}
            </div>
            
            {installed && (
              <div className="mt-5 p-4 rounded-lg bg-green-50 border border-green-200">
                <div className="text-green-700 font-medium">
                  ✓ {plugin.name} installed successfully.
                </div>

                <div className="text-sm text-muted-foreground mt-1">
                  Use the Scope Switcher (Grid icon beside Notifications)
                  to switch between available workspaces.
                </div>
                <hr className="my-5 border-border" />

                <div className="mt-4 flex gap-3 flex-wrap">
                  <button
                    className="px-5 py-2 rounded-lg bg-destructive text-destructive-foreground hover:opacity-90"
                    onClick={() => {
                      const confirmed = window.confirm(
                        "Are you sure you want to uninstall HR Module?"
                      );

                  if (confirmed) {
                    uninstallPlugin(plugin.id);

                    setWorkspace("ppm");

                    navigate({
                      to: "/dashboard",
                    });

                    toast.success("HR Module uninstalled successfully");

                    forceUpdate((v) => v + 1);
                  }
                    }}
                  >
                    Uninstall
                  </button>

                  <Link
                    to="/dashboard"
                    className="px-5 py-2 rounded-lg border border-border"
                  >
                    Home
                  </Link>

                    <button
                      className="px-5 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90"
                      onClick={() => {
                        setWorkspace("hr");
                        navigate({ to: "/hr" });
                      }}
                    >
                      Open HR Workspace
                    </button>
                </div>
              </div>
            )}

            {!installed && (
              <div className="mt-5 flex gap-3">
                <button
                  className="px-5 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90"
                  onClick={() => {
                    installPlugin(plugin.id);

                    toast.success("HR Module installed successfully");

                    forceUpdate((v) => v + 1);
                  }}
                >
                  Install
                </button>

                <Link
                  to="/dashboard"
                  className="px-5 py-2 rounded-lg border border-border hover:bg-muted transition"
                >
                  Home
                </Link>
              </div>
            )}
 
            </div>
          );
        })}
      </div>
    </div>
  );
}