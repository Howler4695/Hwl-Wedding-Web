import { MobileNavButton } from "./MobileNav";
import { NavLinks } from "./NavLinks";

export const NavHeader = ({ partyId }: { partyId?: string }) => (
  <>
    <header className="fixed hidden sm:flex top-0 w-full z-50 mx-auto items-center justify-between px-4 py-6 bg-pink-200">
      <div className="font-heading font-bold text-xl sm:text-2xl naked-text">
        Hannah & Hayden&apos;s Wedding
      </div>
      <nav className="hidden gap-6 text-sm naked-text sm:flex">
        <NavLinks edit={!partyId} />
      </nav>
    </header>
    <div className="sm:hidden fixed top-4 right-4 z-50">
      <MobileNavButton edit={!partyId} />
    </div>
  </>
);

export const NavHeaderLoading = () => (
  <header className="z-10 mx-auto hidden sm:flex w-full max-w-6xl items-center justify-between px-6 py-4">
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
