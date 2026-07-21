import { z } from "zod";
import { makeCrudRoute, optionalString } from "@/lib/crud-route";

const schema = z.object({
  name: z.string().min(1),
  address: optionalString,
  phone: optionalString,
  regionId: optionalString,
});

export const { GET, POST, DELETE } = makeCrudRoute({
  resource: "branches",
  schema,
  list: (ctx) => ctx.db.branches.findMany({ orderBy: { createdAt: "desc" }, include: { region: true } }),
  create: (ctx, data) => ctx.db.branches.create(data),
  remove: (ctx, id) => ctx.db.branches.delete(id),
});
