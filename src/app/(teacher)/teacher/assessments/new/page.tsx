"use client";

import { useState } from "react";
import FileDropCsv from "@/components/FileDropCsv";
import { getAuth } from "firebase/auth";
import { app } from "@/lib/firebase/client";

export default function NewAssessmentPage() {
  const [title, setTitle] = useState("Evaluación 1");
  const [assessmentId, setAssessmentId] = useState<string>("");
  const [msg, setMsg] = useState<string>("");

  const [csvText, setCsvText] = useState<string>("");

  async function createAssessment() {
    setMsg("");
    try {
      // MVP: id local. Luego lo hacemos real con /api/assessments/create
      const id = `assess_${Date.now()}`;
      setAssessmentId(id);
      setMsg("✅ Evaluación creada. Ahora sube la lista CSV.");
    } catch (e: any) {
      setMsg("❌ Error creando evaluación");
    }
  }

  async function uploadRoster() {
    setMsg("");
    try {
      if (!assessmentId) {
        setMsg("Primero crea la evaluación.");
        return;
      }
      if (!csvText) {
        setMsg("Sube el CSV primero.");
        return;
      }

      const auth = getAuth(app);
      const user = auth.currentUser;
      if (!user) {
        setMsg("Debes iniciar sesión.");
        return;
      }
      const idToken = await user.getIdToken(true);

      const r = await fetch("/api/rosters/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken, assessmentId, csvText }),
      });

      const data = await r.json();
      if (!r.ok || !data.ok) {
        setMsg(`❌ No se pudo subir roster: ${data?.error || r.status}`);
        return;
      }

      setMsg(`✅ Lista cargada: ${data.count} estudiantes.`);
    } catch (e: any) {
      setMsg("❌ Error subiendo lista.");
    }
  }

  return (
    <div style={{ display: "grid", gap: 14 }}>
      <h2 style={{ margin: 0 }}>Nueva evaluación</h2>

      <div style={{ display: "grid", gap: 8 }}>
        <label style={{ fontWeight: 700 }}>Título</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{
            padding: "12px 12px",
            borderRadius: 12,
            border: "1px solid rgba(255,255,255,0.15)",
            background: "rgba(255,255,255,0.05)",
            color: "white",
            outline: "none",
          }}
        />
      </div>

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <button
          onClick={createAssessment}
          style={{
            background: "#2b5cff",
            border: "none",
            color: "white",
            padding: "10px 12px",
            borderRadius: 12,
            fontWeight: 900,
            cursor: "pointer",
          }}
        >
          Crear evaluación
        </button>

        {assessmentId ? (
          <div style={{ opacity: 0.9, alignSelf: "center" }}>
            ID: <b>{assessmentId}</b>
          </div>
        ) : null}
      </div>

      <FileDropCsv onText={(t) => setCsvText(t)} />

      <button
        onClick={uploadRoster}
        style={{
          background: assessmentId ? "#21c55d" : "rgba(255,255,255,0.15)",
          border: "none",
          color: "white",
          padding: "10px 12px",
          borderRadius: 12,
          fontWeight: 900,
          cursor: "pointer",
          opacity: assessmentId ? 1 : 0.6,
        }}
      >
        Subir lista (CSV)
      </button>

      {msg ? <div style={{ paddingTop: 6, opacity: 0.95 }}>{msg}</div> : null}

      <div style={{ fontSize: 13, opacity: 0.75, marginTop: 6 }}>
        Próximo: editor de preguntas + link para estudiantes + corrección automática.
      </div>
    </div>
  );
}
