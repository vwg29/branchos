import { z } from "zod";
import { makeCrudRoute, optionalString } from "@/lib/crud-route";

const schema = z.object({
  name: z.string().min(1),
  url: optionalString,
  category: optionalString,
});

export const { GET, POST, DELETE } = makeCrudRoute({
  resource: "documents",
  schema,
  list: (ctx) => ctx.db.documents.findMany({ orderBy: { createdAt: "desc" } }),
  create: (ctx, data) => ctx.db.documents.create(data),
  remove: (ctx, id) => ctx.db.documents.delete(id),
});
