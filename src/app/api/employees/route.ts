import { z } from "zod";
import { makeCrudRoute, optionalString } from "@/lib/crud-route";

const schema = z.object({
  name: z.string().min(1),
  email: optionalString,
  position: optionalString,
  branchId: optionalString,
  agencyId: optionalString,
});

export const { GET, POST, DELETE } = makeCrudRoute({
  resource: "employees",
  schema,
  list: (ctx) => ctx.db.employees.findMany({ orderBy: { createdAt: "desc" }, include: { branch: true, agency: true } }),
  create: (ctx, data) => ctx.db.employees.create(data),
  remove: (ctx, id) => ctx.db.employees.delete(id),
});
