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
            Interpretación climática para tu combinación región + cultivo. Las
            respuestas son orientativas; valida siempre con campo y datos
            locales.
          </>
        }
      />
      <InsightsChat />
    </div>
  );
}
