import { auth } from "@/auth";
import { checkIsAdminPage } from "@/helpers/Auth";
import { RegistryButton } from "@/components";

export default async function Admin() {
  const session = await auth();
  checkIsAdminPage(session);

  return (
    <main className="relative min-h-screen overflow-hidden flex items-center justify-center p-6">
      <div className="rounded-2xl border border-[#E7D9BF] bg-white/60">
        <div className="hidden md:grid grid-cols-12 gap-3 border-b border-[#E8DDC9] px-4 py-3 text-xs font-medium uppercase tracking-wider text-[#6B725E]">
          <div className="col-span-4">Name</div>
          <div className="col-span-4">Email</div>
          <div className="col-span-3">Phone Number</div>
          <div className="col-span-1 text-right">Remove</div>
        </div>
      </div>
    </main>
  );
}
