import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "@tanstack/react-router";
import {
  Search, Filter, ArrowUpDown, ChevronLeft, ChevronRight, X, Trash2,
} from "lucide-react";
import { Badge, priorityTone, statusTone } from "@/components/app/Badge";
import {
  storiesStore, PRIORITIES, STATUSES, ASSIGNEES, SPRINTS,
  type Story, type StoryStatus, type StoryPriority,
} from "@/lib/stories-store";
import { userById } from "@/lib/mock-data";

type SortKey = "key" | "title" | "priority" | "status" | "dueDate" | "storyPoints";
const PAGE_SIZE = 8;

const priorityRank: Record<StoryPriority, number> = { Low: 0, Medium: 1, High: 2, Critical: 3 };
const statusRank: Record<StoryStatus, number> = {
  Backlog: 0, Todo: 1, "In Progress": 2, Review: 3, Testing: 4, Done: 5,
};

interface StoriesListProps {
  stories: Story[];
  totalCount?: number;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyAction?: React.ReactNode;
}

export function StoriesList({ stories, totalCount, emptyTitle, emptyDescription, emptyAction }: StoriesListProps) {
  const [q, setQ] = useState("");
  const [fPriority, setFPriority] = useState<string>("all");
  const [fStatus, setFStatus] = useState<string>("all");
  const [fAssignee, setFAssignee] = useState<string>("all");
  const [fSprint, setFSprint] = useState<string>("all");
  const [sortKey, setSortKey] = useState<SortKey>("key");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    let list = stories.filter((st) => {
      if (fPriority !== "all" && st.priority !== fPriority) return false;
      if (fStatus !== "all" && st.status !== fStatus) return false;
      if (fAssignee !== "all" && st.assigneeId !== fAssignee) return false;
      if (fSprint !== "all" && st.sprintId !== fSprint) return false;
      if (!s) return true;
      return (
        st.title.toLowerCase().includes(s) ||
        st.key.toLowerCase().includes(s) ||
        st.labels.some((l) => l.toLowerCase().includes(s))
      );
    });
    list = [...list].sort((a, b) => {
      let av: number | string = a[sortKey] as any;
      let bv: number | string = b[sortKey] as any;
      if (sortKey === "priority") { av = priorityRank[a.priority]; bv = priorityRank[b.priority]; }
      if (sortKey === "status") { av = statusRank[a.status]; bv = statusRank[b.status]; }
      if (sortKey === "dueDate") { av = new Date(a.dueDate).getTime(); bv = new Date(b.dueDate).getTime(); }
      if (av < bv) return sortDir === "asc" ? -1 : 1;
      if (av > bv) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return list;
  }, [stories, q, fPriority, fStatus, fAssignee, fSprint, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paged = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const toggleSort = (k: SortKey) => {
    if (sortKey === k) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(k); setSortDir("asc"); }
  };

  const resetFilters = () => {
    setQ(""); setFPriority("all"); setFStatus("all"); setFAssignee("all"); setFSprint("all"); setPage(1);
  };

  const activeFilters =
    (q ? 1 : 0) + (fPriority !== "all" ? 1 : 0) + (fStatus !== "all" ? 1 : 0) +
    (fAssignee !== "all" ? 1 : 0) + (fSprint !== "all" ? 1 : 0);

  const showEmpty = stories.length === 0;

  return (
    <>
      <div className="text-sm text-muted-foreground mb-4">
        {filtered.length} of {totalCount ?? stories.length} stories
      </div>

      {!showEmpty && (
        <div className="rounded-xl bg-card border border-border shadow-card p-3 mb-4">
          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                value={q}
                onChange={(e) => { setQ(e.target.value); setPage(1); }}
                placeholder="Search by title, key or label…"
                className="w-full h-9 pl-9 pr-3 rounded-lg bg-background border border-border text-sm outline-none focus:border-ring transition"
              />
            </div>
            <SelectField value={fPriority} onChange={(v) => { setFPriority(v); setPage(1); }} label="Priority"
              options={[{ value: "all", label: "All priorities" }, ...PRIORITIES.map((p) => ({ value: p, label: p }))]} />
            <SelectField value={fStatus} onChange={(v) => { setFStatus(v); setPage(1); }} label="Status"
              options={[{ value: "all", label: "All statuses" }, ...STATUSES.map((s) => ({ value: s, label: s }))]} />
            <SelectField value={fAssignee} onChange={(v) => { setFAssignee(v); setPage(1); }} label="Assignee"
              options={[{ value: "all", label: "All assignees" }, ...ASSIGNEES.map((u) => ({ value: u.id, label: u.name }))]} />
            <SelectField value={fSprint} onChange={(v) => { setFSprint(v); setPage(1); }} label="Sprint"
              options={[{ value: "all", label: "All sprints" }, ...SPRINTS.map((s) => ({ value: s.id, label: s.name }))]} />
            {activeFilters > 0 && (
              <button onClick={resetFilters}
                className="h-9 px-3 rounded-lg border border-border text-sm inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground hover:bg-muted/50">
                <X className="h-3.5 w-3.5" /> Clear ({activeFilters})
              </button>
            )}
            <div className="ml-auto text-xs text-muted-foreground inline-flex items-center gap-1.5">
              <Filter className="h-3.5 w-3.5" /> {activeFilters} active filter{activeFilters === 1 ? "" : "s"}
            </div>
          </div>
        </div>
      )}

      {showEmpty ? (
        <div className="rounded-xl bg-card border border-border shadow-card p-12 text-center">
          <div className="mx-auto h-12 w-12 rounded-full bg-muted grid place-items-center mb-4">
            <Filter className="h-5 w-5 text-muted-foreground" />
          </div>
          <div className="font-semibold">{emptyTitle ?? "No stories yet"}</div>
          <div className="text-sm text-muted-foreground mt-1 max-w-md mx-auto">
            {emptyDescription ?? "Create your first story to start tracking work."}
          </div>
          {emptyAction && <div className="mt-5">{emptyAction}</div>}
        </div>
      ) : (
        <div className="rounded-xl bg-card border border-border shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[900px]">
              <thead>
                <tr className="text-[11px] uppercase tracking-wider text-muted-foreground bg-muted/40">
                  <Th sortable onClick={() => toggleSort("key")} active={sortKey === "key"} dir={sortDir} className="pl-5 w-[110px]">ID</Th>
                  <Th sortable onClick={() => toggleSort("title")} active={sortKey === "title"} dir={sortDir}>Title</Th>
                  <Th sortable onClick={() => toggleSort("priority")} active={sortKey === "priority"} dir={sortDir} className="w-[110px]">Priority</Th>
                  <Th sortable onClick={() => toggleSort("status")} active={sortKey === "status"} dir={sortDir} className="w-[150px]">Status</Th>
                  <Th className="w-[170px]">Assignee</Th>
                  <Th className="w-[160px]">Sprint</Th>
                  <Th sortable onClick={() => toggleSort("dueDate")} active={sortKey === "dueDate"} dir={sortDir} className="w-[110px]">Due</Th>
                  <Th sortable onClick={() => toggleSort("storyPoints")} active={sortKey === "storyPoints"} dir={sortDir} className="w-[70px] text-right pr-5">SP</Th>
                  <th className="w-10" />
                </tr>
              </thead>
              <tbody>
                <AnimatePresence initial={false}>
                  {paged.map((s) => (
                    <motion.tr
                      key={s.id}
                      layout
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="border-t border-border hover:bg-muted/30 group"
                    >
                      <td className="pl-5 py-3 font-mono text-xs text-muted-foreground">
                        <Link to="/stories/$storyId" params={{ storyId: s.id }} className="hover:text-foreground hover:underline">
                          {s.key ?? `ST-${s._id?.slice(-4)}`}
                        </Link>
                      </td>
                      <td className="py-3 pr-3">
                        <Link to="/stories/$storyId"params={{ storyId: s.id }} className="font-medium leading-tight hover:underline">
                          {s.title}
                        </Link>
                        {s.labels.length > 0 && (
                          <div className="flex items-center gap-1 mt-1 flex-wrap">
                            {s.labels.slice(0, 3).map((l) => (
                              <span key={l} className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">#{l}</span>
                            ))}
                          </div>
                        )}
                      </td>
                      <td className="py-3"><Badge tone={priorityTone(s.priority)}>{s.priority}</Badge></td>
                      <td className="py-3"><InlineStatusSelect story={s} /></td>
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <img src={userById(s.assigneeId).avatar}alt={userById(s.assigneeId).name}className="h-6 w-6 rounded-full border border-border"/>
                          <span className="text-xs truncate max-w-[120px]">{userById(s.assigneeId).name}</span>
                        </div>
                      </td>
                      <td className="py-3 text-xs text-muted-foreground truncate">
                        {SPRINTS.find((sp) => sp.id === s.sprintId)?.name ?? "—"}
                      </td>
                      <td className="py-3 text-xs">
                        {new Date(s.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </td>
                      <td className="py-3 pr-5 text-right text-xs font-semibold tabular-nums">{s.storyPoints}</td>
                      <td className="py-3 pr-3">
                        <button
                          onClick={() => {fetch(`https://weintegrity-ppm-main.onrender.com/api/stories/${s.id}`, {method: "DELETE",}).then(() => window.location.reload()).catch((err) => console.error(err));}}
                          title="Delete"
                          className="opacity-0 group-hover:opacity-100 transition h-7 w-7 grid place-items-center rounded-md hover:bg-muted text-muted-foreground hover:text-foreground"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
                {paged.length === 0 && (
                  <tr>
                    <td colSpan={9} className="py-16 text-center text-sm text-muted-foreground">
                      No stories match your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between px-5 py-3 border-t border-border bg-muted/20">
            <div className="text-xs text-muted-foreground">
              Showing <span className="font-medium text-foreground">{paged.length}</span> of{" "}
              <span className="font-medium text-foreground">{filtered.length}</span>
            </div>
            <div className="flex items-center gap-1">
              <button disabled={safePage === 1} onClick={() => setPage(safePage - 1)}
                className="h-8 w-8 grid place-items-center rounded-md border border-border disabled:opacity-40 hover:bg-muted">
                <ChevronLeft className="h-4 w-4" />
              </button>
              <div className="text-xs px-3 tabular-nums">Page {safePage} / {totalPages}</div>
              <button disabled={safePage === totalPages} onClick={() => setPage(safePage + 1)}
                className="h-8 w-8 grid place-items-center rounded-md border border-border disabled:opacity-40 hover:bg-muted">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function Th({
  children, sortable, active, dir, onClick, className = "",
}: {
  children: React.ReactNode; sortable?: boolean; active?: boolean;
  dir?: "asc" | "desc"; onClick?: () => void; className?: string;
}) {
  return (
    <th className={`text-left font-medium py-2.5 ${className}`}>
      {sortable ? (
        <button onClick={onClick} className={`inline-flex items-center gap-1 hover:text-foreground transition ${active ? "text-foreground" : ""}`}>
          {children}
          <ArrowUpDown className={`h-3 w-3 ${active ? "opacity-100" : "opacity-40"}`} />
          {active && <span className="text-[9px]">{dir === "asc" ? "↑" : "↓"}</span>}
        </button>
      ) : children}
    </th>
  );
}

function SelectField({
  value, onChange, options, label,
}: { value: string; onChange: (v: string) => void; options: { value: string; label: string }[]; label: string }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-label={label}
      className="h-9 px-2.5 rounded-lg border border-border bg-background text-sm outline-none focus:border-ring transition cursor-pointer"
    >
      {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  );
}

function InlineStatusSelect({ story }: { story: Story }) {
  const tone = statusTone(story.status);
  const toneClass: Record<string, string> = {
    success: "bg-[oklch(0.95_0.04_155)] text-[oklch(0.4_0.14_155)] border-[oklch(0.85_0.08_155)]",
    warning: "bg-[oklch(0.97_0.04_75)] text-[oklch(0.45_0.14_75)] border-[oklch(0.88_0.1_75)]",
    danger: "bg-[oklch(0.96_0.04_25)] text-[oklch(0.5_0.2_25)] border-[oklch(0.88_0.1_25)]",
    info: "bg-[oklch(0.95_0.04_230)] text-[oklch(0.4_0.14_230)] border-[oklch(0.85_0.08_230)]",
    primary: "bg-[oklch(0.95_0.04_264)] text-primary border-[oklch(0.85_0.08_264)]",
    muted: "bg-muted text-muted-foreground border-border",
    default: "bg-muted text-foreground/80 border-border",
  };
  return (
    <select aria-label="Story status" value={story.status} onChange={(e) => {fetch(`https://weintegrity-ppm-main.onrender.com/api/stories/${story.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      status: e.target.value,
    }),
  })
    .then(() => window.location.reload())
    .catch((err) => console.error(err));
    }}
      className={`text-[11px] font-medium pl-2 pr-6 py-0.5 rounded-full border outline-none cursor-pointer appearance-none bg-[length:14px] bg-[right_4px_center] bg-no-repeat ${toneClass[tone]}`}
      style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='3'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E\")" }}
    >
      {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
    </select>
  );
}
