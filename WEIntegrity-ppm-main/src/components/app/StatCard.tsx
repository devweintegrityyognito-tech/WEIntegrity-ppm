import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { LucideIcon, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { useEffect } from "react";

interface Props {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  change: number; // percentage
  icon: LucideIcon;
  tone?: "primary" | "success" | "warning" | "info";
}

const tones = {
  primary: "from-primary/15 to-primary/0 text-primary",
  success: "from-[oklch(0.68_0.16_155)]/15 to-transparent text-[oklch(0.55_0.16_155)]",
  warning: "from-[oklch(0.78_0.16_75)]/20 to-transparent text-[oklch(0.55_0.16_75)]",
  info: "from-[oklch(0.65_0.14_230)]/15 to-transparent text-[oklch(0.5_0.14_230)]",
};

export function StatCard({ label, value, prefix = "", suffix = "", change, icon: Icon, tone = "primary" }: Props) {
  const mv = useMotionValue(0);
  const rounded = useTransform(mv, (v) => `${prefix}${Math.round(v).toLocaleString()}${suffix}`);
  useEffect(() => {
    const controls = animate(mv, value, { duration: 1.1, ease: "easeOut" });
    return controls.stop;
  }, [value, mv]);

  const positive = change >= 0;

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      className="relative overflow-hidden rounded-xl bg-card border border-border shadow-card p-5"
    >
      <div className={`absolute -top-10 -right-10 h-32 w-32 rounded-full bg-gradient-to-br ${tones[tone]} blur-2xl opacity-60`} />
      <div className="relative">
        <div className="flex items-start justify-between">
          <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</div>
          <div className={`h-8 w-8 grid place-items-center rounded-lg bg-gradient-to-br ${tones[tone]}`}>
            <Icon className="h-4 w-4" />
          </div>
        </div>
        <motion.div className="mt-3 text-3xl font-semibold tracking-tight tabular-nums">{rounded}</motion.div>
        <div className="mt-2 flex items-center gap-1.5 text-xs">
          <span className={`inline-flex items-center gap-0.5 font-semibold ${positive ? "text-[oklch(0.55_0.16_155)]" : "text-destructive"}`}>
            {positive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
            {Math.abs(change)}%
          </span>
          <span className="text-muted-foreground">vs. last month</span>
        </div>
      </div>
    </motion.div>
  );
}
