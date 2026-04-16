import fs from "fs/promises";
import path from "path";
import { NakedHeader } from "@/components";
import GalleryGrid from "@/components/Gallery/GalleryGrid";

const PHOTO_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp"]);

async function getGalleryPhotos(): Promise<string[]> {
  const dir = path.join(process.cwd(), "public", "gallery");
  try {
    const files = await fs.readdir(dir);
    return files
      .filter((f) => PHOTO_EXTENSIONS.has(path.extname(f).toLowerCase()))
      .sort();
  } catch {
    return [];
  }
}

export default async function GalleryPage() {
  const photos = await getGalleryPhotos();

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
