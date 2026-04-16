import { auth } from "@/auth";
import { NextResponse } from "next/server";
import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";

const S3_BUCKET = "hwl-wedding-photos";
const VISIBLE_KEY = "gallery/visible.json";

const s3 = new S3Client({ region: "us-east-2" });

async function getVisibleList(): Promise<string[]> {
  try {
    const res = await s3.send(
      new GetObjectCommand({ Bucket: S3_BUCKET, Key: VISIBLE_KEY })
    );
    const body = await res.Body?.transformToString();
    return body ? JSON.parse(body) : [];
  } catch {
    return [];
  }
}

async function putVisibleList(list: string[]): Promise<void> {
  await s3.send(
    new PutObjectCommand({
      Bucket: S3_BUCKET,
      Key: VISIBLE_KEY,
      Body: JSON.stringify(list),
      ContentType: "application/json",
    })
  );
}

export async function PATCH(request: Request) {
  const session = await auth();
  if (!session?.groups?.includes("Admin")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { filename, visible } = await request.json();
  if (!filename || typeof visible !== "boolean") {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }

  const list = await getVisibleList();
  const set = new Set(list);

  if (visible) {
    set.add(filename);
  } else {
    set.delete(filename);
  }

  const sorted = [...set].sort();
  await putVisibleList(sorted);
  return NextResponse.json({ ok: true, visible: sorted });
}
