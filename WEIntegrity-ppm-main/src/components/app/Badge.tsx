import { ReactNode } from "react";

type Tone = "default" | "success" | "warning" | "danger" | "info" | "primary" | "muted";

const tones: Record<Tone, string> = {
  default: "bg-muted text-foreground/80 border-border",
  success: "bg-[oklch(0.95_0.04_155)] text-[oklch(0.4_0.14_155)] border-[oklch(0.85_0.08_155)]",
  warning: "bg-[oklch(0.97_0.04_75)] text-[oklch(0.45_0.14_75)] border-[oklch(0.88_0.1_75)]",
  danger: "bg-[oklch(0.96_0.04_25)] text-[oklch(0.5_0.2_25)] border-[oklch(0.88_0.1_25)]",
  info: "bg-[oklch(0.95_0.04_230)] text-[oklch(0.4_0.14_230)] border-[oklch(0.85_0.08_230)]",
  primary: "bg-[oklch(0.95_0.04_264)] text-primary border-[oklch(0.85_0.08_264)]",
  muted: "bg-muted text-muted-foreground border-border",
};

export function Badge({ children, tone = "default", dot = false }: { children: ReactNode; tone?: Tone; dot?: boolean }) {
  return (
    <span className={`inline-flex items-center gap-1.5 text-[11px] font-medium px-2 py-0.5 rounded-full border ${tones[tone]}`}>
      {dot && <span className="h-1.5 w-1.5 rounded-full bg-current opacity-80" />}
      {children}
    </span>
  );
}

export function priorityTone(p: string): Tone {
  return p === "Critical" ? "danger" : p === "High" ? "warning" : p === "Medium" ? "info" : "muted";
}

export function statusTone(s: string): Tone {
  if (["On Track", "Done", "Completed", "Active"].includes(s)) return "success";
  if (["At Risk", "Review", "Testing"].includes(s)) return "warning";
  if (["Delayed", "Bug"].includes(s)) return "danger";
  if (["In Progress", "Planned"].includes(s)) return "info";
  return "muted";
}
