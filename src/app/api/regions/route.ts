import { z } from "zod";
import { makeCrudRoute } from "@/lib/crud-route";

const schema = z.object({ name: z.string().min(1) });

export const { GET, POST, DELETE } = makeCrudRoute({
  resource: "regions",
  schema,
  list: (ctx) => ctx.db.regions.findMany({ orderBy: { name: "asc" } }),
  create: (ctx, data) => ctx.db.regions.create(data),
  remove: (ctx, id) => ctx.db.regions.delete(id),
});
