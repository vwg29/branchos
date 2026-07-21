"use client";
import { useEffect, useState, type ReactNode } from "react";
import { useTranslations } from "next-intl";
import { GlassCard } from "./GlassCard";
import { GlassButton } from "./GlassButton";
import { GlassInput } from "./GlassInput";
import { GlassModal } from "./GlassModal";
import { EmptyState, Skeleton, useToast } from "./Feedback";

export interface Field {
  name: string;
  label: string;
  type?: "text" | "number" | "textarea";
  required?: boolean;
}

export interface ManagedListProps<T extends { id: string }> {
  title: string;
  endpoint: string; // e.g. "/api/branches"
  fields: Field[];
  columns: { key: string; label: string; render?: (row: T) => ReactNode }[];
}

// A reusable CRUD surface: fetches a scoped list, renders it, and creates items.
// Every module page (branches, agencies, ...) is a thin wrapper over this.
export function ManagedList<T extends { id: string }>({
  title,
  endpoint,
  fields,
  columns,
}: ManagedListProps<T>) {
  const t = useTranslations("app");
  const { notify } = useToast();
  const [rows, setRows] = useState<T[] | null>(null);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  async function load() {
    try {
      const res = await fetch(endpoint);
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setRows(data.items ?? []);
    } catch {
      setRows([]);
      notify(t("error"), "error");
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endpoint]);

  async function submit() {
    setSaving(true);
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error(await res.text());
      notify(t("save"));
      setOpen(false);
      setForm({});
      await load();
    } catch {
      notify(t("error"), "error");
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: string) {
    try {
      const res = await fetch(`${endpoint}?id=${encodeURIComponent(id)}`, { method: "DELETE" });
      if (!res.ok) throw new Error(await res.text());
      await load();
    } catch {
      notify(t("error"), "error");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-white">{title}</h1>
        <GlassButton onClick={() => setOpen(true)}>{t("add")}</GlassButton>
      </div>

      {rows === null ? (
        <div className="space-y-3">
          <Skeleton className="h-14 w-full" />
          <Skeleton className="h-14 w-full" />
          <Skeleton className="h-14 w-full" />
        </div>
      ) : rows.length === 0 ? (
        <EmptyState
          title={t("empty")}
          hint={t("emptyHint")}
          action={<GlassButton onClick={() => setOpen(true)}>{t("add")}</GlassButton>}
        />
      ) : (
        <GlassCard className="overflow-x-auto p-0">
          <table className="w-full text-start text-sm">
            <thead className="text-white/60">
              <tr>
                {columns.map((c) => (
                  <th key={c.key} className="px-4 py-3 text-start font-medium">{c.label}</th>
                ))}
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="border-t border-white/8">
                  {columns.map((c) => (
                    <td key={c.key} className="px-4 py-3 text-white/90">
                      {c.render ? c.render(row) : String((row as Record<string, unknown>)[c.key] ?? "-")}
                    </td>
                  ))}
                  <td className="px-4 py-3 text-end">
                    <button onClick={() => remove(row.id)} className="text-rose hover:underline">
                      {t("delete")}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </GlassCard>
      )}

      <GlassModal open={open} onClose={() => setOpen(false)} title={title}>
        <div className="space-y-4">
          {fields.map((f) => (
            <GlassInput
              key={f.name}
              label={f.label}
              type={f.type === "number" ? "number" : "text"}
              value={form[f.name] ?? ""}
              onChange={(e) => setForm((s) => ({ ...s, [f.name]: e.target.value }))}
            />
          ))}
          <div className="flex justify-end gap-2 pt-2">
            <GlassButton variant="ghost" onClick={() => setOpen(false)}>{t("cancel")}</GlassButton>
            <GlassButton onClick={submit} disabled={saving}>
              {saving ? t("loading") : t("save")}
            </GlassButton>
          </div>
        </div>
      </GlassModal>
    </div>
  );
}
