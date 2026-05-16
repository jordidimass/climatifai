import { cn } from "@/lib/utils";

/**
 * Atmospheric backdrop for the Climatifai brand. Reads the three
 * `--mesh-a/b/c` stops + `--mesh-opacity` from the active theme so it
 * re-paints automatically when the user toggles light/dark.
 *
 * Render once near the root layout. Pure CSS, no JS, ships with both
 * server and client trees.
 */
export function GradientMesh({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none fixed inset-0 -z-10 overflow-hidden",
        className,
      )}
    >
      {/* primary radial blobs */}
      <div
        className="absolute -top-1/3 -left-1/4 h-[80vh] w-[80vh] rounded-full blur-[120px]"
        style={{
          background:
            "radial-gradient(circle at 40% 40%, var(--mesh-a) 0%, transparent 65%)",
          opacity: "var(--mesh-opacity)",
        }}
      />
      <div
        className="absolute top-1/4 right-[-15%] h-[70vh] w-[70vh] rounded-full blur-[120px]"
        style={{
          background:
            "radial-gradient(circle at 60% 50%, var(--mesh-b) 0%, transparent 70%)",
          opacity: "var(--mesh-opacity)",
        }}
      />
      <div
        className="absolute bottom-[-20%] left-1/4 h-[65vh] w-[65vh] rounded-full blur-[140px]"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, var(--mesh-c) 0%, transparent 70%)",
          opacity: "var(--mesh-opacity)",
        }}
      />
      {/* film grain — adds atmosphere, dampens the gradient */}
      <div
        className="absolute inset-0 opacity-[0.04] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
        }}
      />
    </div>
  );
}
