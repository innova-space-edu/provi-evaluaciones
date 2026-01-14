type Props = { params: { id: string } };

export default function TeacherAssessmentDetailPage({ params }: Props) {
  return (
    <main style={{ padding: 24, maxWidth: 900, margin: "0 auto" }}>
      <h1 style={{ fontSize: 26, fontWeight: 800 }}>Evaluación (Docente)</h1>
      <p style={{ marginTop: 8, opacity: 0.85 }}>
        ID: <code>{params.id}</code>
      </p>

      <div style={{ marginTop: 16, padding: 16, border: "1px solid #ddd", borderRadius: 12 }}>
        <p style={{ margin: 0, fontWeight: 700 }}>Pendiente de conectar</p>
        <ul style={{ marginTop: 10 }}>
          <li>Ver detalles de la evaluación</li>
          <li>Ver intentos y resultados</li>
          <li>Exportar reportes</li>
        </ul>
      </div>

      <div style={{ marginTop: 18 }}>
        <a href="/teacher" style={{ textDecoration: "none", fontWeight: 700 }}>
          ← Volver al Panel Docente
        </a>
      </div>
    </main>
  );
}
