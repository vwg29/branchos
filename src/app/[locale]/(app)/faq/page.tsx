"use client";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlassButton } from "@/components/ui/GlassButton";
import { GlassInput } from "@/components/ui/GlassInput";
import { GlassModal } from "@/components/ui/GlassModal";
import { useToast } from "@/components/ui/Feedback";

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  order: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

const CATEGORIES = ["general", "billing", "setup", "features", "permissions", "integrations", "troubleshooting"];

export default function FAQPage() {
  const t = useTranslations("faq");
  const { notify } = useToast();
  const [items, setItems] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<FAQ | null>(null);
  const [form, setForm] = useState({
    question: "", answer: "", category: "general", order: 0, isPublished: true,
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadItems();
  }, []);

  async function loadItems() {
    setLoading(true);
    try {
      const res = await fetch("/api/faq");
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
    setForm({ question: "", answer: "", category: "general", order: 0, isPublished: true });
    setShowModal(true);
  }

  function openEdit(item: FAQ) {
    setEditingItem(item);
    setForm({ question: item.question, answer: item.answer, category: item.category, order: item.order, isPublished: item.isPublished });
    setShowModal(true);
  }

  async function submit() {
    setSaving(true);
    try {
      const url = editingItem ? `/api/faq/${editingItem.id}` : "/api/faq";
      const method = editingItem ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        notify(editingItem ? "Updated" : "Created", "success");
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

  async function deleteItem(id: string) {
    if (!confirm("Delete this FAQ?")) return;
    try {
      await fetch(`/api/faq/${id}`, { method: "DELETE" });
      notify("Deleted", "success");
      loadItems();
    } catch {
      notify("Failed to delete", "error");
    }
  }

  const grouped = items.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, FAQ[]>);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-h2 text-text-primary">{t("title")}</h1>
        <GlassButton variant="aura" onClick={openNew}>{t("addFAQ")}</GlassButton>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1,2,3].map(i => <div key={i} className="h-24 w-full rounded-xl bg-surface/50 animate-pulse" />)}
        </div>
      ) : items.length === 0 ? (
        <GlassCard panel className="text-center py-12 text-text-muted">
          {t("noFAQs")}
        </GlassCard>
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).map(([category, faqs]) => (
            <GlassCard panel key={category} className="space-y-3">
              <h3 className="text-h4 font-semibold text-text-primary capitalize">{category}</h3>
              <div className="space-y-2">
                {faqs.sort((a, b) => a.order - b.order).map((faq) => (
                  <div key={faq.id} className="group">
                    <div className="flex items-start justify-between p-4 rounded-xl bg-surface/50 hover:bg-surface transition-colors">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-text-primary">{faq.question}</h4>
                        <p className="text-text-secondary text-sm mt-1">{faq.answer}</p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-text-muted">
                          <span>{faq.isPublished ? "Published" : "Draft"}</span>
                          <span>Order: {faq.order}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <GlassButton size="sm" variant="ghost" onClick={() => openEdit(faq)}>
                          Edit
                        </GlassButton>
                        <GlassButton size="sm" variant="danger" onClick={() => deleteItem(faq.id)}>
                          Delete
                        </GlassButton>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          ))}
        </div>
      )}

      <GlassModal open={showModal} onClose={() => setShowModal(false)} title={editingItem ? "Edit FAQ" : "New FAQ"} size="lg">
        <div className="space-y-4">
          <GlassInput label={t("question")} value={form.question} onChange={(e) => setForm({...form, question: e.target.value})} />
          <GlassInput label={t("answer")} value={form.answer} onChange={(e) => setForm({...form, answer: e.target.value})} type="textarea" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <GlassInput label={t("category")} type="select" value={form.category} onChange={(e) => setForm({...form, category: e.target.value})}>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </GlassInput>
            <GlassInput label={t("order")} type="number" value={form.order} onChange={(e) => setForm({...form, order: parseInt(e.target.value)})} />
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={form.isPublished} onChange={(e) => setForm({...form, isPublished: e.target.checked})} className="rounded border-border" />
              <span className="text-text-secondary">{t("published")}</span>
            </label>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <GlassButton variant="ghost" onClick={() => setShowModal(false)}>{t("cancel")}</GlassButton>
            <GlassButton variant="aura" onClick={submit} disabled={saving}>{saving ? t("saving") : t("save")}</GlassButton>
          </div>
        </div>
      </GlassModal>
    </div>
  );
}