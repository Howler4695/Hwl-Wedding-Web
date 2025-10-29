import { Plus } from "lucide-react";
import { DOMAttributes } from "react";

export const PartyAddSubmitDesktop = ({
  addMember,
  submitting,
}: {
  addMember: DOMAttributes<HTMLButtonElement>["onClick"];
  submitting: boolean;
}) => (
  <div className="hidden sm:flex items-center justify-between pt-2">
    <button
      type="button"
      onClick={addMember}
      className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#E7D9BF] bg-[#FFF8EC] px-5 py-3 text-sm font-medium text-[#6B725E] shadow-sm transition-transform hover:-translate-y-0.5 hover:shadow focus:outline-none focus:ring-2 focus:ring-[#CAA55A] focus:ring-offset-2"
    >
      <Plus className="h-4 w-4" />
      Add Member to Party
    </button>

    <button
      type="submit"
      disabled={submitting}
      className="inline-flex items-center justify-center rounded-2xl bg-[#2E4E3F] px-6 py-3 text-sm font-semibold text-white shadow-sm transition-transform hover:-translate-y-0.5 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#CAA55A] focus:ring-offset-2 disabled:opacity-60"
    >
      {submitting ? "Submitting…" : "Submit"}
    </button>
  </div>
);

export const PartyAddSubmitMobile = ({
  addMember,
  submitting,
}: {
  addMember: DOMAttributes<HTMLButtonElement>["onClick"];
  submitting: boolean;
}) => (
  <div className="sm:hidden fixed inset-x-0 bottom-0 z-20 border-t border-white/40 bg-white/80 backdrop-blur-xl p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
    <div className="mx-auto flex w-full max-w-3xl items-center gap-3">
      <button
        type="button"
        onClick={addMember}
        className="flex-1 inline-flex items-center justify-center gap-2 rounded-2xl border border-[#E7D9BF] bg-[#FFF8EC] px-4 py-3 text-sm font-medium text-[#6B725E] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#CAA55A]"
      >
        <Plus className="h-4 w-4" /> Add Member
      </button>
      <button
        type="submit"
        form="party-form"
        disabled={submitting}
        className="flex-1 inline-flex items-center justify-center rounded-2xl bg-[#2E4E3F] px-4 py-3 text-sm font-semibold text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-[#CAA55A] disabled:opacity-60"
      >
        {submitting ? "Submitting…" : "Submit"}
      </button>
    </div>
  </div>
);
