import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { AdminLoginForm } from "@/components/admin/AdminLoginForm";

export default async function AdminLoginPage() {
  const t = await getTranslations("admin.login");

  return (
    <div className="container-site flex min-h-[calc(100vh-5rem)] flex-col items-center justify-center py-12 md:min-h-[calc(100vh-6rem)]">
      <div className="w-full max-w-md">
        <h1 className="text-display text-center text-3xl text-cream-bright">
          {t("title")}
        </h1>
        <p className="text-body mt-4 text-center text-cream-dim">{t("subtitle")}</p>

        <AdminLoginForm />

        <p className="text-body mt-8 text-center text-sm text-cream-faint">
          {t("note")}
        </p>

        <p className="mt-8 text-center">
          <Link
            href="/"
            className="text-meta-label text-cream-faint hover:text-cream"
          >
            ← {t("backHome")}
          </Link>
        </p>
      </div>
    </div>
  );
}
