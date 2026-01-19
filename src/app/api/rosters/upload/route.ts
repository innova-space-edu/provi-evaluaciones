import { NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase/admin";
import { parseRosterCsv } from "@/lib/csv/parseCsv";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { idToken, assessmentId, csvText } = body || {};

    if (!idToken || !assessmentId || !csvText) {
      return NextResponse.json({ ok: false, error: "Missing idToken/assessmentId/csvText" }, { status: 400 });
    }

    const decoded = await adminAuth.verifyIdToken(idToken);
    const email = (decoded.email || "").toLowerCase();
    if (!email) return NextResponse.json({ ok: false, error: "No email in token" }, { status: 400 });

    // dominio permitido
    const allowedDomain = (process.env.NEXT_PUBLIC_ALLOWED_DOMAIN || "").toLowerCase();
    const domain = (email.split("@")[1] || "").toLowerCase();
    if (allowedDomain && domain !== allowedDomain) {
      return NextResponse.json({ ok: false, error: "Email domain not allowed" }, { status: 403 });
    }

    // rol docente
    const userSnap = await adminDb.collection("users").doc(decoded.uid).get();
    const role = (userSnap.data()?.role || "") as string;
    if (!["teacher", "utp"].includes(role)) {
      return NextResponse.json({ ok: false, error: "Forbidden (role)" }, { status: 403 });
    }

    const rows = parseRosterCsv(String(csvText));
    if (!rows.length) {
      return NextResponse.json({ ok: false, error: "CSV sin filas válidas" }, { status: 400 });
    }

    // Guarda roster ligado a assessmentId
    await adminDb.collection("rosters").doc(String(assessmentId)).set(
      {
        assessmentId: String(assessmentId),
        rows,
        count: rows.length,
        uploadedAt: new Date().toISOString(),
        uploadedBy: email,
      },
      { merge: true }
    );

    return NextResponse.json({ ok: true, count: rows.length });
  } catch (e: any) {
    console.error("[/api/rosters/upload] ERROR:", e?.message || e);
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}
