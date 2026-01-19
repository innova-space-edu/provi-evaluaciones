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

  const maxScore = useMemo(() => {
    return questions.reduce((acc, q) => acc + (q.points || 0), 0);
  }, [questions]);

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
              {q.choices.map((c) => (
                <label
                  key={c.id}
                  style={{
                    display: "flex",
                    gap: 10,
                    alignItems: "center",
                    cursor: "pointer",
                    padding: 8,
                    borderRadius: 12,
                    border: "1px solid rgba(255,255,255,0.06)",
                    background:
                      answers[q.id] === c.id
                        ? "rgba(43,92,255,0.18)"
                        : "transparent",
                  }}
                >
                  <input
                    type="radio"
                    name={q.id}
                    checked={answers[q.id] === c.id}
                    onChange={() => setAnswer(q.id, c.id)}
                  />
                  <span>{c.text}</span>
                </label>
              ))}
            </div>
          ) : (
            <div style={{ display: "flex", gap: 10 }}>
              <label
                style={{
                  display: "flex",
                  gap: 8,
                  alignItems: "center",
                  padding: 8,
                  borderRadius: 12,
                  border: "1px solid rgba(255,255,255,0.06)",
                  cursor: "pointer",
                  background:
                    answers[q.id] === true
                      ? "rgba(43,92,255,0.18)"
                      : "transparent",
                }}
              >
                <input
                  type="radio"
                  name={q.id}
                  checked={answers[q.id] === true}
                  onChange={() => setAnswer(q.id, true)}
                />
                Verdadero
              </label>

              <label
                style={{
                  display: "flex",
                  gap: 8,
                  alignItems: "center",
                  padding: 8,
                  borderRadius: 12,
                  border: "1px solid rgba(255,255,255,0.06)",
                  cursor: "pointer",
                  background:
                    answers[q.id] === false
                      ? "rgba(43,92,255,0.18)"
                      : "transparent",
                }}
              >
                <input
                  type="radio"
                  name={q.id}
                  checked={answers[q.id] === false}
                  onChange={() => setAnswer(q.id, false)}
                />
                Falso
              </label>
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
