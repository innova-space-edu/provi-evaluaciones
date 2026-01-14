type Props = { params: { id: string } };

export default function StudentAssessmentRunPage({ params }: Props) {
  return (
    <main style={{ padding: 24, maxWidth: 900, margin: "0 auto" }}>
      <h1 style={{ fontSize: 26, fontWeight: 800 }}>Rendir evaluación</h1>
      <p style={{ marginTop: 8, opacity: 0.85 }}>
        ID: <code>{params.id}</code>
      </p>

      <div style={{ marginTop: 16, padding: 16, border: "1px solid #ddd", borderRadius: 12 }}>
        <p style={{ margin: 0, fontWeight: 700 }}>Pendiente de conectar</p>
        <ul style={{ marginTop: 10 }}>
          <li>Render de preguntas</li>
          <li>Temporizador (si aplica)</li>
          <li>Enviar respuestas a <code>/api/assessments/submit</code></li>
          <li>Redirección a resultados</li>
        </ul>
      </div>

      <div style={{ marginTop: 18 }}>
        <a href="/student" style={{ textDecoration: "none", fontWeight: 700 }}>
          ← Volver al Panel Estudiante
        </a>
      </div>
    </main>
  );
}
