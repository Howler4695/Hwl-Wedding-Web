import Link from "next/link";

export default function RegistryButton({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  return (
    <a
      href={href}
      className="flex items-center justify-center rounded-2xl border border-[#E7D9BF] bg-[#FFF8EC] px-6 py-4 text-[#6B725E] shadow transition-transform hover:-translate-y-0.5 hover:shadow-lg"
      target="_blank"
      rel="noopener noreferrer"
    >
      {label}
    </a>
  );
}

export function NormalButton({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="flex items-center justify-center rounded-2xl border border-[#E7D9BF] bg-[#FFF8EC] px-6 py-4 text-[#6B725E] shadow transition-transform hover:-translate-y-0.5 hover:shadow-lg"
    >
      {label}
    </Link>
  );
}
