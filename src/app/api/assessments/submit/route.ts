import { NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase/admin";
import { pctToGrade } from "@/lib/grading/grading";
import type { Assessment, Question, Attempt } from "@/types";

function normalizeShort(s: string) {
  return (s || "").toString().trim().toLowerCase().replace(/\s+/g, "");
}

function score(assessment: Assessment, answers: Record<string, any>) {
  let score = 0;
  let maxScore = 0;

  const wrong: Attempt["wrong"] = [];

  for (const q of assessment.questions as Question[]) {
    maxScore += q.points;

    const studentAnswer = answers?.[q.id];

    if (q.type === "mcq") {
      const ok = Number(studentAnswer) === q.correctIndex;
      if (ok) score += q.points;
      else {
        wrong.push({
          questionId: q.id,
          prompt: q.prompt,
          studentAnswer,
          correctAnswer: q.options[q.correctIndex],
          explanation: q.explanation,
        });
      }
    }

    if (q.type === "truefalse") {
      const ok = Boolean(studentAnswer) === q.correct;
      if (ok) score += q.points;
      else {
        wrong.push({
          questionId: q.id,
          prompt: q.prompt,
          studentAnswer,
          correctAnswer: q.correct,
          explanation: q.explanation,
        });
      }
    }

    if (q.type === "short") {
      const given = normalizeShort(String(studentAnswer ?? ""));
      const ok = q.correctAnswers.map(normalizeShort).includes(given);
      if (ok) score += q.points;
      else {
        wrong.push({
          questionId: q.id,
          prompt: q.prompt,
          studentAnswer,
          correctAnswer: q.correctAnswers[0],
          explanation: q.explanation,
        });
      }
    }
  }

  const pct = maxScore > 0 ? (score / maxScore) * 100 : 0;
  const grade = pctToGrade(pct);

  return { score, maxScore, pct, grade, wrong };
}

export async function POST(req: Request) {
  try {
    const { idToken, assessmentId, answers } = await req.json();

    if (!idToken || !assessmentId || !answers) {
      return NextResponse.json({ ok: false, error: "Missing idToken/assessmentId/answers" }, { status: 400 });
    }

    const decoded = await adminAuth.verifyIdToken(idToken);
    const email = (decoded.email || "").toLowerCase();
    if (!email) return NextResponse.json({ ok: false, error: "No email" }, { status: 400 });

    const allowedDomain = (process.env.NEXT_PUBLIC_ALLOWED_DOMAIN || "").toLowerCase();
    const domain = (email.split("@")[1] || "").toLowerCase();
    if (allowedDomain && domain !== allowedDomain) {
      return NextResponse.json({ ok: false, error: "Email domain not allowed" }, { status: 403 });
    }

    const aSnap = await adminDb.collection("assessments").doc(String(assessmentId)).get();
    if (!aSnap.exists) {
      return NextResponse.json({ ok: false, error: "Evaluación no encontrada" }, { status: 404 });
    }

    const assessment = { ...(aSnap.data() as any), id: aSnap.id } as Assessment;

    if (!assessment.isPublished) {
      return NextResponse.json({ ok: false, error: "Evaluación no publicada" }, { status: 403 });
    }

    // rosterEmails dentro del assessment (si existe)
    if (Array.isArray(assessment.rosterEmails) && assessment.rosterEmails.length > 0) {
      const allowed = assessment.rosterEmails.map((x) => String(x).toLowerCase()).includes(email);
      if (!allowed) {
        return NextResponse.json({ ok: false, error: "No estás en la lista para esta evaluación" }, { status: 403 });
      }
    }

    // maxAttempts (si quieres)
    if (assessment.maxAttempts && assessment.maxAttempts > 0) {
      const prev = await adminDb
        .collection("attempts")
        .where("assessmentId", "==", String(assessmentId))
        .where("studentUid", "==", decoded.uid)
        .get();

      if (prev.size >= assessment.maxAttempts) {
        return NextResponse.json({ ok: false, error: "Alcanzaste el máximo de intentos" }, { status: 403 });
      }
    }

    const scored = score(assessment, answers);

    const attemptId = `att_${Date.now()}_${Math.random().toString(16).slice(2)}`;
    const now = Date.now();

    const attempt: Attempt = {
      id: attemptId,
      assessmentId: String(assessmentId),
      studentUid: decoded.uid,
      studentEmail: email,
      startedAt: now,
      submittedAt: now,
      answers,
      score: scored.score,
      maxScore: scored.maxScore,
      grade: scored.grade,
      wrong: scored.wrong,
    };

    await adminDb.collection("attempts").doc(attemptId).set(attempt);

    return NextResponse.json({ ok: true, attemptId });
  } catch (e: any) {
    console.error("[/api/assessments/submit] ERROR:", e?.message || e);
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}
