import { auth } from "@/auth";
import { checkIsAdminPage } from "@/helpers/Auth";
import { RegistryButton } from "@/components";

export default async function Admin() {
  const session = await auth();
  checkIsAdminPage(session);

  return (
    <div className="relative min-h-screen overflow-hidden flex items-center justify-center p-6">
      <div className="flex gap-2 flex-col">
        <RegistryButton href="/admin/party" label="View Parties" />
        <RegistryButton href="/admin/comms" label="Comms Portal" />
      </div>
    </div>
  );
}
