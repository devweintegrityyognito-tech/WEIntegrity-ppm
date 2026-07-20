import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Pencil, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";

import {
  groupRoleAssignmentsStore,
  type GroupRoleAssignment,
} from "@/lib/group-role-assignments-store";

const PAGE_SIZE = 10;

interface GroupRoleAssignmentsListProps {
  assignments: GroupRoleAssignment[];
}

export default function GroupRoleAssignmentsList({ assignments }: GroupRoleAssignmentsListProps) {
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(assignments.length / PAGE_SIZE));

  const paginatedAssignments = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;

    return assignments.slice(start, start + PAGE_SIZE);
  }, [assignments, page]);

  async function handleDelete(assignment: GroupRoleAssignment) {
    try {
      await groupRoleAssignmentsStore.remove(assignment.id);

      toast.success("Assignment deleted successfully");
    } catch (err) {
      console.error(err);

      toast.error("Failed to delete assignment");
    }
  }

  return (
    <div className="rounded-xl bg-card border border-border shadow-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-[11px] uppercase tracking-wider text-muted-foreground bg-muted/40">
              <th className="px-5 py-3 text-left font-medium">GROUP</th>

              <th className="px-5 py-3 text-left font-medium">ROLE</th>

              <th className="px-5 py-3 text-left font-medium">STATUS</th>

              <th className="px-5 py-3 text-left font-medium">EFFECTIVE FROM</th>

              <th className="px-5 py-3 text-left font-medium">EFFECTIVE TO</th>

              <th className="w-16 px-4 py-3 text-right font-medium">ACTIONS</th>
            </tr>
          </thead>

          <tbody>
            {paginatedAssignments.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-10 text-sm text-muted-foreground">
                  No assignments found.
                </td>
              </tr>
            ) : (
              paginatedAssignments.map((assignment) => (
                <tr key={assignment.id} className="border-b border-border hover:bg-muted/20">
                  <td className="px-4 py-3">
                    <Link
                      to="/group-role-assignments/$assignmentId"
                      params={{
                        assignmentId: assignment.id,
                      }}
                      className="block"
                    >
                      <div className="font-medium hover:text-primary transition-colors">
                        {assignment.groupName}
                      </div>
                    </Link>
                  </td>

                  <td className="px-4 py-3 text-sm">{assignment.roleName}</td>

                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                        assignment.status === "Active"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {assignment.status}
                    </span>
                  </td>

                  <td className="px-4 py-3 text-sm">{assignment.effectiveFrom || "-"}</td>

                  <td className="px-4 py-3 text-sm">{assignment.effectiveTo || "-"}</td>

                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        to="/group-role-assignments/edit/$assignmentId"
                        params={{
                          assignmentId: assignment.id,
                        }}
                        title="Edit"
                        className="h-7 w-7 grid place-items-center rounded-md hover:bg-muted"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Link>

                      <button
                        type="button"
                        title="Delete"
                        onClick={() => handleDelete(assignment)}
                        className="h-7 w-7 grid place-items-center rounded-md hover:bg-muted"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between px-5 py-3 border-t border-border bg-muted/20">
        <div className="text-xs text-muted-foreground">
          Showing <span className="font-medium text-foreground">{paginatedAssignments.length}</span>{" "}
          of <span className="font-medium text-foreground">{assignments.length}</span>
        </div>

        <div className="flex items-center gap-1">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="h-8 w-8 grid place-items-center rounded-md border border-border disabled:opacity-40 hover:bg-muted"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <div className="text-xs px-3 tabular-nums">
            Page {page} / {totalPages}
          </div>

          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="h-8 w-8 grid place-items-center rounded-md border border-border disabled:opacity-40 hover:bg-muted"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
