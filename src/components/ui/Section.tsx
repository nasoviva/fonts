import { cn } from "@/lib/cn";

type SectionTone = "dark" | "light";
type SectionSpacing = "default" | "compact" | "tight";

const spacingClass: Record<SectionSpacing, string> = {
  default: "section-padding",
  compact: "section-padding-compact",
  tight: "section-padding-tight",
};

type SectionProps = {
  id?: string;
  tone?: SectionTone;
  spacing?: SectionSpacing;
  className?: string;
  children: React.ReactNode;
  fullWidth?: boolean;
};

export function Section({
  id,
  tone = "dark",
  spacing = "default",
  className,
  children,
  fullWidth = false,
}: SectionProps) {
  return (
    <section
      id={id}
      className={cn(
        spacingClass[spacing],
        tone === "dark" ? "bg-ink text-on-dark" : "bg-cream text-ink",
        className
      )}
    >
      {fullWidth ? children : <div className="container-site">{children}</div>}
    </section>
  );
}
