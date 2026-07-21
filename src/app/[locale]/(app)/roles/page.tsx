"use client";
import { useTranslations } from "next-intl";
import { ManagedList } from "@/components/ui/ManagedList";

export default function Page() {
  const t = useTranslations("app");
  return (
    <ManagedList
      title={t("roles")}
      endpoint="/api/roles"
      fields={[{ name: "name", label: t("roles"), required: true }]}
      columns={[{ key: "name", label: t("roles") }]}
    />
  );
}
