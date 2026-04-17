# Aurora Background + Glass Cards Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship an animated aurora gradient background (A3 direction) with translucent glass cards so content reads through to the aurora — "stained-glass looking into the future about to start inside."

**Architecture:** A single pure-CSS `AuroraBackground` server component rendered once in the root layout. Three fixed-position, full-viewport layers stacked with blend modes, animated via CSS keyframes targeting `transform` only. Cards get reverted from opaque cream back to translucent white with `backdrop-blur-xl` so the aurora reads through. No JS, no scroll listeners, no client-side runtime.

**Tech Stack:** Next.js 16 App Router · Tailwind CSS 4 · plain TSX · CSS keyframes.

**Reference spec:** `docs/superpowers/specs/2026-04-17-aurora-background-design.md`
**Current branch:** `hwl/bg`

---

## File Map

| File | Change |
|------|--------|
| `components/Background/AuroraBackground.tsx` | Create |
| `components/index.ts` | Add export |
| `app/globals.css` | Add aurora CSS (keyframes, layer classes, reduced-motion, mobile-blur media queries); revert `card` utility |
| `app/layout.tsx` | Render `<AuroraBackground />`; remove `bg-background` from wrapper div |

No other files touched. Zero test files (no test suite exists; validation is visual walkthrough per existing project practice).

## Color Reference (from spec)

| Role | Hex |
|------|-----|
| Base body (static fallback) | `#869A78` |
| Rose | `#A24E69` |
| Deep rose | `#7E2E4B` |
| Light rose | `#C07F94` |
| Gold | `#CAA55A` |
| Cream | `#FFF8EC` |
| Beige | `#E8DDC9` |

---

### Task 1: Add aurora CSS utilities and keyframes

**Files:**
- Modify: `app/globals.css` (append to end)

- [ ] **Step 1:** Open `app/globals.css`. Append these new utilities + keyframes + media queries at the **end of the file** (after all existing utilities and `@layer base` block):

```css
/* ============================================================
   Aurora Background
   Three stacked full-viewport layers of blurred radial-gradient
   blobs, each animating transform only (GPU-friendly).
   ============================================================ */

@utility aurora-root {
  position: fixed;
  inset: 0;
  z-index: -10;
  pointer-events: none;
  isolation: isolate;
  overflow: hidden;
  background: #869A78;
}

@utility aurora-layer {
  position: absolute;
  inset: -40%;
  filter: blur(60px);
  will-change: transform;
  transform: translateZ(0);
  pointer-events: none;
}

@utility aurora-layer-1 {
  opacity: 0.95;
  background:
    radial-gradient(circle at 20% 30%, #A24E69 0%, transparent 32%),
    radial-gradient(circle at 80% 40%, #CAA55A 0%, transparent 35%),
    radial-gradient(circle at 50% 80%, #FFF8EC 0%, transparent 38%),
    radial-gradient(circle at 10% 90%, #7E2E4B 0%, transparent 30%);
  animation: auroraDrift1 10s ease-in-out infinite alternate;
}

@utility aurora-layer-2 {
  opacity: 0.80;
  mix-blend-mode: screen;
  background:
    radial-gradient(circle at 70% 20%, #C07F94 0%, transparent 34%),
    radial-gradient(circle at 30% 65%, #E8DDC9 0%, transparent 40%),
    radial-gradient(circle at 90% 85%, #A24E69 0%, transparent 26%);
  animation: auroraDrift2 13s ease-in-out infinite alternate;
}

@utility aurora-layer-3 {
  opacity: 0.65;
  mix-blend-mode: overlay;
  filter: blur(65px);
  background:
    radial-gradient(circle at 40% 50%, #CAA55A 0%, transparent 28%),
    radial-gradient(circle at 60% 15%, #7E2E4B 0%, transparent 28%);
  animation: auroraDrift3 9s ease-in-out infinite alternate;
}

@keyframes auroraDrift1 {
  0%   { transform: translate(0, 0) scale(1) rotate(0deg); }
  50%  { transform: translate(30%, -18%) scale(1.5) rotate(8deg); }
  100% { transform: translate(-25%, 20%) scale(0.75) rotate(-6deg); }
}

@keyframes auroraDrift2 {
  0%   { transform: translate(0, 0) scale(1) rotate(0deg); }
  50%  { transform: translate(-32%, 22%) scale(1.35) rotate(-10deg); }
  100% { transform: translate(28%, -20%) scale(1.2) rotate(8deg); }
}

@keyframes auroraDrift3 {
  0%   { transform: translate(0, 0) scale(1); }
  50%  { transform: translate(22%, 26%) scale(1.55); }
  100% { transform: translate(-28%, -18%) scale(0.75); }
}

/* Mobile: reduce blur radius to lighten GPU cost. Visual difference
   at phone sizes is minor because blur blending is less pronounced. */
@media (max-width: 640px) {
  .aurora-layer,
  .aurora-layer-1,
  .aurora-layer-2 {
    filter: blur(40px);
  }
  .aurora-layer-3 {
    filter: blur(42px);
  }
}

/* Accessibility: respect user motion preferences. Aurora still
   renders with its colors blended, just frozen at the 0% keyframe. */
@media (prefers-reduced-motion: reduce) {
  .aurora-layer-1,
  .aurora-layer-2,
  .aurora-layer-3 {
    animation: none;
  }
}
```

- [ ] **Step 2: Verify the CSS compiles**

Run: `yarn build`
Expected: build succeeds with no CSS errors. If Tailwind 4 rejects any syntax, check that utilities are defined with `@utility name { ... }` and keyframes are at the top level.

---

### Task 2: Create the AuroraBackground component

**Files:**
- Create: `components/Background/AuroraBackground.tsx`

- [ ] **Step 1:** Write the component. Exact content:

```tsx
/**
 * AuroraBackground
 *
 * A fixed, full-viewport animated gradient mesh that sits behind all
 * content. Three layers of blurred radial-gradient blobs stacked with
 * blend modes; each animates transform only (GPU-friendly, zero JS).
 *
 * Must be rendered at the root of the layout so it covers the whole
 * viewport regardless of the current route.
 */
export function AuroraBackground() {
  return (
    <div aria-hidden="true" className="aurora-root">
      <div className="aurora-layer aurora-layer-1" />
      <div className="aurora-layer aurora-layer-2" />
      <div className="aurora-layer aurora-layer-3" />
    </div>
  );
}
```

- [ ] **Step 2: Verify the file typechecks and builds**

Run: `yarn build`
Expected: build succeeds. No TypeScript errors about the component.

---

### Task 3: Export AuroraBackground from the components barrel

**Files:**
- Modify: `components/index.ts`

- [ ] **Step 1:** Add this line near the other Background-folder export (next to `MagCorners`):

```ts
export { AuroraBackground as AuroraBackground } from "./Background/AuroraBackground";
```

- [ ] **Step 2: Verify import resolves**

Run: `grep -n "AuroraBackground" components/index.ts`
Expected: one line showing the export.

---

### Task 4: Render AuroraBackground in the root layout and remove the wrapper's `bg-background`

**Files:**
- Modify: `app/layout.tsx`

The current RootLayout:

```tsx
return (
  <html lang="en">
    <body className={`${cormorant.variable} ${quicksand.variable} antialiased`}>
      <div className="min-h-screen bg-background">
        <NavHeader />
        <main className="min-h-screen overflow-y-auto sm:pt-20">
          {children}
        </main>
      </div>
    </body>
  </html>
);
```

Becomes:

```tsx
return (
  <html lang="en">
    <body className={`${cormorant.variable} ${quicksand.variable} antialiased`}>
      <AuroraBackground />
      <div className="min-h-screen">
        <NavHeader />
        <main className="min-h-screen overflow-y-auto sm:pt-20">
          {children}
        </main>
      </div>
    </body>
  </html>
);
```

- [ ] **Step 1:** Import `AuroraBackground` alongside `NavHeader`:

```ts
import { NavHeader, AuroraBackground } from "@/components";
```

- [ ] **Step 2:** Render `<AuroraBackground />` as the first child of `<body>`, before the wrapper div.

- [ ] **Step 3:** Remove the `bg-background` class from the wrapper div so it doesn't paint over the aurora. The wrapper is now `<div className="min-h-screen">`.

- [ ] **Step 4: Verify in dev**

Run: `yarn dev` (leave running for later tasks).
Open http://localhost:3000/ in a browser.
Expected: the home page loads and the aurora is visibly animating behind the cards. The wrapper no longer paints solid sage over it.

If the aurora is not visible, possible culprits:
  - Wrapper still has `bg-background` → revisit step 3.
  - Z-index collision → check that no other fixed/absolute elements sit at a negative z-index deeper than `-10`.
  - Component not exported → check `components/index.ts` has the line from Task 3.

---

### Task 5: Revert `card` utility to translucent glass

**Files:**
- Modify: `app/globals.css` (existing `@utility card` block)

- [ ] **Step 1:** Find the current `card` utility in `app/globals.css`:

```css
@utility card {
  @apply rounded-2xl border border-[#E8DDC9] bg-[#FFF8EC]/85 md:bg-[#FFF8EC]/90 shadow-xl backdrop-blur-md;
}
```

Replace its body (everything between the braces) with:

```css
@utility card {
  @apply rounded-2xl border border-[#E8DDC9] bg-white/20 md:bg-white/40 shadow-xl backdrop-blur-xl;
}
```

- [ ] **Step 2:** Do **not** modify `card-no-blur`. Form pages need to keep opaque backgrounds for input-field readability.

- [ ] **Step 3: Verify visually**

Reload http://localhost:3000/ in the dev browser.
Expected: the Welcome card, gallery credit area (no card), Story cards, Travel Info cards, the Travel map card, and FAQ card are now translucent. The aurora's colors bleed through them as a stained-glass effect. Text inside cards remains readable.

Spot-check each home-page card for readability (rose headings on aurora-bleed background, warm-brown body text):
  - Welcome (h1 "You're Invited", date, countdown)
  - Gallery (grid of images — unchanged, no card)
  - Our Story (6 StoryCards with subtitle + title + text)
  - Travel & Lodging (3 InfoCards + Ceremony-to-Reception map card)
  - FAQs (3 AccordionItems inside a card)

If text becomes hard to read over the aurora, note which card and which aurora color was behind it. Fallback (not in this plan): bump `md:bg-white/40` to `md:bg-white/60` for more card opacity.

---

### Task 6: Visit form pages and confirm they stayed opaque

- [ ] **Step 1:** Visit each form route in the dev browser:
  - http://localhost:3000/register
  - http://localhost:3000/cant-make-it
  - http://localhost:3000/party-builder
  - http://localhost:3000/rsvp

For `/register`, `/cant-make-it`, `/party-builder` (these use `card-no-blur`): cards should still be solid cream. Form inputs should have clean, readable backgrounds.

For `/rsvp` (uses `card`): card becomes translucent and the aurora is visible through it. That's expected.

Expected: forms remain usable; no input-field readability regression.

---

### Task 7: Verify reduced-motion behavior

- [ ] **Step 1:** In Chrome/Firefox DevTools, open Rendering tab → "Emulate CSS media feature prefers-reduced-motion" → set to `reduce`.
- [ ] **Step 2:** Reload http://localhost:3000/.

Expected:
  - Aurora still renders (colors visible, blended)
  - No motion — layers are frozen at the 0% keyframe position
  - All other animations (countdown, skeletons if any) still work as before (they don't use the new media query)

- [ ] **Step 3:** Turn the emulation back off.

---

### Task 8: Verify prod build

- [ ] **Step 1:** Stop `yarn dev` if running.

- [ ] **Step 2:** Run a production build:

```bash
yarn build
```

Expected: clean build, no CSS or TypeScript errors, all 17 routes present in the output summary.

- [ ] **Step 3:** (optional) Run `yarn start` to confirm prod-mode renders correctly; open `/` and spot-check the aurora + glass cards.

---

### Task 9: Commit

- [ ] **Step 1:** Stage all changes and commit:

```bash
git add -A
git status  # confirm only the four expected files
git commit -m "$(cat <<'EOF'
feat: aurora animated background + glass cards

Add a pure-CSS animated aurora background (three stacked blurred
gradient layers with drifting transforms, blend modes, GPU-only
animation) and revert the card utility back to translucent
backdrop-blur-xl so content reads through as a stained-glass lens
onto the aurora. Form pages (card-no-blur) remain opaque for input
readability. Respects prefers-reduced-motion; drops blur radius on
mobile to lighten GPU cost.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

- [ ] **Step 2:** Push the branch (do NOT merge to dev or master yet):

```bash
git push -u origin hwl/bg
```

- [ ] **Step 3:** Surface to the user for live review before deploying. The deploy command (`ssh -i ~/Downloads/hwl.pem ubuntu@3.150.189.231 "bash ~/Hwl-Wedding-Web/scripts/deploy.sh dev"`) deploys whatever branch is checked out on the server — deploy decisions are outside this plan.

---

## Done

Execution is complete when:
- `yarn build` passes.
- The four files listed in the File Map are the only modified files.
- The aurora is visible and animating at `/` in dev.
- Cards on `/` are translucent glass and text reads clearly over the aurora.
- Form pages retain opaque `card-no-blur` styling.
- `prefers-reduced-motion: reduce` freezes animation without hiding colors.
- Changes are committed to `hwl/bg` and pushed to origin.
- The user has seen the live dev preview and approved before any deploy.
