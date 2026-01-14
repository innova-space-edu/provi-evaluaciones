export default function TeacherHomePage() {
  return (
    <main style={{ padding: 24, maxWidth: 900, margin: "0 auto" }}>
      <h1 style={{ fontSize: 28, fontWeight: 800 }}>Panel Docente</h1>
      <p style={{ marginTop: 8, opacity: 0.85 }}>
        Aquí podrás crear evaluaciones, subir listas (CSV) y revisar resultados.
      </p>

      <div style={{ marginTop: 16, display: "flex", gap: 12, flexWrap: "wrap" }}>
        <a
          href="/teacher/assessments/new"
          style={{
            padding: "10px 14px",
            borderRadius: 10,
            border: "1px solid #ccc",
            textDecoration: "none",
            fontWeight: 700
          }}
        >
          + Crear nueva evaluación
        </a>

        <a
          href="/"
          style={{
            padding: "10px 14px",
            borderRadius: 10,
            border: "1px solid #ccc",
            textDecoration: "none",
            fontWeight: 700
          }}
        >
          Inicio
        </a>
      </div>

      <hr style={{ margin: "22px 0" }} />
      <p style={{ fontSize: 14, opacity: 0.75 }}>
        Próximo: lista de evaluaciones del docente (Firestore) + publicación de link.
      </p>
    </main>
  );
}
