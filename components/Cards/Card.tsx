export default function Card({
  children,
  pad = 24,
  useGold = false,
}: {
  children: React.ReactNode;
  pad?: number;
  useGold?: boolean;
}) {
  // If you imported GoldOutline, flip useGold to true and replace this with <GoldOutline> wrapper
  if (useGold) {
    // return <GoldOutline padding={pad} radius={28}>{children}</GoldOutline>;
  }
  return (
    <div
      className="rounded-3xl border border-[#E8DDC9] bg-white/70 p-6 shadow-xl backdrop-blur-xl sm:p-10"
      style={{ padding: pad }}
    >
      {children}
    </div>
  );
}
