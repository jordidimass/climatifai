import { Compass, LineChart, Sparkles } from "lucide-react";

const FEATURES = [
  {
    icon: Compass,
    eyebrow: "Patrones históricos",
    title: "Un siglo de contexto.",
    body: "Consulta datos de observación homogeneizados por región y mes. Entiende la línea base de la que el clima se está alejando.",
  },
  {
    icon: LineChart,
    eyebrow: "Escenarios proyectados",
    title: "El mañana, en varios caminos.",
    body: "Compara proyecciones entre escenarios SSP. Planifica riego, selección varietal y ventanas de cosecha frente a lo que viene.",
  },
  {
    icon: Sparkles,
    eyebrow: "Lecturas por cultivo",
    title: "Agronomía, no solo clima.",
    body: "GDD, días de estrés térmico y riesgo de sequía calculados para tus cultivos reales, no para una curva genérica de temperatura.",
  },
];

export function FeatureGrid() {
  return (
    <section id="features" className="mx-auto max-w-7xl px-6 py-20">
      <div className="mx-auto max-w-2xl text-center">
        <p className="eyebrow">Por qué Climatifai</p>
        <h2 className="mt-3 font-[family-name:var(--font-display)] text-4xl tracking-tight md:text-5xl">
          La señal,{" "}
          <span className="italic text-foreground/80">no el ruido.</span>
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
