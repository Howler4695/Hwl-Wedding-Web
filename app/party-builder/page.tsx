import React from "react";

import { MagCorners, PartyBuilder } from "@/components";
import { auth } from "@/auth";

export default function PartyBuilderPage() {
  return (
    <main className="relative min-h-screen overflow-hidden flex items-center justify-center p-4 sm:p-6]">
      <MagCorners />

      <PartyBuilder />
    </main>
  );
}
