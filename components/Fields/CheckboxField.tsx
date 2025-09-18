export default function CheckboxField({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-center gap-2 rounded-2xl border border-[#E8DDC9] bg-white px-4 py-3 text-[#2E4E3F]">
      <input
        type="checkbox"
        className="accent-[#2E4E3F]"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      {label}
    </label>
  );
}
