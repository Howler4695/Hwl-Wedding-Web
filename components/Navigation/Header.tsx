import { auth } from "@/auth";
import { MobileNavButton } from "./MobileNav";
import { NavLinks } from "./NavLinks";
import { GET_OPTIONS } from "@/helpers";
import { checkIsAdmin } from "@/helpers/Auth";

export const NavHeader = async () => {
  const session = await auth();
  const userId = session?.user?.id;

  let party;
  let isAdmin = false;
  if (userId) {
    isAdmin = checkIsAdmin(session);
    const partyJ = await fetch(
      `${process.env.BACKEND_URL}/party/${userId}`,
      GET_OPTIONS(session)
    );
    party = await partyJ.json();
  }

  return (
    <>
      <header className="fixed hidden sm:flex top-0 w-full z-50 mx-auto items-center justify-between px-4 py-6 bg-pink-200">
        <div className="font-heading font-bold text-xl sm:text-2xl naked-text">
          Hannah & Hayden&apos;s Wedding
        </div>
        <nav className="hidden gap-6 text-sm naked-text sm:flex">
          <NavLinks edit={!!party?.id} showAdmin={isAdmin} />
        </nav>
      </header>
      <header className="sm:hidden fixed top-4 right-4 z-50">
        <MobileNavButton edit={!!party?.id} showAdmin={isAdmin} />
      </header>
    </>
  );
};

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
