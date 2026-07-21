import { z } from "zod";
import { makeCrudRoute, optionalString } from "@/lib/crud-route";

const schema = z.object({
  title: z.string().min(1),
  description: optionalString,
  status: z.enum(["TODO", "IN_PROGRESS", "DONE", "BLOCKED"]).default("TODO"),
  assigneeId: optionalString,
  branchId: optionalString,
  agencyId: optionalString,
});

export const { GET, POST, DELETE } = makeCrudRoute({
  resource: "tasks",
  schema,
  list: (ctx) => ctx.db.tasks.findMany({ orderBy: { createdAt: "desc" }, include: { assignee: true, branch: true } }),
  create: (ctx, data) => ctx.db.tasks.create(data),
  remove: (ctx, id) => ctx.db.tasks.delete(id),
});
