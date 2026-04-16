import { NakedHeader } from "@/components";
import GalleryGrid from "@/components/Gallery/GalleryGrid";

const S3_BUCKET_URL =
  "https://hwl-wedding-photos.s3.us-east-2.amazonaws.com";

export type GalleryPhoto = {
  src: string;
  fullRes: string;
};

async function getGalleryPhotos(): Promise<GalleryPhoto[]> {
  const res = await fetch(
    `${S3_BUCKET_URL}?list-type=2&prefix=gallery/web/`,
    { next: { revalidate: 60 } }
  );
  const xml = await res.text();
  const keys = [...xml.matchAll(/<Key>([^<]+)<\/Key>/g)]
    .map((m) => m[1])
    .filter((key) => key.toLowerCase().endsWith(".jpg"))
    .sort();

  return keys.map((key) => {
    const filename = key.replace("gallery/web/", "");
    const baseName = filename.replace(/\.jpg$/, "");
    return {
      src: `${S3_BUCKET_URL}/${key}`,
      fullRes: `${S3_BUCKET_URL}/gallery/${baseName}.png`,
    };
  });
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
        {" & "}
        <a
          className="text-blue-400 underline"
          href="#"
          target="_blank"
          rel="noopener noreferrer"
        >
          Christine Kounter
        </a>
      </p>
    </div>
  );
}
