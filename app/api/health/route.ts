export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const res = await fetch(`${process.env.BACKEND_URL}/health`, {
      signal: AbortSignal.timeout(35000),
    });
    if (!res.ok) {
      return Response.json({ status: "waking" }, { status: 503 });
    }
    return Response.json({ status: "ok" });
  } catch {
    return Response.json({ status: "waking" }, { status: 503 });
  }
}
