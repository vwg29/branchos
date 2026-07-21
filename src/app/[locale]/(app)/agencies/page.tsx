"use client";
import { useTranslations } from "next-intl";
import { ManagedList } from "@/components/ui/ManagedList";

export default function Page() {
  const t = useTranslations("app");
  return (
    <ManagedList
      title={t("agencies")}
      endpoint="/api/agencies"
      fields={[{ name: "name", label: t("agencies"), required: true }, { name: "contact", label: "التواصل" }]}
      columns={[{ key: "name", label: t("agencies") }, { key: "contact", label: "التواصل" }]}
    />
  );
}
