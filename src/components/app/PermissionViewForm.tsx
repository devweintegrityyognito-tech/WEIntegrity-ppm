import { Sparkles } from "lucide-react";
import type { Permission } from "@/lib/permissions-store";

type PermissionViewFormProps = {
  permission: Permission;
};

export default function PermissionViewForm({ permission }: PermissionViewFormProps) {
  return (
    <div className="rounded-xl bg-card border border-border shadow-card overflow-hidden">
      <div className="flex items-center gap-3 px-6 py-5 border-b border-border bg-muted/20">
        <div className="h-9 w-9 rounded-lg bg-gradient-primary grid place-items-center">
          <Sparkles className="h-4 w-4 text-white" />
        </div>

        <div>
          <h2 className="text-xl font-semibold">Permission Details</h2>
          <p className="text-sm text-muted-foreground">View permission information</p>
        </div>
      </div>

      <div className="px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Permission Name" value={permission.permissionName} />

          <Field label="Permission Code" value={permission.permissionCode} />

          <Field label="Module Name" value={permission.moduleName} />

          <Field label="Resource Name" value={permission.resourceName} />

          <Field label="Action" value={permission.action} />

          <Field label="Status" value={permission.status} />

          <Field label="System Permission" value={permission.systemPermission ? "Yes" : "No"} />

          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">Description</label>

            <textarea
              value={permission.description || ""}
              readOnly
              rows={3}
              className="w-full px-3 py-2 rounded-lg border border-border bg-muted text-sm resize-none"
            />
          </div>

          <Field label="Created By" value={permission.createdBy} />

          <Field label="Created Date" value={permission.createdDate} />

          <Field label="Updated By" value={permission.updatedBy} />

          <Field label="Updated Date" value={permission.updatedDate} />
        </div>
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value?: string | number }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-2">{label}</label>

      <input
        value={value ?? ""}
        readOnly
        className="w-full h-10 px-3 rounded-lg border border-border bg-muted text-sm"
      />
    </div>
  );
}
