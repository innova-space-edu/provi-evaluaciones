"use client";

import type { Attempt } from "@/types";

export default function ResultsView({ attempt }: { attempt: Attempt }) {
  return (
    <div style={{ display: "grid", gap: 14 }}>
      <h2 style={{ margin: 0 }}>Resultados</h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: 10,
        }}
      >
        <Card label="Puntaje" value={`${attempt.score} / ${attempt.maxScore}`} />
        <Card label="Porcentaje" value={`${attempt.pct.toFixed(1)}%`} />
        <Card label="Nota" value={attempt.grade.toFixed(1)} />
      </div>

      <div style={{ opacity: 0.85 }}>
        <b>Detalle por pregunta</b>
      </div>

      <div style={{ display: "grid", gap: 10 }}>
        {attempt.feedback.map((f) => (
          <div
            key={f.questionId}
            style={{
              border: "1px solid rgba(255,255,255,0.10)",
              borderRadius: 14,
              padding: 14,
              background: f.ok ? "rgba(33,197,93,0.10)" : "rgba(255,80,80,0.10)",
            }}
          >
            <div style={{ fontWeight: 900, marginBottom: 6 }}>
              {f.ok ? "✅ Correcta" : "❌ Incorrecta"}{" "}
              <span style={{ opacity: 0.7, fontWeight: 700 }}>
                ({f.pointsEarned}/{f.pointsMax})
              </span>
            </div>
            <div style={{ fontSize: 13, opacity: 0.9 }}>
              Tu respuesta: <b>{String(f.given)}</b>
            </div>
            <div style={{ fontSize: 13, opacity: 0.9 }}>
              Correcta: <b>{String(f.correct)}</b>
            </div>
          </div>
        ))}
      </div>

      <div style={{ fontSize: 12, opacity: 0.7 }}>
        Enviado: {new Date(attempt.submittedAt).toLocaleString("es-CL")}
      </div>
    </div>
  );
}

function Card({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        border: "1px solid rgba(255,255,255,0.10)",
        borderRadius: 14,
        padding: 14,
        background: "rgba(255,255,255,0.03)",
      }}
    >
      <div style={{ fontSize: 12, opacity: 0.75 }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 950 }}>{value}</div>
    </div>
  );
}
