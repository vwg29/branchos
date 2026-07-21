"use client";
import { useTranslations } from "next-intl";
import { ManagedList } from "@/components/ui/ManagedList";

export default function Page() {
  const t = useTranslations("app");
  return (
    <ManagedList
      title={t("performance")}
      endpoint="/api/performance"
      fields={[{ name: "metric", label: "المؤشر", required: true }, { name: "value", label: "القيمة", type: "number" }, { name: "period", label: "الفترة" }]}
      columns={[{ key: "metric", label: "المؤشر" }, { key: "value", label: "القيمة" }, { key: "period", label: "الفترة" }]}
    />
  );
}
