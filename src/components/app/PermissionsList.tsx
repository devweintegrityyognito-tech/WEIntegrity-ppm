import { Pencil, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Badge } from "@/components/app/Badge";
import { Permission, permissionsStore } from "@/lib/permissions-store";
import { toast } from "sonner";

interface PermissionsListProps {
  permissions: Permission[];
}

export function PermissionsList({ permissions }: PermissionsListProps) {
  const PAGE_SIZE = 8;

  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(permissions.length / PAGE_SIZE));

  const safePage = Math.min(page, totalPages);

  const pagedPermissions = permissions.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  return (
    <div className="rounded-xl bg-card border border-border shadow-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-[11px] uppercase tracking-wider text-muted-foreground bg-muted/40">
              <th className="px-5 py-3 text-left font-medium">Permission Name</th>

              <th className="px-5 py-3 text-left font-medium">Permission Code</th>

              <th className="px-5 py-3 text-left font-medium">Module</th>

              <th className="px-5 py-3 text-left font-medium">Action</th>

              <th className="px-5 py-3 text-left font-medium">Status</th>

              <th className="w-16 px-4 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>

          <tbody>
            {pagedPermissions.map((permission) => (
              <tr
                key={permission.id}
                className="group border-t border-border hover:bg-muted/30 transition-colors cursor-pointer"
              >
                <td className="px-5 py-4">
                  <Link
                    to="/permissions/$permissionId"
                    params={{ permissionId: permission.id }}
                    className="block"
                  >
                    <div className="font-medium hover:text-primary">
                      {permission.permissionName}
                    </div>

                    <div className="text-xs text-muted-foreground">
                      {permission.description || "-"}
                    </div>
                  </Link>
                </td>

                <td className="px-5 py-4">{permission.permissionCode}</td>

                <td className="px-5 py-4">{permission.moduleName}</td>

                <td className="px-5 py-4">{permission.action}</td>

                <td className="px-5 py-4">
                  <Badge tone={permission.status === "Active" ? "success" : "muted"}>
                    {permission.status}
                  </Badge>
                </td>

                <td className="px-4 py-4">
                  <div className="flex items-center justify-end gap-1">
                    <Link
                      to="/permissions/edit/$permissionId"
                      params={{ permissionId: permission.id }}
                      onClick={(e) => e.stopPropagation()}
                      title="Edit"
                      className="h-7 w-7 grid place-items-center rounded-md hover:bg-muted"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Link>

                    <button
                      onClick={async (e) => {
                        e.stopPropagation();

                        try {
                          await permissionsStore.remove(permission.id);

                          toast.success("Permission deleted successfully");
                        } catch (error) {
                          console.error(error);

                          toast.error("Failed to delete permission");
                        }
                      }}
                      title="Delete"
                      className="h-7 w-7 grid place-items-center rounded-md hover:bg-muted"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between px-5 py-3 border-t border-border bg-muted/20">
        <div className="text-xs text-muted-foreground">
          Showing <span className="font-medium text-foreground">{pagedPermissions.length}</span> of{" "}
          <span className="font-medium text-foreground">{permissions.length}</span>
        </div>

        <div className="flex items-center gap-1">
          <button
            disabled={safePage === 1}
            onClick={() => setPage(safePage - 1)}
            className="h-8 w-8 grid place-items-center rounded-md border border-border disabled:opacity-40 hover:bg-muted"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <div className="text-xs px-3 tabular-nums">
            Page {safePage} / {totalPages}
          </div>

          <button
            disabled={safePage === totalPages}
            onClick={() => setPage(safePage + 1)}
            className="h-8 w-8 grid place-items-center rounded-md border border-border disabled:opacity-40 hover:bg-muted"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
