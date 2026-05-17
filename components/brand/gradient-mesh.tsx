import { cn } from "@/lib/utils";

export function GradientMesh({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none fixed inset-0 -z-10 overflow-hidden",
        className,
      )}
    >
      <div
        className="absolute -top-1/3 -left-1/4 h-[78vh] w-[78vh] rounded-full blur-[130px]"
        style={{
          background:
            "radial-gradient(circle at 40% 40%, var(--mesh-a) 0%, transparent 65%)",
          opacity: "var(--mesh-opacity)",
        }}
      />
      <div
        className="absolute top-1/4 right-[-15%] h-[68vh] w-[68vh] rounded-full blur-[130px]"
        style={{
          background:
            "radial-gradient(circle at 60% 50%, var(--mesh-b) 0%, transparent 70%)",
          opacity: "var(--mesh-opacity)",
        }}
      />
      <div
        className="absolute bottom-[-20%] left-1/4 h-[64vh] w-[64vh] rounded-full blur-[150px]"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, var(--mesh-c) 0%, transparent 70%)",
          opacity: "var(--mesh-opacity)",
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.04] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(100deg, transparent 0 34px, color-mix(in oklch, var(--primary) 22%, transparent) 34px 35px, transparent 35px 72px)",
        }}
      />
    </div>
  );
}
