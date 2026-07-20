import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { useTeams } from "@/lib/teams-store";
import GroupViewForm from "@/components/team/GroupViewForm";

export const Route = createFileRoute("/team/$teamId")({
  component: TeamDetailsPage,
});

function TeamDetailsPage() {
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
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back Button */}
      <Link
        to="/team"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Groups
      </Link>

      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Group Details</h1>

        <p className="text-sm text-muted-foreground mt-1">View group information</p>
      </div>

      {/* Details Card */}
      <GroupViewForm team={team} />
    </div>
  );
}
