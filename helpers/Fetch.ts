import { Session } from "next-auth";

export const GET_OPTIONS = (session: Session | null) => ({
  method: "GET",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${session?.accessToken}`,
  },
});

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function fetchWithRetry(
  url: string,
  options: RequestInit,
  retries = 10,
  delayMs = 3000
): Promise<Response> {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, options);
      if (res.ok || attempt === retries) return res;
    } catch {
      if (attempt === retries) throw new Error(`Failed to fetch ${url}`);
    }
    await sleep(delayMs);
  }
  return fetch(url, options);
}
