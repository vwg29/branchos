import { z } from "zod";
import { makeCrudRoute, optionalString } from "@/lib/crud-route";

const schema = z.object({
  title: z.string().min(1),
  body: optionalString,
});

export const { GET, POST, DELETE } = makeCrudRoute({
  resource: "announcements",
  schema,
  list: (ctx) => ctx.db.announcements.findMany({ orderBy: [{ pinned: "desc" }, { createdAt: "desc" }] }),
  create: (ctx, data) => ctx.db.announcements.create(data),
  remove: (ctx, id) => ctx.db.announcements.delete(id),
});
