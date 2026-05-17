import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string;
  unit?: string;

  badge?: React.ReactNode;

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
        "glass relative flex min-w-0 flex-col gap-3 overflow-hidden rounded-xl p-5",
        className,
      )}
    >
      <header className="flex items-start justify-between gap-3">
        <span className="eyebrow min-w-0 flex-1 break-words">{label}</span>
        {badge ? <span className="shrink-0">{badge}</span> : null}
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
