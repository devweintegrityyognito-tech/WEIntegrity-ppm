import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app/AppShell";
import { currentUser } from "@/lib/mock-data";
import { User, Bell, Shield, Plug, CreditCard } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [{ title: "Settings — Yognito" }] }),
  component: SettingsPage,
});

const tabs = [
  { id: "profile", label: "Profile", icon: User },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security", label: "Security", icon: Shield },
  { id: "integrations", label: "Integrations", icon: Plug },
  { id: "billing", label: "Billing", icon: CreditCard },
];

function SettingsPage() {
  const [tab, setTab] = useState("profile");
  return (
    <AppShell>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your account, workspace and integrations.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[220px,1fr] gap-6">
        <nav className="space-y-0.5">
          {tabs.map((t) => {
            const Icon = t.icon;
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition ${active ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"}`}
              >
                <Icon className="h-4 w-4" /> {t.label}
              </button>
            );
          })}
        </nav>

        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl bg-card border border-border shadow-card p-6"
        >
          {tab === "profile" && (
            <>
              <h2 className="text-lg font-semibold tracking-tight">Profile</h2>
              <p className="text-sm text-muted-foreground mt-1">
                This information will be visible to your team.
              </p>
              <div className="mt-6 flex items-center gap-4">
                <img
                  src={currentUser.avatar}
                  className="h-16 w-16 rounded-full border border-border"
                />
                <div>
                  <button className="h-8 px-3 rounded-md bg-gradient-primary text-primary-foreground text-xs font-medium">
                    Upload new photo
                  </button>
                  <div className="text-[11px] text-muted-foreground mt-1.5">
                    PNG or JPG, max 2MB.
                  </div>
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4 mt-6">
                {[
                  ["Full name", currentUser.name],
                  ["Email", currentUser.email],
                  ["Title", currentUser.title],
                  ["Team", currentUser.team],
                ].map(([l, v]) => (
                  <div key={l}>
                    <label className="text-xs font-medium text-foreground/80">{l}</label>
                    <input
                      defaultValue={v}
                      className="mt-1.5 w-full h-9 px-3 rounded-lg border border-border bg-card text-sm outline-none focus:border-ring"
                    />
                  </div>
                ))}
              </div>
              <div className="mt-6 flex items-center justify-end gap-2 pt-4 border-t border-border">
                <button className="h-9 px-3.5 rounded-lg border border-border text-sm">
                  Cancel
                </button>
                <button className="h-9 px-3.5 rounded-lg bg-gradient-primary text-primary-foreground text-sm font-medium shadow-elegant">
                  Save changes
                </button>
              </div>
            </>
          )}

          {tab !== "profile" && (
            <div className="text-center py-16">
              <div className="h-12 w-12 rounded-xl bg-muted grid place-items-center mx-auto mb-3">
                {(() => {
                  const Icon = tabs.find((x) => x.id === tab)!.icon;
                  return <Icon className="h-5 w-5 text-muted-foreground" />;
                })()}
              </div>
              <h3 className="font-semibold">{tabs.find((x) => x.id === tab)!.label}</h3>
              <p className="text-sm text-muted-foreground mt-1 max-w-sm mx-auto">
                This section is configured by your workspace admin. Contact{" "}
                <span className="text-primary">support@yognito.com</span> to enable changes.
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </AppShell>
  );
}
