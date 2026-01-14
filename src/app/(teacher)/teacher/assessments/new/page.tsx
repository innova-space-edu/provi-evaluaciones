export default function TeacherNewAssessmentPage() {
  return (
    <main style={{ padding: 24, maxWidth: 900, margin: "0 auto" }}>
      <h1 style={{ fontSize: 26, fontWeight: 800 }}>Crear evaluación</h1>
      <p style={{ marginTop: 8, opacity: 0.85 }}>
        En esta pantalla el docente creará la evaluación y subirá la lista de estudiantes (CSV).
      </p>

      <div style={{ marginTop: 16, padding: 16, border: "1px solid #ddd", borderRadius: 12 }}>
        <p style={{ margin: 0, fontWeight: 700 }}>MVP (pendiente de conectar)</p>
        <ul style={{ marginTop: 10 }}>
          <li>Título, duración, intentos</li>
          <li>Subida CSV con correos</li>
          <li>Editor de preguntas (alternativas / V-F / respuesta corta)</li>
          <li>Publicación</li>
        </ul>

        <p style={{ marginTop: 10, fontSize: 13, opacity: 0.75 }}>
          Luego conectamos esta pantalla con <code>/api/assessments/create</code>.
        </p>
      </div>

      <div style={{ marginTop: 18, display: "flex", gap: 12 }}>
        <a href="/teacher" style={{ textDecoration: "none", fontWeight: 700 }}>
          ← Volver
        </a>
        <a href="/" style={{ textDecoration: "none", fontWeight: 700 }}>
          Inicio
        </a>
      </div>
    </main>
  );
}
