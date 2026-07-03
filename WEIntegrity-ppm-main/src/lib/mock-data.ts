// Realistic mock data for the Yognito PPM platform
export type Role = "Admin" | "Manager" | "Developer" | "Employee";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar: string;
  title: string;
  team: string;
  status: "online" | "away" | "offline";
}

export interface Project {
  id: string;
  key: string;
  name: string;
  client: string;
  status: "On Track" | "At Risk" | "Delayed" | "Completed";
  priority: "Low" | "Medium" | "High" | "Critical";
  progress: number;
  startDate: string;
  endDate: string;
  budget: number;
  spent: number;
  lead: string;
  members: string[];
  tags: string[];
}

export interface Task {
  id: string;
  key: string;
  title: string;
  projectId: string;
  type: "Story" | "Task" | "Bug" | "Epic";
  status: "Backlog" | "Todo" | "In Progress" | "Review" | "Testing" | "Done";
  priority: "Low" | "Medium" | "High" | "Critical";
  assignee: string;
  reporter: string;
  storyPoints: number;
  sprintId?: string;
  dueDate: string;
  tags: string[];
  description?: string;
}

export interface Sprint {
  id: string;
  name: string;
  goal: string;
  startDate: string;
  endDate: string;
  status: "Planned" | "Active" | "Completed";
  velocity: number;
  capacity: number;
}

const avatar = (seed: string) =>
  `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(seed)}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`;

export const currentUser: User = {
  id: "u-1",
  name: "Aarav Sharma",
  email: "aarav.sharma@yognito.com",
  role: "Admin",
  avatar: avatar("Aarav Sharma"),
  title: "VP of Engineering",
  team: "Leadership",
  status: "online",
};

export const users: User[] = [
  currentUser,
  { id: "u-2", name: "Priya Kapoor", email: "priya@yognito.com", role: "Manager", avatar: avatar("Priya Kapoor"), title: "Engineering Manager", team: "Platform", status: "online" },
  { id: "u-3", name: "Marcus Lee", email: "marcus@yognito.com", role: "Manager", avatar: avatar("Marcus Lee"), title: "Product Manager", team: "Growth", status: "online" },
  { id: "u-4", name: "Sofia Martinez", email: "sofia@yognito.com", role: "Developer", avatar: avatar("Sofia Martinez"), title: "Senior Frontend Engineer", team: "Platform", status: "online" },
  { id: "u-5", name: "Daniel Kim", email: "daniel@yognito.com", role: "Developer", avatar: avatar("Daniel Kim"), title: "Backend Engineer", team: "Platform", status: "away" },
  { id: "u-6", name: "Aisha Patel", email: "aisha@yognito.com", role: "Developer", avatar: avatar("Aisha Patel"), title: "Full-stack Engineer", team: "Growth", status: "online" },
  { id: "u-7", name: "Liam O'Connor", email: "liam@yognito.com", role: "Developer", avatar: avatar("Liam O'Connor"), title: "QA Engineer", team: "Quality", status: "offline" },
  { id: "u-8", name: "Naomi Tanaka", email: "naomi@yognito.com", role: "Developer", avatar: avatar("Naomi Tanaka"), title: "UI Engineer", team: "Design Eng", status: "online" },
  { id: "u-9", name: "Ethan Wright", email: "ethan@yognito.com", role: "Employee", avatar: avatar("Ethan Wright"), title: "DevOps Engineer", team: "Infra", status: "online" },
  { id: "u-10", name: "Chloe Dubois", email: "chloe@yognito.com", role: "Employee", avatar: avatar("Chloe Dubois"), title: "Product Designer", team: "Design", status: "away" },
  { id: "u-11", name: "Rohan Mehta", email: "rohan@yognito.com", role: "Manager", avatar: avatar("Rohan Mehta"), title: "Delivery Lead", team: "Delivery", status: "online" },
  { id: "u-12", name: "Hannah Schmidt", email: "hannah@yognito.com", role: "Developer", avatar: avatar("Hannah Schmidt"), title: "Data Engineer", team: "Data", status: "online" },
];

export const projects: Project[] = [
  { id: "p-1", key: "ATLAS", name: "Atlas Customer Portal", client: "Northwind Health", status: "On Track", priority: "High", progress: 72, startDate: "2026-01-08", endDate: "2026-07-30", budget: 480000, spent: 312000, lead: "u-2", members: ["u-4", "u-5", "u-7", "u-8"], tags: ["Web", "React", "B2B"] },
  { id: "p-2", key: "ORION", name: "Orion Billing Platform", client: "Helios Finance", status: "At Risk", priority: "Critical", progress: 54, startDate: "2025-11-12", endDate: "2026-06-20", budget: 720000, spent: 520000, lead: "u-3", members: ["u-5", "u-6", "u-9", "u-12"], tags: ["FinTech", "Payments"] },
  { id: "p-3", key: "NEBULA", name: "Nebula Analytics Suite", client: "Internal", status: "On Track", priority: "Medium", progress: 41, startDate: "2026-02-01", endDate: "2026-09-15", budget: 360000, spent: 148000, lead: "u-2", members: ["u-6", "u-8", "u-12"], tags: ["Analytics", "Data"] },
  { id: "p-4", key: "VELA", name: "Vela Mobile Banking", client: "First Meridian Bank", status: "Delayed", priority: "High", progress: 38, startDate: "2025-10-04", endDate: "2026-05-10", budget: 920000, spent: 700000, lead: "u-11", members: ["u-4", "u-5", "u-7"], tags: ["Mobile", "iOS", "Android"] },
  { id: "p-5", key: "LUNA", name: "Luna Design System v3", client: "Internal", status: "On Track", priority: "Low", progress: 88, startDate: "2026-01-20", endDate: "2026-06-01", budget: 120000, spent: 92000, lead: "u-2", members: ["u-8", "u-10"], tags: ["Design", "DS"] },
  { id: "p-6", key: "POLARIS", name: "Polaris CRM Migration", client: "Stellar Logistics", status: "Completed", priority: "Medium", progress: 100, startDate: "2025-08-01", endDate: "2026-02-28", budget: 410000, spent: 398000, lead: "u-11", members: ["u-4", "u-6", "u-9"], tags: ["CRM", "Migration"] },
];

export const sprints: Sprint[] = [
  { id: "s-23", name: "ATLAS Sprint 23", goal: "Ship checkout v2 + 3 critical bug fixes", startDate: "2026-05-12", endDate: "2026-05-26", status: "Active", velocity: 42, capacity: 56 },
  { id: "s-22", name: "ATLAS Sprint 22", goal: "Account settings revamp", startDate: "2026-04-28", endDate: "2026-05-11", status: "Completed", velocity: 51, capacity: 54 },
  { id: "s-21", name: "ATLAS Sprint 21", goal: "Notifications overhaul", startDate: "2026-04-14", endDate: "2026-04-27", status: "Completed", velocity: 47, capacity: 56 },
  { id: "s-24", name: "ATLAS Sprint 24", goal: "Performance + Lighthouse 95+", startDate: "2026-05-27", endDate: "2026-06-09", status: "Planned", velocity: 0, capacity: 56 },
];

const taskTitles = [
  "Implement OAuth2 login flow",
  "Refactor checkout state machine",
  "Add unit tests for billing service",
  "Design empty states for dashboard",
  "Fix CLS issue on landing page",
  "Set up GitHub Actions deploy pipeline",
  "Migrate cron jobs to scheduler service",
  "Add audit log for admin actions",
  "Integrate Stripe webhooks v2",
  "Create reusable DataTable component",
  "Improve loading skeletons",
  "Add multi-region failover docs",
  "Wire up real-time presence",
  "Lighthouse pass on settings page",
  "Investigate 502s on /api/orders",
  "Add e2e Playwright suite for auth",
  "Update privacy policy page",
  "Rebuild notification preferences UI",
];

const statuses: Task["status"][] = ["Backlog", "Todo", "In Progress", "Review", "Testing", "Done"];
const priorities: Task["priority"][] = ["Low", "Medium", "High", "Critical"];
const types: Task["type"][] = ["Story", "Task", "Bug", "Epic"];
const tagPool = ["frontend", "backend", "design", "infra", "qa", "perf", "security", "docs"];

export const tasks: Task[] = taskTitles.map((title, i) => ({
  id: `t-${i + 1}`,
  key: `ATLAS-${120 + i}`,
  title,
  projectId: "p-1",
  type: types[i % types.length],
  status: statuses[i % statuses.length],
  priority: priorities[(i + 1) % priorities.length],
  assignee: users[(i % (users.length - 2)) + 2].id,
  reporter: "u-2",
  storyPoints: [1, 2, 3, 5, 8][i % 5],
  sprintId: i < 12 ? "s-23" : "s-24",
  dueDate: new Date(2026, 4, 13 + (i % 14)).toISOString(),
  tags: [tagPool[i % tagPool.length], tagPool[(i + 3) % tagPool.length]],
  description: "Detailed acceptance criteria captured in linked spec.",
}));

export const notifications = [
  { id: "n-1", title: "Priya assigned you ATLAS-128", desc: "Refactor checkout state machine", time: "2m ago", unread: true, type: "task" },
  { id: "n-2", title: "Sprint 23 burndown updated", desc: "5 issues remaining · 4 days left", time: "27m ago", unread: true, type: "sprint" },
  { id: "n-3", title: "Daniel commented on ORION-451", desc: "\"Approving — let's ship after QA pass.\"", time: "1h ago", unread: true, type: "comment" },
  { id: "n-4", title: "Deployment succeeded", desc: "atlas-web @ v2.14.0 → production", time: "3h ago", unread: false, type: "deploy" },
  { id: "n-5", title: "Weekly velocity report", desc: "Platform team velocity up 12%", time: "Yesterday", unread: false, type: "report" },
];

export const activity = [
  { id: "a-1", user: "u-4", action: "moved ATLAS-127 to", target: "In Progress", time: "just now" },
  { id: "a-2", user: "u-2", action: "created sprint", target: "ATLAS Sprint 24", time: "8m ago" },
  { id: "a-3", user: "u-5", action: "closed bug", target: "ORION-448", time: "32m ago" },
  { id: "a-4", user: "u-6", action: "opened PR for", target: "NEBULA-209", time: "1h ago" },
  { id: "a-5", user: "u-8", action: "published Luna v3.2", target: "Design System", time: "2h ago" },
  { id: "a-6", user: "u-11", action: "marked POLARIS as", target: "Completed", time: "Yesterday" },
];

// Charts data
export const velocityData = [
  { sprint: "S18", planned: 48, completed: 45 },
  { sprint: "S19", planned: 52, completed: 49 },
  { sprint: "S20", planned: 50, completed: 52 },
  { sprint: "S21", planned: 56, completed: 47 },
  { sprint: "S22", planned: 54, completed: 51 },
  { sprint: "S23", planned: 56, completed: 42 },
];

export const burndownData = Array.from({ length: 11 }, (_, i) => ({
  day: `D${i}`,
  ideal: Math.max(0, 56 - i * 5.6),
  actual: Math.max(0, 56 - [0, 4, 8, 14, 19, 22, 28, 33, 38, 44, 50][i]),
}));

export const productivityData = [
  { day: "Mon", tasks: 24, hours: 38 },
  { day: "Tue", tasks: 31, hours: 41 },
  { day: "Wed", tasks: 28, hours: 39 },
  { day: "Thu", tasks: 35, hours: 44 },
  { day: "Fri", tasks: 22, hours: 36 },
  { day: "Sat", tasks: 6, hours: 8 },
  { day: "Sun", tasks: 2, hours: 3 },
];

export const projectMixData = [
  { name: "On Track", value: 3, color: "oklch(0.68 0.16 155)" },
  { name: "At Risk", value: 1, color: "oklch(0.78 0.16 75)" },
  { name: "Delayed", value: 1, color: "oklch(0.62 0.23 25)" },
  { name: "Completed", value: 1, color: "oklch(0.65 0.14 230)" },
];

export const headcountData = [
  { month: "Dec", count: 142 },
  { month: "Jan", count: 148 },
  { month: "Feb", count: 154 },
  { month: "Mar", count: 161 },
  { month: "Apr", count: 168 },
  { month: "May", count: 176 },
];

export function userById(id: string) {
  return users.find((u) => u.id === id) ?? currentUser;
}
