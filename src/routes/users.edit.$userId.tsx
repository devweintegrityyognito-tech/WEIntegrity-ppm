import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2, Pencil, Sparkles, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { usersStore, type UserStatus } from "@/lib/users-store";

export const Route = createFileRoute("/users/edit/$userId")({
  component: EditUserPage,
});

function EditUserPage() {
  const navigate = useNavigate();
  const { userId } = Route.useParams();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [createdDate, setCreatedDate] = useState("");

  const [role, setRole] = useState("User");
  const [status, setStatus] = useState<UserStatus>("Active");

  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    async function loadUser() {
      try {
        const res = await fetch(`https://weintegrity-ppm-main.onrender.com/api/users/${userId}`);
        const user = await res.json();

        setFirstName(user.firstName || "");
        setLastName(user.lastName || "");
        setUsername(user.username || "");
        setEmail(user.email || "");
        setPassword(user.password || "");
        setPhoneNumber(user.phoneNumber || "");
        setDateOfBirth(user.dateOfBirth || "");
        setRole(user.role || "User");
        setStatus(user.status || "Active");
        setCreatedDate(user.createdDate || "");
      } catch (err) {
        console.error(err);
        toast.error("Failed to load user");
      }
    }

    loadUser();
  }, [userId]);

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();

    if (
      !firstName.trim() ||
      !lastName.trim() ||
      !username.trim() ||
      !email.trim() ||
      !password.trim()
    ) {
      toast.error("Please fill all required fields.");
      return;
    }
    if (firstName.length > 100) {
      toast.error("First Name cannot exceed 100 characters.");
      return;
    }

    if (lastName.length > 100) {
      toast.error("Last Name cannot exceed 100 characters.");
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }

    if (phoneNumber && !/^[0-9]{10}$/.test(phoneNumber)) {
      toast.error("Enter a valid 10-digit phone number.");
      return;
    }

    if (dateOfBirth && new Date(dateOfBirth) > new Date()) {
      toast.error("Date of Birth cannot be in the future.");
      return;
    }

    setSubmitting(true);

    try {
      await usersStore.update(userId, {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        username: username.trim(),
        email: email.trim(),
        password,
        phoneNumber,
        profilePicture: "",
        dateOfBirth,
        role,
        status,
        emailVerified: false,
        createdDate,
        updatedDate: "",
      });

      toast.success("User updated successfully");

      navigate({
        to: "/users",
      });
    } catch (err) {
      console.error(err);
      toast.error("Failed to update user");
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
        to="/users"
        className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mb-4"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to Users
      </Link>

      <form onSubmit={handleUpdate} className="space-y-5">
        <div className="rounded-xl bg-card border border-border shadow-card overflow-hidden">
          <div className="flex items-center gap-3 px-6 py-4 border-b border-border bg-muted/20">
            <div className="h-9 w-9 rounded-lg bg-gradient-primary grid place-items-center">
              <Sparkles className="h-4 w-4 text-white" />
            </div>

            <div>
              <div className="font-semibold leading-tight">Update User</div>

              <div className="text-xs text-muted-foreground">Update user profile information</div>
            </div>
          </div>

          <div className="px-6 py-6 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="First Name" required>
                <input
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm outline-none focus:border-ring"
                />
              </Field>

              <Field label="Last Name" required>
                <input
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm outline-none focus:border-ring"
                />
              </Field>

              <Field label="Username" required>
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm outline-none focus:border-ring"
                />
              </Field>

              <Field label="Email" required>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm outline-none focus:border-ring"
                />
              </Field>

              <Field label="Password" required>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full h-10 px-3 pr-10 rounded-lg border border-border bg-background text-sm outline-none focus:border-ring"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </Field>

              <Field label="Phone Number">
                <input
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm outline-none focus:border-ring"
                />
              </Field>

              <Field label="Date of Birth">
                <input
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm outline-none focus:border-ring cursor-pointer"
                />
              </Field>

              <Field label="Role" required>
                <FormSelect
                  value={role}
                  onChange={setRole}
                  options={[
                    { value: "User", label: "User" },
                    { value: "Admin", label: "Admin" },
                  ]}
                />
              </Field>

              <Field label="Status">
                <div className="h-10 px-3 rounded-lg border border-border bg-muted/40 flex items-center text-sm">
                  {status}
                </div>
              </Field>
            </div>
          </div>

          <div className="px-6 py-4 border-t border-border bg-muted/20 flex justify-end gap-2">
            <Link
              to="/users"
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
                  Update User
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
  options: { value: string; label: string }[];
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
