import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  locale: "en",
  path: "/admin",
  title: "Admin",
  description: "Private admin area.",
  noIndex: true,
});

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-ink text-cream">
      <Header />
      <main className="pt-16 md:pt-20">{children}</main>
    </div>
  );
}
