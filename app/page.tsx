import Image from "next/image";
import Link from "next/link";
import { formatDateLong, formatDateShort } from "@/helpers";
import {
  Card,
  InfoCard,
  StoryCard,
  RegistryButton,
  AccordionItem,
  Countdown,
  AddCalenderButton,
} from "@/components";

export default function HomePage() {
  const COUPLE = "Hannah & Hayden";
  const WEDDING_DATE = "2026-05-16T16:30:00-05:00";
  const CITY_STATE = "Saint Francisville, Louisiana";
  const CEREMONY_VENUE = "Grace Epicopal Church";
  const RECEPTION_VENUE = "Propinquity";
  const HAS_GOLD_OUTLINE = false;

  const targetDate = new Date(WEDDING_DATE);

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-b  text-[#2E4E3F]">
      <Image
        src="/magnolia_no_stem.png"
        alt="Decorative magnolia"
        width={1024}
        height={1024}
        className="pointer-events-none select-none absolute -top-20 -left-20 h-72 w-72 rotate-[140deg] opacity-60"
        priority
      />
      <Image
        src="/magnolia_no_stem.png"
        alt="Decorative magnolia"
        width={1024}
        height={1024}
        className="pointer-events-none select-none absolute -bottom-24 -right-24 h-80 w-80 rotate-[320deg] opacity-70"
        priority
      />

      <header className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
        <div className="font-serif text-xl sm:text-2xl text-white/90">
          Hannah & Hayden's Wedding
        </div>
        <nav className="hidden gap-6 text-sm text-white/80 sm:flex">
          <Link href="/rsvp" className="hover:text-white">
            RSVP
          </Link>
          <Link href="#events" className="hover:text-white">
            Events
          </Link>
          <Link href="#travel" className="hover:text-white">
            Travel
          </Link>
          <Link href="#registry" className="hover:text-white">
            Registry
          </Link>
          <Link href="#faqs" className="hover:text-white">
            FAQ
          </Link>
        </nav>
      </header>

      <section className="relative z-10 mx-auto mt-2 w-full max-w-5xl px-6">
        <Card pad={32} useGold={HAS_GOLD_OUTLINE}>
          <p className="mb-1 text-[12px] uppercase tracking-[0.35em] text-[#6B725E]">
            Welcome
          </p>
          <h1 className="font-serif text-4xl leading-tight sm:text-6xl">
            {COUPLE}
          </h1>
          <div className="mx-auto my-5 h-0.5 w-28 rounded-full bg-gradient-to-r from-transparent via-[#CAA55A] to-transparent" />
          <p className="text-[#4F5E50]">
            {formatDateLong(targetDate)} · {CITY_STATE}
          </p>

          <div className="mt-6">
            <Countdown target={targetDate} />
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-3 justify-evenly sm:justify-normal">
            <Link
              href="/register"
              className="sm:inline-flex items-center justify-center hidden rounded-2xl border border-[#9FB39E] bg-[#2E4E3F] px-6 py-3 text-white font-medium shadow transition-transform hover:-translate-y-0.5 hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-[#CAA55A] focus-visible:ring-offset-2"
            >
              RSVP Now
            </Link>
            <AddCalenderButton />
          </div>
        </Card>
      </section>

      <section
        id="events"
        className="relative z-10 mx-auto mt-12 w-full max-w-6xl px-6"
      >
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <Card useGold={HAS_GOLD_OUTLINE}>
            <h2 className="font-serif text-2xl sm:text-3xl">The Ceremony</h2>
            <p className="mt-2 text-sm text-[#7A846F]">{CEREMONY_VENUE}</p>
            <p className="mt-1 text-[#4F5E50]">4:30 PM · Garden Lawn</p>
            <ul className="mt-4 list-disc pl-5 text-sm text-[#4F5E50]">
              <li>Outdoor seating (shaded)</li>
              <li>Attire: Garden formal</li>
              <li>Shuttle service from hotel block</li>
            </ul>
          </Card>
          <Card useGold={HAS_GOLD_OUTLINE}>
            <h2 className="font-serif text-2xl sm:text-3xl">The Reception</h2>
            <p className="mt-2 text-sm text-[#7A846F]">{RECEPTION_VENUE}</p>
            <p className="mt-1 text-[#4F5E50]">6:00 PM · Dinner & Dancing</p>
            <ul className="mt-4 list-disc pl-5 text-sm text-[#4F5E50]">
              <li>Plated dinner (menu options later)</li>
              <li>Open bar · Live band</li>
              <li>After‑party bonfire on the beach</li>
            </ul>
          </Card>
        </div>
      </section>

      <section className="relative z-10 mx-auto mt-14 w-full max-w-6xl px-6">
        <h2 className="font-serif text-3xl text-white/80">Our Story</h2>
        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
          <StoryCard
            title="First Hello"
            subtitle="January 2025"
            text="Went on a date at El patron while Hannah was on a drill weekend."
          />
          <StoryCard
            title="Let's See Where This Goes"
            subtitle="Febuary 2025"
            text="After an amazing date at Buccees, we decide to officially become a couple."
          />
          <StoryCard
            title="Future Pharmicist"
            subtitle="August 2025"
            text="After years of hard work and saving, Hannah walks the stage receiving here whitecoat. Starting her 4 year journey in PharmD."
          />
          <StoryCard
            title="Yes!"
            subtitle="September 2025"
            text="Hayden proposed at the Redburn in Auburn at sunset."
          />
          <StoryCard
            title="Next Chapter"
            subtitle="May 2026"
            text="Can’t wait to celebrate with our favorite people."
          />
        </div>
      </section>

      <section
        id="travel"
        className="relative z-10 mx-auto mt-14 w-full max-w-6xl px-6"
      >
        <h2 className="font-serif text-3xl text-white">Travel & Lodging</h2>
        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
          <InfoCard
            label="Hotel Block"
            text="Magnolia Dunes Inn — mention ‘Kounter‑Howle’ for group rate."
          />
          <InfoCard
            label="Airports"
            text="Closest: PNS (Pensacola), MOB (Mobile) — ~1.5 hrs drive."
          />
          <InfoCard
            label="Getting Around"
            text="Free shuttles wedding day; rideshare available in area."
          />
        </div>
        <div className="mt-6 rounded-2xl border border-[#E8DDC9] bg-white/60 p-4 text-sm text-[#4F5E50]">
          <p className="mb-2 font-medium text-[#2E4E3F]">Map</p>
          <div className="grid place-items-center rounded-xl border border-[#E8DDC9] bg-white/60 p-8 text-center">
            <p>Embed Google Map here (venue & hotel pins).</p>
            <p className="mt-2 text-xs text-[#7A846F]">
              Replace this box with an iframe or custom map component.
            </p>
          </div>
        </div>
      </section>

      <section
        id="registry"
        className="relative z-10 mx-auto mt-14 w-full max-w-6xl px-6"
      >
        <h2 className="font-serif text-3xl text-white/90">Registry</h2>
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <RegistryButton href="#" label="Amazon" />
          <RegistryButton href="#" label="Target" />
          <RegistryButton href="#" label="Zola" />
        </div>
      </section>

      <section className="relative z-10 mx-auto mt-14 w-full max-w-6xl px-6">
        <h2 className="font-serif text-3xl text-white/90">Photos</h2>
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="aspect-square rounded-xl border border-[#E8DDC9] bg-white/60"
            />
          ))}
        </div>
      </section>

      <section
        id="faqs"
        className="relative z-10 mx-auto mt-14 w-full max-w-3xl px-6"
      >
        <h2 className="font-serif text-3xl text-white/90">FAQs</h2>
        <div className="mt-4 divide-y divide-[#E8DDC9] rounded-2xl border border-[#E8DDC9] bg-white/60">
          <AccordionItem
            q="What’s the dress code?"
            a="Garden formal. Think suits or cocktail dresses; breathable fabrics encouraged."
          />
          <AccordionItem
            q="Can I bring a guest?"
            a="Please check your invitation; space is limited at the venue."
          />
          <AccordionItem
            q="Are kids welcome?"
            a="We love your little ones! We’ll share details on childcare options soon."
          />
        </div>
      </section>

      <div className="fixed bottom-4 left-0 right-0 z-20 px-4 sm:hidden">
        <Link
          href="/register"
          className="block w-full rounded-2xl border border-[#9FB39E] bg-[#2E4E3F] px-6 py-3 text-center text-white shadow-lg"
        >
          RSVP for {formatDateShort(targetDate)}
        </Link>
      </div>

      <footer className="relative z-10 mx-auto mt-16 w-full max-w-6xl px-6 pb-20 sm:pb-12">
        <div className="mt-8 flex items-center justify-center gap-2 text-xs text-[#8C7E68]">
          <span className="inline-block h-px w-8 bg-[#E8DDC9]" />
          <span>
            {COUPLE} · {CITY_STATE}
          </span>
          <span className="inline-block h-px w-8 bg-[#E8DDC9]" />
        </div>
      </footer>
    </main>
  );
}
