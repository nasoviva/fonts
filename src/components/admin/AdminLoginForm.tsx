"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { PasswordInput } from "@/components/ui/PasswordInput";

export function AdminLoginForm() {
  const t = useTranslations("admin.login");
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const email = String(form.get("email") ?? "");
    const password = String(form.get("password") ?? "");

    console.log("[Admin] login submit", { email });

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        console.log("[Admin] login failed", res.status);
        setError(t("error"));
        return;
      }

      console.log("[Admin] login success, redirect to dashboard");
      router.push("/admin/dashboard");
      router.refresh();
    } catch {
      setError(t("errorNetwork"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-12 space-y-8">
      <div>
        <label htmlFor="email" className="text-meta-label mb-2 block text-cream-dim">
          {t("email")}
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="username"
          required
          disabled={loading}
          className="input-underline text-body w-full disabled:opacity-50"
        />
      </div>
      <div>
        <label
          htmlFor="password"
          className="text-meta-label mb-2 block text-cream-dim"
        >
          {t("password")}
        </label>
        <PasswordInput
          id="password"
          required
          disabled={loading}
          showLabel={t("showPassword")}
          hideLabel={t("hidePassword")}
        />
      </div>

      {error && (
        <p className="text-body text-center text-sm text-red-400" role="alert">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-full bg-cream py-3 text-meta-label text-ink hover:bg-cream-muted disabled:opacity-50"
      >
        {loading ? t("submitting") : t("submit")}
      </button>
    </form>
  );
}
