import Link from "next/link";

export const NavHeader = ({ partyId }: { partyId?: string }) => (
  <header className="fixed top-0 w-full z-50 mx-auto flex items-center justify-between px-4 py-6 bg-pink-200">
    <div className="font-heading font-bold text-xl sm:text-2xl naked-text">
      Hannah & Hayden&apos;s Wedding
    </div>
    <nav className="hidden gap-6 text-sm naked-text sm:flex">
      <Link href="/rsvp" className="hover:text-white">
        {partyId ? "Edit RSVP" : "RSVP"}
      </Link>
      <Link href="/#photos" className="hover:text-white">
        Photos
      </Link>
      <Link href="#story" className="hover:text-white">
        Story
      </Link>
      <Link href="/#travel" className="hover:text-white">
        Travel
      </Link>
      <Link href="#faqs" className="hover:text-white">
        FAQ
      </Link>
      <a
        href="https://www.amazon.com/wedding/share/thehowles"
        className="hover:text-white"
        target="_blank"
        rel="noopener noreferrer"
      >
        Registry
      </a>
    </nav>
  </header>
);

export const NavHeaderLoading = () => (
  <header className="z-10 mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
    <div className="font-heading font-bold text-xl sm:text-2xl naked-text">
      Hannah & Hayden&apos;s Wedding
    </div>
    <nav className="skeleton-glow hidden w-80 h-5 gap-6 text-sm naked-text sm:flex">
      {/* <div className="skeleton-glow">{"RSVP"}</div>
      <div className="skeleton-glow">Registry</div>
      <div className="skeleton-glow">FAQ</div> */}
    </nav>
  </header>
);
