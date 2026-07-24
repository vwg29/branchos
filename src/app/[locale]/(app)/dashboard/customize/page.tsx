"use client";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlassButton } from "@/components/ui/GlassButton";
import { GlassModal } from "@/components/ui/GlassModal";
import { useToast } from "@/components/ui/Feedback";

interface Widget {
  id: string;
  type: "metric" | "list" | "chart";
  position: { x: number; y: number; w: number; h: number };
  config?: Record<string, unknown>;
}

const AVAILABLE_WIDGETS = [
  { id: "branches", type: "metric", label: "Branches Count", icon: "🏢", defaultConfig: { metric: "branches" } },
  { id: "agencies", type: "metric", label: "Agencies Count", icon: "🏛️", defaultConfig: { metric: "agencies" } },
  { id: "employees", type: "metric", label: "Employees Count", icon: "👥", defaultConfig: { metric: "employees" } },
  { id: "tasks", type: "metric", label: "Tasks Count", icon: "📋", defaultConfig: { metric: "tasks" } },
  { id: "announcements", type: "metric", label: "Announcements", icon: "📢", defaultConfig: { metric: "announcements" } },
  { id: "recent-tasks", type: "list", label: "Recent Tasks", icon: "📝", defaultConfig: { resource: "tasks", limit: 5 }, defaultSize: { w: 6, h: 4 } },
  { id: "recent-announcements", type: "list", label: "Recent Announcements", icon: "📢", defaultConfig: { resource: "announcements", limit: 5 }, defaultSize: { w: 6, h: 4 } },
  { id: "branch-performance", type: "chart", label: "Branch Performance", icon: "📊", defaultConfig: { chart: "branch-performance" }, defaultSize: { w: 6, h: 4 } },
  { id: "revenue", type: "chart", label: "Revenue Overview", icon: "💰", defaultConfig: { chart: "revenue" }, defaultSize: { w: 6, h: 4 } },
];

const GRID_COLS = 12;
const GRID_ROWS = 10;

export default function DashboardCustomize() {
  const t = useTranslations("dashboard");
  const { notify } = useToast();
  const [layout, setLayout] = useState<Widget[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [draggedWidget, setDraggedWidget] = useState<Widget | null>(null);

  useEffect(() => {
    loadLayout();
  }, []);

  async function loadLayout() {
    try {
      const res = await fetch("/api/dashboard-layout");
      const data = await res.json();
      setLayout(data.layout || []);
    } catch {
      setLayout([]);
    } finally {
      setLoading(false);
    }
  }

  async function saveLayout() {
    setSaving(true);
    try {
      const res = await fetch("/api/dashboard-layout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ layout }),
      });
      if (res.ok) {
        notify("Layout saved", "success");
      } else {
        notify("Failed to save", "error");
      }
    } catch {
      notify("Failed to save", "error");
    } finally {
      setSaving(false);
    }
  }

  function resetLayout() {
    setLayout([
      { id: "branches", type: "metric", position: { x: 0, y: 0, w: 2, h: 1 }, config: { metric: "branches" } },
      { id: "agencies", type: "metric", position: { x: 2, y: 0, w: 2, h: 1 }, config: { metric: "agencies" } },
      { id: "employees", type: "metric", position: { x: 4, y: 0, w: 2, h: 1 }, config: { metric: "employees" } },
      { id: "tasks", type: "metric", position: { x: 6, y: 0, w: 2, h: 1 }, config: { metric: "tasks" } },
      { id: "announcements", type: "metric", position: { x: 8, y: 0, w: 2, h: 1 }, config: { metric: "announcements" } },
      { id: "recent-tasks", type: "list", position: { x: 0, y: 1, w: 6, h: 4 }, config: { resource: "tasks", limit: 5 } },
      { id: "recent-announcements", type: "list", position: { x: 6, y: 1, w: 6, h: 4 }, config: { resource: "announcements", limit: 5 } },
    ]);
  }

  function addWidget(widgetId: string) {
    const widget = AVAILABLE_WIDGETS.find(w => w.id === widgetId);
    if (!widget) return;

    // Find first available position
    let y = 0;
    while (true) {
      const overlapping = layout.some(w => 
        w.position.y === y && w.position.x === 0
      );
      if (!overlapping) break;
      y++;
    }

    const newWidget: Widget = {
      id: widget.id + "-" + Date.now(),
      type: widget.type,
      position: { x: 0, y, w: widget.defaultSize?.w || 4, h: widget.defaultSize?.h || 2 },
      config: widget.defaultConfig,
    };
    setLayout([...layout, newWidget]);
    setShowAddModal(false);
  }

  function removeWidget(id: string) {
    setLayout(layout.filter(w => w.id !== id));
  }

  function updateWidgetPosition(id: string, position: Widget["position"]) {
    setLayout(layout.map(w => w.id === id ? { ...w, position } : w));
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }

  function handleDrop(e: React.DragEvent, targetId: string) {
    e.preventDefault();
    if (!draggedWidget) return;
    
    const target = layout.find(w => w.id === targetId);
    if (!target) return;

    // Swap positions
    setLayout(layout.map(w => {
      if (w.id === draggedWidget.id) return { ...w, position: target.position };
      if (w.id === targetId) return { ...w, position: draggedWidget.position };
      return w;
    }));
    setDraggedWidget(null);
  }

  function handleDragStart(e: React.DragEvent, widget: Widget) {
    setDraggedWidget(widget);
    e.dataTransfer.effectAllowed = "move";
  }

  function handleDragEnd() {
    setDraggedWidget(null);
  }

  if (loading) {
    return <div className="space-y-4">Loading...</div>;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-h2 text-text-primary">{t("customizeTitle")}</h1>
        <div className="flex gap-2">
          <GlassButton variant="ghost" onClick={resetLayout}>{t("resetLayout")}</GlassButton>
          <GlassButton variant="aura" onClick={saveLayout} disabled={saving}>
            {saving ? t("saving") : t("saveLayout")}
          </GlassButton>
          <GlassButton variant="secondary" onClick={() => setShowAddModal(true)}>
            + {t("addWidget")}
          </GlassButton>
        </div>
      </div>

      <div className="glass-panel p-4 rounded-2xl">
        <div 
          className="relative grid grid-cols-12 gap-2 min-h-[500px] bg-surface/30 rounded-xl p-2"
          onDragOver={handleDragOver}
          onDrop={(e) => {
            e.preventDefault();
            if (!draggedWidget) return;
            // Drop in empty space - find nearest grid position
            const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
            const x = Math.round((e.clientX - rect.left) / (rect.width / GRID_COLS));
            const y = Math.round((e.clientY - rect.top) / 50);
            updateWidgetPosition(draggedWidget.id, { 
              x: Math.max(0, Math.min(GRID_COLS - draggedWidget.position.w, x)), 
              y: Math.max(0, y), 
              w: draggedWidget.position.w, 
              h: draggedWidget.position.h 
            });
            setDraggedWidget(null);
          }}
        >
          {layout.map((widget) => (
            <div
              key={widget.id}
              className={`absolute transition-all duration-200 ${
                draggedWidget?.id === widget.id ? "opacity-50 shadow-glass-elevated z-50" : ""
              }`}
              style={{
                gridColumnStart: widget.position.x + 1,
                gridColumnEnd: `span ${widget.position.w}`,
                gridRowStart: widget.position.y + 1,
                gridRowEnd: `span ${widget.position.h}`,
              }}
              draggable
              onDragStart={(e) => handleDragStart(e, widget)}
              onDragEnd={handleDragEnd}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, widget.id)}
            >
              <GlassCard panel className="h-full flex flex-col">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-label text-text-secondary">{widget.id}</span>
                  <button
                    onClick={(e) => { e.stopPropagation(); removeWidget(widget.id); }}
                    className="p-1 text-text-muted hover:text-rose transition"
                    aria-label="Remove widget"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>
                <div className="flex-1 flex items-center justify-center text-text-muted text-sm">
                  {widget.type === "metric" && "📊 Metric"}
                  {widget.type === "list" && "📋 List"}
                  {widget.type === "chart" && "📈 Chart"}
                </div>
              </GlassCard>
            </div>
          ))}
        </div>
      </div>

      <GlassModal 
        open={showAddModal} 
        onClose={() => setShowAddModal(false)} 
        title={t("addWidget")}
        size="lg"
      >
        <div className="space-y-4">
          <p className="text-text-secondary">{t("addWidgetDescription")}</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-96 overflow-y-auto">
            {AVAILABLE_WIDGETS.map((widget) => (
              <button
                key={widget.id}
                onClick={() => addWidget(widget.id)}
                className="glass-panel p-4 text-start hover:border-aura/30 hover:shadow-glow-aura-subtle transition flex flex-col items-center gap-2"
              >
                <span className="text-3xl">{widget.icon}</span>
                <span className="font-medium text-text-primary">{widget.label}</span>
                <span className="text-xs text-text-muted capitalize">{widget.type}</span>
              </button>
            ))}
          </div>
          </div>
      </GlassModal>
    </div>
  );
}