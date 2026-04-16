export default function NumberField({
  label,
  value,
  onChange,
  min = 0,
  max = 99,
  className = "",
}: {
  label: string;
  value: number;
  onChange: (n: number) => void;
  min?: number;
  max?: number;
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1 block text-sm font-medium text-[#5A4A42]">
        {label}
      </span>
      <input
        type="number"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full rounded-2xl border border-[#E8DDC9] bg-white px-4 py-3 text-[#A24E69] shadow-sm outline-none focus:border-[#CAA55A] focus:ring-2 focus:ring-[#CAA55A]"
      />
    </label>
  );
}
