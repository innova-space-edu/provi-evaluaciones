"use client";

import { useMemo, useState } from "react";
import type { Question } from "@/types";

export default function QuizRunner({
  questions,
  onSubmit,
}: {
  questions: Question[];
  onSubmit: (answers: Record<string, any>) => Promise<void>;
}) {
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [sending, setSending] = useState(false);

  const maxScore = useMemo(
    () => questions.reduce((acc, q) => acc + (q.points || 0), 0),
    [questions]
  );

  function setAnswer(qid: string, value: any) {
    setAnswers((prev) => ({ ...prev, [qid]: value }));
  }

  async function handleSubmit() {
    setSending(true);
    try {
      await onSubmit(answers);
    } finally {
      setSending(false);
    }
  }

  return (
    <div style={{ display: "grid", gap: 14 }}>
      <div style={{ opacity: 0.85, fontSize: 13 }}>
        Preguntas: <b>{questions.length}</b> — Puntaje máximo: <b>{maxScore}</b>
      </div>

      {questions.map((q, idx) => (
        <div
          key={q.id}
          style={{
            border: "1px solid rgba(255,255,255,0.10)",
            borderRadius: 14,
            padding: 14,
            background: "rgba(255,255,255,0.03)",
          }}
        >
          <div style={{ fontWeight: 900, marginBottom: 8 }}>
            {idx + 1}. {q.prompt}{" "}
            <span style={{ opacity: 0.7, fontWeight: 700 }}>
              ({q.points} pts)
            </span>
          </div>

          {q.type === "mcq" ? (
            <div style={{ display: "grid", gap: 8 }}>
              {q.options.map((opt, i) => (
                <label
                  key={i}
                  style={{
                    display: "flex",
                    gap: 10,
                    alignItems: "center",
                    cursor: "pointer",
                    padding: 8,
                    borderRadius: 12,
                    border: "1px solid rgba(255,255,255,0.06)",
                    background:
                      answers[q.id] === i
                        ? "rgba(43,92,255,0.18)"
                        : "transparent",
                  }}
                >
                  <input
                    type="radio"
                    name={q.id}
                    checked={answers[q.id] === i}
                    onChange={() => setAnswer(q.id, i)}
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
          ) : q.type === "truefalse" ? (
            <div style={{ display: "flex", gap: 10 }}>
              <label style={tfStyle(answers[q.id] === true)}>
                <input
                  type="radio"
                  name={q.id}
                  checked={answers[q.id] === true}
                  onChange={() => setAnswer(q.id, true)}
                />
                Verdadero
              </label>

              <label style={tfStyle(answers[q.id] === false)}>
                <input
                  type="radio"
                  name={q.id}
                  checked={answers[q.id] === false}
                  onChange={() => setAnswer(q.id, false)}
                />
                Falso
              </label>
            </div>
          ) : (
            <div style={{ display: "grid", gap: 8 }}>
              <input
                value={String(answers[q.id] ?? "")}
                onChange={(e) => setAnswer(q.id, e.target.value)}
                placeholder="Escribe tu respuesta"
                style={{
                  padding: "12px 12px",
                  borderRadius: 12,
                  border: "1px solid rgba(255,255,255,0.15)",
                  background: "rgba(255,255,255,0.05)",
                  color: "white",
                  outline: "none",
                }}
              />
              <div style={{ fontSize: 12, opacity: 0.7 }}>
                Responde con texto (por ejemplo: H2O)
              </div>
            </div>
          )}
        </div>
      ))}

      <button
        onClick={handleSubmit}
        disabled={sending}
        style={{
          background: sending ? "rgba(255,255,255,0.15)" : "#21c55d",
          border: "none",
          color: "white",
          padding: "12px 14px",
          borderRadius: 12,
          fontWeight: 900,
          cursor: "pointer",
        }}
      >
        {sending ? "Enviando..." : "Enviar evaluación"}
      </button>
    </div>
  );
}

function tfStyle(active: boolean) {
  return {
    display: "flex",
    gap: 8,
    alignItems: "center",
    padding: 8,
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.06)",
    cursor: "pointer",
    background: active ? "rgba(43,92,255,0.18)" : "transparent",
  } as React.CSSProperties;
}
