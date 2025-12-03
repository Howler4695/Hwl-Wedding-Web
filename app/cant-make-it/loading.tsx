export default async function WeddingRSVPFormPageLoading() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-b flex items-center justify-center p-6">
      <section className="relative z-10 w-full max-w-3xl">
        <div className="card-no-blur border border-[#E8DDC9] p-8 sm:p-10">
          <p className="mb-2 text-[12px] uppercase tracking-[0.1em] text-[#6B725E]">
            Wedding Registration
          </p>
          <h1 className="text-3xl sm:text-4xl leading-tight text-[#2E4E3F]">
            We&apos;re sad to hear you can&apos;t make it
          </h1>
          <p className="mt-2 text-[#2E4E3F]">
            Submit your absense so we know you&apos;re not coming.
          </p>
          <div className="mx-auto my-6 h-0.5 w-28 rounded-full bg-gradient-to-r from-transparent via-[#CAA55A] to-transparent" />

          <div className="mt-4 grid grid-cols-1 gap-4">
            <label className="flex flex-col">
              <span className="mb-1 text-sm font-medium text-[#4F5E50]">
                Why you can&apos;t make it / Note for the couple (optional)
              </span>
              <div className="skeleton-glow h-[98px] rounded-2xl border border-[#E8DDC9] bg-white px-4 py-3 text-[#2E4E3F]" />
            </label>
          </div>

          <div className="mt-8 px-6 sm:px-0 flex flex-wrap items-center gap-3 justify-center sm:justify-start">
            <div className="skeleton-glow inline-flex w-full sm:w-auto items-center justify-center rounded-2xl border border-[#9FB39E] bg-[#2E4E3F] px-6 py-3 font-medium shadow">
              Submit absence
            </div>
            <a
              href="/rsvp"
              className="skeleton-glow inline-flex w-full sm:w-auto items-center justify-center rounded-2xl border border-[#E7D9BF] bg-[#FFF8EC] px-6 py-3 font-medium shadow"
            >
              Back to invite
            </a>
          </div>

          <footer className="mt-4 sm:mt-6 flex text-center items-center justify-center gap-2 text-xs text-[#8C7E68]">
            <span className="inline-block h-px w-8 bg-[#E8DDC9]" />
            <span>email help@thehowles.love with any questions or issues</span>
            <span className="inline-block h-px w-8 bg-[#E8DDC9]" />
          </footer>
        </div>
      </section>
    </main>
  );
}
