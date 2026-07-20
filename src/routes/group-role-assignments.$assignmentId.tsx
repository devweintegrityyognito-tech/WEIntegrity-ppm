import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

import GroupRoleAssignmentViewForm from "@/components/app/GroupRoleAssignmentViewForm";
import { type GroupRoleAssignment } from "@/lib/group-role-assignments-store";

export const Route = createFileRoute("/group-role-assignments/$assignmentId")({
  component: GroupRoleAssignmentDetailsPage,
});

function GroupRoleAssignmentDetailsPage() {
  const { assignmentId } = Route.useParams();

  const [assignment, setAssignment] = useState<GroupRoleAssignment | null>(null);

  useEffect(() => {
    async function loadAssignment() {
      try {
        const res = await fetch(
          `https://weintegrity-ppm-main.onrender.com/api/group-role-assignments/${assignmentId}`,
        );

        const data = await res.json();

        setAssignment(data);
      } catch (err) {
        console.error(err);

        toast.error("Failed to load assignment");
      }
    }

    loadAssignment();
  }, [assignmentId]);

  if (!assignment) {
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
        to="/group-role-assignments"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Group Role Assignments
      </Link>

      <GroupRoleAssignmentViewForm assignment={assignment} />
    </motion.div>
  );
}
