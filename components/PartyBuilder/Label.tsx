export default function PartyLabel({ id, text }: { id: string; text: string }) {
  return (
    <label
      className="mb-1 block text-xs font-medium text-[#7A6B5C] md:hidden"
      htmlFor={`age-${id}`}
    >
      {text}
    </label>
  );
}
