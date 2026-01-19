"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ResultsView from "@/components/ResultsView";
import type { Attempt } from "@/types";

export default function StudentResultsPage() {
  const params = useParams<{ attemptId: string }>();
  const attemptId = params?.attemptId;

  const [loading, setLoading] = useState(true);
  const [attempt, setAttempt] = useState<Attempt | null>(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    async function load() {
      try {
        setErr("");
        setLoading(true);

        const r = await fetch(`/api/public/attempts/${attemptId}`);
        const data = await r.json();

        if (!r.ok || !data.ok) throw new Error(data?.error || "No se pudo cargar");
        setAttempt(data.attempt);
      } catch (e: any) {
        setErr(e?.message || "Error");
      } finally {
        setLoading(false);
      }
    }
    if (attemptId) load();
  }, [attemptId]);

  if (loading) return <div>Cargando resultados...</div>;
  if (err) return <div style={{ color: "#ff8080" }}>❌ {err}</div>;
  if (!attempt) return <div>No encontrado.</div>;

  return <ResultsView attempt={attempt} />;
}
