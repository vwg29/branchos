"use client";
import { useTranslations } from "next-intl";
import { ManagedList } from "@/components/ui/ManagedList";

export default function Page() {
  const t = useTranslations("app");
  return (
    <ManagedList
      title={t("tasks")}
      endpoint="/api/tasks"
      fields={[{ name: "title", label: t("tasks"), required: true }, { name: "description", label: "الوصف", type: "textarea" }]}
      columns={[{ key: "title", label: t("tasks") }, { key: "status", label: "الحالة" }]}
    />
  );
}
