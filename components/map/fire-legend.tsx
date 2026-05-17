"use client";

export function FireLegend() {
  return (
    <div className="glass pointer-events-none flex flex-col gap-1.5 rounded-lg px-3 py-2 text-[10px] shadow-sm">
      <p className="eyebrow text-foreground/80">Intensidad FRP</p>
      <div
        className="h-1.5 w-32 rounded-full"
        style={{
          background:
            "linear-gradient(to right, rgba(243,176,59,0.7), rgba(221,107,43,0.85), rgba(198,74,44,0.95), rgba(120,20,8,1))",
        }}
        aria-hidden
      />
      <div className="flex justify-between text-muted-foreground numeric">
        <span>baja</span>
        <span>alta</span>
      </div>
      <p className="mt-1 eyebrow text-foreground/80">Confianza</p>
      <div className="flex items-center gap-2 text-muted-foreground">
        <Dot color="#f3b03b" /> baja
        <Dot color="#dd6b2b" /> nominal
        <Dot color="#9c2a14" /> alta
      </div>
    </div>
  );
}

function Dot({ color }: { color: string }) {
  return (
    <span
      className="inline-block size-2 rounded-full"
      style={{ background: color }}
      aria-hidden
    />
  );
}
