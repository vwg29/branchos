import { z } from "zod";
import { makeCrudRoute, optionalString } from "@/lib/crud-route";

const schema = z.object({
  metric: z.string().min(1),
  value: z.coerce.number().default(0),
  period: optionalString,
  branchId: optionalString,
});

export const { GET, POST, DELETE } = makeCrudRoute({
  resource: "performance",
  schema,
  list: (ctx) => ctx.db.performance.findMany({ orderBy: { createdAt: "desc" } }),
  create: (ctx, data) => ctx.db.performance.create(data),
  remove: (ctx, id) => ctx.db.performance.delete(id),
});
