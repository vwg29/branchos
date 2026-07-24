import { z } from "zod";
import { makeCrudRoute, optionalString } from "@/lib/crud-route";

const schema = z.object({
  name: z.string().min(1),
  contact: optionalString,
  regionId: optionalString,
});

export const { GET, POST, DELETE } = makeCrudRoute({
  resource: "agencies",
  schema,
  list: (ctx) => ctx.db.agencies.findMany({ orderBy: { createdAt: "desc" }, include: { region: true } }),
  create: (ctx, data) => ctx.db.agencies.create(data),
  remove: (ctx, id) => ctx.db.agencies.delete(id),
});