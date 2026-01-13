import { NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase/admin";
import { parseRosterCsv } from "@/lib/csv/parseCsv";

export async function POST(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return NextResponse.json({ error: "No auth token" }, { status: 401 });
  }
  const token = authHeader.slice("Bearer ".length);
  const decoded = await adminAuth.verifyIdToken(token);

  const body = await req.json();
  const { title, durationMinutes, maxAttempts, questions, rosterCsvText } = body;

  // Parse roster
  const rosterEmails = parseRosterCsv(rosterCsvText);

  // (opcional) validar rol teacher vía users/{uid}
  const userDoc = await adminDb.collection("users").doc(decoded.uid).get();
  const role = userDoc.exists ? userDoc.data()?.role : "student";
  if (role !== "teacher" && role !== "admin" && role !== "utp") {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  const createdAt = Date.now();
  const ref = adminDb.collection("assessments").doc();

  const assessment = {
    id: ref.id,
    title,
    createdByUid: decoded.uid,
    createdAt,
    durationMinutes: Number(durationMinutes) || 20,
    maxAttempts: Number(maxAttempts) || 1,
    isPublished: true,
    rosterEmails,
    questions,
  };

  await ref.set(assessment);

  return NextResponse.json({ ok: true, id: ref.id });
}
