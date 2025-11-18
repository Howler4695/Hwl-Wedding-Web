import ReauthClient from "./ReauthClient";

interface ReauthPageProps {
  searchParams: {
    from?: string;
  };
}

export default function ReauthPage({ searchParams }: ReauthPageProps) {
  const from = searchParams.from ?? "/";

  return <ReauthClient from={from} />;
}
