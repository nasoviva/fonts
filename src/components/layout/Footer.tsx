import { getTranslations } from "next-intl/server";
import {
  EmailIcon,
  InstagramIcon,
  ThreadsIcon,
  TelegramIcon,
} from "@/components/ui/SocialIcons";

export async function Footer() {
  const t = await getTranslations("footer");

  return (
    <footer className="border-t hairline-dark bg-ink py-10">
      <div className="container-site flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
        <p className="text-meta-label text-cream-faint">
          © {new Date().getFullYear()} — {t("rights")}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8">
          <a
            href={`mailto:${t("emailAddress")}`}
            className="text-meta-label inline-flex items-center gap-2 text-cream-dim hover:text-cream-bright"
          >
            <EmailIcon size={16} />
            {t("emailLabel")}
          </a>
          <a
            href={t("instagramUrl")}
            target="_blank"
            rel="noopener noreferrer"
            className="text-meta-label inline-flex items-center gap-2 text-cream-dim hover:text-cream-bright"
            aria-label="Instagram"
          >
            <InstagramIcon size={16} />
            {t("instagram")}
          </a>
          <a
            href={t("threadsUrl")}
            target="_blank"
            rel="noopener noreferrer"
            className="text-meta-label inline-flex items-center gap-2 text-cream-dim hover:text-cream-bright"
            aria-label="Threads"
          >
            <ThreadsIcon size={16} />
            {t("threads")}
          </a>
          <a
            href={t("telegramUrl")}
            target="_blank"
            rel="noopener noreferrer"
            className="text-meta-label inline-flex items-center gap-2 text-cream-dim hover:text-cream-bright"
            aria-label="Telegram"
          >
            <TelegramIcon size={16} />
            {t("telegram")}
          </a>
        </div>
      </div>
    </footer>
  );
}
