export default function InfoCard({
  label,
  text,
}: {
  label: string;
  text: string;
}) {
  return (
    <div className="card p-5">
      <p className="text-sm uppercase tracking-widest text-[#6B725E]">
        {label}
      </p>
      <p className="mt-1 text-[#4F5E50]">{text}</p>
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
