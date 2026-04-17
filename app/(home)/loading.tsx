import Link from "next/link";
import { formatDateLong } from "@/helpers";
import {
  Card,
  InfoCard,
  StoryCard,
  AccordionItem,
  CountdownSkeleton,
  NakedHeader,
} from "@/components";

export default async function LoadingHomePage() {
  const WEDDING_DATE = "2026-05-16T16:30:00-05:00";
  const CITY_STATE = "Saint Francisville, Louisiana";

  return (
    <div>
      <section
        id="welcome"
        className="relative z-10 mx-auto mt-2 w-full max-w-6xl px-6"
      >
        <Card pad={32}>
          <p className="mb-1 text-[12px] uppercase tracking-[0.35em] text-[#7A6B5C]">
            Welcome
          </p>
          <h1 className="leading-tight">Hannah & Hayden</h1>
          <div className="mx-auto my-5 h-0.5 w-28 rounded-full bg-gradient-to-r from-transparent via-[#CAA55A] to-transparent" />
          <p className="text-[#5A4A42]">
            {formatDateLong(WEDDING_DATE)} · {CITY_STATE}
          </p>

          <div className="mt-6">
            <CountdownSkeleton />
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-3 justify-evenly sm:justify-normal">
            <div className="skeleton-glow sm:inline-flex items-center justify-center hidden rounded-2xl border border-[#843E55] bg-[#A24E69] px-6 py-3 font-medium shadow">
              {"RSVP Now"}
            </div>
            <div className="skeleton-glow inline-flex items-center justify-center rounded-2xl px-6 py-3 font-medium border border-[#E7D9BF]">
              Add to Calendar
            </div>
          </div>
        </Card>
      </section>

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
        <div className="mt-2 flex flex-col items-center gap-1">
          <p className="text-xs text-[#5A4A42]">
            {"Courtesy of "}
            <span className="text-[#A24E69] underline underline-offset-2">Eric Lincoln</span>
            {" & "}
            <span className="text-[#A24E69] underline underline-offset-2">Christine Kounter</span>
          </p>
          <Link
            href="/gallery"
            className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-[#A24E69] bg-[#FFF8EC] px-5 py-2 text-sm font-medium text-[#A24E69] shadow-sm"
          >
            View Gallery
            <span aria-hidden="true" className="text-base leading-none">→</span>
          </Link>
        </div>
      </section>

      <section
        id="story"
        className="relative z-10 mx-auto section-offset w-full max-w-6xl px-6"
      >
        <NakedHeader text="Our Story" />
        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
          <StoryCard title="First Hello" subtitle="July 2024" text="Hannah and Hayden meet online." />
          <StoryCard title="First Date" subtitle="January 2025" text="Hayden asks Hannah on a date over Mexican and Margaritas." />
          <StoryCard title="It's Official" subtitle="Febuary 2025" text="After an amazing date at Buccees, Hannah and Hayden decide to officially become a couple." />
          <StoryCard title="Future Pharmicist" subtitle="August 2025" text="After years of hard work, Hannah receives her whitecoat. Marking the start of her 4 year journey to get her doctorate in pharmacy." />
          <StoryCard title="She Said Yes!" subtitle="September 2025" text="Hayden proposes at the Red Barn in Auburn at sunset. Hannah says YES!!" />
          <StoryCard title="Next Chapter" subtitle="May 2026" text="We can't wait to celebrate with our favorite people!" />
        </div>
      </section>

      <section
        id="travel"
        className="relative z-10 mx-auto section-offset w-full max-w-6xl px-6"
      >
        <NakedHeader text="Travel & Lodging" />
        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
          <InfoCard
            label="Accommodations"
            text="Best Western St. Franciville · The Myrtles · Hotel Francis · Family in area"
          />
          <InfoCard label="Airport" text="Closest: BTR (Baton Rouge) — ~30 min drive." />
          <InfoCard
            label="Getting Around"
            text="You'll be driving, recommend car pooling with friends and family"
          />
        </div>
        <div className="card mt-6 p-4 text-sm text-[#5A4A42]">
          <p className="mb-2 font-medium text-[#A24E69]">Ceremony to Reception</p>
          <div className="grid place-items-center rounded-xl border border-[#E8DDC9] bg-white/60 p-2 sm:p-4 md:p-8 text-center overflow-hidden">
            <div className="skeleton-glow h-[300px] w-[270px] md:h-[450px] md:w-[600px] rounded-2xl" />
          </div>
        </div>
      </section>

      <section
        id="faqs"
        className="relative z-10 mx-auto section-offset w-full max-w-3xl px-6"
      >
        <NakedHeader text="FAQs" />
        <div className="card mt-4 divide-y divide-[#E8DDC9]">
          <AccordionItem q="What's the dress code?" a="Cocktail Attire." />
          <AccordionItem
            q="Can I bring a guest?"
            a="Yes, but plus one's may be limited due to space concerns."
          />
          <AccordionItem
            q="Are kids welcome?"
            a="Absolutely! Please make sure they're added to your party."
          />
        </div>
      </section>
      <footer className="relative z-10 mx-auto mt-16 w-full max-w-6xl px-6 pb-32 sm:pb-12" />

      <div className="fixed bottom-20 left-0 right-0 z-20 px-4 sm:hidden">
        <div className="skeleton-glow block w-full rounded-2xl border border-[#E7D9BF] bg-[#FFF8EC] px-6 py-3 text-center shadow-lg">
          Registry
        </div>
      </div>
      <div className="fixed bottom-4 left-0 right-0 z-20 px-4 sm:hidden">
        <div className="skeleton-glow block w-full rounded-2xl border border-[#843E55] bg-[#A24E69] px-6 py-3 text-center shadow-lg">
          RSVP
        </div>
      </div>
    </div>
  );
}
