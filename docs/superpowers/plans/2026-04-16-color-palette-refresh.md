# Color Palette Refresh Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Re-color the wedding site's UI to harmonize with the new sage background — translating Hannah's "dark green → pink, pink → beige, RSVP letters black" feedback into a concrete, readable palette across every page and component.

**Architecture:** Pure CSS/className change. Two design tokens in `globals.css` (`--background`, `--foreground`) plus the `--color-hannah-pink` token's value get updated; everywhere else, hardcoded hex values are replaced inline via Edit. No Tailwind config refactor. Special cases (text-white only on rose buttons, hover-state colors that would collide with the new background, MobileNav's `pink-500` Tailwind references) get handled file-by-file before the bulk mechanical replacements.

**Tech Stack:** Next.js 16 (App Router), Tailwind CSS 4, plain TSX components.

**Reference spec:** `docs/superpowers/specs/2026-04-16-color-palette-refresh-design.md`

## Color Mapping Table

| Old hex                           | New hex                           | Notes                                       |
| --------------------------------- | --------------------------------- | ------------------------------------------- |
| `#9CAF88` (`#9caf88`)             | `#869A78` (`#869a78`)             | Background sage → muted sage                |
| `#2E4E3F` (`#2e4e3f`)             | `#A24E69` (`#a24e69`)             | Dark green → mid rose                       |
| `#4F5E50` (`#4f5e50`)             | `#5A4A42` (`#5a4a42`)             | Body text dark → warm dark brown            |
| `#6B725E` (`#6b725e`)             | `#7A6B5C` (`#7a6b5c`)             | Body text medium → medium warm brown        |
| `#7A846F` (`#7a846f`)             | `#9C8B7A` (`#9c8b7a`)             | Body text light → light warm brown          |
| `#9FB39E` (`#9fb39e`)             | `#843E55` (`#843e55`)             | Light sage button border → darker rose      |
| `rgba(251, 182, 206, 0.75)`       | `rgba(232, 221, 201, 0.75)`       | Bright pink halo → linen beige glow         |
| `rgba(251, 182, 206, 1)`          | `rgba(232, 221, 201, 1)`          | hannah-pink token value                     |

**Special cases (do NOT use bulk replace):**
- `hover:text-[#9CAF88]` → `hover:text-[#C07F94]` (collision avoidance)
- `hover:bg-[#9FB39E]` → `hover:bg-[#C07F94]` (Modal only — hover lightens)
- `bg-pink-500/40` → `bg-[#A24E69]/40` (MobileNav only)
- `text-white` → `text-[#FFF8EC]` ONLY on buttons whose bg is `#A24E69` (was `#2E4E3F`). Keep as `text-white` in: Lightbox icon controls, MobileNav menu heading, `text-nav` utility in globals.css.

## Files Touched

`app/globals.css` plus 39 source files (17 pages/loading, 22 components). All listed in the per-task sections below.

---

### Task 1: Update globals.css tokens

**Files:**
- Modify: `app/globals.css`

- [ ] **Step 1:** Open `app/globals.css` and apply these exact edits.

Replace the `:root` block (lines 3-6):
```css
:root {
  --background: #9CAF88;
  --foreground: #2e4e3f;
}
```
with:
```css
:root {
  --background: #869A78;
  --foreground: #5A4A42;
}
```

Replace `--color-hannah-pink: rgba(251, 182, 206, 1);` with:
```css
--color-hannah-pink: rgba(232, 221, 201, 1);
```

Replace the `prefers-color-scheme: dark` block (lines 17-22):
```css
@media (prefers-color-scheme: dark) {
  :root {
    --background: #9CAF88;
    --foreground: #2e4e3f;
  }
}
```
with:
```css
@media (prefers-color-scheme: dark) {
  :root {
    --background: #869A78;
    --foreground: #5A4A42;
  }
}
```

Replace inside `.naked-backdrop-halo::before`:
```css
background: radial-gradient(120% 60% at 50% 50%, rgba(251, 182, 206, 0.75));
```
with:
```css
background: radial-gradient(120% 60% at 50% 50%, rgba(232, 221, 201, 0.75));
```

- [ ] **Step 2: Verify**

Run:
```bash
grep -nE "9CAF88|9caf88|2e4e3f|251, 182, 206" app/globals.css
```
Expected: no matches.

---

### Task 2: MobileNav — pink-500 → new rose, preserve menu heading white

**Files:**
- Modify: `components/Navigation/MobileNav.tsx`

The token `bg-hannah-pink` already points at beige after Task 1, so the outer ring needs no change. The inner circle and overlay use Tailwind's `pink-500/40`, which must change to `[#A24E69]/40`. The "Hannah & Hayden's Wedding" heading inside the menu (line 67) stays `text-white` (it sits on the rose-tinted overlay).

- [ ] **Step 1:** Replace both occurrences of `bg-pink-500/40` in `components/Navigation/MobileNav.tsx` with `bg-[#A24E69]/40`.

- [ ] **Step 2: Verify**

Run:
```bash
grep -n "pink-500" components/Navigation/MobileNav.tsx
```
Expected: no matches.

---

### Task 3: Modal — rose primary button + lighter-rose hover

**Files:**
- Modify: `components/Modal/Modal.tsx`

- [ ] **Step 1:** In line 39's className string (primary button), replace:
  - `border-[#9FB39E]` → `border-[#843E55]`
  - `bg-[#2E4E3F]` → `bg-[#A24E69]`
  - `text-white` → `text-[#FFF8EC]`
  - `hover:bg-[#9FB39E]` → `hover:bg-[#C07F94]`

  Line 45 (cancel button) keeps `bg-[#FFF8EC]`, `border-[#E7D9BF]`, `hover:bg-[#E7D9BF]` — unchanged.

- [ ] **Step 2:** Map the remaining `text-[#2E4E3F]` references in this file (modal title on line 28, modal body on line 32) → `text-[#A24E69]`. They use the accent color, not the body brown.

- [ ] **Step 3: Verify**

Run:
```bash
grep -nE "9FB39E|2E4E3F" components/Modal/Modal.tsx
```
Expected: no matches.

---

### Task 4: Home page — hover-text collision fix + button text recolor

**Files:**
- Modify: `app/(home)/page.tsx`
- Modify: `app/(home)/loading.tsx`

In `app/(home)/page.tsx`:

- [ ] **Step 1:** Line 121, replace `hover:text-[#9CAF88]` with `hover:text-[#C07F94]` (the gallery link hover).

- [ ] **Step 2:** Lines 81 and 246 — both are `bg-[#2E4E3F]` buttons with `text-white`. Replace `text-white` → `text-[#FFF8EC]` on both lines.

- [ ] **Step 3:** Run mechanical hex replacements on `app/(home)/page.tsx`:
  - `#2E4E3F` → `#A24E69` (all remaining instances)
  - `#9CAF88` → `#869A78` (none remain after Step 1, but verify)
  - `#9FB39E` → `#843E55`
  - `#4F5E50` → `#5A4A42`
  - `#6B725E` → `#7A6B5C`

In `app/(home)/loading.tsx`:

- [ ] **Step 4:** Mechanical hex replacements (no special cases here):
  - `#2E4E3F` → `#A24E69`
  - `#9FB39E` → `#843E55`
  - `#4F5E50` → `#5A4A42`
  - `#6B725E` → `#7A6B5C`

- [ ] **Step 5: Verify**

Run:
```bash
grep -nE "#(2E4E3F|2e4e3f|9CAF88|9caf88|9FB39E|9fb39e|4F5E50|4f5e50|6B725E|6b725e|7A846F|7a846f)" app/\(home\)/page.tsx app/\(home\)/loading.tsx
```
Expected: no matches.

---

### Task 5: RSVP, Cant-Make-It, Party-Builder, Register pages + their loading skeletons

**Files (10 total):**
- Modify: `app/rsvp/page.tsx`
- Modify: `app/rsvp/loading.tsx`
- Modify: `app/cant-make-it/page.tsx`
- Modify: `app/cant-make-it/loading.tsx`
- Modify: `app/party-builder/page.tsx`
- Modify: `app/party-builder/loading.tsx`
- Modify: `app/register/page.tsx`
- Modify: `app/register/loading.tsx`

These all share a similar pattern: a primary `bg-[#2E4E3F]` button with `text-white` (or `text-white` in a skeleton), plus body text in green-grays.

- [ ] **Step 1:** For each of the 8 files, apply these replacements:
  - `bg-[#2E4E3F]` → `bg-[#A24E69]` (and any `text-white` on the same className → `text-[#FFF8EC]`)
  - `border-[#9FB39E]` → `border-[#843E55]`
  - `text-[#4F5E50]` → `text-[#5A4A42]`
  - `text-[#6B725E]` → `text-[#7A6B5C]`
  - `text-[#7A846F]` → `text-[#9C8B7A]`
  - Any other `#2E4E3F`, `#4F5E50`, `#6B725E`, `#7A846F`, `#9FB39E` references (e.g., as `decoration-[#...]`, `placeholder-[#...]`) → mapped per the table.

- [ ] **Step 2: Verify**

Run:
```bash
grep -nE "#(2E4E3F|2e4e3f|9CAF88|9caf88|9FB39E|9fb39e|4F5E50|4f5e50|6B725E|6b725e|7A846F|7a846f)" app/rsvp/page.tsx app/rsvp/loading.tsx app/cant-make-it/page.tsx app/cant-make-it/loading.tsx app/party-builder/page.tsx app/party-builder/loading.tsx app/register/page.tsx app/register/loading.tsx
```
Expected: no matches.

---

### Task 6: Admin pages

**Files (4 total):**
- Modify: `app/admin/page.tsx`
- Modify: `app/admin/party/page.tsx`
- Modify: `app/admin/party-people/[party_id]/page.tsx`
- Modify: `app/admin/allergies/page.tsx`

Note: Several admin links use `hover:text-[#2E4E3F]` — these become `hover:text-[#A24E69]` (bulk replace catches them).

- [ ] **Step 1:** Apply the standard mechanical mapping to all 4 files:
  - `#2E4E3F` / `#2e4e3f` → `#A24E69` / `#a24e69`
  - `#4F5E50` / `#4f5e50` → `#5A4A42` / `#5a4a42`
  - `#6B725E` / `#6b725e` → `#7A6B5C` / `#7a6b5c`
  - `#7A846F` / `#7a846f` → `#9C8B7A` / `#9c8b7a`
  - `#9FB39E` / `#9fb39e` → `#843E55` / `#843e55`
  - `#9CAF88` / `#9caf88` → `#869A78` / `#869a78`

- [ ] **Step 2: Verify**

Run:
```bash
grep -nE "#(2E4E3F|2e4e3f|9CAF88|9caf88|9FB39E|9fb39e|4F5E50|4f5e50|6B725E|6b725e|7A846F|7a846f)" app/admin/page.tsx app/admin/party/page.tsx "app/admin/party-people/[party_id]/page.tsx" app/admin/allergies/page.tsx
```
Expected: no matches.

---

### Task 7: Maintenance + Gallery pages

**Files (3 total):**
- Modify: `app/maintence/page.tsx`
- Modify: `app/maintence/loading.tsx`
- Modify: `app/gallery/page.tsx`

The maintenance page has a `bg-[#2E4E3F]` button with `text-white` — that pair needs the cream conversion. Gallery page only has `text-[#4F5E50]` body refs.

- [ ] **Step 1:** For `app/maintence/page.tsx` and `app/maintence/loading.tsx`:
  - `bg-[#2E4E3F]` → `bg-[#A24E69]` (and `text-white` on same className → `text-[#FFF8EC]`)
  - `border-[#9FB39E]` → `border-[#843E55]`
  - `text-[#4F5E50]` → `text-[#5A4A42]`
  - `text-[#6B725E]` → `text-[#7A6B5C]`

- [ ] **Step 2:** For `app/gallery/page.tsx`:
  - `text-[#4F5E50]` → `text-[#5A4A42]` (both occurrences)

- [ ] **Step 3: Verify**

Run:
```bash
grep -nE "#(2E4E3F|2e4e3f|9CAF88|9caf88|9FB39E|9fb39e|4F5E50|4f5e50|6B725E|6b725e|7A846F|7a846f)" app/maintence/page.tsx app/maintence/loading.tsx app/gallery/page.tsx
```
Expected: no matches.

---

### Task 8: Lightbox & GalleryGrid (special-case `text-white` preservation)

**Files:**
- Modify: `components/Gallery/Lightbox.tsx`
- Modify: `components/Gallery/GalleryGrid.tsx`

In Lightbox, the only background-affecting hex is line 60: `bg-[#9CAF88]/60` (the photo backdrop). It needs to become the new bg color. The three `text-white` occurrences (lines 68, 93, 114) are icon controls floating over photos — KEEP as `text-white`. The `bg-white/20` and `hover:bg-white/40` stay.

In GalleryGrid, `bg-[#2E4E3F]` is the active filter button bg with `text-white` (line 82) — convert pair to rose + cream.

- [ ] **Step 1:** In `components/Gallery/Lightbox.tsx`:
  - Line 60: `bg-[#9CAF88]/60` → `bg-[#869A78]/60`
  - Do NOT touch `text-white` on lines 68, 93, 114.

- [ ] **Step 2:** In `components/Gallery/GalleryGrid.tsx`:
  - Line 82: `bg-[#2E4E3F]` → `bg-[#A24E69]`, `border-[#2E4E3F]` → `border-[#A24E69]`, `text-white` → `text-[#FFF8EC]`
  - Any other green-gray hexes in the file → standard mapping.

- [ ] **Step 3: Verify**

Run:
```bash
grep -nE "#(2E4E3F|2e4e3f|9CAF88|9caf88|9FB39E|9fb39e|4F5E50|4f5e50|6B725E|6b725e|7A846F|7a846f)" components/Gallery/Lightbox.tsx components/Gallery/GalleryGrid.tsx
```
Expected: no matches.

Run:
```bash
grep -n "text-white" components/Gallery/Lightbox.tsx
```
Expected: 3 matches preserved (lines 68, 93, 114 — the icon buttons).

---

### Task 9: Card, Accordion, Countdown, Logo, GoldFrame, NakedHeader components

**Files:**
- Modify: `components/Cards/StoryCard.tsx`
- Modify: `components/Cards/InfoCard.tsx`
- Modify: `components/Accordions/AccordionItem.tsx`
- Modify: `components/Countdown/Countdown.tsx`
- Modify: `components/Countdown/CountdownSkeleton.tsx`
- Modify: `components/Logo/Logo.tsx`
- Modify: `components/GoldFrame/GoldFrame.tsx`
- Modify: `components/Text/NakedHeader.tsx` (no direct hex refs but verify)
- Modify: `components/BtfSkeletons/HomeBtfSkeleton.tsx`

These have only mechanical color references (no `text-white`-on-rose specials, no hover collisions).

- [ ] **Step 1:** For each file, apply standard hex mapping:
  - `#2E4E3F` → `#A24E69`
  - `#4F5E50` → `#5A4A42`
  - `#6B725E` → `#7A6B5C`
  - `#7A846F` → `#9C8B7A`
  - `#9FB39E` → `#843E55`
  - `#9CAF88` → `#869A78`
  - (lowercase variants likewise)

- [ ] **Step 2: Verify**

Run:
```bash
grep -nE "#(2E4E3F|2e4e3f|9CAF88|9caf88|9FB39E|9fb39e|4F5E50|4f5e50|6B725E|6b725e|7A846F|7a846f)" components/Cards/StoryCard.tsx components/Cards/InfoCard.tsx components/Accordions/AccordionItem.tsx components/Countdown/Countdown.tsx components/Countdown/CountdownSkeleton.tsx components/Logo/Logo.tsx components/GoldFrame/GoldFrame.tsx components/Text/NakedHeader.tsx components/BtfSkeletons/HomeBtfSkeleton.tsx
```
Expected: no matches.

---

### Task 10: Field components

**Files:**
- Modify: `components/Fields/TextField.tsx`
- Modify: `components/Fields/TextAreaField.tsx`
- Modify: `components/Fields/SelectField.tsx`
- Modify: `components/Fields/NumberField.tsx`
- Modify: `components/Fields/CheckboxField.tsx`

- [ ] **Step 1:** For each file, apply standard hex mapping (same list as Task 9).

- [ ] **Step 2: Verify**

Run:
```bash
grep -nE "#(2E4E3F|2e4e3f|9CAF88|9caf88|9FB39E|9fb39e|4F5E50|4f5e50|6B725E|6b725e|7A846F|7a846f)" components/Fields/*.tsx
```
Expected: no matches.

---

### Task 11: PartyBuilder components

**Files:**
- Modify: `components/PartyBuilder/PartyBuilder.tsx`
- Modify: `components/PartyBuilder/Row.tsx`
- Modify: `components/PartyBuilder/Input.tsx`
- Modify: `components/PartyBuilder/Label.tsx`
- Modify: `components/PartyBuilder/AddSubmitButtons.tsx`
- Modify: `components/PartyBuilder/RemoveButton.tsx` (only `#8C7E68` and `#FFF8EC` here — both stay; verify nothing in the active map present)

`AddSubmitButtons.tsx` has two `bg-[#2E4E3F]` + `text-white` button pairs (lines 24 and 51) — both need cream conversion.

- [ ] **Step 1:** In `components/PartyBuilder/AddSubmitButtons.tsx`, change `text-white` → `text-[#FFF8EC]` on both buttons (lines 24 and 51), then apply the standard hex mapping.

- [ ] **Step 2:** For the remaining PartyBuilder files, apply the standard hex mapping (Task 9 list).

- [ ] **Step 3: Verify**

Run:
```bash
grep -nE "#(2E4E3F|2e4e3f|9CAF88|9caf88|9FB39E|9fb39e|4F5E50|4f5e50|6B725E|6b725e|7A846F|7a846f)" components/PartyBuilder/*.tsx
```
Expected: no matches.

---

### Task 12: Buttons (RegistryButton, AddCalender) + Header

**Files:**
- Modify: `components/Buttons/RegistryButton.tsx`
- Modify: `components/Buttons/AddCalender.tsx`
- Modify: `components/Navigation/Header.tsx` (uses utility classes only — verify, may need no edits)

These files only use `#6B725E` text on cream `#FFF8EC` — straightforward map.

- [ ] **Step 1:** Apply standard hex mapping to all three files.

- [ ] **Step 2: Verify**

Run:
```bash
grep -nE "#(2E4E3F|2e4e3f|9CAF88|9caf88|9FB39E|9fb39e|4F5E50|4f5e50|6B725E|6b725e|7A846F|7a846f)" components/Buttons/*.tsx components/Navigation/Header.tsx
```
Expected: no matches.

---

### Task 13: Whole-tree verification — no old hex values remain

- [ ] **Step 1:** Run a global grep across the source tree (excluding `docs/` and `.next/` and `node_modules/`).

```bash
grep -rnE --include="*.tsx" --include="*.ts" --include="*.css" "#(2E4E3F|2e4e3f|9CAF88|9caf88|9FB39E|9fb39e|4F5E50|4f5e50|6B725E|6b725e|7A846F|7a846f)" app components helpers types auth.ts proxy.ts
```
Expected: no matches anywhere.

- [ ] **Step 2:** Confirm `bg-pink-500` and `hover:text-[#9CAF88]` are gone:

```bash
grep -rn --include="*.tsx" --include="*.ts" --include="*.css" "bg-pink-500\|hover:text-\[#9CAF88\]\|hover:bg-\[#9FB39E\]" app components
```
Expected: no matches.

- [ ] **Step 3:** Confirm `text-white` survives only in expected places:

```bash
grep -rn --include="*.tsx" "text-white" app components
```
Expected matches only in: `components/Gallery/Lightbox.tsx` (3 icon-button refs) and `components/Navigation/MobileNav.tsx` (1 menu-heading ref). Anything else means a missed conversion.

---

### Task 14: Build verification

- [ ] **Step 1:** Run the production build.

```bash
yarn build
```
Expected: clean build, no errors. (Tailwind 4 may emit warnings about arbitrary values — not failures.)

- [ ] **Step 2:** If build fails, fix the cited file(s) and re-run.

---

### Task 15: Visual walkthrough — start dev server, capture issues

- [ ] **Step 1:** Start the dev server.

```bash
yarn dev
```
Wait for "Ready" line.

- [ ] **Step 2:** Methodically visit every route in the browser at `http://localhost:3000` and confirm the new palette renders correctly. Routes to check:
  - `/` (home — signed out + signed in if possible)
  - `/rsvp`
  - `/cant-make-it`
  - `/party-builder`
  - `/register`
  - `/gallery`
  - `/admin` (if admin user available)
  - `/admin/party`
  - `/admin/party-people/[some-id]`
  - `/admin/allergies`
  - `/maintence`
  - `/auth/signin`, `/auth/signout`, `/auth/reauth`
  - Mobile viewport: home, RSVP, mobile nav drawer (hamburger button + open menu)

- [ ] **Step 3:** Capture any styling issues that look "iffy" (per user's explicit request) — anything that reads poorly, has bad contrast, looks washed out, or doesn't harmonize with the new palette. Record them as a list to surface to the user before committing.

- [ ] **Step 4:** Surface the issue list to the user. Wait for guidance on whether to fix any of them in this PR or defer.

---

### Task 16: Commit

- [ ] **Step 1:** Stage and commit the changes.

```bash
git add -A
git status  # confirm only the expected files are staged
git commit -m "$(cat <<'EOF'
feat: refresh color palette for new sage background

Re-color UI to harmonize with the recent background swap from peach to
sage. Per Hannah's direction: dark green tones become rose, the bright
pink halo becomes linen beige, and primary button text becomes cream
(softer than black/white on rose).

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

- [ ] **Step 2:** Verify the commit landed cleanly.

```bash
git log -1 --stat
```

---

## Done

Plan execution is complete when:
- `yarn build` passes.
- The whole-tree grep in Task 13 returns zero matches for old hex values.
- The visual walkthrough in Task 15 has been performed and any iffy issues surfaced to the user.
- Changes are committed.

Optional next step (not in this plan): deploy via `ssh -i ~/Downloads/hwl.pem ubuntu@3.150.189.231 "bash ~/Hwl-Wedding-Web/scripts/deploy.sh dev"` if the user wants to ship.
