import ReauthClient from "./ReauthClient";

interface ReauthPageProps {
  searchParams?: Promise<{
    from?: string;
  }>;
}

export default async function ReauthPage({ searchParams }: ReauthPageProps) {
  const from = (await searchParams)?.from ?? "/";

  return <ReauthClient from={from} />;
}
