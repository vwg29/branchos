"use client";
import { useTranslations } from "next-intl";
import { ManagedList } from "@/components/ui/ManagedList";

export default function Page() {
  const t = useTranslations("app");
  return (
    <ManagedList
      title={t("branches")}
      endpoint="/api/branches"
      fields={[{ name: "name", label: t("branches"), required: true }, { name: "address", label: "العنوان" }, { name: "phone", label: "الهاتف" }]}
      columns={[{ key: "name", label: t("branches") }, { key: "address", label: "العنوان" }, { key: "phone", label: "الهاتف" }]}
    />
  );
}
