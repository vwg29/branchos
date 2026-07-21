"use client";
import { useTranslations } from "next-intl";
import { ManagedList } from "@/components/ui/ManagedList";

export default function Page() {
  const t = useTranslations("app");
  return (
    <ManagedList
      title={t("documents")}
      endpoint="/api/documents"
      fields={[{ name: "name", label: t("documents"), required: true }, { name: "url", label: "الرابط" }, { name: "category", label: "التصنيف" }]}
      columns={[{ key: "name", label: t("documents") }, { key: "category", label: "التصنيف" }]}
    />
  );
}
