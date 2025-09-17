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
    <div className="rounded-2xl border border-[#E8DDC9] bg-white/60 p-6">
      <p className="text-xs uppercase tracking-[0.25em] text-[#6B725E]">
        {subtitle}
      </p>
      <h3 className="mt-1 font-serif text-2xl text-[#2E4E3F]">{title}</h3>
      <p className="mt-2 text-[#4F5E50]">{text}</p>
    </div>
  );
}
