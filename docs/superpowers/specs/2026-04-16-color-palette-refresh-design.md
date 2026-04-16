# Color Palette Refresh — Design Spec

**Date:** 2026-04-16
**Status:** Draft, pending review

## Context

The site background was recently swapped from peach (`rgba(253, 228, 208, 1)`) to sage green (`#9CAF88`) in commit `576183a`. The rest of the palette — built around dark forest green text, a bright pink accent, and warm beige cards — was tuned for the old peach background and now reads poorly against sage.

Hannah (the bride) gave the following high-level direction:
1. Whatever was the dark green, make pink.
2. Whatever was pink, make beige.
3. RSVP letters black.

Her direction was deliberately broad. This spec translates it into a concrete palette and per-element mapping that respects web-design fundamentals (contrast, hierarchy, harmony) and accommodates the technical reality that pink-as-body-text is unreadable on sage.

## Final Palette

After visual iteration in the browser companion:

| Role                            | Old value                              | New value                          | Notes                                    |
| ------------------------------- | -------------------------------------- | ---------------------------------- | ---------------------------------------- |
| Background                      | `#9CAF88`                              | `#869A78`                          | Muted sage; less retina-glare            |
| Primary accent (was dark green) | `#2E4E3F`                              | `#A24E69`                          | Mid rose; "between A and C" pink         |
| Body text — dark                | `#4F5E50`                              | `#5A4A42`                          | Warm dark brown                          |
| Body text — medium              | `#6B725E`                              | `#7A6B5C`                          | Medium warm brown                        |
| Body text — light               | `#7A846F`                              | `#9C8B7A`                          | Light warm brown                         |
| Button border (was light sage)  | `#9FB39E`                              | `#843E55`                          | Darker rose; matches new accent          |
| Button hover (was light sage)   | `#9FB39E` (Modal hover)                | `#C07F94`                          | Lighter rose; hover lightens             |
| Underline hover (was sage)      | `#9CAF88` (link hover)                 | `#C07F94`                          | Avoids matching the new bg               |
| Halo / glow (was bright pink)   | `rgba(251, 182, 206, 0.75)`            | `rgba(232, 221, 201, 0.75)`        | Linen beige glow                         |
| Mobile nav outer ring           | `bg-hannah-pink` (`#FBB6CE`)           | `#E8DDC9` (linen beige)            | Per "pink → beige"                       |
| Mobile nav inner / overlay      | `bg-pink-500/40`                       | `bg-[#A24E69]/40`                  | New rose at same opacity                 |
| Button text on rose             | `text-white`                           | `#FFF8EC` (cream)                  | "RSVP letters" — softer than white/black |
| Footer/help text                | `#8C7E68`                              | `#8C7E68`                          | Already brown — unchanged                |
| Card border                     | `#E8DDC9`                              | `#E8DDC9`                          | Unchanged                                |
| Cream button bg                 | `#FFF8EC` / border `#E7D9BF`           | unchanged                          | Already neutral                          |
| Gold divider                    | `#CAA55A`                              | `#CAA55A`                          | Unchanged per user                       |
| Admin row hover bg              | `#FFF8EC/60`                           | unchanged                          | Already neutral                          |
| Admin row alt bg                | `#FDFAF5`                              | unchanged                          | Already neutral                          |

## Interpretation of "RSVP letters black"

User clarified Hannah was referring to the **mobile floating RSVP button** at the bottom of the home page (the one that says "RSVP for May 16"). When previewed, pure black on pink read harsh, so we landed on **cream `#FFF8EC`** — softer than black and white, still high-readability. Applied to all white-on-rose button text site-wide for consistency (i.e., wherever `text-white` sat on `bg-[#2E4E3F]` previously).

## Scope of Change

### globals.css

- `--background`: `#9CAF88` → `#869A78` (in both `:root` and `prefers-color-scheme: dark`)
- `--foreground`: `#2e4e3f` → `#5A4A42` (warm brown body default)
- `--color-hannah-pink`: token retained for compatibility, reassigned to `rgba(232, 221, 201, 1)` (linen beige). Rationale: only two consumers (`naked-backdrop-halo`, `MobileNav.tsx`); no need for renaming churn this round.
- `naked-backdrop-halo::before` background: pink `rgba(251, 182, 206, 0.75)` → beige `rgba(232, 221, 201, 0.75)`

### Pages (11)

All hardcoded hex values matching the table above are replaced via Edit. Affected files:

- `app/(home)/page.tsx`
- `app/(home)/loading.tsx`
- `app/rsvp/page.tsx`
- `app/rsvp/loading.tsx`
- `app/cant-make-it/page.tsx`
- `app/cant-make-it/loading.tsx`
- `app/party-builder/page.tsx`
- `app/party-builder/loading.tsx`
- `app/register/page.tsx`
- `app/register/loading.tsx`
- `app/admin/page.tsx`
- `app/admin/party/page.tsx`
- `app/admin/party-people/[party_id]/page.tsx`
- `app/admin/allergies/page.tsx`
- `app/maintence/page.tsx`
- `app/maintence/loading.tsx`
- `app/gallery/page.tsx`

### Components (~20)

- `components/Navigation/MobileNav.tsx` — outer ring beige, inner/overlay new-rose
- `components/Navigation/Header.tsx` — `naked-text` continues to apply
- `components/Cards/{InfoCard,StoryCard}.tsx`
- `components/Accordions/AccordionItem.tsx`
- `components/Modal/Modal.tsx` — primary button rose, hover lighter rose
- `components/Countdown/Countdown.tsx` + `CountdownSkeleton.tsx`
- `components/Logo/Logo.tsx`
- `components/PartyBuilder/{PartyBuilder,Row,Input,Label,AddSubmitButtons,RemoveButton}.tsx`
- `components/Fields/{Text,TextArea,Select,Number,Checkbox}Field.tsx`
- `components/Gallery/{GalleryGrid,Lightbox}.tsx`
- `components/GoldFrame/GoldFrame.tsx`
- `components/BtfSkeletons/HomeBtfSkeleton.tsx`
- `components/Text/NakedHeader.tsx` (no direct color refs but consumes globals)

### Out of scope

- Backend, auth, routing — pure CSS change
- Image assets, gallery photos, gold frame — visual content stays
- Tailwind config — no token refactor; we keep flat hex values for this round to limit blast radius. (A future refactor could promote everything to CSS variables.)
- Documentation files in `docs/` — historical specs/plans reference old colors but are frozen records of past work.

## Approach

Mechanical find-and-replace per the table above. Order:

1. Update `globals.css` (design tokens + halo).
2. Update components (smaller files, easier to spot-check).
3. Update pages and loading skeletons.
4. Run `yarn build` to catch any syntax breakage.
5. `yarn dev` and walk through every route in the browser methodically; capture before/after observations.

## Risks & Mitigations

- **Risk:** Some hex values appear in multiple semantic contexts (e.g., `#6B725E` is used both as small-label color AND as the "cancel button" text). Mapping it to one new value should still work because both contexts want medium-warm-neutral.
- **Risk:** `text-white` on rose buttons exists in many places; we need to convert to `text-[#FFF8EC]` only where the bg is the new rose, not where it's, say, on a dark photo overlay (Lightbox close UI). Mitigation: scope replacements to lines that also reference the rose bg.
- **Risk:** `hover:text-[#9CAF88]` on links would now match the bg color and disappear on hover. Mitigation: replace with `hover:text-[#C07F94]`.
- **Risk:** Hannah may not love the muted sage `#869A78` once she sees it live. Mitigation: tokens are centralized to a small handful of values; tweaking is a one-line change.

## Acceptance

- Visual walkthrough of all routes (home, rsvp, cant-make-it, party-builder, register, gallery, admin/*, maintence, auth/*) shows no remaining `#2E4E3F`/`#9CAF88`/`#FBB6CE` artifacts.
- All buttons remain readable (cream on rose, no contrast regressions).
- `yarn build` succeeds.
- Hannah and Hayden both approve the live preview before deploy.
