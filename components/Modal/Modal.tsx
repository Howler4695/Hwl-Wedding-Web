import Link from "next/link";

export default function FullPageModal({
  title,
  text,
  primaryHref,
  primaryText,
  secondaryHref,
  secondaryText,
}: {
  title: string;
  text: string;
  primaryHref: string;
  primaryText: string;
  secondaryText: string;
  secondaryHref: string;
}) {
  return (
    <div
      aria-modal="true"
      role="dialog"
      aria-labelledby="modal-title"
      className="fixed inset-0 z-50 flex"
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div className="relative z-10 flex h-full w-full items-start justify-center">
        <div className="relative mt-8 w-full max-w-2xl rounded-2xl bg-white/90 p-6 shadow-xl sm:mt-16 sm:p-8">
          <h1
            id="modal-title"
            className="mb-3 text-2xl font-semibold tracking-tight text-[#2E4E3F]"
          >
            {title}
          </h1>

          <div className="prose prose-slate max-w-none text-[15px] leading-7 text-[#2E4E3F]">
            <p>{text}</p>
          </div>

          <div className="mt-6 flex gap-2">
            <Link
              href={primaryHref}
              className="inline-flex items-center justify-center rounded-lg border-[#9FB39E] bg-[#2E4E3F] text-center shadow-lg px-4 py-2 text-sm font-medium text-white hover:bg-[#9FB39E] focus:outline-none focus:ring-2 focus:ring-slate-400"
            >
              {primaryText}
            </Link>
            <Link
              href={secondaryHref}
              className="inline-flex items-center justify-center rounded-lg border-[#E7D9BF] bg-[#FFF8EC] text-slate-600 px-4 py-2 text-sm font-medium hover:bg-[#E7D9BF] focus:outline-none focus:ring-2 focus:ring-slate-400"
            >
              {secondaryText}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
