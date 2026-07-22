import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "@tanstack/react-router";
import { Search, Filter, ChevronLeft, ChevronRight, X, Trash2, Pencil } from "lucide-react";
import { Badge, priorityTone, statusTone } from "@/components/app/Badge";
import {
  storiesStore,
  PRIORITIES,
  STATUSES,
  SPRINTS,
  type Story,
  type StoryStatus,
  type StoryPriority,
} from "@/lib/stories-store";
import { useUsers } from "@/lib/users-store";

type SortKey = "key" | "title" | "priority" | "status" | "dueDate" | "storyPoints";
const PAGE_SIZE = 8;

const priorityRank: Record<StoryPriority, number> = { Low: 0, Medium: 1, High: 2, Critical: 3 };
const statusRank: Record<StoryStatus, number> = {
  Backlog: 0,
  Todo: 1,
  "In Progress": 2,
  Review: 3,
  Testing: 4,
  Done: 5,
};

interface StoriesListProps {
  stories: Story[];
  totalCount?: number;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyAction?: React.ReactNode;
}

export function StoriesList({
  stories,
  totalCount,
  emptyTitle,
  emptyDescription,
  emptyAction,
}: StoriesListProps) {
  const [q, setQ] = useState("");
  const [fPriority, setFPriority] = useState<string>("all");
  const [fStatus, setFStatus] = useState<string>("all");
  const [fAssignee, setFAssignee] = useState<string>("all");
  const [fSprint, setFSprint] = useState<string>("all");
  const [sortKey, setSortKey] = useState<SortKey>("key");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);

  const navigate = useNavigate();
  const users = useUsers();
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
      let av: number | string = a[sortKey as keyof Story] as number | string;
      let bv: number | string = b[sortKey as keyof Story] as number | string;
      if (sortKey === "priority") {
        av = priorityRank[a.priority];
        bv = priorityRank[b.priority];
      }
      if (sortKey === "status") {
        av = statusRank[a.status];
        bv = statusRank[b.status];
      }
      if (sortKey === "dueDate") {
        av = new Date(a.dueDate).getTime();
        bv = new Date(b.dueDate).getTime();
      }
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
    else {
      setSortKey(k);
      setSortDir("asc");
    }
  };

  const resetFilters = () => {
    setQ("");
    setFPriority("all");
    setFStatus("all");
    setFAssignee("all");
    setFSprint("all");
    setPage(1);
  };

  const activeFilters =
    (q ? 1 : 0) +
    (fPriority !== "all" ? 1 : 0) +
    (fStatus !== "all" ? 1 : 0) +
    (fAssignee !== "all" ? 1 : 0) +
    (fSprint !== "all" ? 1 : 0);

  const showEmpty = stories.length === 0;

  return (
    <>
      <div className="text-sm text-muted-foreground mb-4">
        {filtered.length} of {totalCount ?? stories.length} stories
      </div>

      {!showEmpty && (
        <div className="rounded-xl bg-card border border-border shadow-card p-3 mb-4">
          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative flex-1 min-w-50 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                value={q}
                onChange={(e) => {
                  setQ(e.target.value);
                  setPage(1);
                }}
                placeholder="Search by title, key or label…"
                className="w-full h-9 pl-9 pr-3 rounded-lg bg-background border border-border text-sm outline-none focus:border-ring transition"
              />
            </div>
            <SelectField
              value={fPriority}
              onChange={(v) => {
                setFPriority(v);
                setPage(1);
              }}
              label="Priority"
              options={[
                { value: "all", label: "All priorities" },
                ...PRIORITIES.map((p) => ({ value: p, label: p })),
              ]}
            />
            <SelectField
              value={fStatus}
              onChange={(v) => {
                setFStatus(v);
                setPage(1);
              }}
              label="Status"
              options={[
                { value: "all", label: "All statuses" },
                ...STATUSES.map((s) => ({ value: s, label: s })),
              ]}
            />
            <SelectField
              value={fAssignee}
              onChange={(v) => {
                setFAssignee(v);
                setPage(1);
              }}
              label="Assignee"
              options={[
                { value: "all", label: "All assignees" },
                ...users.map((u) => ({
                  value: u.id,
                  label: `${u.firstName} ${u.lastName}`,
                })),
              ]}
            />
            <SelectField
              value={fSprint}
              onChange={(v) => {
                setFSprint(v);
                setPage(1);
              }}
              label="Sprint"
              options={[
                { value: "all", label: "All sprints" },
                ...SPRINTS.map((s) => ({ value: s.id, label: s.name })),
              ]}
            />
            {activeFilters > 0 && (
              <button
                onClick={resetFilters}
                className="h-9 px-3 rounded-lg border border-border text-sm inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground hover:bg-muted/50"
              >
                <X className="h-3.5 w-3.5" /> Clear ({activeFilters})
              </button>
            )}
            <div className="ml-auto text-xs text-muted-foreground inline-flex items-center gap-1.5">
              <Filter className="h-3.5 w-3.5" /> {activeFilters} active filter
              {activeFilters === 1 ? "" : "s"}
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
            <table className="w-full text-sm">
              <thead>
                <tr className="text-[11px] uppercase tracking-wider text-muted-foreground bg-muted/40">
                  <th className="w-24 px-5 py-3 text-left font-medium">ID</th>

                  <th className="px-5 py-3 text-left font-medium">Title</th>

                  <th className="px-5 py-3 text-left font-medium">Priority</th>

                  <th className="px-5 py-3 text-left font-medium">Status</th>

                  <th className="px-5 py-3 text-left font-medium">Assignee</th>

                  <th className="px-5 py-3 text-left font-medium">Sprint</th>

                  <th className="px-5 py-3 text-left font-medium">Due</th>

                  <th className="w-16 px-5 py-3 text-right font-medium">SP</th>

                  <th className="w-16 px-4 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence initial={false}>
                  {paged.map((s) => {
                    const assignee = users.find((u) => u.id === s.assigneeId);

                    return (
                      <motion.tr
                        key={s.id}
                        layout
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="group border-t border-border hover:bg-muted/30 transition-colors"
                      >
                        <td className="px-5 py-4 font-medium text-muted-foreground">
                          <Link
                            to="/stories/$storyId"
                            params={{ storyId: s.id }}
                            className="hover:text-foreground hover:underline"
                          >
                            {s.key ?? `ST-${s._id?.slice(-4)}`}
                          </Link>
                        </td>
                        <td className="px-5 py-4">
                          <Link
                            to="/stories/$storyId"
                            params={{ storyId: s.id }}
                            className="font-medium leading-tight hover:underline"
                          >
                            {s.title}
                          </Link>
                          {s.labels.length > 0 && (
                            <div className="flex items-center gap-1 mt-1 flex-wrap">
                              {s.labels.slice(0, 3).map((l) => (
                                <span
                                  key={l}
                                  className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground"
                                >
                                  #{l}
                                </span>
                              ))}
                            </div>
                          )}
                        </td>
                        <td className="px-5 py-4">
                          <Badge tone={priorityTone(s.priority)}>{s.priority}</Badge>
                        </td>
                        <td className="px-5 py-4">
                          <Badge tone={statusTone(s.status)} dot>
                            {s.status}
                          </Badge>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <img
                              src={assignee?.profilePicture || ""}
                              alt={assignee ? `${assignee.firstName} ${assignee.lastName}` : "User"}
                              className="h-6 w-6 rounded-full border border-border"
                            />
                            <span className="truncate max-w-30">
                              {assignee ? `${assignee.firstName} ${assignee.lastName}` : "-"}
                            </span>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-sm text-muted-foreground">
                          {SPRINTS.find((sp) => sp.id === s.sprintId)?.name ?? "—"}
                        </td>
                        <td className="px-5 py-4 text-sm">
                          {new Date(s.dueDate).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                        </td>
                        <td className="w-16 px-5 py-4 text-right font-medium">{s.storyPoints}</td>
                        <td className="px-4 py-4">
                          <div className="flex items-center justify-end gap-1">
                            {/* Edit */}
                            <button
                              onClick={() =>
                                navigate({
                                  to: "/stories/edit/$storyId",
                                  params: { storyId: s.id },
                                })
                              }
                              title="Edit"
                              className="h-7 w-7 grid place-items-center rounded-md hover:bg-muted"
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </button>

                            {/* Delete */}
                            <button
                              onClick={() => {
                                fetch(`https://weintegrity-ppm-main.onrender.com/api/stories/${s.id}`, {
                                  method: "DELETE",
                                })
                                  .then(() => window.location.reload())
                                  .catch(console.error);
                              }}
                              title="Delete"
                              className="h-7 w-7 grid place-items-center rounded-md hover:bg-muted"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
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
              <button
                disabled={safePage === 1}
                onClick={() => setPage(safePage - 1)}
                className="h-8 w-8 grid place-items-center rounded-md border border-border disabled:opacity-40 hover:bg-muted"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <div className="text-xs px-3 tabular-nums">
                Page {safePage} / {totalPages}
              </div>
              <button
                disabled={safePage === totalPages}
                onClick={() => setPage(safePage + 1)}
                className="h-8 w-8 grid place-items-center rounded-md border border-border disabled:opacity-40 hover:bg-muted"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function SelectField({
  value,
  onChange,
  options,
  label,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  label: string;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-label={label}
      className="h-9 px-2.5 rounded-lg border border-border bg-background text-sm outline-none focus:border-ring transition cursor-pointer"
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}
