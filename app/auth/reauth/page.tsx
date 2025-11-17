"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { signIn, signOut } from "next-auth/react";

export default function ReauthPage() {
  const searchParams = useSearchParams();
  const from = searchParams.get("from") ?? "/";

  useEffect(() => {
    (async () => {
      try {
        await signOut({ redirect: false });
      } finally {
        await signIn("cognito", { callbackUrl: from });
      }
    })();
  }, [from]);

  return (
    <main style={{ padding: "2rem", textAlign: "center" }}>
      <h1>Reconnecting your session…</h1>
      <p>Youll be redirected to sign in again.</p>
      <p>Contact help@thehowles.love if you have any issues.</p>
    </main>
  );
}
