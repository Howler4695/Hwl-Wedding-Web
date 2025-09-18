export default function SelectField({
  label,
  value,
  onChange,
  options,
  placeholder = "Select",
  className = "",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder?: string;
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1 block text-sm font-medium text-[#4F5E50]">
        {label}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-2xl border border-[#E8DDC9] bg-white px-4 py-3 text-[#2E4E3F] shadow-sm outline-none focus:border-[#CAA55A] focus:ring-2 focus:ring-[#CAA55A]"
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </label>
  );
}
