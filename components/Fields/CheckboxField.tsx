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
    <label className="flex items-center gap-2 rounded-2xl border border-[#E8DDC9] bg-white px-4 py-3 text-[#A24E69]">
      <input
        type="checkbox"
        className="accent-[#A24E69]"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      {label}
    </label>
  );
}
