import { NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase/admin";
import type { Assessment, Attempt, Question } from "@/types";
import { pctToGrade } from "@/lib/grading/grading";

function scoreAttempt(questions: Question[], answers: Record<string, any>) {
  let score = 0;
  let maxScore = 0;

  const feedback: Attempt["feedback"] = [];

  for (const q of questions) {
    const given = answers?.[q.id];

    if (q.type === "mcq") {
      maxScore += q.points;
      const ok = given === q.correctChoiceId;
      const earned = ok ? q.points : 0;
      score += earned;
      feedback.push({
        questionId: q.id,
        ok,
        correct: q.correctChoiceId,
        given: given ?? "",
        pointsEarned: earned,
        pointsMax: q.points,
      });
    } else if (q.type === "tf") {
      maxScore += q.points;
      const ok = given === q.correct;
      const earned = ok ? q.points : 0;
      score += earned;
      feedback.push({
        questionId: q.id,
        ok,
        correct: q.correct,
        given: given ?? "",
        pointsEarned: earned,
        pointsMax: q.points,
      });
    }
  }

  const pct = maxScore > 0 ? (score / maxScore) * 100 : 0;
  const grade = pctToGrade(pct);

  return { score, maxScore, pct, grade, feedback };
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { idToken, assessmentId, answers } = body || {};

    if (!idToken || !assessmentId || !answers) {
      return NextResponse.json({ ok: false, error: "Missing idToken/assessmentId/answers" }, { status: 400 });
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

    // verificar roster (si existe)
    const rosterSnap = await adminDb.collection("rosters").doc(String(assessmentId)).get();
    if (rosterSnap.exists) {
      const rows = rosterSnap.data()?.rows || [];
      const allowed = rows.some((r: any) => String(r.mail || "").toLowerCase() === email);
      if (!allowed) {
        return NextResponse.json({ ok: false, error: "No estás en la lista para esta evaluación" }, { status: 403 });
      }
    }

    // cargar assessment
    const aSnap = await adminDb.collection("assessments").doc(String(assessmentId)).get();
    if (!aSnap.exists) {
      return NextResponse.json({ ok: false, error: "Evaluación no encontrada" }, { status: 404 });
    }

    const assessment = { id: aSnap.id, ...aSnap.data() } as Assessment;
    const questions = (assessment.questions || []) as Question[];

    const scored = scoreAttempt(questions, answers);

    const attemptId = `att_${Date.now()}_${Math.random().toString(16).slice(2)}`;

    const attempt: Attempt = {
      id: attemptId,
      assessmentId: String(assessmentId),
      studentEmail: email,
      answers,
      score: scored.score,
      maxScore: scored.maxScore,
      pct: scored.pct,
      grade: scored.grade,
      feedback: scored.feedback,
      submittedAt: new Date().toISOString(),
    };

    await adminDb.collection("attempts").doc(attemptId).set(attempt);

    return NextResponse.json({ ok: true, attemptId });
  } catch (e: any) {
    console.error("[/api/assessments/submit] ERROR:", e?.message || e);
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}
