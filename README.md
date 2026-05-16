# Climatifai

Agricultural climate intelligence — compare historical climate patterns
against current and projected conditions for the crops and regions you
care about.

This repository is a **base scaffold**: design system, routes, state,
and BFF API stubs are in place. Real climate data and the AI insights
surface are next.

---

## Stack

| Concern    | Choice                                                  |
| ---------- | ------------------------------------------------------- |
| Framework  | Next.js 16 (App Router, TypeScript, Turbopack default)  |
| Styling    | Tailwind CSS v4 (CSS-first `@theme`) + shadcn/ui        |
| Theming    | `next-themes` · light default · dark toggle             |
| Maps       | `react-map-gl/mapbox` + Mapbox GL JS                    |
| Charts     | `recharts`                                              |
| State      | `zustand` (selection + climate cache)                   |
| API layer  | Route Handlers in `app/api/` acting as BFF              |
| AI         | Vercel AI SDK + AI Gateway (Claude Sonnet 4.6 default)  |
| Validation | `zod` (env + route inputs)                              |

## Quick start

```bash
pnpm install
cp .env.local.example .env.local      # fill in tokens — both are optional
pnpm dev                               # http://localhost:3000
```

Useful scripts:

```bash
pnpm dev          # Next dev server (Turbopack)
pnpm build        # Production build
pnpm start        # Run the production build locally
pnpm typecheck    # tsc --noEmit
pnpm lint         # ESLint flat config
```

## Environment

See `.env.local.example`. Both vars are **optional**:

- `NEXT_PUBLIC_MAPBOX_TOKEN` — when unset, the dashboard renders a styled
  placeholder card instead of the live map. Get a free token at
  <https://account.mapbox.com/access-tokens>.
- `AI_GATEWAY_API_KEY` — needed only when you want to exercise
  `POST /api/ai/chat`. Create one in the Vercel AI Gateway dashboard.

## Folder map

```
app/
  (marketing)/          marketing chrome — landing page
  (app)/                authenticated/app chrome — sidebar + topbar
    dashboard/          map + stats + chart placeholder
  api/
    ai/chat/            streaming chat via AI Gateway → Claude
    climate/historical/ BFF stub returning synthetic series
    climate/projected/  BFF stub with scenario param
    crops/              static crop catalog
    regions/            static region catalog
  layout.tsx            root — fonts, ThemeProvider, gradient mesh
  globals.css           Tailwind v4 + @theme tokens (light + dark)
  error.tsx, not-found.tsx

components/
  brand/                Logo, GradientMesh (signature visual)
  layout/               SiteHeader/Footer, AppSidebar/Topbar, ThemeToggle
  marketing/            Hero, FeatureGrid, CtaSection
  data/                 StatCard, AnomalyBadge, ChartShell
  selection/            CropPicker, RegionPicker
  map/                  RegionMap (react-map-gl wrapper)
  theme/                ThemeProvider (next-themes wrapper)
  ui/                   shadcn primitives (generated)

lib/
  utils.ts              cn() helper (shadcn)
  env.ts                zod-validated env access
  ai/gateway.ts         AI Gateway client + system prompt
  api/climate.ts        Server-side climate fetcher (stub)
  api/crops.ts          Static crop catalog
  api/regions.ts        Static region catalog

stores/
  selection-store.ts    Selected region + crop (Zustand)
  climate-store.ts      Climate series cache

types/
  climate.ts            ClimateSeries, ClimatePoint, Anomaly, TimeRange
  crop.ts               Crop
  region.ts             Region
```

## Design system

The aesthetic is **atmospheric / climate-cinematic**: warm bone in light
mode, deep night-sky indigo in dark mode, with a soft gradient-mesh
backdrop and glassmorphic panels. Every color, radius, shadow, font,
and gradient stop is exposed as a CSS variable in `app/globals.css`
inside the `:root` and `.dark` blocks. Components reference tokens
(`bg-card`, `text-primary`, `border-anomaly-warm/30`) — never raw hex.

### Typography

- **Display** — Instrument Serif (Google Fonts).
- **Body** — Geist Sans (via the `geist` package).
- **Mono** — Geist Mono (used for numerical readouts).

> **Note on Söhne**: the original design conversation referenced Söhne
> by Klim Type Foundry as the body face. Söhne is a paid font, so this
> scaffold ships with Geist Sans as a refined free analog. To swap in
> Söhne later, replace the `GeistSans` import in `app/layout.tsx` with a
> `next/font/local` declaration pointing at your licensed `.woff2`
> files, and keep the `--font-sans` alias in `app/globals.css` pointing
> at whichever variable name you set.

### Utilities

A few non-shadcn utility classes live in `app/globals.css`:

- `.glass` — the signature glassmorphic surface.
- `.hairline` — soft horizontal divider used in data panels.
- `.numeric` — mono + tabular-nums for stat readouts.
- `.eyebrow` — small uppercase tracked label used above headings.

## Smoke-testing the BFF

```bash
# Static catalogs
curl http://localhost:3000/api/crops   | jq
curl http://localhost:3000/api/regions | jq

# Climate stubs (deterministic synthetic series)
curl 'http://localhost:3000/api/climate/historical?regionId=es-cat&cropId=maize&from=2015-01&to=2024-12' \
  | jq '.points | length'

curl 'http://localhost:3000/api/climate/projected?regionId=es-cat&cropId=maize&from=2031-01&to=2050-12&scenario=ssp3-7.0' \
  | jq '.scenario, (.points | length)'
```

## Smoke-testing AI chat

Requires `AI_GATEWAY_API_KEY` set in `.env.local`.

```bash
curl -N -X POST http://localhost:3000/api/ai/chat \
  -H 'content-type: application/json' \
  -d '{
    "messages": [
      { "id": "1", "role": "user",
        "parts": [{ "type": "text", "text": "Summarize maize climate risk in Catalonia under SSP3-7.0." }] }
    ]
  }'
```

## What's NOT in the scaffold (next sessions)

- Real climate data integration (NASA POWER / Open-Meteo / Copernicus).
- The `/compare` route — side-by-side historical vs. projected.
- The `/insights` route — the AI chat surface (the endpoint exists, the
  page does not).
- Auth, persistence, and saved scenarios.
- A real Mapbox style customized to Climatifai's palette.
