import { DOMAttributes } from "react";
import { Trash2 } from "lucide-react";

export default function PartyRemoveButton({
  onClick,
}: {
  onClick: DOMAttributes<HTMLButtonElement>["onClick"];
}) {
  return (
    <div className="flex justify-center sm:col-span-1 sm:justify-end">
      <button
        type="button"
        onClick={onClick}
        className="inline-flex max-w-full sm:h-11 sm:w-11 items-center justify-center gap-1 rounded-xl border border-transparent text-[#8C7E68] hover:bg-[#FFF8EC] focus:outline-none focus:ring-2 focus:ring-[#CAA55A]/40"
        aria-label="Remove member"
        title="Remove member"
      >
        <Trash2 className="h-5 min-w-5" />
        <span className="sm:hidden">Remove</span>
      </button>
    </div>
  );
}
