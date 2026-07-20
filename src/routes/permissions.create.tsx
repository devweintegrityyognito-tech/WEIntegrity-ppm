import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2, Plus, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { permissionsStore, type PermissionStatus } from "@/lib/permissions-store";

export const Route = createFileRoute("/permissions/create")({
  component: CreatePermissionPage,
});

function CreatePermissionPage() {
  const navigate = useNavigate();

  const [permissionName, setPermissionName] = useState("");
  const [permissionCode, setPermissionCode] = useState("");
  const [moduleName, setModuleName] = useState("");
  const [resourceName, setResourceName] = useState("");
  const [action, setAction] = useState("Read");
  const [description, setDescription] = useState("");

  const [status] = useState<PermissionStatus>("Active");
  const [systemPermission, setSystemPermission] = useState(false);

  const [submitting, setSubmitting] = useState(false);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();

    if (
      !permissionName.trim() ||
      !permissionCode.trim() ||
      !moduleName.trim() ||
      !resourceName.trim()
    ) {
      toast.error("Please fill all required fields.");
      return;
    }

    if (permissionName.length > 100) {
      toast.error("Permission Name cannot exceed 100 characters.");
      return;
    }

    if (permissionCode.length > 30) {
      toast.error("Permission Code cannot exceed 30 characters.");
      return;
    }

    if (moduleName.length > 100) {
      toast.error("Module Name cannot exceed 100 characters.");
      return;
    }

    if (resourceName.length > 100) {
      toast.error("Resource Name cannot exceed 100 characters.");
      return;
    }

    if (description.length > 500) {
      toast.error("Description cannot exceed 500 characters.");
      return;
    }

    setSubmitting(true);

    try {
      await permissionsStore.add({
        permissionName: permissionName.trim(),
        permissionCode: permissionCode.trim(),
        moduleName: moduleName.trim(),
        resourceName: resourceName.trim(),
        action,
        description: description.trim(),
        status,
        systemPermission,
        createdBy: "Admin User",
        createdDate: "",
        updatedBy: "Admin User",
        updatedDate: "",
      });

      toast.success("Permission created successfully");

      navigate({
        to: "/permissions",
      });
    } catch (err) {
      console.error(err);

      toast.error("Failed to create permission");
    } finally {
      setSubmitting(false);
    }
  }
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="max-w-4xl mx-auto"
    >
      <Link
        to="/permissions"
        className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mb-4"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to Permissions
      </Link>

      <form onSubmit={handleCreate} className="space-y-5">
        <div className="rounded-xl bg-card border border-border shadow-card overflow-hidden">
          <div className="flex items-center gap-3 px-6 py-4 border-b border-border bg-muted/20">
            <div className="h-9 w-9 rounded-lg bg-gradient-primary grid place-items-center">
              <Sparkles className="h-4 w-4 text-white" />
            </div>

            <div>
              <div className="font-semibold leading-tight">Create Permission</div>

              <div className="text-xs text-muted-foreground">Create a new permission</div>
            </div>
          </div>

          <div className="px-6 py-6 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Permission Name" required>
                <input
                  value={permissionName}
                  onChange={(e) => setPermissionName(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm outline-none focus:border-ring"
                />
              </Field>

              <Field label="Permission Code" required>
                <input
                  value={permissionCode}
                  onChange={(e) => setPermissionCode(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm outline-none focus:border-ring"
                />
              </Field>

              <Field label="Module Name" required>
                <input
                  value={moduleName}
                  onChange={(e) => setModuleName(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm outline-none focus:border-ring"
                />
              </Field>

              <Field label="Resource Name" required>
                <input
                  value={resourceName}
                  onChange={(e) => setResourceName(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm outline-none focus:border-ring"
                />
              </Field>

              <Field label="Action">
                <FormSelect
                  value={action}
                  onChange={setAction}
                  options={[
                    { value: "Create", label: "Create" },
                    { value: "Read", label: "Read" },
                    { value: "Update", label: "Update" },
                    { value: "Delete", label: "Delete" },
                  ]}
                />
              </Field>

              <Field label="Status">
                <div className="h-10 px-3 rounded-lg border border-border bg-muted/40 flex items-center text-sm">
                  {status}
                </div>
              </Field>

              <Field label="Description">
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm outline-none focus:border-ring resize-none"
                />
              </Field>

              <Field label="System Permission">
                <label className="flex items-center gap-2 h-10">
                  <input
                    type="checkbox"
                    checked={systemPermission}
                    onChange={(e) => setSystemPermission(e.target.checked)}
                  />

                  <span className="text-sm">Is System Permission</span>
                </label>
              </Field>
            </div>
          </div>

          <div className="px-6 py-4 border-t border-border bg-muted/20 flex justify-end gap-2">
            <Link
              to="/permissions"
              className="h-9 px-4 rounded-lg border border-border inline-flex items-center text-sm"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={submitting}
              className="h-9 px-4 rounded-lg bg-gradient-primary text-primary-foreground inline-flex items-center gap-2 text-sm"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  Create Permission
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </motion.div>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <div className="mb-1.5 text-xs font-medium">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </div>

      {children}
    </label>
  );
}

function FormSelect({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (value: string) => void;
  options: {
    value: string;
    label: string;
  }[];
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm outline-none focus:border-ring"
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
