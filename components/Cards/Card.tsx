export default function Card({
  children,
  pad = 24,
}: {
  children: React.ReactNode;
  pad?: number;
}) {
  return (
    <div className="card p-6 sm:p-10" style={{ padding: pad }}>
      {children}
    </div>
  );
}
