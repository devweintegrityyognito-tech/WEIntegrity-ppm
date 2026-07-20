import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Sparkles } from "lucide-react";
import PermissionViewForm from "@/components/app/PermissionViewForm";
import { type Permission } from "@/lib/permissions-store";
import { toast } from "sonner";

export const Route = createFileRoute("/permissions/$permissionId")({
  component: PermissionDetailsPage,
});

function PermissionDetailsPage() {
  const { permissionId } = Route.useParams();

  const [permission, setPermission] = useState<Permission | null>(null);

  useEffect(() => {
    async function loadPermission() {
      try {
        const res = await fetch(`https://weintegrity-ppm-main.onrender.com/api/permissions/${permissionId}`);

        const data = await res.json();

        setPermission(data);
      } catch (err) {
        console.error(err);

        toast.error("Failed to load permission");
      }
    }

    loadPermission();
  }, [permissionId]);

  if (!permission) {
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
        to="/permissions"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Permissions
      </Link>

      <PermissionViewForm permission={permission} />
    </motion.div>
  );
}
