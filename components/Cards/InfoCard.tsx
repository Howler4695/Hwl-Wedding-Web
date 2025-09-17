export default function InfoCard({
  label,
  text,
}: {
  label: string;
  text: string;
}) {
  return (
    <div className="rounded-2xl border border-[#E8DDC9] bg-white/60 p-5">
      <p className="text-sm uppercase tracking-widest text-[#6B725E]">
        {label}
      </p>
      <p className="mt-1 text-[#4F5E50]">{text}</p>
    </div>
  );
}
