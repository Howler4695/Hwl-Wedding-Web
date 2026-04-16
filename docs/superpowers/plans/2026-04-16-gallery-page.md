# Gallery Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a `/gallery` page with masonry photo grid, Framer Motion lightbox, and update the home page to preview photos with a link to the full gallery.

**Architecture:** Server component reads `public/gallery/` via `fs` and passes filenames to a client-side masonry grid. Clicking a photo opens a Framer Motion lightbox with `layoutId` transitions, swipe navigation, and scroll lock. Home page shows a 4-photo preview. Playwright e2e test validates mobile experience.

**Tech Stack:** Next.js 16 App Router, Framer Motion 12, Tailwind CSS 4, Next/Image, Playwright

**Spec:** `docs/superpowers/specs/2026-04-16-gallery-page-design.md`

---

## File Structure

| File | Responsibility |
|------|---------------|
| `app/gallery/page.tsx` | Server component: reads `public/gallery/`, renders page shell, passes filenames to GalleryGrid |
| `app/gallery/loading.tsx` | Skeleton loading state for gallery page |
| `components/Gallery/GalleryGrid.tsx` | Client component: masonry CSS columns grid + manages lightbox open state |
| `components/Gallery/Lightbox.tsx` | Client component: fullscreen viewer with Framer Motion bloom animation, navigation, scroll lock |
| `e2e/gallery.spec.ts` | Playwright e2e test for mobile gallery experience |

---

### Task 1: Move photos and update middleware

**Files:**
- Move: `public/front_pic_0.jpg` → `public/gallery/front_pic_0.jpg` (repeat for 0-3)
- Modify: `proxy.ts:4-14` (public route allowlist)
- Modify: `proxy.ts:30-34` (matcher regex)

- [ ] **Step 1: Create gallery directory and move photos**

```bash
mkdir -p public/gallery
mv public/front_pic_0.jpg public/gallery/
mv public/front_pic_1.jpg public/gallery/
mv public/front_pic_2.jpg public/gallery/
mv public/front_pic_3.jpg public/gallery/
```

- [ ] **Step 2: Update middleware — add `/gallery` to public routes**

In `proxy.ts`, change the `!req.auth` check (lines 9-13) from:

```typescript
  if (
    !req.auth &&
    req.nextUrl.pathname !== "/auth/signin" &&
    req.nextUrl.pathname !== "/"
  ) {
```

to:

```typescript
  if (
    !req.auth &&
    req.nextUrl.pathname !== "/auth/signin" &&
    req.nextUrl.pathname !== "/" &&
    req.nextUrl.pathname !== "/gallery"
  ) {
```

- [ ] **Step 3: Update middleware matcher — replace individual front_pic entries with gallery/**

In `proxy.ts`, change the matcher (line 31-33) from:

```typescript
  matcher: [
    "/((?!api/auth/|auth/signin|auth/signout|maintence|auth/reauth|_next/static|_next/image|favicon.ico|__nextjs_font|img/|images/|magnolia_no_stem.svg|front_pic_0.jpg|front_pic_1.jpg|front_pic_2.jpg|front_pic_3.jpg).*)",
  ],
```

to:

```typescript
  matcher: [
    "/((?!api/auth/|auth/signin|auth/signout|maintence|auth/reauth|_next/static|_next/image|favicon.ico|__nextjs_font|img/|images/|gallery/|magnolia_no_stem.svg).*)",
  ],
```

- [ ] **Step 4: Commit**

Note: The build is intentionally broken at this point — `StaticImages.tsx` still imports the old `front_pic_*.jpg` paths. This is resolved in Task 5.

```bash
git add public/gallery/ proxy.ts
git commit -m "feat: move photos to public/gallery and update middleware for gallery route"
```

---

### Task 2: Create Lightbox component

**Files:**
- Create: `components/Gallery/Lightbox.tsx`

- [ ] **Step 1: Create the Lightbox component**

Create `components/Gallery/Lightbox.tsx`:

```tsx
"use client";

import { useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

type LightboxProps = {
  photos: string[];
  selectedIndex: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
};

export default function Lightbox({
  photos,
  selectedIndex,
  onClose,
  onNavigate,
}: LightboxProps) {
  const photo = photos[selectedIndex];

  // Scroll lock
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight" && selectedIndex < photos.length - 1)
        onNavigate(selectedIndex + 1);
      if (e.key === "ArrowLeft" && selectedIndex > 0)
        onNavigate(selectedIndex - 1);
    },
    [onClose, onNavigate, selectedIndex, photos.length]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0 bg-[#9CAF88]/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 rounded-full bg-white/20 p-2 text-white backdrop-blur-sm transition-colors hover:bg-white/40"
        aria-label="Close"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>

      {/* Navigation arrows */}
      {selectedIndex > 0 && (
        <button
          onClick={() => onNavigate(selectedIndex - 1)}
          className="absolute left-4 z-10 rounded-full bg-white/20 p-2 text-white backdrop-blur-sm transition-colors hover:bg-white/40"
          aria-label="Previous photo"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
      )}
      {selectedIndex < photos.length - 1 && (
        <button
          onClick={() => onNavigate(selectedIndex + 1)}
          className="absolute right-4 z-10 rounded-full bg-white/20 p-2 text-white backdrop-blur-sm transition-colors hover:bg-white/40"
          aria-label="Next photo"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      )}

      {/* Image with drag-to-dismiss and swipe navigation */}
      <motion.div
        className="relative z-10 flex max-h-[85vh] max-w-[90vw] items-center justify-center"
        layoutId={`gallery-photo-${photo}`}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        drag
        dragConstraints={{ top: 0, bottom: 0, left: 0, right: 0 }}
        dragElastic={0.4}
        onDragEnd={(_, info) => {
          if (Math.abs(info.offset.y) > 100) {
            onClose();
          } else if (info.offset.x < -80 && selectedIndex < photos.length - 1) {
            onNavigate(selectedIndex + 1);
          } else if (info.offset.x > 80 && selectedIndex > 0) {
            onNavigate(selectedIndex - 1);
          }
        }}
      >
        <Image
          src={`/gallery/${photo}`}
          alt=""
          width={1200}
          height={800}
          className="max-h-[85vh] w-auto rounded-lg object-contain"
          sizes="90vw"
          priority
        />
      </motion.div>
    </motion.div>
  );
}
```

- [ ] **Step 2: Verify no TypeScript errors**

Run: `npx tsc --noEmit --pretty`
Expected: No errors in `Lightbox.tsx`

- [ ] **Step 3: Commit**

```bash
git add components/Gallery/Lightbox.tsx
git commit -m "feat: add Lightbox component with bloom animation and swipe navigation"
```

---

### Task 3: Create GalleryGrid component

**Files:**
- Create: `components/Gallery/GalleryGrid.tsx`

- [ ] **Step 1: Create the GalleryGrid component**

Create `components/Gallery/GalleryGrid.tsx`:

```tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import Lightbox from "./Lightbox";

export default function GalleryGrid({ photos }: { photos: string[] }) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  return (
    <>
      <div className="mt-6 columns-2 md:columns-3 lg:columns-4 gap-3">
        {photos.map((photo, i) => (
          <motion.div
            key={photo}
            layoutId={`gallery-photo-${photo}`}
            className="mb-3 cursor-pointer overflow-hidden rounded-xl border border-[#E8DDC9] break-inside-avoid"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            onClick={() => setSelectedIndex(i)}
          >
            <Image
              src={`/gallery/${photo}`}
              alt=""
              width={600}
              height={400}
              className="w-full h-auto block"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedIndex !== null && (
          <Lightbox
            photos={photos}
            selectedIndex={selectedIndex}
            onClose={() => setSelectedIndex(null)}
            onNavigate={setSelectedIndex}
          />
        )}
      </AnimatePresence>
    </>
  );
}
```

- [ ] **Step 2: Verify no TypeScript errors**

Run: `npx tsc --noEmit --pretty`
Expected: No errors in `GalleryGrid.tsx`

- [ ] **Step 3: Commit**

```bash
git add components/Gallery/GalleryGrid.tsx
git commit -m "feat: add GalleryGrid masonry component with staggered fade-in"
```

---

### Task 4: Create gallery page and loading skeleton

**Files:**
- Create: `app/gallery/page.tsx`
- Create: `app/gallery/loading.tsx`

- [ ] **Step 1: Create the gallery page**

Create `app/gallery/page.tsx`:

```tsx
import fs from "fs";
import path from "path";
import { NakedHeader } from "@/components";
import GalleryGrid from "@/components/Gallery/GalleryGrid";

const PHOTO_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp"]);

function getGalleryPhotos(): string[] {
  const dir = path.join(process.cwd(), "public", "gallery");
  try {
    return fs
      .readdirSync(dir)
      .filter((f) => PHOTO_EXTENSIONS.has(path.extname(f).toLowerCase()))
      .sort();
  } catch {
    return [];
  }
}

export default function GalleryPage() {
  const photos = getGalleryPhotos();

  return (
    <div className="relative z-10 mx-auto mt-2 w-full max-w-6xl px-6 pb-16">
      <NakedHeader text="Gallery" />
      {photos.length > 0 ? (
        <GalleryGrid photos={photos} />
      ) : (
        <p className="mt-8 text-center text-[#4F5E50]">
          Photos coming soon.
        </p>
      )}
      <p className="mt-4 text-center text-xs text-[#4F5E50]/70">
        {"Courtesy of "}
        <a
          className="text-blue-400 underline"
          href="https://ericlincoln.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Eric Lincoln
        </a>
      </p>
    </div>
  );
}
```

- [ ] **Step 2: Create the gallery loading skeleton**

Create `app/gallery/loading.tsx`:

```tsx
import { NakedHeader } from "@/components";

export default function GalleryLoading() {
  return (
    <div className="relative z-10 mx-auto mt-2 w-full max-w-6xl px-6 pb-16">
      <NakedHeader text="Gallery" />
      <div className="mt-6 columns-2 md:columns-3 lg:columns-4 gap-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="mb-3 skeleton-glow rounded-xl break-inside-avoid"
            style={{ height: `${180 + (i % 3) * 60}px` }}
          />
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Verify build compiles**

Run: `npx tsc --noEmit --pretty`
Expected: No errors

- [ ] **Step 4: Commit**

```bash
git add app/gallery/
git commit -m "feat: add gallery page with dynamic photo loading and skeleton"
```

---

### Task 5: Update home page, loading, nav, and barrel exports

**Files:**
- Modify: `app/(home)/page.tsx:1-14,89-95` (imports + photos section)
- Modify: `app/(home)/loading.tsx:1-3,40-46` (imports + photos skeleton)
- Modify: `components/Navigation/NavLinks.tsx:28-29` (Photos → Gallery link)
- Modify: `components/index.ts:24` (remove StaticImages export)
- Delete: `components/Images/StaticImages.tsx`

- [ ] **Step 1: Update home page — replace photos section with preview + gallery link**

In `app/(home)/page.tsx`:

Remove the `StaticImages` import (line 11) from the import block. The import line:
```tsx
  StaticImages,
```
should be removed.

Then replace the photos section (lines 89-95):

```tsx
      <section
        id="photos"
        className="relative z-10 mx-auto section-offset w-full max-w-6xl px-6"
      >
        <NakedHeader text="Photos" />
        <StaticImages />
      </section>
```

with:

```tsx
      <section
        id="photos"
        className="relative z-10 mx-auto section-offset w-full max-w-6xl px-6"
      >
        <NakedHeader text="Gallery" />
        <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
          {["front_pic_0.jpg", "front_pic_1.jpg", "front_pic_2.jpg", "front_pic_3.jpg"].map((photo) => (
            <Image
              key={photo}
              src={`/gallery/${photo}`}
              alt=""
              width={600}
              height={600}
              className="aspect-square rounded-xl border border-[#E8DDC9] bg-white/60 object-cover"
            />
          ))}
        </div>
        <div className="mt-2 flex flex-col items-center gap-1">
          <p className="text-xs text-[#4F5E50]/70">
            {"Courtesy of "}
            <a className="text-blue-400 underline" href="https://ericlincoln.com/" target="_blank" rel="noopener noreferrer">
              Eric Lincoln
            </a>
          </p>
          <Link
            href="/gallery"
            className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-[#2E4E3F] underline underline-offset-4 hover:text-[#9CAF88]"
          >
            View Gallery
          </Link>
        </div>
      </section>
```

Also add the `Image` import at the top of the file (it's not currently imported):
```tsx
import Image from "next/image";
```

- [ ] **Step 2: Update loading page — replace LoadingStaticImages with inline skeletons**

In `app/(home)/loading.tsx`:

Remove line 3:
```tsx
import { LoadingStaticImages } from "@/components/Images/StaticImages";
```

Replace the photos section (lines 40-46):
```tsx
      <section
        id="photos"
        className="relative z-10 mx-auto section-offset w-full max-w-6xl px-6"
      >
        <NakedHeader text="Photos" />
        <LoadingStaticImages />
      </section>
```

with:

```tsx
      <section
        id="photos"
        className="relative z-10 mx-auto section-offset w-full max-w-6xl px-6"
      >
        <NakedHeader text="Gallery" />
        <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="aspect-square rounded-xl border border-[#E8DDC9] skeleton-glow"
            />
          ))}
        </div>
      </section>
```

- [ ] **Step 3: Update nav link — Photos → Gallery**

In `components/Navigation/NavLinks.tsx`, change line 28-29:

```tsx
    <Link href="/#photos" className="text-nav" onClick={onNav}>
      Photos
    </Link>
```

to:

```tsx
    <Link href="/gallery" className="text-nav" onClick={onNav}>
      Gallery
    </Link>
```

- [ ] **Step 4: Update barrel exports — remove StaticImages**

In `components/index.ts`, remove line 24:

```tsx
export { StaticImages as StaticImages } from "./Images/StaticImages";
```

- [ ] **Step 5: Delete StaticImages component**

```bash
rm components/Images/StaticImages.tsx
```

If `components/Images/` is now empty:
```bash
rmdir components/Images
```

- [ ] **Step 6: Verify build**

Run: `yarn build`
Expected: Build succeeds with no errors

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: update home page with gallery preview, nav link, and remove StaticImages"
```

---

### Task 6: Install Playwright and write e2e test

**Files:**
- Create: `e2e/gallery.spec.ts`
- Create: `playwright.config.ts`

- [ ] **Step 1: Install Playwright**

```bash
yarn add -D @playwright/test
npx playwright install chromium
```

- [ ] **Step 2: Create Playwright config**

Create `playwright.config.ts`:

```ts
import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  retries: 0,
  use: {
    baseURL: "http://localhost:3000",
  },
  webServer: {
    command: "yarn dev",
    url: "http://localhost:3000",
    reuseExistingServer: true,
    timeout: 30000,
  },
});
```

- [ ] **Step 3: Create gallery e2e test**

Create `e2e/gallery.spec.ts`:

```ts
import { test, expect } from "@playwright/test";

test.describe("Gallery page - mobile", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("renders gallery grid with photos", async ({ page }) => {
    await page.goto("/gallery");
    const images = page.locator("img");
    await expect(images.first()).toBeVisible();
    const count = await images.count();
    expect(count).toBeGreaterThanOrEqual(4);
    await page.screenshot({ path: "e2e/screenshots/gallery-mobile-grid.png", fullPage: true });
  });

  test("opens lightbox on photo tap", async ({ page }) => {
    await page.goto("/gallery");
    const firstImage = page.locator("img").first();
    await firstImage.click();

    // Lightbox backdrop should be visible
    const lightbox = page.locator("[aria-label='Close']");
    await expect(lightbox).toBeVisible();
    await page.screenshot({ path: "e2e/screenshots/gallery-mobile-lightbox.png" });
  });

  test("closes lightbox on X tap", async ({ page }) => {
    await page.goto("/gallery");
    await page.locator("img").first().click();

    const closeBtn = page.locator("[aria-label='Close']");
    await expect(closeBtn).toBeVisible();
    await closeBtn.click();

    // Lightbox should be gone
    await expect(closeBtn).not.toBeVisible();
  });
});

test.describe("Gallery page - desktop", () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  test("renders 4-column grid on desktop", async ({ page }) => {
    await page.goto("/gallery");
    await expect(page.locator("img").first()).toBeVisible();
    await page.screenshot({ path: "e2e/screenshots/gallery-desktop-grid.png", fullPage: true });
  });

  test("navigates photos with arrow buttons", async ({ page }) => {
    await page.goto("/gallery");
    await page.locator("img").first().click();

    const nextBtn = page.locator("[aria-label='Next photo']");
    await expect(nextBtn).toBeVisible();
    await nextBtn.click();

    // Should still be in lightbox with next photo
    await expect(page.locator("[aria-label='Close']")).toBeVisible();
    await page.screenshot({ path: "e2e/screenshots/gallery-desktop-lightbox-nav.png" });
  });
});
```

- [ ] **Step 4: Create screenshots directory**

```bash
mkdir -p e2e/screenshots
```

- [ ] **Step 5: Run the tests**

Start the dev server if not running, then:

```bash
npx playwright test --reporter=list
```

Expected: All tests pass. Screenshots saved to `e2e/screenshots/`.

- [ ] **Step 6: Review screenshots**

Open the screenshots and verify:
- Mobile grid shows 2 columns of photos
- Lightbox opens with sage-green backdrop
- Desktop grid shows 4 columns

- [ ] **Step 7: Commit**

```bash
git add playwright.config.ts e2e/ package.json yarn.lock
git commit -m "test: add Playwright e2e tests for gallery page"
```
