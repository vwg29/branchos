"use client";
import { useTranslations } from "next-intl";
import { ManagedList } from "@/components/ui/ManagedList";

export default function Page() {
  const t = useTranslations("app");
  return (
    <ManagedList
      title={t("employees")}
      endpoint="/api/employees"
      fields={[{ name: "name", label: t("employees"), required: true }, { name: "email", label: "البريد" }, { name: "position", label: "المسمى" }]}
      columns={[{ key: "name", label: t("employees") }, { key: "email", label: "البريد" }, { key: "position", label: "المسمى" }]}
    />
  );
}
