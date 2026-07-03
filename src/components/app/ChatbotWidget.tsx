import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, X, Send, Minus, Sparkles, User as UserIcon } from "lucide-react";
import { useWorkspace } from "@/lib/workspace";

type Msg = { id: string; role: "user" | "assistant"; content: string; ts: number };

const PPM_PROMPTS = [
  "Summarize this sprint's progress",
  "Which projects are at risk?",
  "Show my team's velocity trend",
  "What tasks are blocked?",
];
const HR_PROMPTS = [
  "How many leave days do I have left?",
  "Show today's attendance summary",
  "Open recruitment pipeline status",
  "Summarize leave policy",
];

const PPM_QUICK = ["Project status", "Sprint summary", "Team workload", "Deadlines this week"];
const HR_QUICK = ["Leave balance", "Attendance", "Payroll cycle", "HR policy"];

function answer(workspace: "ppm" | "hr", q: string): string {
  const lower = q.toLowerCase();
  if (workspace === "hr") {
    if (lower.includes("leave"))
      return "You have **14** of 21 annual leave days remaining. Last approved leave: Aug 12–14. Next holiday: Oct 2 (Gandhi Jayanti).";
    if (lower.includes("attendance"))
      return "Today's attendance: **86 present**, 4 on leave, 2 WFH, 1 late check-in. Team punctuality is up 3.2% week-over-week.";
    if (lower.includes("payroll"))
      return "Current payroll cycle closes on the 28th. 124 employees in scope; 3 pending approvals from finance.";
    if (lower.includes("recruit") || lower.includes("hiring"))
      return "Pipeline: 47 active candidates · 12 in interviews · 4 offers extended · 2 onboarding next week.";
    if (lower.includes("policy"))
      return "Policy snapshot: 21 PL + 8 SL + 10 CL per year. WFH up to 8 days/month. Maternity 26 weeks · Paternity 15 days.";
    return "I can help with leave, attendance, payroll, recruitment, employee records, and HR policy. Try one of the suggestions below.";
  }
  if (lower.includes("sprint"))
    return "**Sprint 24.2** — Day 7/14. 38 of 64 SP completed (59%). Burndown is on trend, projected to close at 96% of committed scope.";
  if (lower.includes("risk") || lower.includes("at risk"))
    return "**At risk:** Mobile Re-platform (budget 92% spent, 12 days slip). **Watch:** Data Lake Migration (2 unresolved blockers).";
  if (lower.includes("velocity"))
    return "Trailing 6-sprint velocity: 52 · 58 · 61 · 55 · 64 · 67 SP. Mean 59.5, trending **+8.4%**. Capacity for Sprint 24.3 ≈ 70 SP.";
  if (lower.includes("block"))
    return "3 blocked tasks: YGN-481 (waiting on design), YGN-503 (infra approval), YGN-512 (3rd-party API outage).";
  if (lower.includes("deadline"))
    return "This week: 5 stories due, 1 epic milestone (Checkout v2 → Fri). 2 items at risk of slipping past due date.";
  if (lower.includes("workload") || lower.includes("team"))
    return "Workload: 4 engineers at healthy load, 2 over-allocated (Sofia, Daniel). Recommend rebalancing 6 SP to Aisha or Marcus.";
  return "I can answer questions about projects, sprints, velocity, blockers, deadlines, and team workload. Try a suggestion below.";
}
function clampToViewport(x: number, y: number, size: number) {
  if (typeof window === "undefined") return { x, y };
  const maxX = Math.max(0, window.innerWidth - size - 8);
  const maxY = Math.max(0, window.innerHeight - size - 8);
  return { x: Math.min(Math.max(8, x), maxX), y: Math.min(Math.max(8, y), maxY) };
}

export function ChatbotWidget() {
  const { workspace } = useWorkspace();
  const [open, setOpen] = useState(false);
  const [min, setMin] = useState(false);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hi, I'm **Yogi** — your AI workspace assistant. Ask me about your work, or pick a suggestion to get started.",
      ts: Date.now(),
    },
  ]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const FAB_SIZE = 56;
  const dragRef = useRef<{
    startX: number;
    startY: number;
    origX: number;
    origY: number;
    moved: boolean;
  } | null>(null);
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);

  // Init position from localStorage or default to bottom-right
  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = localStorage.getItem("yogi-fab-pos");
    if (saved) {
      try {
        const p = JSON.parse(saved);
        setPos(clampToViewport(p.x, p.y, FAB_SIZE));
        return;
      } catch {}
    }
    setPos({ x: window.innerWidth - FAB_SIZE - 24, y: window.innerHeight - FAB_SIZE - 24 });
  }, []);

  // Re-clamp on resize
  useEffect(() => {
    const onResize = () => setPos((p) => (p ? clampToViewport(p.x, p.y, FAB_SIZE) : p));
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing, open, min]);

  const prompts = workspace === "hr" ? HR_PROMPTS : PPM_PROMPTS;
  const quick = workspace === "hr" ? HR_QUICK : PPM_QUICK;

  const send = (text: string) => {
    const q = text.trim();
    if (!q) return;
    const userMsg: Msg = { id: crypto.randomUUID(), role: "user", content: q, ts: Date.now() };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setTyping(true);
    setTimeout(
      () => {
        setMessages((m) => [
          ...m,
          {
            id: crypto.randomUUID(),
            role: "assistant",
            content: answer(workspace, q),
            ts: Date.now(),
          },
        ]);
        setTyping(false);
      },
      700 + Math.random() * 500,
    );
  };

  return (
    <>
      {/* Floating button — draggable */}
      <AnimatePresence>
        {!open && pos && (
          <motion.button
            key="fab"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 22 }}
            onPointerDown={(e) => {
              (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
              dragRef.current = {
                startX: e.clientX,
                startY: e.clientY,
                origX: pos.x,
                origY: pos.y,
                moved: false,
              };
            }}
            onPointerMove={(e) => {
              const d = dragRef.current;
              if (!d) return;
              const dx = e.clientX - d.startX;
              const dy = e.clientY - d.startY;
              if (!d.moved && Math.hypot(dx, dy) < 4) return;
              d.moved = true;
              setPos(clampToViewport(d.origX + dx, d.origY + dy, FAB_SIZE));
            }}
            onPointerUp={(e) => {
              const d = dragRef.current;
              dragRef.current = null;
              try {
                (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
              } catch {}
              if (d?.moved) {
                e.preventDefault();
                if (pos) localStorage.setItem("yogi-fab-pos", JSON.stringify(pos));
              } else {
                setOpen(true);
                setMin(false);
              }
            }}
            style={{ left: pos.x, top: pos.y, touchAction: "none" }}
            className="fixed z-[9999] h-14 w-14 rounded-full bg-gradient-primary text-white shadow-glow grid place-items-center hover:scale-105 transition cursor-grab active:cursor-grabbing"
            aria-label="Open AI assistant (drag to move)"
          >
            <Bot className="h-6 w-6 pointer-events-none" />
            <span className="absolute -top-1 -right-1 h-3.5 w-3.5 rounded-full bg-emerald-400 border-2 border-background pointer-events-none" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="panel"
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 280, damping: 26 }}
            className={`fixed z-[9999] w-[380px] max-w-[calc(100vw-2rem)] rounded-2xl bg-popover border border-border shadow-card overflow-hidden flex flex-col ${
              min ? "h-14" : "h-[580px] max-h-[calc(100vh-3rem)]"
            }`}
            style={(() => {
              const panelW = 380;
              const panelH = min ? 56 : 580;
              const margin = 12;
              const vw = typeof window !== "undefined" ? window.innerWidth : 1024;
              const vh = typeof window !== "undefined" ? window.innerHeight : 768;
              const baseX = pos ? pos.x : vw - panelW - 24;
              const baseY = pos ? pos.y : vh - panelH - 24;
              // Try to anchor panel near FAB without going offscreen
              const left = Math.min(
                Math.max(margin, baseX - panelW + FAB_SIZE),
                vw - panelW - margin,
              );
              const top = Math.min(Math.max(margin, baseY - panelH - 12), vh - panelH - margin);
              return { left, top, transition: "height 0.25s ease" };
            })()}
          >
            {/* Header */}
            <div className="px-4 h-14 flex items-center justify-between border-b border-border bg-gradient-primary text-white shrink-0">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="h-8 w-8 rounded-lg bg-white/15 backdrop-blur grid place-items-center border border-white/20">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-semibold truncate">Yogi · AI Assistant</div>
                  <div className="text-[11px] text-white/70 capitalize">
                    {workspace} workspace · online
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setMin((v) => !v)}
                  className="h-8 w-8 grid place-items-center rounded-md hover:bg-white/15 transition"
                  aria-label="Minimize"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setOpen(false)}
                  className="h-8 w-8 grid place-items-center rounded-md hover:bg-white/15 transition"
                  aria-label="Close"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {!min && (
              <>
                {/* Messages */}
                <div
                  ref={scrollRef}
                  className="flex-1 overflow-y-auto scrollbar-thin px-4 py-4 space-y-3 bg-background/50"
                >
                  {messages.map((m) => (
                    <div
                      key={m.id}
                      className={`flex gap-2.5 ${m.role === "user" ? "flex-row-reverse" : ""}`}
                    >
                      <div
                        className={`h-7 w-7 shrink-0 rounded-full grid place-items-center text-white ${m.role === "user" ? "bg-muted-foreground/70" : "bg-gradient-primary"}`}
                      >
                        {m.role === "user" ? (
                          <UserIcon className="h-3.5 w-3.5" />
                        ) : (
                          <Bot className="h-3.5 w-3.5" />
                        )}
                      </div>
                      <div
                        className={`max-w-[78%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed ${
                          m.role === "user"
                            ? "bg-primary text-primary-foreground rounded-tr-sm"
                            : "bg-card border border-border rounded-tl-sm"
                        }`}
                      >
                        {m.content
                          .split(/(\*\*[^*]+\*\*)/g)
                          .map((part, i) =>
                            part.startsWith("**") ? (
                              <strong key={i}>{part.slice(2, -2)}</strong>
                            ) : (
                              <span key={i}>{part}</span>
                            ),
                          )}
                      </div>
                    </div>
                  ))}
                  {typing && (
                    <div className="flex gap-2.5">
                      <div className="h-7 w-7 shrink-0 rounded-full bg-gradient-primary grid place-items-center text-white">
                        <Bot className="h-3.5 w-3.5" />
                      </div>
                      <div className="bg-card border border-border rounded-2xl rounded-tl-sm px-3.5 py-3 flex gap-1">
                        {[0, 1, 2].map((i) => (
                          <motion.span
                            key={i}
                            animate={{ y: [0, -3, 0], opacity: [0.4, 1, 0.4] }}
                            transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }}
                            className="h-1.5 w-1.5 rounded-full bg-muted-foreground"
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {messages.length <= 1 && (
                    <div className="pt-2">
                      <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                        Suggested
                      </div>
                      <div className="space-y-1.5">
                        {prompts.map((p) => (
                          <button
                            key={p}
                            onClick={() => send(p)}
                            className="w-full text-left text-[13px] px-3 py-2 rounded-lg bg-card border border-border hover:border-primary/50 hover:bg-muted/50 transition"
                          >
                            {p}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Quick chips */}
                <div className="px-3 pt-2 flex flex-wrap gap-1.5 border-t border-border bg-background/50">
                  {quick.map((c) => (
                    <button
                      key={c}
                      onClick={() => send(c)}
                      className="text-[11px] px-2.5 py-1 rounded-full bg-muted hover:bg-muted/70 text-foreground/80 transition"
                    >
                      {c}
                    </button>
                  ))}
                </div>

                {/* Input */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    send(input);
                  }}
                  className="p-3 flex items-center gap-2 bg-background/50"
                >
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask Yogi anything…"
                    className="flex-1 h-10 px-3.5 rounded-lg bg-card border border-border text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/20 transition"
                  />
                  <button
                    type="submit"
                    disabled={!input.trim()}
                    className="h-10 w-10 grid place-items-center rounded-lg bg-gradient-primary text-white shadow-elegant disabled:opacity-40 transition"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </form>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
