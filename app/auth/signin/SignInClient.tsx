"use client";
import { signIn } from "next-auth/react";
import { useEffect } from "react";
import { redirect } from "next/navigation";

export default function SignInClient({ from }: { from?: string }) {
  useEffect(() => {
    (async () => {
      try {
        await signIn("cognito", { redirectTo: from });
      } catch {
        redirect("/");
      }
    })();
  }, [from]);

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h1>Signing in</h1>
      <p>Contact help@thehowles.love if you have any issues.</p>
    </div>
  );
}
