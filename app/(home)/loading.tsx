import { formatDateLong } from "@/helpers";
import { Card, NakedHeader, CountdownSkeleton } from "@/components";
import { LoadingStaticImages } from "@/components/Images/StaticImages";

export default async function LoadingHomePage() {
  const WEDDING_DATE = "2026-05-16T16:30:00-05:00";
  const CITY_STATE = "Saint Francisville, Louisiana";

  return (
    <div className="min-h-screen overflow-hidden">
      <section
        id="welcome"
        className="relative z-10 mx-auto mt-2 w-full max-w-6xl px-6"
      >
        <Card pad={32}>
          <p className="mb-1 text-[12px] uppercase tracking-[0.35em] text-[#6B725E]">
            Welcome
          </p>
          <h1 className="skeleton-glow leading-tight">DisplayName</h1>
          <div className="mx-auto my-5 h-0.5 w-28 rounded-full bg-gradient-to-r from-transparent via-[#CAA55A] to-transparent" />
          <p className="text-[#4F5E50]">
            {formatDateLong(WEDDING_DATE)} · {CITY_STATE}
          </p>

          <div className="mt-6">
            <CountdownSkeleton />
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-3 justify-evenly sm:justify-normal">
            <div className="skeleton-glow sm:inline-flex items-center justify-center hidden rounded-2xl border border-[#9FB39E] bg-[#2E4E3F] px-6 py-3 font-medium shadow transition-transform">
              {"RSVP Now"}
            </div>
            <div className="skeleton inline-flex items-center justify-center rounded-2xl  px-6 py-3 font-medium ">
              Add to Calendar
            </div>
          </div>
        </Card>
      </section>

      <section
        id="photos"
        className="relative z-10 mx-auto section-offset w-full max-w-6xl px-6"
      >
        <NakedHeader text="Photos" />
        <LoadingStaticImages />
      </section>

      <section
        id="story"
        className="relative z-10 mx-auto section-offset w-full max-w-6xl px-6"
      >
        <NakedHeader text="Our Story" />
        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="skeleton-glow h-[134px] md:h-[206px] xl:h-[182px] rounded-2xl" />
          <div className="skeleton-glow h-[158px] md:h-[206px] xl:h-[182px] rounded-2xl" />
          <div className="skeleton-glow h-[182px] md:h-[206px] xl:h-[182px] rounded-2xl" />
          <div className="skeleton-glow h-[206px] md:h-[206px] rounded-2xl" />
          <div className="skeleton-glow h-[158px] md:h-[206px] rounded-2xl" />
          <div className="skeleton-glow h-[158px] md:h-[206px] rounded-2xl" />
        </div>
      </section>

      <section
        id="travel"
        className="relative z-10 mx-auto section-offset w-full max-w-6xl px-6"
      >
        <NakedHeader text="Travel & Lodging" />
        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="skeleton-glow h-[114px] rounded-2xl" />
          <div className="skeleton-glow h-[114px] rounded-2xl" />
          <div className="skeleton-glow h-[114px] rounded-2xl" />
        </div>
        <div className="card mt-6 p-4 text-sm text-[#4F5E50]">
          <p className="mb-2 font-medium text-[#2E4E3F]">
            Ceremony to Reception
          </p>
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
        <div className="mt-4 skeleton-glow h-[144px] rounded-2xl" />
      </section>
      <footer className="relative z-10 mx-auto mt-16 w-full max-w-6xl px-6 pb-36 sm:pb-16" />

      <div className="fixed bottom-20 left-0 right-0 z-20 px-4 sm:hidden">
        <div className="skeleton-glow block w-full rounded-2xl border border-[#E7D9BF] bg-[#FFF8EC] px-6 py-3 text-center shadow-lg">
          Registry
        </div>
      </div>
      <div className="fixed bottom-4 left-0 right-0 z-20 px-4 sm:hidden">
        <div className="skeleton-glow block w-full rounded-2xl border border-[#9FB39E] bg-[#2E4E3F] px-6 py-3 text-center shadow-lg">
          RSVP
        </div>
      </div>
    </div>
  );
}
