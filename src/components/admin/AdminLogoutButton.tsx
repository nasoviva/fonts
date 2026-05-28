"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";

export function AdminLogoutButton() {
  const t = useTranslations("admin.dashboard");
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);
    console.log("[Admin] logout click");

    try {
      await fetch("/api/admin/logout", { method: "POST" });
      console.log("[Admin] logout success");
      router.push("/admin");
      router.refresh();
    } catch {
      console.log("[Admin] logout failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={loading}
      className="rounded-full border hairline-dark px-6 py-3 text-meta-label hover:bg-cream/5 disabled:opacity-50"
    >
      {loading ? t("loggingOut") : t("logout")}
    </button>
  );
}
