export interface Plugin {
  id: string;
  name: string;
  description: string;
  version: string;
  icon: string;
  category: string;
  enabledByDefault?: boolean;
}

export const availablePlugins: Plugin[] = [
  {
    id: "hr",
    name: "HR Module",
    version: "1.0.0",
    description: "Human Resource Management",
    icon: "👥",
    category: "Core Business",
    enabledByDefault: false,
  },
];

export function getInstalledPlugins(): string[] {
  if (typeof window === "undefined") {
    return [];
  }

  const plugins = window.localStorage.getItem("installedPlugins");

  if (!plugins) {
    return [];
  }

  const parsed = JSON.parse(plugins);

  // Remove duplicates automatically
  return [...new Set(parsed)];
}

export function installPlugin(pluginId: string) {
  if (typeof window === "undefined") return;

  const installed = getInstalledPlugins();

  if (!installed.includes(pluginId)) {
    installed.push(pluginId);

    window.localStorage.setItem("installedPlugins", JSON.stringify(installed));
  }
}

export function uninstallPlugin(pluginId: string) {
  const installed = getInstalledPlugins();

  const updated = installed.filter((id) => id !== pluginId);

  window.localStorage.setItem("installedPlugins", JSON.stringify(updated));
}

export function isPluginInstalled(pluginId: string) {
  return getInstalledPlugins().includes(pluginId);
}
