import { NakedHeader } from "@/components";
import GalleryGrid from "@/components/Gallery/GalleryGrid";
import { auth } from "@/auth";
import { checkIsAdmin } from "@/helpers/Auth";

const S3_BUCKET_URL =
  "https://hwl-wedding-photos.s3.us-east-2.amazonaws.com";

export type GalleryPhoto = {
  src: string;
  fullRes: string;
  filename: string;
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
      filename,
    };
  });
}

async function getVisiblePhotos(): Promise<Set<string>> {
  try {
    const res = await fetch(`${S3_BUCKET_URL}/gallery/visible.json`, {
      next: { revalidate: 0 },
    });
    const list: string[] = await res.json();
    return new Set(list);
  } catch {
    return new Set();
  }
}

export default async function GalleryPage({
  searchParams,
}: {
  searchParams?: Promise<{ photo?: string }>;
}) {
  const session = await auth();
  const isAdmin = checkIsAdmin(session);

  const allPhotos = await getGalleryPhotos();
  const visibleSet = await getVisiblePhotos();
  const openPhoto = (await searchParams)?.photo ?? null;

  const photos = isAdmin
    ? allPhotos
    : allPhotos.filter((p) => visibleSet.has(p.filename));

  return (
    <div className="relative z-10 mx-auto mt-2 w-full max-w-6xl px-6 pb-16">
      <NakedHeader text="Gallery" />
      {photos.length > 0 ? (
        <GalleryGrid
          photos={photos}
          initialPhoto={openPhoto}
          isAdmin={isAdmin}
          visiblePhotos={[...visibleSet]}
        />
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
