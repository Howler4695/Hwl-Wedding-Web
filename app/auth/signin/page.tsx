"use client";
import { signIn } from "next-auth/react";
import { useEffect } from "react";

export default function SignIn() {
  useEffect(() => {
    signIn("cognito", { redirectTo: "/rsvp" });
  }, []);

  return (
    <main style={{ padding: "2rem", textAlign: "center" }}>
      <h1>Signing in</h1>
      <p>Contact help@thehowles.love if you have any issues.</p>
    </main>
  );
}
