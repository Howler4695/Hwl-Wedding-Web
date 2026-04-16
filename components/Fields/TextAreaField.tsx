export default function TextAreaField({
  label,
  value,
  onChange,
  placeholder = "",
  className = "",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1 block text-sm font-medium text-[#5A4A42]">
        {label}
      </span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={4}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-[#E8DDC9] bg-white px-4 py-3 text-[#A24E69] shadow-sm outline-none placeholder:text-[#A39A86] focus:border-[#CAA55A] focus:ring-2 focus:ring-[#CAA55A]"
      />
    </label>
  );
}
