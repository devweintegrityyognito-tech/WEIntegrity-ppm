import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Sparkles } from "lucide-react";
import { type Role } from "@/lib/roles-store";
import { toast } from "sonner";

export const Route = createFileRoute("/roles/$roleId")({
  component: RoleDetailsPage,
});

function RoleDetailsPage() {
  const { roleId } = Route.useParams();

  const [role, setRole] = useState<Role | null>(null);

  useEffect(() => {
    async function loadRole() {
      try {
        const res = await fetch(`https://weintegrity-ppm-main.onrender.com/api/roles/${roleId}`);

        const data = await res.json();

        setRole(data);
      } catch (err) {
        console.error(err);

        toast.error("Failed to load role");
      }
    }

    loadRole();
  }, [roleId]);

  if (!role) {
    return (
      <div className="rounded-xl bg-card border border-border p-8 text-center">Loading...</div>
    );
  }
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="max-w-4xl mx-auto"
    >
      <Link
        to="/roles"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Roles
      </Link>

      <div className="rounded-xl bg-card border border-border shadow-card overflow-hidden">
        <div className="flex items-center gap-3 px-6 py-4 border-b border-border bg-muted/20">
          <div className="h-9 w-9 rounded-lg bg-gradient-primary grid place-items-center">
            <Sparkles className="h-4 w-4 text-white" />
          </div>

          <div>
            <div className="font-semibold leading-tight">Role Details</div>

            <div className="text-xs text-muted-foreground">View role information</div>
          </div>
        </div>

        <div className="px-6 py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Field label="Role Name">
              <ReadOnly value={role.roleName} />
            </Field>

            <Field label="Role Code">
              <ReadOnly value={role.roleCode} />
            </Field>

            <Field label="Description">
              <ReadOnly value={role.description || "Not Available"} />
            </Field>

            <Field label="Role Type">
              <ReadOnly value={role.roleType} />
            </Field>

            <Field label="Status">
              <ReadOnly value={role.status} />
            </Field>

            <Field label="System Role">
              <ReadOnly value={role.systemRole ? "Yes" : "No"} />
            </Field>

            <Field label="Priority">
              <ReadOnly value={String(role.priority)} />
            </Field>

            <Field label="Created By">
              <ReadOnly value={role.createdBy || "Not Available"} />
            </Field>

            <Field label="Created Date">
              <ReadOnly
                value={
                  role.createdDate
                    ? new Date(role.createdDate).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })
                    : "Not Available"
                }
              />
            </Field>

            <Field label="Updated By">
              <ReadOnly value={role.updatedBy || "Not Available"} />
            </Field>

            <Field label="Updated Date">
              <ReadOnly
                value={
                  role.updatedDate
                    ? new Date(role.updatedDate).toLocaleString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "Not Available"
                }
              />
            </Field>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="mb-1.5 text-xs font-medium">{label}</div>

      {children}
    </label>
  );
}

function ReadOnly({ value }: { value: string }) {
  return (
    <input
      value={value}
      readOnly
      className="w-full h-10 px-3 rounded-lg border border-border bg-muted text-sm"
    />
  );
}
