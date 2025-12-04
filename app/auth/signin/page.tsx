import SignInClient from "./SignInClient";

interface SignInPageProps {
  searchParams?: Promise<{
    from?: string;
  }>;
}

export default async function SignIn({ searchParams }: SignInPageProps) {
  const from = (await searchParams)?.from ?? "/";

  return <SignInClient from={from} />;
}
