import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";

export async function GET(_: Request, { params }: { params: { attemptId: string } }) {
  try {
    const id = params.attemptId;
    const snap = await adminDb.collection("attempts").doc(id).get();
    if (!snap.exists) {
      return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ ok: true, attempt: snap.data() });
  } catch (e: any) {
    console.error("[/api/public/attempts/[attemptId]] ERROR:", e?.message || e);
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}
