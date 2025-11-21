import React from "react";

export default async function PartyBuilderPage() {
  return (
    <main className="relative min-h-screen overflow-hidden flex items-center justify-center p-4 sm:p-6]">
      <section className="relative z-10 w-full max-w-6xl pb-16">
        <div className="rounded-3xl border-2 border-white/10 bg-white/90 shadow-2xl p-4 sm:p-8">
          <header className="mb-4 sm:mb-6">
            <p className="mb-2 text-[12px] uppercase tracking-[0.35em] text-[#6B725E]">
              Wedding Registration
            </p>
            <h1 className="font-serif text-3xl sm:text-4xl leading-tight text-[#2E4E3F]">
              {"Loading"}
            </h1>
            <div className="mx-auto my-4 h-0.5 w-24 sm:w-28 rounded-full bg-gradient-to-r from-transparent via-[#CAA55A] to-transparent" />
            <p className="text-sm sm:text-base text-[#4F5E50]">
              {`Add family members or plus ones below. Phone numbers and allergies are optional. A Phone Number must be provided for your party leader`}
            </p>
          </header>

          <>
            <div id="party-form" className="space-y-4">
              <div className="rounded-2xl border border-[#E7D9BF] bg-white/60">
                <div className="hidden md:grid grid-cols-12 gap-3 border-b border-[#E8DDC9] px-4 py-3 text-xs font-medium uppercase tracking-wider text-[#6B725E]">
                  <div className="col-span-2">First name</div>
                  <div className="col-span-2">Last name</div>
                  <div className="col-span-1">Age</div>
                  <div className="col-span-2">Phone Number</div>
                  <div className="col-span-4">Allergies / Accomadations</div>
                  <div className="col-span-1 text-right">Remove</div>
                </div>
              </div>

              <div className="hidden sm:flex items-center justify-between pt-2">
                <button
                  type="button"
                  disabled={true}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#E7D9BF] bg-[#FFF8EC] px-5 py-3 text-sm font-medium text-[#6B725E] shadow-sm transition-transform hover:-translate-y-0.5 hover:shadow focus:outline-none focus:ring-2 focus:ring-[#CAA55A] focus:ring-offset-2"
                >
                  Add Member to Party
                </button>

                <button
                  type="submit"
                  disabled={true}
                  className="inline-flex items-center justify-center rounded-2xl bg-[#2E4E3F] px-6 py-3 text-sm font-semibold text-white shadow-sm transition-transform hover:-translate-y-0.5 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#CAA55A] focus:ring-offset-2 disabled:opacity-60"
                >
                  {"Finalize Party"}
                </button>
              </div>
            </div>

            <div className="sm:hidden fixed inset-x-0 bottom-0 z-20 border-t border-white/40 bg-white/80 backdrop-blur-xl p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
              <div className="mx-auto flex w-full max-w-3xl items-center gap-3">
                <button
                  type="button"
                  disabled={true}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-2xl border border-[#E7D9BF] bg-[#FFF8EC] px-4 py-3 text-sm font-medium text-[#6B725E] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#CAA55A]"
                >
                  Add Member
                </button>
                <button
                  type="submit"
                  form="party-form"
                  disabled={true}
                  className="flex-1 inline-flex items-center justify-center rounded-2xl bg-[#2E4E3F] px-4 py-3 text-sm font-semibold text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-[#CAA55A] disabled:opacity-60"
                >
                  {"Finalize Party"}
                </button>
              </div>
            </div>
          </>

          <footer className="mt-4 sm:mt-6 flex text-center items-center justify-center gap-2 text-xs text-[#8C7E68]">
            <span className="inline-block text-center h-px w-8 bg-[#E8DDC9]" />
            <span>email help@thehowles.love with any questions or issues</span>
            <span className="inline-block h-px w-8 bg-[#E8DDC9]" />
          </footer>
        </div>
      </section>
    </main>
  );
}
