export default async function WeddingRSVPFormPageLoading() {
  return (
    <main className="relative center-page-no-scroll overflow-hidden bg-gradient-to-b flex items-center justify-center p-6">
      <section className="relative z-10 w-full max-w-3xl">
        <div className="card-no-blur p-8 sm:p-10">
          <p className="mb-2 text-[12px] uppercase tracking-[0.1em] text-[#6B725E]">
            Wedding Registration
          </p>
          <h1 className="skeleton-glow text-3xl sm:text-4xl leading-tight">
            {"Update Details"}
          </h1>
          <div className="mx-auto my-6 h-0.5 w-28 rounded-full bg-gradient-to-r from-transparent via-[#CAA55A] to-transparent" />

          <div className="mt-4 grid grid-cols-1 gap-4">
            <label className="flex flex-col">
              <span className="mb-1 text-sm font-medium text-[#4F5E50]">
                Note for the couple
              </span>
              <div className="skeleton-glow h-[146px] rounded-2xl border border-[#E8DDC9] bg-white px-4 py-3 text-[#2E4E3F]" />
            </label>
          </div>
          <div className="mt-8 px-6 sm:px-0 flex flex-wrap items-center gap-3 justify-center sm:justify-start">
            <div className="skeleton-glow inline-flex w-full sm:w-auto items-center justify-center rounded-2xl border border-[#9FB39E] bg-[#2E4E3F] px-6 py-3 font-medium shadow">
              Submit RSVP
            </div>
            <div className="skeleton-glow inline-flex w-full sm:w-auto items-center justify-center rounded-2xl border border-[#E7D9BF] bg-[#FFF8EC] px-6 py-3 font-medium shadow">
              Back to Party Builder
            </div>
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
