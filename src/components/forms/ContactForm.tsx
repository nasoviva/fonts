"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

type ContactFormProps = {
  tone?: "dark" | "light";
  defaultMessage?: string;
};

export function ContactForm({
  tone = "dark",
  defaultMessage = "",
}: ContactFormProps) {
  const t = useTranslations("contact.form");
  const [sent, setSent] = useState(false);
  const [message, setMessage] = useState(defaultMessage);

  const labelClass = cn(
    "text-meta-label mb-2 block",
    tone === "light" ? "text-ink/60" : "text-cream-dim"
  );

  const inputClass = cn(
    "input-underline text-body",
    tone === "light" && "input-underline-light text-ink"
  );

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    console.log("[ContactForm] submit", { message });
    setSent(true);
  }

  if (sent) {
    return (
      <p
        className={cn(
          "text-lead text-center",
          tone === "light" ? "text-ink" : "text-cream"
        )}
      >
        {t("success")}
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-xl space-y-6">
      <div>
        <label htmlFor="name" className={labelClass}>
          {t("name")}
        </label>
        <input id="name" name="name" type="text" required className={inputClass} />
      </div>

      <div>
        <label htmlFor="email" className={labelClass}>
          {t("email")}
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="message" className={labelClass}>
          {t("message")}
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          required
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className={cn(inputClass, "resize-none")}
        />
      </div>

      <div className="flex justify-center pt-2">
        <Button
          type="submit"
          variant={tone === "light" ? "solid-dark" : "solid"}
        >
          {t("submit")}
        </Button>
      </div>
    </form>
  );
}
