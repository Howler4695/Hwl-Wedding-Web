# Gallery Page Design

## Summary

Add a `/gallery` page with a masonry photo grid and fullscreen lightbox viewer. Replaces the inline photos section on the home page with a preview linking to the full gallery.

## Architecture

### Photo Storage

- All photos (existing + new) live in `public/gallery/`
- The 4 existing Eric Lincoln photos (`front_pic_0.jpg` through `front_pic_3.jpg`) move into `public/gallery/`
- Server component reads `public/gallery/` via `fs.readdirSync(path.join(process.cwd(), 'public', 'gallery'))` at render time — works on EC2 where Next.js runs from the repo root
- Photos are sorted alphabetically by filename

### Middleware (`proxy.ts`)

- Add `/gallery` to the public route allowlist in the `!req.auth` check (alongside `/` and `/auth/signin`)
- Update the matcher regex: remove individual `front_pic_*.jpg` entries, add `gallery/` to the negative lookahead so static gallery images are not intercepted

### Gallery Page (`app/gallery/page.tsx`)

Server component that:
1. Reads `public/gallery/` directory for all `.jpg`/`.jpeg`/`.png`/`.webp` files
2. Passes file list to a client component for the interactive grid + lightbox

### Gallery Loading (`app/gallery/loading.tsx`)

Skeleton loading page matching project patterns — a grid of `skeleton-glow` placeholders in the masonry shape.

### Masonry Grid (`components/Gallery/GalleryGrid.tsx`)

Client component:
- CSS `columns` layout: `columns-2 sm:columns-2 md:columns-3 lg:columns-4`
- `gap` between items via margin-bottom on each item
- Each image wrapped in a `motion.div` with a unique `layoutId` based on filename
- Next.js `<Image>` with:
  - `sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"`
  - `loading="lazy"` (default)
  - No `placeholder="blur"` — dynamic paths from `fs.readdir` don't support static blur; accept this trade-off for the flexibility of drop-in photos
  - Rounded corners, subtle border matching existing card style (`border-[#E8DDC9]`)
- Staggered fade-in on scroll using Framer Motion (`initial={{ opacity: 0, y: 20 }}`, `whileInView={{ opacity: 1, y: 0 }}`)

### Lightbox (`components/Gallery/Lightbox.tsx`)

Client component using Framer Motion:

**Opening animation (Soft Bloom):**
- `layoutId` shared between thumbnail and lightbox image for smooth position+scale transition
- Backdrop: `#9CAF88` at 60% opacity with `backdrop-blur-sm`, fades in over 300ms
- Total transition: ~400ms ease-out

**Scroll lock:**
- Set `document.body.style.overflow = 'hidden'` when lightbox opens, restore on close
- Cleanup in `useEffect` return to handle unmount

**Navigation:**
- Left/right arrow buttons (desktop)
- Keyboard: arrow keys to navigate, Escape to close
- Swipe left/right on mobile via Framer Motion `drag="x"` with `onDragEnd` threshold
- Drag down to dismiss on mobile

**Close:**
- X button (top-right)
- Backdrop tap
- Escape key
- Drag down past threshold

**Exit animation:**
- Reverse bloom back to thumbnail position via `layoutId`
- Backdrop fades out

### Home Page Changes

- Photos section keeps the `NakedHeader` but shows first 4 gallery photos in a simple 2x2/4-col grid (inline, no separate component)
- Preserve Eric Lincoln photographer credit below the preview grid
- Add a "View Gallery" link below the credit
- Replace the `StaticImages` import with inline `<Image>` tags using dynamic paths from `fs.readdir` (same server component approach as the gallery page, limited to 4)

### Home Loading Page (`app/(home)/loading.tsx`)

- Remove the direct import of `LoadingStaticImages` from `@/components/Images/StaticImages`
- Replace with inline skeleton placeholders (4x `skeleton-glow` divs in a grid)
- Update section header from "Photos" to "Gallery"

### Navigation Changes

- `NavLinks.tsx`: Change `Photos → /#photos` link to `Gallery → /gallery`

## Components

| Component | Type | File |
|-----------|------|------|
| Gallery page | Server | `app/gallery/page.tsx` |
| Gallery loading | Server | `app/gallery/loading.tsx` |
| GalleryGrid | Client | `components/Gallery/GalleryGrid.tsx` |
| Lightbox | Client | `components/Gallery/Lightbox.tsx` |

## Testing (Playwright)

Install Playwright and write an e2e test:
- Mobile viewport (390x844, iPhone 14)
- Navigate to `/gallery`
- Verify grid renders with images
- Click a photo, verify lightbox opens
- Screenshot for visual review
- Close lightbox, verify it closes
- Test file: `e2e/gallery.spec.ts`

## File Changes Summary

| Action | File |
|--------|------|
| Create | `app/gallery/page.tsx` |
| Create | `app/gallery/loading.tsx` |
| Create | `components/Gallery/GalleryGrid.tsx` |
| Create | `components/Gallery/Lightbox.tsx` |
| Create | `e2e/gallery.spec.ts` |
| Move | `public/front_pic_*.jpg` → `public/gallery/` |
| Edit | `proxy.ts` — add `/gallery` to public routes, update matcher for `gallery/` assets |
| Edit | `app/(home)/page.tsx` — photos section becomes inline preview with credit + "View Gallery" link |
| Edit | `app/(home)/loading.tsx` — replace `LoadingStaticImages` import with inline skeletons |
| Edit | `components/Navigation/NavLinks.tsx` — Photos → Gallery |
| Edit | `components/index.ts` — remove `StaticImages` export, add gallery exports |
| Delete | `components/Images/StaticImages.tsx` — replaced by gallery components + inline preview |
| Install | `@playwright/test` as dev dependency |
