"use client";
import { useTranslations } from "next-intl";
import { ManagedList } from "@/components/ui/ManagedList";

export default function Page() {
  const t = useTranslations("app");
  return (
    <ManagedList
      title={t("regions")}
      endpoint="/api/regions"
      fields={[{ name: "name", label: t("regions"), required: true }]}
      columns={[{ key: "name", label: t("regions") }]}
    />
  );
}
