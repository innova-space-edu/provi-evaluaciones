import { NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase/admin";

export async function POST(req: Request) {
  try {
    const { idToken, title } = await req.json();

    if (!idToken) {
      return NextResponse.json({ ok: false, error: "Missing idToken" }, { status: 400 });
    }

    const decoded = await adminAuth.verifyIdToken(idToken);
    const email = (decoded.email || "").toLowerCase();
    if (!email) return NextResponse.json({ ok: false, error: "No email" }, { status: 400 });

    // dominio permitido (colprovidencia.cl)
    const allowedDomain = (process.env.NEXT_PUBLIC_ALLOWED_DOMAIN || "").toLowerCase();
    const domain = (email.split("@")[1] || "").toLowerCase();
    if (allowedDomain && domain !== allowedDomain) {
      return NextResponse.json({ ok: false, error: "Email domain not allowed" }, { status: 403 });
    }

    // rol docente / utp / admin
    const uSnap = await adminDb.collection("users").doc(decoded.uid).get();
    const role = String(uSnap.data()?.role || "");
    if (!["teacher", "utp", "admin"].includes(role)) {
      return NextResponse.json({ ok: false, error: "Forbidden (role)" }, { status: 403 });
    }

    const id = `assess_${Date.now()}`;
    const now = Date.now();

    const assessment = {
      id,
      title: title || "Evaluación Demo",
      createdByUid: decoded.uid,
      createdAt: now,
      durationMinutes: 20,
      maxAttempts: 1,
      isPublished: true,
      rosterEmails: [], // por ahora vacío (opcional)
      questions: [
        {
          id: "q1",
          type: "mcq",
          prompt: "¿Cuál es la capital de Chile?",
          options: ["Santiago", "Valparaíso", "Antofagasta"],
          correctIndex: 0,
          explanation: "La capital administrativa y política es Santiago.",
          points: 2,
        },
        {
          id: "q2",
          type: "truefalse",
          prompt: "La Tierra es plana.",
          correct: false,
          explanation: "La evidencia científica indica que es aproximadamente esférica.",
          points: 1,
        },
        {
          id: "q3",
          type: "short",
          prompt: "Escribe el símbolo químico del agua.",
          correctAnswers: ["h2o"],
          explanation: "El agua está formada por dos átomos de hidrógeno y uno de oxígeno: H2O.",
          points: 2,
        },
      ],
    };

    await adminDb.collection("assessments").doc(id).set(assessment);

    return NextResponse.json({ ok: true, assessmentId: id });
  } catch (e: any) {
    console.error("[/api/assessments/demo] ERROR:", e?.message || e);
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}
