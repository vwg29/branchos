// Permission catalog (platform-level). Keys follow "resource:action".
export const PERMISSION_CATALOG: {
  key: string;
  group: string;
  description: string;
}[] = [
  { key: "dashboard:read", group: "dashboard", description: "View dashboard" },
  { key: "branches:read", group: "branches", description: "View branches" },
  { key: "branches:write", group: "branches", description: "Create and edit branches" },
  { key: "agencies:read", group: "agencies", description: "View agencies" },
  { key: "agencies:write", group: "agencies", description: "Create and edit agencies" },
  { key: "regions:read", group: "regions", description: "View regions" },
  { key: "regions:write", group: "regions", description: "Create and edit regions" },
  { key: "employees:read", group: "employees", description: "View employees" },
  { key: "employees:write", group: "employees", description: "Create and edit employees" },
  { key: "roles:read", group: "roles", description: "View roles" },
  { key: "roles:write", group: "roles", description: "Create and edit roles" },
  { key: "tasks:read", group: "tasks", description: "View tasks" },
  { key: "tasks:write", group: "tasks", description: "Create and edit tasks" },
  { key: "announcements:read", group: "announcements", description: "View announcements" },
  { key: "announcements:write", group: "announcements", description: "Create and edit announcements" },
  { key: "performance:read", group: "performance", description: "View performance metrics" },
  { key: "performance:write", group: "performance", description: "Record performance metrics" },
  { key: "documents:read", group: "documents", description: "View documents" },
  { key: "documents:write", group: "documents", description: "Upload and manage documents" },
  { key: "billing:read", group: "billing", description: "View billing and invoices" },
  { key: "settings:read", group: "settings", description: "View workspace settings" },
  { key: "settings:write", group: "settings", description: "Change workspace settings" },
];

// All permission keys — used to grant the workspace owner full access.
export const ALL_PERMISSION_KEYS = PERMISSION_CATALOG.map((p) => p.key);
