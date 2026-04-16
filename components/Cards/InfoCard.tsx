export default function InfoCard({
  label,
  text,
}: {
  label: string;
  text: string;
}) {
  return (
    <div className="card p-5">
      <p className="text-sm uppercase tracking-widest text-[#7A6B5C]">
        {label}
      </p>
      <p className="mt-1 text-[#5A4A42]">{text}</p>
    </div>
  );
}

export function InfoCardSkeleton() {
  return (
    <div className="card p-5">
      <p className="skeleton-glow text-sm uppercase tracking-widest">label</p>
      <p className="skeleton-glow mt-1">text</p>
    </div>
  );
}
