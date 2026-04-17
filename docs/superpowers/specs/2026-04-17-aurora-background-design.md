# Aurora Background + Glass Cards — Design Spec

**Date:** 2026-04-17
**Status:** Draft, pending review
**Branch:** `hwl/bg`

## Goal

Replace the static sage background with an animated aurora gradient mesh that matches the "A3 max energy" direction picked in brainstorming. Revert the recent opaque-cream card treatment to the prior translucent `backdrop-blur-xl` so the aurora reads through the cards as a stained-glass effect — "you're looking into stained glass in a church to see the future about to start inside."

The aurora is the hero; the cards are translucent lenses onto it. Target feel: bold, youthful, ambitious, immediately wow-factor, but readable for page content.

## User-facing preview reference

Final "A3" aurora mockup lived at `.superpowers/brainstorm/60692-1776449581/aurora-dialed-up.html` in the companion session. The implementation should match its motion character (amplitude, timing, layering).

## Palette

Unchanged from current site — the aurora uses the established palette:

| Role                                   | Hex        |
| -------------------------------------- | ---------- |
| Base body background (static fallback) | `#869A78`  |
| Rose (primary aurora blob)             | `#A24E69`  |
| Deep rose                              | `#7E2E4B`  |
| Light rose                             | `#C07F94`  |
| Gold                                   | `#CAA55A`  |
| Cream (highlight blob)                 | `#FFF8EC`  |
| Beige                                  | `#E8DDC9`  |

## Component Architecture

### `components/Backgrounds/AuroraBackground.tsx` (new)

A server component (pure markup + class names — no client interactivity). Renders a single outer `<div aria-hidden="true">` with `position: fixed`, `inset: 0`, `-z-10`, `pointer-events: none`, `isolation: isolate`, containing three stacked `<div>` layers.

Each inner layer:
- `position: absolute`, `inset: -40%` (so blurred gradients extend past viewport edges)
- `filter: blur(60–65px)`
- `will-change: transform`
- `transform: translateZ(0)` (pin compositor layer)
- A `background` property listing multiple `radial-gradient(circle at X% Y%, color 0%, transparent N%)` entries
- A CSS animation driving `transform` (translate / scale / slight rotate)

| Layer | Blobs                                                           | Blend       | Opacity | Cycle |
| ----- | --------------------------------------------------------------- | ----------- | ------- | ----- |
| 1     | rose `#A24E69`, gold `#CAA55A`, cream `#FFF8EC`, deep `#7E2E4B` | normal      | 0.95    | 10s   |
| 2     | light-rose `#C07F94`, beige `#E8DDC9`, rose `#A24E69`           | `screen`    | 0.80    | 13s   |
| 3     | gold `#CAA55A`, deep rose `#7E2E4B`                             | `overlay`   | 0.65    | 9s    |

Animation amplitudes (match A3):
- Layer 1: translate up to ±30% · scale 0.75–1.5 · rotate ±8° · 10s ease-in-out alternate
- Layer 2: translate up to ±32% · scale 1.2–1.35 · rotate ±10° · 13s ease-in-out alternate
- Layer 3: translate up to ±28% · scale 0.75–1.55 · 9s ease-in-out alternate

### `app/layout.tsx`

Render `<AuroraBackground />` once, inside the `<body>`, before the `<div className="min-h-screen bg-background">` (so it sits at the lowest z layer behind everything).

No other files in `app/` need to change.

### `app/globals.css`

Revert the recent opaque-cream `card` utility back to translucent glass:

```css
@utility card {
  @apply rounded-2xl border border-[#E8DDC9] bg-white/20 md:bg-white/40 shadow-xl backdrop-blur-xl;
}
```

**Tint decision:** neutral white (`/20` mobile, `/40` desktop). Per user: lets aurora colors come through truest — "truest stained-glass."

`card-no-blur` stays as-is (opaque cream). Form pages (register, cant-make-it, party-builder) retain solid backgrounds for text-field readability — the aurora should not be visible through form fields.

## Accessibility

- `aria-hidden="true"` on the AuroraBackground root — screen readers ignore it.
- `pointer-events: none` — clicks fall through to content.
- **Reduced motion** — a `@media (prefers-reduced-motion: reduce)` block sets `animation: none` on all three layers. The aurora renders as a single static blended snapshot (the position the keyframes occupy at 0%). Colors and glass-card effect are preserved; only the motion is suppressed.

## Performance

- **Pure CSS** — zero JS, no `requestAnimationFrame`, no scroll listeners.
- **GPU-accelerated** — animations target `transform` only; `will-change: transform` and `translateZ(0)` ensure each layer is promoted to its own compositor layer upfront rather than lazily on first animation tick.
- **Mobile concession** — on `max-width: 640px`, reduce `filter: blur` from 60–65px to 40px on each layer. Cuts GPU cost on phones; visual difference is minor at mobile scale because the blur blending is less visually prominent at that size.
- **Three compositor layers** — a fixed cost. With pinning via `will-change`, no re-creation churn during scroll.

## Known Risks

1. **`filter: blur` + `backdrop-filter` interaction.** We've already seen Firefox flicker on the Gallery section halo (a smaller `filter: blur` near a `backdrop-blur` card). Adding the aurora introduces more layers of this interaction. The user has acknowledged the flicker is still present from the prior halo fix and has chosen to address it later rather than block this work. **Spec does not attempt a fresh fix for it — it documents the risk and preserves the existing mitigations** (`isolation: isolate`, `will-change: transform`). If after deploy the flicker becomes unacceptable with the aurora live, fallbacks:
   - `@supports (not (backdrop-filter: blur(1px)))` → downgrade `card` to opaque
   - Split filter:blur across fewer compositor layers (combine layers 2+3)
   - Add `contain: paint` to aurora root

2. **Battery drain on mobile** — continuous animation can warm devices. Mitigation is the `prefers-reduced-motion` handling and the mobile blur-radius reduction. If feedback comes back that it's hot on phones, further mitigation is pausing animation when the page is hidden (`visibilitychange` listener would need to become a client component — out of scope for v1).

3. **Card legibility regression** — reverting to translucent cards against the animated aurora is aesthetic but text-on-moving-background is harder to read than text-on-opaque-card. Rose headings (`#A24E69`) and warm brown body (`#5A4A42`) were tested against the A3 mockup and stayed crisp. Worst-case if live testing reveals a problem: bump card tint from `/40` to `/60` on desktop (still translucent, more legibility).

## Scope

### In scope
- Create `components/Backgrounds/AuroraBackground.tsx`
- Export from `components/index.ts`
- Render in `app/layout.tsx`
- Revert `card` utility in `app/globals.css` to translucent `bg-white/20 md:bg-white/40 backdrop-blur-xl`
- Add `prefers-reduced-motion` and mobile-blur-radius media queries in `app/globals.css`

### Out of scope
- Fixing the existing Firefox halo flicker (user deferred)
- `card-no-blur` utility (forms keep opaque backgrounds)
- Any per-page background overrides
- Image/asset changes
- Other components
- Navigation, theming, light/dark mode variants

## Acceptance

- Visiting `/` on desktop shows animated aurora with three visibly blending layers matching the A3 mockup in motion.
- Cards on the home page (Welcome, Gallery, Story, Travel, FAQs) render as translucent glass lenses onto the aurora; text is readable.
- Form pages (`/register`, `/cant-make-it`, `/party-builder`) remain on opaque cream cards.
- On a device with `prefers-reduced-motion: reduce`, the aurora renders static but colored.
- `yarn build` passes.
- No new console errors.
