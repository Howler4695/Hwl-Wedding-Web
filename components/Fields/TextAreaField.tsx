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
      <span className="mb-1 block text-sm font-medium text-[#4F5E50]">
        {label}
      </span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={4}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-[#E8DDC9] bg-white px-4 py-3 text-[#2E4E3F] shadow-sm outline-none placeholder:text-[#A39A86] focus:border-[#CAA55A] focus:ring-2 focus:ring-[#CAA55A]"
      />
    </label>
  );
}
