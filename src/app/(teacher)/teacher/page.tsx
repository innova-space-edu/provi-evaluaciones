"use client";

import { useState } from "react";
import { getAuth } from "firebase/auth";
import { app } from "@/lib/firebase/client";

export default function TeacherPage() {
  const [title, setTitle] = useState("Evaluación Demo - Providencia");
  const [creating, setCreating] = useState(false);
  const [assessmentId, setAssessmentId] = useState<string>("");
  const [err, setErr] = useState<string>("");

  async function createDemo() {
    setErr("");
    setAssessmentId("");

    const auth = getAuth(app);
    const user = auth.currentUser;
    if (!user) {
      setErr("Debes iniciar sesión con Google primero.");
      return;
    }

    setCreating(true);
    try {
      const idToken = await user.getIdToken(true);

      const r = await fetch("/api/assessments/demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken, title }),
      });

      const data = await r.json();
      if (!r.ok || !data.ok) {
        throw new Error(data?.error || "No se pudo crear");
      }

      setAssessmentId(data.assessmentId);
    } catch (e: any) {
      setErr(e?.message || "Error");
    } finally {
      setCreating(false);
    }
  }

  const studentLink = assessmentId
    ? `${typeof window !== "undefined" ? window.location.origin : ""}/student/assessments/${assessmentId}`
    : "";

  return (
    <div style={{ display: "grid", gap: 14 }}>
      <h1 style={{ margin: 0, fontSize: 22 }}>Panel Docente</h1>

      <div style={card}>
        <div style={{ fontWeight: 900, marginBottom: 8 }}>Crear evaluación demo</div>

        <label style={{ display: "grid", gap: 6 }}>
          <span style={{ fontSize: 12, opacity: 0.8 }}>Título</span>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Título de la evaluación"
            style={input}
          />
        </label>

        <button onClick={createDemo} disabled={creating} style={btnPrimary}>
          {creating ? "Creando..." : "Crear evaluación demo"}
        </button>

        {err ? <div style={{ color: "#ff8080", fontWeight: 700 }}>❌ {err}</div> : null}

        {assessmentId ? (
          <div style={{ marginTop: 10, display: "grid", gap: 8 }}>
            <div style={{ fontWeight: 900 }}>✅ Creada: {assessmentId}</div>

            <div style={{ fontSize: 13, opacity: 0.9 }}>
              Link para estudiantes:
            </div>

            <div style={linkBox}>
              <a href={studentLink} target="_blank" rel="noreferrer" style={{ color: "white" }}>
                {studentLink}
              </a>
            </div>

            <button
              onClick={() => navigator.clipboard.writeText(studentLink)}
              style={btnGhost}
            >
              Copiar link
            </button>
          </div>
        ) : null}
      </div>

      <div style={{ fontSize: 12, opacity: 0.75 }}>
        Nota: esto crea una evaluación demo real en Firestore bajo <b>assessments</b>.
      </div>
    </div>
  );
}

const card: React.CSSProperties = {
  border: "1px solid rgba(255,255,255,0.10)",
  borderRadius: 16,
  padding: 14,
  background: "rgba(255,255,255,0.03)",
  display: "grid",
  gap: 10,
};

const input: React.CSSProperties = {
  padding: "12px 12px",
  borderRadius: 12,
  border: "1px solid rgba(255,255,255,0.15)",
  background: "rgba(255,255,255,0.05)",
  color: "white",
  outline: "none",
};

const btnPrimary: React.CSSProperties = {
  background: "#21c55d",
  border: "none",
  color: "white",
  padding: "12px 14px",
  borderRadius: 12,
  fontWeight: 900,
  cursor: "pointer",
};

const btnGhost: React.CSSProperties = {
  background: "rgba(255,255,255,0.08)",
  border: "1px solid rgba(255,255,255,0.12)",
  color: "white",
  padding: "10px 12px",
  borderRadius: 12,
  fontWeight: 800,
  cursor: "pointer",
};

const linkBox: React.CSSProperties = {
  padding: 12,
  borderRadius: 12,
  border: "1px solid rgba(255,255,255,0.12)",
  background: "rgba(0,0,0,0.25)",
  overflowX: "auto",
};
