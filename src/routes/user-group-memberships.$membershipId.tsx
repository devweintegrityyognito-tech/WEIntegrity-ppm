import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

import UserGroupMembershipViewForm from "@/components/app/UserGroupMembershipViewForm";
import { type UserGroupMembership } from "@/lib/user-group-memberships-store";

export const Route = createFileRoute("/user-group-memberships/$membershipId")({
  component: UserGroupMembershipDetailsPage,
});

function UserGroupMembershipDetailsPage() {
  const { membershipId } = Route.useParams();

  const [membership, setMembership] = useState<UserGroupMembership | null>(null);

  useEffect(() => {
    async function loadMembership() {
      try {
        const res = await fetch(`https://weintegrity-ppm-main.onrender.com/api/user-group-memberships/${membershipId}`);

        const data = await res.json();

        setMembership(data);
      } catch (err) {
        console.error(err);

        toast.error("Failed to load membership");
      }
    }

    loadMembership();
  }, [membershipId]);

  if (!membership) {
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
        to="/user-group-memberships"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to User Group Memberships
      </Link>

      <UserGroupMembershipViewForm membership={membership} />
    </motion.div>
  );
}
