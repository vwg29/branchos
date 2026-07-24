"use client";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlassButton } from "@/components/ui/GlassButton";
import { GlassInput } from "@/components/ui/GlassInput";
import { GlassModal } from "@/components/ui/GlassModal";
import { useToast } from "@/components/ui/Feedback";

interface Communication {
  id: string;
  subject: string;
  body: string;
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  status: "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";
  category: "GENERAL" | "COMPLAINT" | "ISSUE" | "REQUEST" | "ANNOUNCEMENT";
  fromUser?: { name: string; email: string };
  toUser?: { name: string; email: string };
  toBranch?: { name: string };
  toAgency?: { name: string };
  createdAt: string;
  updatedAt: string;
}

const PRIORITY_COLORS = {
  LOW: "text-violet",
  MEDIUM: "text-amber",
  HIGH: "text-rose",
  URGENT: "text-rose font-bold",
};

const STATUS_COLORS = {
  OPEN: "text-aura",
  IN_PROGRESS: "text-amber",
  RESOLVED: "text-violet",
  CLOSED: "text-text-muted",
};

export default function CommunicationsPage() {
  const t = useTranslations("communication");
  const { notify } = useToast();
  const [items, setItems] = useState<Communication[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<Communication | null>(null);
  const [form, setForm] = useState({
    subject: "", body: "", priority: "MEDIUM" as const, category: "GENERAL" as const,
    toUserId: "", toBranchId: "", toAgencyId: "",
  });
  const [saving, setSaving] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  useEffect(() => {
    loadItems();
  }, [statusFilter, categoryFilter]);

  async function loadItems() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== "all") params.set("status", statusFilter);
      if (categoryFilter !== "all") params.set("category", categoryFilter);
      const res = await fetch(`/api/communications?${params.toString()}`);
      const data = await res.json();
      setItems(data.items || []);
    } catch {
      notify("Failed to load", "error");
    } finally {
      setLoading(false);
    }
  }

  function openNew() {
    setEditingItem(null);
    setForm({ subject: "", body: "", priority: "MEDIUM", category: "COMPLAINT", toUserId: "", toBranchId: "", toAgencyId: "" });
    setShowModal(true);
  }

  function openEdit(item: Communication) {
    setEditingItem(item);
    setForm({ subject: item.subject, body: "", priority: item.priority, category: item.category, toUserId: "", toBranchId: "", toAgencyId: "" });
    setShowModal(true);
  }

  async function submit() {
    setSaving(true);
    try {
      const url = editingItem ? `/api/communications/${editingItem.id}` : "/api/communications";
      const method = editingItem ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingItem ? { status: form.body ? "IN_PROGRESS" : undefined, body: form.body } : form),
      });
      if (res.ok) {
        notify(editingItem ? "Reply sent" : "Message sent", "success");
        setShowModal(false);
        loadItems();
      } else {
        notify("Failed", "error");
      }
    } catch {
      notify("Error", "error");
    } finally {
      setSaving(false);
    }
  }

  async function updateStatus(id: string, status: Communication["status"]) {
    try {
      await fetch(`/api/communications/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      loadItems();
    } catch {
      notify("Failed to update", "error");
    }
  }

  const filteredItems = items;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-h2 text-text-primary">{t("title")}</h1>
        <GlassButton variant="aura" onClick={openNew}>{t("newMessage")}</GlassButton>
      </div>

      <GlassCard panel className="space-y-4">
        <div className="flex flex-wrap gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="glass-surface rounded-xl px-4 py-2 text-sm"
          >
            <option value="all">{t("allStatus")}</option>
            <option value="OPEN">{t("open")}</option>
            <option value="IN_PROGRESS">{t("inProgress")}</option>
            <option value="RESOLVED">{t("resolved")}</option>
            <option value="CLOSED">{t("closed")}</option>
          </select>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="glass-surface rounded-xl px-4 py-2 text-sm"
          >
            <option value="all">{t("allCategories")}</option>
            <option value="COMPLAINT">{t("complaint")}</option>
            <option value="ISSUE">{t("issue")}</option>
            <option value="REQUEST">{t("request")}</option>
            <option value="ANNOUNCEMENT">{t("announcement")}</option>
          </select>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1,2,3].map(i => <div key={i} className="h-16 w-full rounded-xl bg-surface/50 animate-pulse" />)}
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-12 text-text-muted">{t("noMessages")}</div>
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <GlassCard key={item.id} panel className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-text-primary">{item.subject}</h3>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded ${PRIORITY_COLORS[item.priority]}`}>{item.priority}</span>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded ${STATUS_COLORS[item.status]}`}>{item.status}</span>
                      <span className="text-xs text-text-muted">{item.category}</span>
                    </div>
                    <p className="text-text-secondary text-sm mb-2">{item.body}</p>
                    <div className="flex flex-wrap gap-4 text-xs text-text-muted">
                      <span>{t("from")} {item.fromUser?.name || "System"}</span>
                      {item.toUser && <span>{t("to")} {item.toUser.name}</span>}
                      {item.toBranch && <span>{t("toBranch")} {item.toBranch.name}</span>}
                      {item.toAgency && <span>{t("toAgency")} {item.toAgency.name}</span>}
                      <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {item.status === "OPEN" && (
                      <GlassButton size="sm" variant="secondary" onClick={() => updateStatus(item.id, "IN_PROGRESS")}>
                        {t("startWork")}
                      </GlassButton>
                    )}
                    {item.status === "IN_PROGRESS" && (
                      <GlassButton size="sm" variant="aura" onClick={() => updateStatus(item.id, "RESOLVED")}>
                        {t("markResolved")}
                      </GlassButton>
                    )}
                    {item.status === "RESOLVED" && (
                      <GlassButton size="sm" variant="secondary" onClick={() => updateStatus(item.id, "CLOSED")}>
                        {t("close")}
                      </GlassButton>
                    )}
                    {item.status === "CLOSED" && (
                      <GlassButton size="sm" variant="ghost" onClick={() => updateStatus(item.id, "REOPENED")}>
                        {t("reopen")}
                      </GlassButton>
                    )}
                  </div>
                </div>
                {editingItem?.id === item.id && (
                  <div className="mt-4 space-y-3">
                    <GlassInput label={t("reply")} value={form.body} onChange={(e) => setForm({...form, body: e.target.value})} type="textarea" />
                    <div className="flex justify-end gap-2">
                      <GlassButton variant="ghost" onClick={() => setEditingItem(null)}>{t("cancel")}</GlassButton>
                      <GlassButton variant="aura" onClick={submit} disabled={saving}>{saving ? t("saving") : t("sendReply")}</GlassButton>
                    </div>
                  </div>
                )}
              </GlassCard>
            ))}
          </div>
        )}
      </GlassCard>

      <GlassModal open={showModal} onClose={() => setShowModal(false)} title={editingItem ? t("replyTo") + " " + editingItem.subject : t("newMessage")} size="lg">
        <div className="space-y-4">
          {!editingItem && (
            <>
              <GlassInput label={t("subject")} value={form.subject} onChange={(e) => setForm({...form, subject: e.target.value})} />
              <GlassInput label={t("message")} value={form.body} onChange={(e) => setForm({...form, body: e.target.value})} type="textarea" />
              <div className="grid grid-cols-2 gap-4">
                <GlassInput label={t("priority")} type="select" value={form.priority} onChange={(e) => setForm({...form, priority: e.target.value as any})}>
                  <option value="LOW">{t("low")}</option>
                  <option value="MEDIUM">{t("medium")}</option>
                  <option value="HIGH">{t("high")}</option>
                  <option value="URGENT">{t("urgent")}</option>
                </GlassInput>
                <GlassInput label={t("category")} type="select" value={form.category} onChange={(e) => setForm({...form, category: e.target.value as any})}>
                  <option value="COMPLAINT">{t("complaint")}</option>
                  <option value="ISSUE">{t("issue")}</option>
                  <option value="REQUEST">{t("request")}</option>
                  <option value="ANNOUNCEMENT">{t("announcement")}</option>
                </GlassInput>
              </div>
            </>
          )}
          {editingItem && (
            <GlassInput label={t("reply")} value={form.body} onChange={(e) => setForm({...form, body: e.target.value})} type="textarea" />
          )}
          <div className="flex justify-end gap-2 pt-2">
            <GlassButton variant="ghost" onClick={() => setShowModal(false)}>{t("cancel")}</GlassButton>
            <GlassButton variant="aura" onClick={submit} disabled={saving}>{saving ? t("saving") : (editingItem ? t("sendReply") : t("send"))}</GlassButton>
          </div>
        </div>
      </GlassModal>
    </div>
  );
}