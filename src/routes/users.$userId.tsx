import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Sparkles } from "lucide-react";
import { type User } from "@/lib/users-store";
import { toast } from "sonner";

export const Route = createFileRoute("/users/$userId")({
  component: UserDetailsPage,
});

function UserDetailsPage() {
  const { userId } = Route.useParams();

  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    async function loadUser() {
      try {
        const res = await fetch(`https://weintegrity-ppm-main.onrender.com/api/users/${userId}`);

        const data = await res.json();

        setUser(data);
      } catch (err) {
        console.error(err);

        toast.error("Failed to load user");
      }
    }

    loadUser();
  }, [userId]);

  if (!user) {
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
        to="/users"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Users
      </Link>

      <div className="rounded-xl bg-card border border-border shadow-card overflow-hidden">
        <div className="flex items-center gap-3 px-6 py-4 border-b border-border bg-muted/20">
          <div className="h-9 w-9 rounded-lg bg-gradient-primary grid place-items-center">
            <Sparkles className="h-4 w-4 text-white" />
          </div>

          <div>
            <div className="font-semibold leading-tight">User Details</div>

            <div className="text-xs text-muted-foreground">View user profile information</div>
          </div>
        </div>

        <div className="px-6 py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Field label="First Name">
              <ReadOnly value={user.firstName} />
            </Field>

            <Field label="Last Name">
              <ReadOnly value={user.lastName} />
            </Field>

            <Field label="Username">
              <ReadOnly value={user.username} />
            </Field>

            <Field label="Email">
              <ReadOnly value={user.email} />
            </Field>

            <Field label="Phone Number">
              <ReadOnly value={user.phoneNumber || "Not Available"} />
            </Field>

            <Field label="Date of Birth">
              <ReadOnly value={user.dateOfBirth || "Not Available"} />
            </Field>

            <Field label="Role">
              <ReadOnly value={user.role} />
            </Field>

            <Field label="Status">
              <ReadOnly value={user.status} />
            </Field>

            <Field label="Created Date">
              <ReadOnly
                value={
                  user.createdDate
                    ? new Date(user.createdDate).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })
                    : "Not Available"
                }
              />
            </Field>

            <Field label="Updated Date">
              <ReadOnly
                value={
                  user.updatedDate
                    ? new Date(user.updatedDate).toLocaleString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "Not Available"
                }
              />
            </Field>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="mb-1.5 text-xs font-medium">{label}</div>

      {children}
    </label>
  );
}

function ReadOnly({ value }: { value: string }) {
  return (
    <input
      value={value}
      readOnly
      className="w-full h-10 px-3 rounded-lg border border-border bg-muted text-sm"
    />
  );
}
