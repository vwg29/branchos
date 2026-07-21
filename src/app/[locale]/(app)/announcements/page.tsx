"use client";
import { useTranslations } from "next-intl";
import { ManagedList } from "@/components/ui/ManagedList";

export default function Page() {
  const t = useTranslations("app");
  return (
    <ManagedList
      title={t("announcements")}
      endpoint="/api/announcements"
      fields={[{ name: "title", label: t("announcements"), required: true }, { name: "body", label: "النص", type: "textarea" }]}
      columns={[{ key: "title", label: t("announcements") }]}
    />
  );
}
