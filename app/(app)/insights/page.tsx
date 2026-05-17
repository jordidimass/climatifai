import { InsightsAnimatedHero } from "./_components/insights-animated-hero";
import { InsightsChat } from "./_components/insights-chat";

export default function InsightsPage() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-10 pb-10">
      <InsightsAnimatedHero
        eyebrow="Inteligencia agrícola"
        title="Hallazgos con IA"
        description={
          <>
            Interpretación climática para tu región y cultivo. Usá{" "}
            <strong className="font-medium text-foreground">
              Ir a Hallazgos
            </strong>{" "}
            en el resultado de Analizar siembra: se copian en la dirección los
            mismos datos (región del catálogo, cultivo, fecha y punto
            geocodificado cuando exista).
          </>
        }
      />
      <InsightsChat />
    </div>
  );
}
