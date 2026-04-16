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
        <div className="relative mt-8 w-full max-w-2xl rounded-2xl bg-white/90 p-6 shadow-xl sm:mt-16 sm:p-8 self-center">
          <h2 id="modal-title" className="mb-3 tracking-tight text-[#A24E69]">
            {title}
          </h2>

          <div className="prose prose-slate max-w-none text-[15px] leading-7 text-[#A24E69]">
            <p>{text}</p>
          </div>

          <div className="mt-6 flex gap-2 justify-center md:justify-normal">
            <Link
              href={primaryHref}
              className="inline-flex items-center justify-center rounded-lg border-[#843E55] bg-[#A24E69] text-center shadow-lg px-4 py-2 text-sm font-medium text-[#FFF8EC] hover:bg-[#C07F94] focus:outline-none focus:ring-2 focus:ring-[#CAA55A]"
            >
              {primaryText}
            </Link>
            <Link
              href={secondaryHref}
              className="inline-flex items-center justify-center rounded-lg border-[#E7D9BF] bg-[#FFF8EC] text-[#7A6B5C] px-4 py-2 text-sm font-medium hover:bg-[#E7D9BF] focus:outline-none focus:ring-2 focus:ring-[#CAA55A]"
            >
              {secondaryText}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
