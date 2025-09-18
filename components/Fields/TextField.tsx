export default function TextField({
  label,
  value,
  onChange,
  className = "",
  required = false,
  placeholder = "",
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  className?: string;
  required?: boolean;
  placeholder?: string;
  type?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1 block text-sm font-medium text-[#4F5E50]">
        {label}
        {required && <span className="text-[#CAA55A]"> *</span>}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-[#E8DDC9] bg-white px-4 py-3 text-[#2E4E3F] shadow-sm outline-none placeholder:text-[#A39A86] focus:border-[#CAA55A] focus:ring-2 focus:ring-[#CAA55A]"
      />
    </label>
  );
}
