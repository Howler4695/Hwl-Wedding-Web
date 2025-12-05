"use client";

import { useEffect } from "react";
import { signIn, signOut } from "next-auth/react";

export default function ReauthClient({ from }: { from: string }) {
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
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h1>Reconnecting your session…</h1>
      <p>Youll be redirected to sign in again.</p>
      <p>Contact help@thehowles.love if you have any issues.</p>
    </div>
  );
}
