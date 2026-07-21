import { Prisma } from "@prisma/client";
import { prisma } from "./prisma";

/**
 * The ONLY place tenant-scoped Prisma queries are allowed.
 * Every read/write injects tenantId from the trusted session — never from client input.
 *
 * Guide 5.5: use ready-made Prisma.* types (Prisma.BranchFindManyArgs, ...) instead of
 * Parameters<PrismaClient[...]>, and Omit<Prisma.XUncheckedCreateInput, "tenantId"> for
 * creates so foreign keys (assigneeId, branchId, ...) are passed as plain values.
 */
export class ScopedDb {
  constructor(private readonly tenantId: string) {}

  private scopeWhere<T extends { where?: unknown }>(args: T): T {
    const where = (args.where ?? {}) as Record<string, unknown>;
    return { ...args, where: { ...where, tenantId: this.tenantId } } as T;
  }

  // --- Regions ---
  regions = {
    findMany: (args: Prisma.RegionFindManyArgs = {}) =>
      prisma.region.findMany(this.scopeWhere(args)),
    findFirst: (args: Prisma.RegionFindFirstArgs = {}) =>
      prisma.region.findFirst(this.scopeWhere(args)),
    count: (args: Prisma.RegionCountArgs = {}) =>
      prisma.region.count(this.scopeWhere(args)),
    create: (data: Omit<Prisma.RegionUncheckedCreateInput, "tenantId">) =>
      prisma.region.create({ data: { ...data, tenantId: this.tenantId } }),
    update: (id: string, data: Prisma.RegionUncheckedUpdateInput) =>
      prisma.region.updateMany({ where: { id, tenantId: this.tenantId }, data }),
    delete: (id: string) =>
      prisma.region.deleteMany({ where: { id, tenantId: this.tenantId } }),
  };

  // --- Branches ---
  branches = {
    findMany: (args: Prisma.BranchFindManyArgs = {}) =>
      prisma.branch.findMany(this.scopeWhere(args)),
    findFirst: (args: Prisma.BranchFindFirstArgs = {}) =>
      prisma.branch.findFirst(this.scopeWhere(args)),
    count: (args: Prisma.BranchCountArgs = {}) =>
      prisma.branch.count(this.scopeWhere(args)),
    create: (data: Omit<Prisma.BranchUncheckedCreateInput, "tenantId">) =>
      prisma.branch.create({ data: { ...data, tenantId: this.tenantId } }),
    update: (id: string, data: Prisma.BranchUncheckedUpdateInput) =>
      prisma.branch.updateMany({ where: { id, tenantId: this.tenantId }, data }),
    delete: (id: string) =>
      prisma.branch.deleteMany({ where: { id, tenantId: this.tenantId } }),
  };

  // --- Agencies ---
  agencies = {
    findMany: (args: Prisma.AgencyFindManyArgs = {}) =>
      prisma.agency.findMany(this.scopeWhere(args)),
    findFirst: (args: Prisma.AgencyFindFirstArgs = {}) =>
      prisma.agency.findFirst(this.scopeWhere(args)),
    count: (args: Prisma.AgencyCountArgs = {}) =>
      prisma.agency.count(this.scopeWhere(args)),
    create: (data: Omit<Prisma.AgencyUncheckedCreateInput, "tenantId">) =>
      prisma.agency.create({ data: { ...data, tenantId: this.tenantId } }),
    update: (id: string, data: Prisma.AgencyUncheckedUpdateInput) =>
      prisma.agency.updateMany({ where: { id, tenantId: this.tenantId }, data }),
    delete: (id: string) =>
      prisma.agency.deleteMany({ where: { id, tenantId: this.tenantId } }),
  };

  // --- Employees ---
  employees = {
    findMany: (args: Prisma.EmployeeFindManyArgs = {}) =>
      prisma.employee.findMany(this.scopeWhere(args)),
    findFirst: (args: Prisma.EmployeeFindFirstArgs = {}) =>
      prisma.employee.findFirst(this.scopeWhere(args)),
    count: (args: Prisma.EmployeeCountArgs = {}) =>
      prisma.employee.count(this.scopeWhere(args)),
    create: (data: Omit<Prisma.EmployeeUncheckedCreateInput, "tenantId">) =>
      prisma.employee.create({ data: { ...data, tenantId: this.tenantId } }),
    update: (id: string, data: Prisma.EmployeeUncheckedUpdateInput) =>
      prisma.employee.updateMany({ where: { id, tenantId: this.tenantId }, data }),
    delete: (id: string) =>
      prisma.employee.deleteMany({ where: { id, tenantId: this.tenantId } }),
  };

  // --- Roles ---
  roles = {
    findMany: (args: Prisma.RoleFindManyArgs = {}) =>
      prisma.role.findMany(this.scopeWhere(args)),
    findFirst: (args: Prisma.RoleFindFirstArgs = {}) =>
      prisma.role.findFirst(this.scopeWhere(args)),
    count: (args: Prisma.RoleCountArgs = {}) =>
      prisma.role.count(this.scopeWhere(args)),
    create: (data: Omit<Prisma.RoleUncheckedCreateInput, "tenantId">) =>
      prisma.role.create({ data: { ...data, tenantId: this.tenantId } }),
    update: (id: string, data: Prisma.RoleUncheckedUpdateInput) =>
      prisma.role.updateMany({ where: { id, tenantId: this.tenantId }, data }),
    delete: (id: string) =>
      prisma.role.deleteMany({ where: { id, tenantId: this.tenantId } }),
  };

  // --- Tasks (foreign keys assigneeId/branchId/agencyId passed as plain values) ---
  tasks = {
    findMany: (args: Prisma.TaskFindManyArgs = {}) =>
      prisma.task.findMany(this.scopeWhere(args)),
    findFirst: (args: Prisma.TaskFindFirstArgs = {}) =>
      prisma.task.findFirst(this.scopeWhere(args)),
    count: (args: Prisma.TaskCountArgs = {}) =>
      prisma.task.count(this.scopeWhere(args)),
    create: (data: Omit<Prisma.TaskUncheckedCreateInput, "tenantId">) =>
      prisma.task.create({ data: { ...data, tenantId: this.tenantId } }),
    update: (id: string, data: Prisma.TaskUncheckedUpdateInput) =>
      prisma.task.updateMany({ where: { id, tenantId: this.tenantId }, data }),
    delete: (id: string) =>
      prisma.task.deleteMany({ where: { id, tenantId: this.tenantId } }),
  };

  // --- Announcements ---
  announcements = {
    findMany: (args: Prisma.AnnouncementFindManyArgs = {}) =>
      prisma.announcement.findMany(this.scopeWhere(args)),
    count: (args: Prisma.AnnouncementCountArgs = {}) =>
      prisma.announcement.count(this.scopeWhere(args)),
    create: (data: Omit<Prisma.AnnouncementUncheckedCreateInput, "tenantId">) =>
      prisma.announcement.create({ data: { ...data, tenantId: this.tenantId } }),
    update: (id: string, data: Prisma.AnnouncementUncheckedUpdateInput) =>
      prisma.announcement.updateMany({ where: { id, tenantId: this.tenantId }, data }),
    delete: (id: string) =>
      prisma.announcement.deleteMany({ where: { id, tenantId: this.tenantId } }),
  };

  // --- Performance metrics ---
  performance = {
    findMany: (args: Prisma.PerformanceMetricFindManyArgs = {}) =>
      prisma.performanceMetric.findMany(this.scopeWhere(args)),
    count: (args: Prisma.PerformanceMetricCountArgs = {}) =>
      prisma.performanceMetric.count(this.scopeWhere(args)),
    create: (data: Omit<Prisma.PerformanceMetricUncheckedCreateInput, "tenantId">) =>
      prisma.performanceMetric.create({ data: { ...data, tenantId: this.tenantId } }),
    delete: (id: string) =>
      prisma.performanceMetric.deleteMany({ where: { id, tenantId: this.tenantId } }),
  };

  // --- Documents ---
  documents = {
    findMany: (args: Prisma.DocumentFindManyArgs = {}) =>
      prisma.document.findMany(this.scopeWhere(args)),
    count: (args: Prisma.DocumentCountArgs = {}) =>
      prisma.document.count(this.scopeWhere(args)),
    create: (data: Omit<Prisma.DocumentUncheckedCreateInput, "tenantId">) =>
      prisma.document.create({ data: { ...data, tenantId: this.tenantId } }),
    delete: (id: string) =>
      prisma.document.deleteMany({ where: { id, tenantId: this.tenantId } }),
  };

  // --- Invoices (billing) ---
  billing = {
    findMany: (args: Prisma.InvoiceFindManyArgs = {}) =>
      prisma.invoice.findMany(this.scopeWhere(args)),
    count: (args: Prisma.InvoiceCountArgs = {}) =>
      prisma.invoice.count(this.scopeWhere(args)),
    create: (data: Omit<Prisma.InvoiceUncheckedCreateInput, "tenantId">) =>
      prisma.invoice.create({ data: { ...data, tenantId: this.tenantId } }),
  };

  // --- Notifications ---
  notifications = {
    findMany: (args: Prisma.NotificationFindManyArgs = {}) =>
      prisma.notification.findMany(this.scopeWhere(args)),
    count: (args: Prisma.NotificationCountArgs = {}) =>
      prisma.notification.count(this.scopeWhere(args)),
    create: (data: Omit<Prisma.NotificationUncheckedCreateInput, "tenantId">) =>
      prisma.notification.create({ data: { ...data, tenantId: this.tenantId } }),
    markRead: (id: string) =>
      prisma.notification.updateMany({
        where: { id, tenantId: this.tenantId },
        data: { read: true },
      }),
  };

  // --- Settings ---
  settings = {
    get: () => prisma.tenantSettings.findUnique({ where: { tenantId: this.tenantId } }),
    upsert: (data: Omit<Prisma.TenantSettingsUncheckedCreateInput, "tenantId" | "id">) =>
      prisma.tenantSettings.upsert({
        where: { tenantId: this.tenantId },
        update: data,
        create: { ...data, tenantId: this.tenantId },
      }),
  };
}

export function scopedDb(tenantId: string): ScopedDb {
  return new ScopedDb(tenantId);
}
