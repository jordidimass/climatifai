import { Compass, LineChart, Sparkles } from "lucide-react";

const FEATURES = [
  {
    icon: Compass,
    eyebrow: "Historical patterns",
    title: "A century of context.",
    body: "Pull homogenized observation data for any region down to the month. See the baseline the climate is moving away from.",
  },
  {
    icon: LineChart,
    eyebrow: "Projected scenarios",
    title: "Tomorrow, in five tracks.",
    body: "Side-by-side projections across SSP scenarios. Plan irrigation, varietal selection, and harvest windows against what's coming.",
  },
  {
    icon: Sparkles,
    eyebrow: "Crop-aware insights",
    title: "Agronomy, not just weather.",
    body: "GDD, heat-stress days, drought risk — calculated for the actual crops you grow, not a generic temperature curve.",
  },
];

export function FeatureGrid() {
  return (
    <section id="features" className="mx-auto max-w-7xl px-6 py-20">
      <div className="mx-auto max-w-2xl text-center">
        <p className="eyebrow">Why Climatifai</p>
        <h2 className="mt-3 font-[family-name:var(--font-display)] text-4xl tracking-tight md:text-5xl">
          The signal,{" "}
          <span className="italic text-foreground/80">not the static.</span>
        </h2>
      </div>

      <div className="mt-14 grid gap-4 md:grid-cols-3">
        {FEATURES.map((f) => {
          const Icon = f.icon;
          return (
            <article
              key={f.title}
              className="glass group relative flex flex-col gap-4 rounded-2xl p-6 transition-transform hover:-translate-y-0.5"
            >
              <div className="inline-flex size-10 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                <Icon className="size-5" aria-hidden="true" />
              </div>
              <p className="eyebrow">{f.eyebrow}</p>
              <h3 className="font-[family-name:var(--font-display)] text-2xl leading-tight tracking-tight">
                {f.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {f.body}
              </p>
              <div className="hairline mt-auto" />
            </article>
          );
        })}
      </div>
    </section>
  );
}
