"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import QuizRunner from "@/components/QuizRunner";
import type { Assessment } from "@/types";
import { getAuth } from "firebase/auth";
import { app } from "@/lib/firebase/client";

export default function StudentAssessmentPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = params?.id;

  const [loading, setLoading] = useState(true);
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    async function load() {
      try {
        setErr("");
        setLoading(true);

        // Cargamos desde API simple (por ahora directo desde firestore via API no existe)
        // Hack MVP: usamos endpoint server-only mediante fetch a /api/assessments/get (lo haremos después)
        // Como aún no existe, intentamos leer desde una ruta pública fallback:
        const r = await fetch(`/api/public/assessments/${id}`);
        if (!r.ok) throw new Error("No se pudo cargar evaluación");
        const data = await r.json();
        setAssessment(data.assessment);
      } catch (e: any) {
        setErr(e?.message || "Error cargando evaluación");
      } finally {
        setLoading(false);
      }
    }
    if (id) load();
  }, [id]);

  async function submit(answers: Record<string, any>) {
    setErr("");
    const auth = getAuth(app);
    const user = auth.currentUser;
    if (!user) {
      setErr("Debes iniciar sesión con tu correo institucional.");
      return;
    }
    const idToken = await user.getIdToken(true);

    const r = await fetch("/api/assessments/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken, assessmentId: id, answers }),
    });

    const data = await r.json();
    if (!r.ok || !data.ok) {
      setErr(data?.error || "No se pudo enviar");
      return;
    }
    router.push(`/student/results/${data.attemptId}`);
  }

  if (loading) return <div>Cargando evaluación...</div>;
  if (err) return <div style={{ color: "#ff8080" }}>❌ {err}</div>;
  if (!assessment) return <div>Evaluación no encontrada.</div>;

  return (
    <div style={{ display: "grid", gap: 14 }}>
      <h2 style={{ margin: 0 }}>{assessment.title}</h2>
      <div style={{ opacity: 0.8, fontSize: 13 }}>
        Exigencia: <b>{assessment.passPct || 60}%</b> (60% = nota 4.0)
      </div>

      <QuizRunner questions={assessment.questions || []} onSubmit={submit} />
    </div>
  );
}
