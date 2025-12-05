import Link from "next/link";

export const NavLinks = ({
  edit,
  onNav,
}: {
  edit: boolean;
  onNav?: () => void;
}) => (
  <>
    <Link href="/rsvp" className="text-nav" onClick={onNav} prefetch>
      {edit ? "Edit RSVP" : "RSVP"}
    </Link>
    <a
      href="https://www.amazon.com/wedding/share/thehowles"
      className="text-nav"
      target="_blank"
      rel="noopener noreferrer"
    >
      Registry
    </a>
    <Link href="/" className="text-nav" onClick={onNav}>
      Home
    </Link>
    <Link href="/#photos" className="text-nav" onClick={onNav}>
      Photos
    </Link>
    <Link href="/#story" className="text-nav" onClick={onNav}>
      Story
    </Link>
    <Link href="/#travel" className="text-nav" onClick={onNav}>
      Travel
    </Link>
    <Link href="/#faqs" className="text-nav" onClick={onNav}>
      FAQ
    </Link>
  </>
);
