export default async function WeddingInvitePage() {
  const dateText = "Saturday, May 16, 2026";

  return (
    <div className="relative center-page-no-scroll overflow-hidden flex items-center justify-center p-6">
      <section className="relative z-10 w-full max-w-2xl">
        <div className="card p-10">
          <h1 className="skeleton-glow text-4xl sm:text-5xl leading-tight text-center">
            {"you're invited to our wedding!"}
          </h1>

          <div className="mx-auto my-6 h-0.5 w-28 rounded-full bg-gradient-to-r from-transparent via-[#CAA55A] to-transparent" />

          <p className="text-lg text-[#4F5E50]">{dateText}</p>
          <p className="mt-1 text-sm text-[#7A846F]">
            {"You can edit your rsvp at anytime."}
          </p>

          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="skeleton-glow inline-flex items-center text-center justify-center rounded-2xl border border-[#9FB39E] bg-[#2E4E3F] px-6 py-3 font-medium shadow transition-transform hover:-translate-y-0.5 hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-[#CAA55A] focus-visible:ring-offset-2">
              {"Edit RSVP"}
            </div>

            <div className="skeleton-glow inline-flex items-center text-center justify-center rounded-2xl border border-[#E7D9BF] bg-[#FFF8EC] px-6 py-3 font-medium shadow transition-transform hover:-translate-y-0.5 hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-[#CAA55A] focus-visible:ring-offset-2">
              {"Cant make it"}
            </div>
          </div>

          <div className="mt-8 px-10 flex items-center text-center justify-center gap-2 text-xs text-[#8C7E68]">
            <span>email help@thehowles.love with any issues or questions.</span>
          </div>
        </div>
      </section>
    </div>
  );
}
