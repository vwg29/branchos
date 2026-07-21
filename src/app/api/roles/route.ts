import { z } from "zod";
import { makeCrudRoute } from "@/lib/crud-route";

const schema = z.object({
  name: z.string().min(1),
  permissions: z.array(z.string()).default([]),
});

export const { GET, POST, DELETE } = makeCrudRoute({
  resource: "roles",
  schema,
  list: (ctx) => ctx.db.roles.findMany({ orderBy: { createdAt: "asc" } }),
  create: (ctx, data) => ctx.db.roles.create(data),
  remove: (ctx, id) => ctx.db.roles.delete(id),
});
