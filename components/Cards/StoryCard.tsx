export default function StoryCard({
  title,
  subtitle,
  text,
}: {
  title: string;
  subtitle: string;
  text: string;
}) {
  return (
    <div className="card p-6">
      <p className="text-xs uppercase tracking-[0.25em] text-[#7A6B5C]">
        {subtitle}
      </p>
      <h3 className="mt-1 text-2xl text-[#A24E69]">{title}</h3>
      <p className="mt-2 text-[#5A4A42]">{text}</p>
    </div>
  );
}

export function StoryCardSkeleton() {
  return (
    <div className="card p-6">
      <p className="skeleton-glow text-xs uppercase tracking-[0.25em]">
        subtitle
      </p>
      <h3 className="skeleton-glow mt-1 text-2xl">Title</h3>
      <p className="skeleton-glow mt-2">text</p>
    </div>
  );
}
