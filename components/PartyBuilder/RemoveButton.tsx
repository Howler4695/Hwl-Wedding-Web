import { DOMAttributes } from "react";
import { Trash2 } from "lucide-react";

export default function PartyRemoveButton({
  onClick,
}: {
  onClick: DOMAttributes<HTMLButtonElement>["onClick"];
}) {
  return (
    <div className="flex justify-center col-span-2 pt-4 pb-4 md:p-0 md:col-span-1 md:justify-end">
      <button
        type="button"
        onClick={onClick}
        className="inline-flex p-2 md:h-11 md:w-11 items-center justify-center gap-1 rounded-xl border border-red-600 md:border-transparent text-[#8C7E68] hover:bg-[#FFF8EC] focus:outline-none focus:ring-2 focus:ring-[#CAA55A]/40"
        aria-label="Remove member"
        title="Remove member"
      >
        <Trash2 className="h-5 min-w-5 text-red-600" />
        <span className="md:hidden text-red-600">Remove</span>
      </button>
    </div>
  );
}
