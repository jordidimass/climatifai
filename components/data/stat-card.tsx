import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string;
  unit?: string;
  /** Optional rendered element — usually an AnomalyBadge — shown bottom-right. */
  badge?: React.ReactNode;
  /** Optional caption rendered under the headline value. */
  caption?: string;
  className?: string;
}

export function StatCard({
  label,
  value,
  unit,
  badge,
  caption,
  className,
}: StatCardProps) {
  return (
    <article
      className={cn(
        "glass relative flex flex-col gap-3 rounded-xl p-5",
        className,
      )}
    >
      <header className="flex items-center justify-between gap-3">
        <span className="eyebrow">{label}</span>
        {badge}
      </header>
      <div className="flex items-baseline gap-1">
        <span className="numeric text-3xl font-medium tracking-tight">
          {value}
        </span>
        {unit && (
          <span className="numeric text-sm text-muted-foreground">{unit}</span>
        )}
      </div>
      {caption && (
        <p className="text-xs leading-relaxed text-muted-foreground">
          {caption}
        </p>
      )}
    </article>
  );
}
