import { z } from "zod";
import { makeCrudRoute, optionalString } from "@/lib/crud-route";
import { isBranch, isAgency, canAccessBranch, canAccessAgency } from "@/lib/session";

const schema = z.object({
  name: z.string().min(1),
  email: optionalString,
  position: optionalString,
  branchId: optionalString,
  agencyId: optionalString,
});

function filterEmployees(ctx: any, items: any[]) {
  if (isBranch(ctx)) {
    return items.filter((e) => e.branchId === ctx.branchId);
  }
  if (isAgency(ctx)) {
    return items.filter((e) => e.agencyId === ctx.agencyId);
  }
  return items;
}

export const { GET, POST, DELETE } = makeCrudRoute({
  resource: "employees",
  schema,
  list: async (ctx) => {
    const items = await ctx.db.employees.findMany({ 
      orderBy: { createdAt: "desc" }, 
      include: { branch: true, agency: true } 
    });
    return filterEmployees(ctx, items);
  },
  create: (ctx, data) => {
    // Branch/Agency users can only create employees in their own branch/agency
    if (isBranch(ctx)) {
      data.branchId = ctx.branchId!;
      data.agencyId = undefined;
    } else if (isAgency(ctx)) {
      data.agencyId = ctx.agencyId!;
      data.branchId = undefined;
    }
    return ctx.db.employees.create(data);
  },
  remove: (ctx, id) => ctx.db.employees.delete(id),
});
