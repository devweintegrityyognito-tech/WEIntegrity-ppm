import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { useTeams } from "@/lib/teams-store";
import GroupEditForm from "@/components/team/GroupEditForm";

export const Route = createFileRoute("/team/edit/$teamId")({
  component: EditTeamPage,
});

function EditTeamPage() {
  const { teamId } = Route.useParams();

  const teams = useTeams();

  const team = teams.find((t) => t.id === teamId);

  if (!team) {
    return (
      <div className="p-6">
        <h2 className="text-xl font-semibold">Group not found</h2>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="max-w-4xl mx-auto space-y-6"
    >
      <Link
        to="/team"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Groups
      </Link>

      <GroupEditForm team={team} />
    </motion.div>
  );
}
