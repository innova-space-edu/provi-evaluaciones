import { NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase/admin";
import { scoreToGradeChile60 } from "@/lib/grading/grading";
import type { Assessment, Attempt, Question } from "@/types";

function normalizeShort(s: string) {
  return s.trim().toLowerCase();
}

function gradeAttempt(assessment: Assessment, answers: Record<string, any>) {
  let score = 0;
  let maxScore = 0;
  const wrong: Attempt["wrong"] = [];

  for (const q of assessment.questions as Question[]) {
    maxScore += q.points;

    const a = answers[q.id];

    if (q.type === "mcq") {
      const ok = Number(a) === q.correctIndex;
      if (ok) score += q.points;
      else {
        wrong.push({
          questionId: q.id,
          prompt: q.prompt,
          studentAnswer: a,
          correctAnswer: q.correctIndex,
          explanation: q.explanation,
        });
      }
    }

    if (q.type === "truefalse") {
      const ok = Boolean(a) === q.correct;
      if (ok) score += q.points;
      else {
        wrong.push({
          questionId: q.id,
          prompt: q.prompt,
          studentAnswer: a,
          correctAnswer: q.correct,
          explanation: q.explanation,
        });
      }
    }

    if (q.type === "short") {
      const norm = normalizeShort(String(a ?? ""));
      const ok = q.correctAnswers.map(normalizeShort).includes(norm);
      if (ok) score += q.points;
      else {
        wrong.push({
          questionId: q.id,
          prompt: q.prompt,
          studentAnswer: a,
          correctAnswer: q.correctAnswers,
          explanation: q.explanation,
        });
      }
    }
  }

  const grade = scoreToGradeChile60(score, maxScore);
  return { score, maxScore, grade, wrong };
}

export async function POST(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return NextResponse.json({ error: "No auth token" }, { status: 401 });
  }
  const token = authHeader.slice("Bearer ".length);
  const decoded = await adminAuth.verifyIdToken(token);

  const { assessmentId, answers } = await req.json();

  const aRef = adminDb.collection("assessments").doc(assessmentId);
  const aSnap = await aRef.get();
  if (!aSnap.exists) return NextResponse.json({ error: "No existe" }, { status: 404 });

  const assessment = aSnap.data() as Assessment;

  // Validar dominio + roster
  const email = (decoded.email || "").toLowerCase();
  const allowedDomain = process.env.NEXT_PUBLIC_ALLOWED_DOMAIN!;
  if (!email.endsWith("@" + allowedDomain)) {
    return NextResponse.json({ error: "Dominio no permitido" }, { status: 403 });
  }
  if (!assessment.rosterEmails.includes(email)) {
    return NextResponse.json({ error: "No estás en la lista" }, { status: 403 });
  }

  // Control de intentos
  const attemptsQuery = await adminDb.collection("attempts")
    .where("assessmentId", "==", assessmentId)
    .where("studentUid", "==", decoded.uid)
    .get();

  if (attemptsQuery.size >= assessment.maxAttempts) {
    return NextResponse.json({ error: "Sin intentos disponibles" }, { status: 403 });
  }

  const { score, maxScore, grade, wrong } = gradeAttempt(assessment, answers);

  const attemptRef = adminDb.collection("attempts").doc();
  const attempt: Attempt = {
    id: attemptRef.id,
    assessmentId,
    studentUid: decoded.uid,
    studentEmail: email,
    startedAt: Date.now(),
    submittedAt: Date.now(),
    answers,
    score,
    maxScore,
    grade,
    wrong,
  };

  await attemptRef.set(attempt);

  return NextResponse.json({
    ok: true,
    attemptId: attempt.id,
    score,
    maxScore,
    grade,
    wrong,
  });
}
