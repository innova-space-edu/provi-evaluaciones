import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id;
    const snap = await adminDb.collection("assessments").doc(id).get();
    if (!snap.exists) {
      return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
    }

    const data = snap.data() || {};
    // Solo devolvemos lo necesario para rendir
    const assessment = {
      id: snap.id,
      title: data.title || "Evaluación",
      passPct: data.passPct ?? 60,
      questions: data.questions || [],
    };

    return NextResponse.json({ ok: true, assessment });
  } catch (e: any) {
    console.error("[/api/public/assessments/[id]] ERROR:", e?.message || e);
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}
