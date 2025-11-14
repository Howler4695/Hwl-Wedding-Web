import Link from "next/link";
import { formatDateLong, formatDateShort, GET_OPTIONS } from "@/helpers";
import {
  Card,
  InfoCard,
  StoryCard,
  AccordionItem,
  Countdown,
  AddCalenderButton,
  MagCorners,
  FullPageModal,
} from "@/components";
import Image from "next/image";
import { auth } from "@/auth";

export default async function HomePage({
  searchParams,
}: {
  searchParams?: Promise<{ attending?: string }>;
}) {
  const attending = (await searchParams)?.attending;
  const COUPLE = "Hannah & Hayden";
  const WEDDING_DATE = "2026-05-16T16:30:00-05:00";
  const CITY_STATE = "Saint Francisville, Louisiana";
  // const CEREMONY_VENUE = "Grace Epicopal Church";
  // const RECEPTION_VENUE = "Propinquity";
  const HAS_GOLD_OUTLINE = false;

  const session = await auth();
  const userId = session?.user?.id;

  let userInfo;
  let party;
  let partyPops;
  if (userId) {
    const userJ = await fetch(
      `${process.env.BACKEND_URL}/user/${userId}`,
      GET_OPTIONS(session)
    );
    const partyJ = await fetch(
      `${process.env.BACKEND_URL}/party/${userId}`,
      GET_OPTIONS(session)
    );
    const popJ = await fetch(
      `${process.env.BACKEND_URL}/party/pops/${userId}`,
      GET_OPTIONS(session)
    );
    userInfo = await userJ.json();
    party = await partyJ.json();
    partyPops = await popJ.json();
  }

  const displayName =
    userInfo?.Firstname === undefined && userInfo?.LastName === undefined
      ? null
      : partyPops.length > 1
      ? `${userInfo?.LastName} Party`
      : `${userInfo?.FirstName} ${userInfo?.LastName}`;

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-b  text-[#2E4E3F]">
      <MagCorners />

      <header className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
        <div className="font-serif text-xl sm:text-2xl text-white/90">
          Hannah & Hayden&apos;s Wedding
        </div>
        <nav className="hidden gap-6 text-sm text-white/80 sm:flex">
          <Link href="/rsvp" className="hover:text-white">
            {party?.id ? "Edit RSVP" : "RSVP"}
          </Link>
          <Link href="#events" className="hover:text-white">
            Photos
          </Link>
          <Link href="#events" className="hover:text-white">
            Details
          </Link>
          <Link href="#travel" className="hover:text-white">
            Travel
          </Link>
          <Link
            href="https://www.amazon.com/wedding/share/thehowles"
            className="hover:text-white"
          >
            Registry
          </Link>
          <Link href="#faqs" className="hover:text-white">
            FAQ
          </Link>
        </nav>
      </header>

      <section className="relative z-10 mx-auto mt-2 w-full max-w-6xl px-6">
        <Card pad={32} useGold={HAS_GOLD_OUTLINE}>
          <p className="mb-1 text-[12px] uppercase tracking-[0.35em] text-[#6B725E]">
            Welcome
          </p>
          <h1 className="font-serif text-4xl leading-tight sm:text-6xl">
            {displayName}
          </h1>
          <div className="mx-auto my-5 h-0.5 w-28 rounded-full bg-gradient-to-r from-transparent via-[#CAA55A] to-transparent" />
          <p className="text-[#4F5E50]">
            {formatDateLong(WEDDING_DATE)} · {CITY_STATE}
          </p>

          <div className="mt-6">
            <Countdown weddingTarget={WEDDING_DATE} />
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-3 justify-evenly sm:justify-normal">
            <Link
              href="/rsvp"
              className="sm:inline-flex items-center justify-center hidden rounded-2xl border border-[#9FB39E] bg-[#2E4E3F] px-6 py-3 text-white font-medium shadow transition-transform hover:-translate-y-0.5 hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-[#CAA55A] focus-visible:ring-offset-2"
            >
              {party?.id ? "Edit RSVP" : "RSVP Now"}
            </Link>
            <AddCalenderButton />
          </div>
        </Card>
      </section>

      {/* <section
        id="events"
        className="relative z-10 mx-auto mt-12 w-full max-w-6xl px-6"
      >
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <Card useGold={HAS_GOLD_OUTLINE}>
            <h2 className="font-serif text-2xl sm:text-3xl">The Ceremony</h2>
            <p className="mt-2 text-sm text-[#7A846F]">{CEREMONY_VENUE}</p>
            <p className="mt-1 text-[#4F5E50]">4:30 PM · Grace Church</p>
            <ul className="mt-4 list-disc pl-5 text-sm text-[#4F5E50]">
              <li>Indoor Searting</li>
              <li>Attire: Formal</li>
              <li>Free Parking next to church</li>
            </ul>
          </Card>
          <Card useGold={HAS_GOLD_OUTLINE}>
            <h2 className="font-serif text-2xl sm:text-3xl">The Reception</h2>
            <p className="mt-2 text-sm text-[#7A846F]">{RECEPTION_VENUE}</p>
            <p className="mt-1 text-[#4F5E50]">6:00 PM · Dinner & Dancing</p>
            <ul className="mt-4 list-disc pl-5 text-sm text-[#4F5E50]">
              <li>Plated dinner</li>
              <li>Bar · Dance Floor · Cornhole</li>
              <li>A fun night to remember</li>
            </ul>
          </Card>
        </div>
      </section> */}

      <section className="relative z-10 mx-auto mt-14 w-full max-w-6xl px-6">
        <h2 className="font-serif text-3xl text-white/90">Photos</h2>
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-2 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Image
              src={`/front_pic_${i}.jpg`}
              alt={`image_${i}`}
              width={4000}
              height={4000}
              key={i}
              className="aspect-square rounded-xl border border-[#E8DDC9] bg-white/60"
              placeholder="blur"
              blurDataURL={`/blur.png`}
            />
          ))}
        </div>
      </section>

      <section className="relative z-10 mx-auto mt-14 w-full max-w-6xl px-6">
        <h2 className="font-serif text-3xl text-white/80">Our Story</h2>
        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
          <StoryCard
            title="First Hello"
            subtitle="July 2024"
            text="Hannah and Hayden meet online."
          />
          <StoryCard
            title="First Date"
            subtitle="January 2025"
            text="Hayden asks Hannah on a date over Mexican and Margaritas."
          />
          <StoryCard
            title="It's Official"
            subtitle="Febuary 2025"
            text="After an amazing date at Buccees, Hannah and Hayden decide to officially become a couple."
          />
          <StoryCard
            title="Future Pharmicist"
            subtitle="August 2025"
            text="After years of hard work, Hannah receives her whitecoat. Marking the start of her 4 year journey to get her doctorate in pharmacy."
          />
          <StoryCard
            title="She Said Yes!"
            subtitle="September 2025"
            text="Hayden proposes at the Red Barn in Auburn at sunset. Hannah says YES!!"
          />
          <StoryCard
            title="Next Chapter"
            subtitle="May 2026"
            text="We can't wait to celebrate with our favorite people!"
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
            label="Accommodations"
            text="Best Western St. Franciville · The Myrtles · Hotel Francis · Family in area"
          />
          <InfoCard
            label="Airport"
            text="Closest: BTR (Baton Rouge) — ~30 min drive."
          />
          <InfoCard
            label="Getting Around"
            text="You'll be driving, recommend car pooling with friends and family"
          />
        </div>
        <div className="mt-6 rounded-2xl border border-[#E8DDC9] bg-white/60 p-4 text-sm text-[#4F5E50]">
          <p className="mb-2 font-medium text-[#2E4E3F]">
            Ceremony to Reception
          </p>
          <div className="grid place-items-center rounded-xl border border-[#E8DDC9] bg-white/60 p-2 sm:p-4 md:p-8 text-center overflow-hidden">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d1713.9856490238308!2d-91.38767971111108!3d30.775384993640916!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e6!4m5!1s0x862431ebbabe965d%3A0xbee33abb5fa6bb05!2sGrace%20Church%20Of%20West%20Feliciana%2C%2011621%20Ferdinand%20St%2C%20St%20Francisville%2C%20LA%2070775!3m2!1d30.7763928!2d-91.38685459999999!4m5!1s0x8624314e887dd377%3A0xde5e3fd0eb4923fd!2sPropinquity%20Marker%2C%20Royal%20St%2C%20Saint%20Francisville%2C%20LA!3m2!1d30.7744167!2d-91.3865012!5e0!3m2!1sen!2sus!4v1761532419832!5m2!1sen!2sus"
              width="600"
              height="450"
              className="border-0 hidden md:block"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d1713.9856490238308!2d-91.38767971111108!3d30.775384993640916!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e6!4m5!1s0x862431ebbabe965d%3A0xbee33abb5fa6bb05!2sGrace%20Church%20Of%20West%20Feliciana%2C%2011621%20Ferdinand%20St%2C%20St%20Francisville%2C%20LA%2070775!3m2!1d30.7763928!2d-91.38685459999999!4m5!1s0x8624314e887dd377%3A0xde5e3fd0eb4923fd!2sPropinquity%20Marker%2C%20Royal%20St%2C%20Saint%20Francisville%2C%20LA!3m2!1d30.7744167!2d-91.3865012!5e0!3m2!1sen!2sus!4v1761532419832!5m2!1sen!2sus"
              width="270"
              height="300"
              className="border-0 md:hidden "
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </section>

      {/* <section
        id="registry"
        className="relative z-10 mx-auto mt-14 w-full max-w-6xl px-6"
      >
        <h2 className="font-serif text-3xl text-white/90">Registry</h2>
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <RegistryButton
            href="https://www.amazon.com/wedding/share/thehowles"
            label="Amazon"
          />
        </div>
      </section> */}

      <section
        id="faqs"
        className="relative z-10 mx-auto mt-14 w-full max-w-3xl px-6"
      >
        <h2 className="font-serif text-3xl text-white/90">FAQs</h2>
        <div className="mt-4 divide-y divide-[#E8DDC9] rounded-2xl border border-[#E8DDC9] bg-white/60">
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

      <div className="fixed bottom-20 left-0 right-0 z-20 px-4 sm:hidden">
        <Link
          href="https://www.amazon.com/wedding/share/thehowles"
          className="block w-full rounded-2xl border border-[#E7D9BF] bg-[#FFF8EC] text-[#6B725E] px-6 py-3 text-center shadow-lg"
        >
          Registry
        </Link>
      </div>
      <div className="fixed bottom-4 left-0 right-0 z-20 px-4 sm:hidden">
        <Link
          href="/rsvp"
          className="block w-full rounded-2xl border border-[#9FB39E] bg-[#2E4E3F] px-6 py-3 text-center text-white shadow-lg"
        >
          {party?.id
            ? "Edit RSVP"
            : `RSVP for ${formatDateShort(WEDDING_DATE)}`}
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
      {attending === "true" && (
        <FullPageModal
          title="Thanks for RSVPing!"
          text="We're excited to celebrate our union with you. We'll send you updates for the wedding via email and text. If you need to edit your rsvp, you can do so at any time. If you need to conact us please email us at help@thehowles.love."
          primaryHref="/"
          primaryText="Close"
          secondaryHref="/rsvp"
          secondaryText="Edit RSVP"
        />
      )}
      {attending === "false" && (
        <FullPageModal
          title="We're sorry you can't make it"
          text="Thanks for letting us know you can't make it. If you ever find you can make it, you can edit your rsvp at any time. Please contact help@thehowles.love if you need assistance."
          primaryHref="/"
          primaryText="Close"
          secondaryHref="/rsvp"
          secondaryText="Edit RSVP"
        />
      )}
    </main>
  );
}
