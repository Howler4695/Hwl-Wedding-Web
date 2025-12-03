import { InfoCardSkeleton } from "../Cards/InfoCard";
import { StoryCardSkeleton } from "../Cards/StoryCard";
import { NakedHeader } from "../Text/NakedHeader";

export const HomeBtfSkeleton = () => (
  <>
    <section className="relative z-10 mx-auto mt-14 w-full max-w-6xl px-6">
      <NakedHeader text="Our Story" />
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
        <StoryCardSkeleton />
        <StoryCardSkeleton />
        <StoryCardSkeleton />
        <StoryCardSkeleton />
        <StoryCardSkeleton />
        <StoryCardSkeleton />
      </div>
    </section>

    <section
      id="travel"
      className="relative z-10 mx-auto mt-14 w-full max-w-6xl px-6"
    >
      <NakedHeader text="Travel & Lodging" />
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
        <InfoCardSkeleton />
        <InfoCardSkeleton />
        <InfoCardSkeleton />
      </div>
      <div className="card mt-6 p-4 text-sm text-[#4F5E50]">
        <p className="mb-2 font-medium text-[#2E4E3F]">Ceremony to Reception</p>
        <div className="grid place-items-center rounded-xl border border-[#E8DDC9] bg-white/60 p-2 sm:p-4 md:p-8 text-center overflow-hidden">
          <div className="skeleton-glow h-[300px] w-[270px] md:h-[450px] md:w-[600px]" />
        </div>
      </div>
    </section>

    <section
      id="faqs"
      className="relative z-10 mx-auto mt-14 w-full max-w-3xl px-6"
    >
      <NakedHeader text="FAQs" />
      <div className="card mt-4 divide-y divide-[#E8DDC9]">
        <AccordionItemSkeleton />
        <AccordionItemSkeleton />
        <AccordionItemSkeleton />
      </div>
    </section>
    <footer className="relative z-10 mx-auto mt-16 w-full max-w-6xl px-6 pb-32 sm:pb-12" />
  </>
);

export const AccordionItemSkeleton = () => (
  <div>
    <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3">
      <span className="skeleton-glow font-medium">question</span>
      <span className="skelton-glow ml-4 select-none rounded-full border border-[#E8DDC9] px-2 py-0.5 text-xs">
        open/closed
      </span>
    </summary>
    <div className="skeleton-glow px-4 pb-4 text-sm">answer</div>
  </div>
);
