import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { AdminTable } from "@/components/admin/AdminTable";
import { AdminLogoutButton } from "@/components/admin/AdminLogoutButton";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export default async function AdminDashboardPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("admin.dashboard");

  return (
    <div className="container-site py-12 md:py-16">
      <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-display text-3xl text-cream-bright">{t("title")}</h1>
        <div className="flex flex-wrap gap-3 sm:gap-4">
          <Link
            href="/admin/taxonomy"
            className="rounded-full border hairline-dark px-6 py-3 text-meta-label hover:bg-cream/5"
          >
            {t("taxonomy")}
          </Link>
          <Link
            href="/admin/artwork/new"
            className="rounded-full bg-cream px-6 py-3 text-meta-label text-ink hover:bg-cream-muted"
          >
            {t("add")}
          </Link>
          <AdminLogoutButton />
        </div>
      </div>
      <AdminTable />
    </div>
  );
}
