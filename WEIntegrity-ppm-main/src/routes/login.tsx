import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Sparkles, Github, Chrome, ArrowRight, ShieldCheck, Zap, Users } from "lucide-react";
import { useState, FormEvent } from "react";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Sign in — Yognito PPM" }] }),
  component: LoginPage,
});

function LoginPage() {
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => nav({ to: "/dashboard" }), 700);
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      {/* Left brand panel */}
      <div className="relative hidden lg:flex flex-col justify-between p-12 bg-gradient-hero text-white overflow-hidden">
        <motion.div
          aria-hidden
          animate={{ scale: [1, 1.1, 1], rotate: [0, 25, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-white/10 blur-3xl"
        />
        <motion.div
          aria-hidden
          animate={{ scale: [1, 1.15, 1], rotate: [0, -20, 0] }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-40 -right-20 h-[28rem] w-[28rem] rounded-full bg-[oklch(0.65_0.22_295)]/30 blur-3xl"
        />

        <div className="relative flex items-center gap-2.5">
          <div className="h-10 w-10 rounded-xl bg-white/15 backdrop-blur grid place-items-center border border-white/20">
            <Sparkles className="h-5 w-5" />
          </div>
          <div className="font-semibold text-lg tracking-tight">Yognito</div>
        </div>

        <div className="relative">
          <motion.h1
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-4xl xl:text-5xl font-semibold tracking-tight leading-[1.1]"
          >
            Run every project<br />with surgical clarity.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="mt-5 text-white/70 max-w-md text-[15px] leading-relaxed"
          >
            The portfolio management platform trusted by 4,200+ engineering teams to plan sprints, ship roadmaps, and keep delivery on track.
          </motion.p>

          <div className="mt-10 grid grid-cols-3 gap-4 max-w-md">
            {[
              { icon: ShieldCheck, label: "SOC 2 Type II" },
              { icon: Zap, label: "Real-time sync" },
              { icon: Users, label: "Unlimited seats" },
            ].map(({ icon: Icon, label }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.08 }}
                className="rounded-xl bg-white/5 border border-white/10 backdrop-blur p-3"
              >
                <Icon className="h-4 w-4 text-white/80" />
                <div className="mt-1.5 text-xs font-medium text-white/90">{label}</div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="relative text-xs text-white/50">© 2026 Yognito, Inc. · All rights reserved.</div>
      </div>

      {/* Right form */}
      <div className="flex items-center justify-center p-6 sm:p-12">
        <motion.div
          initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="lg:hidden flex items-center gap-2.5 mb-8">
            <div className="h-9 w-9 rounded-lg bg-gradient-primary grid place-items-center">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <div className="font-semibold tracking-tight">Yognito</div>
          </div>

          <h2 className="text-2xl font-semibold tracking-tight">Welcome back</h2>
          <p className="text-sm text-muted-foreground mt-1.5">Sign in to your workspace to continue.</p>

          <div className="grid grid-cols-2 gap-2.5 mt-7">
            <button className="h-10 rounded-lg border border-border bg-card hover:bg-muted/50 text-sm font-medium inline-flex items-center justify-center gap-2 transition">
              <Chrome className="h-4 w-4" /> Google
            </button>
            <button className="h-10 rounded-lg border border-border bg-card hover:bg-muted/50 text-sm font-medium inline-flex items-center justify-center gap-2 transition">
              <Github className="h-4 w-4" /> GitHub
            </button>
          </div>

          <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
            <div className="h-px flex-1 bg-border" /> OR <div className="h-px flex-1 bg-border" />
          </div>

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="text-xs font-medium text-foreground/80">Work email</label>
              <input type="email" required defaultValue="aarav.sharma@yognito.com" className="mt-1.5 w-full h-10 px-3 rounded-lg border border-border bg-card text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/20 transition" />
            </div>
            <div>
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-foreground/80">Password</label>
                <Link to="/login" className="text-xs text-primary hover:underline">Forgot password?</Link>
              </div>
              <input type="password" required defaultValue="••••••••••" className="mt-1.5 w-full h-10 px-3 rounded-lg border border-border bg-card text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/20 transition" />
            </div>
            <label className="flex items-center gap-2 text-xs text-muted-foreground select-none">
              <input type="checkbox" defaultChecked className="rounded border-border" />
              Keep me signed in for 30 days
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-10 rounded-lg bg-gradient-primary text-primary-foreground text-sm font-semibold inline-flex items-center justify-center gap-2 shadow-elegant hover:opacity-95 disabled:opacity-70 transition"
            >
              {loading ? "Signing you in…" : (<>Sign in <ArrowRight className="h-4 w-4" /></>)}
            </button>
          </form>

          <p className="text-xs text-muted-foreground text-center mt-6">
            Don't have an account? <Link to="/login" className="text-primary font-medium hover:underline">Request a demo</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
