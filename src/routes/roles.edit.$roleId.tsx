import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2, Pencil, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { rolesStore, type RoleStatus } from "@/lib/roles-store";

export const Route = createFileRoute("/roles/edit/$roleId")({
  component: EditRolePage,
});

function EditRolePage() {
  const navigate = useNavigate();
  const { roleId } = Route.useParams();

  const [roleName, setRoleName] = useState("");
  const [roleCode, setRoleCode] = useState("");
  const [description, setDescription] = useState("");
  const [roleType, setRoleType] = useState("System");
  const [status, setStatus] = useState<RoleStatus>("Active");
  const [systemRole, setSystemRole] = useState(false);
  const [priority, setPriority] = useState(1);

  const [createdBy, setCreatedBy] = useState("");
  const [createdDate, setCreatedDate] = useState("");
  const [updatedBy] = useState("Admin User");

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function loadRole() {
      try {
        const res = await fetch(`https://weintegrity-ppm-main.onrender.com/api/roles/${roleId}`);

        const role = await res.json();

        setRoleName(role.roleName || "");
        setRoleCode(role.roleCode || "");
        setDescription(role.description || "");
        setRoleType(role.roleType || "System");
        setStatus(role.status || "Active");
        setSystemRole(role.systemRole || false);
        setPriority(role.priority || 1);
        setCreatedBy(role.createdBy || "");
        setCreatedDate(role.createdDate || "");
      } catch (err) {
        console.error(err);
        toast.error("Failed to load role");
      }
    }

    loadRole();
  }, [roleId]);

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();

    if (!roleName.trim() || !roleCode.trim()) {
      toast.error("Please fill all required fields.");
      return;
    }

    if (roleName.length > 100) {
      toast.error("Role Name cannot exceed 100 characters.");
      return;
    }

    if (roleCode.length > 30) {
      toast.error("Role Code cannot exceed 30 characters.");
      return;
    }

    if (description.length > 500) {
      toast.error("Description cannot exceed 500 characters.");
      return;
    }

    if (priority < 1) {
      toast.error("Priority must be greater than 0.");
      return;
    }

    setSubmitting(true);

    try {
      await rolesStore.update(roleId, {
        roleName: roleName.trim(),
        roleCode: roleCode.trim(),
        description: description.trim(),
        roleType,
        status,
        systemRole,
        priority,
        createdBy,
        createdDate,
        updatedBy,
        updatedDate: "",
      });

      toast.success("Role updated successfully");

      navigate({
        to: "/roles",
      });
    } catch (err) {
      console.error(err);
      toast.error("Failed to update role");
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
        to="/roles"
        className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mb-4"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to Roles
      </Link>

      <form onSubmit={handleUpdate} className="space-y-5">
        <div className="rounded-xl bg-card border border-border shadow-card overflow-hidden">
          <div className="flex items-center gap-3 px-6 py-4 border-b border-border bg-muted/20">
            <div className="h-9 w-9 rounded-lg bg-gradient-primary grid place-items-center">
              <Sparkles className="h-4 w-4 text-white" />
            </div>

            <div>
              <div className="font-semibold leading-tight">Update Role</div>

              <div className="text-xs text-muted-foreground">Update role information</div>
            </div>
          </div>

          <div className="px-6 py-6 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Role Name" required>
                <input
                  value={roleName}
                  onChange={(e) => setRoleName(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm outline-none focus:border-ring"
                />
              </Field>

              <Field label="Role Code" required>
                <input
                  value={roleCode}
                  onChange={(e) => setRoleCode(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm outline-none focus:border-ring"
                />
              </Field>

              <Field label="Description">
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm outline-none focus:border-ring resize-none"
                />
              </Field>

              <Field label="Role Type">
                <FormSelect
                  value={roleType}
                  onChange={setRoleType}
                  options={[
                    { value: "System", label: "System" },
                    { value: "Custom", label: "Custom" },
                  ]}
                />
              </Field>

              <Field label="Priority">
                <input
                  type="number"
                  min={1}
                  value={priority}
                  onChange={(e) => setPriority(Number(e.target.value))}
                  className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm outline-none focus:border-ring"
                />
              </Field>

              <Field label="Status">
                <div className="h-10 px-3 rounded-lg border border-border bg-muted/40 flex items-center text-sm">
                  {status}
                </div>
              </Field>

              <Field label="System Role">
                <label className="flex items-center gap-2 h-10">
                  <input
                    type="checkbox"
                    checked={systemRole}
                    onChange={(e) => setSystemRole(e.target.checked)}
                  />

                  <span className="text-sm">Is System Role</span>
                </label>
              </Field>
            </div>
          </div>

          <div className="px-6 py-4 border-t border-border bg-muted/20 flex justify-end gap-2">
            <Link
              to="/roles"
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
                  Updating...
                </>
              ) : (
                <>
                  <Pencil className="h-4 w-4" />
                  Update Role
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
