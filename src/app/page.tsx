export default function HomePage() {
  return (
    <main style={{ padding: 24, maxWidth: 900, margin: "0 auto" }}>
      <h1 style={{ fontSize: 32, fontWeight: 800 }}>Provi Evaluaciones</h1>
      <p style={{ marginTop: 8, opacity: 0.85 }}>
        Plataforma de evaluaciones online (Colegio Providencia).
      </p>

      <div style={{ marginTop: 18, display: "flex", gap: 12, flexWrap: "wrap" }}>
        <a
          href="/login"
          style={{
            padding: "10px 14px",
            borderRadius: 10,
            border: "1px solid #ccc",
            textDecoration: "none",
            fontWeight: 700
          }}
        >
          Ir a Login
        </a>

        <a
          href="/teacher"
          style={{
            padding: "10px 14px",
            borderRadius: 10,
            border: "1px solid #ccc",
            textDecoration: "none",
            fontWeight: 700
          }}
        >
          Panel Docente
        </a>

        <a
          href="/student"
          style={{
            padding: "10px 14px",
            borderRadius: 10,
            border: "1px solid #ccc",
            textDecoration: "none",
            fontWeight: 700
          }}
        >
          Panel Estudiante
        </a>
      </div>

      <hr style={{ margin: "22px 0" }} />

      <p style={{ fontSize: 14, opacity: 0.75 }}>
        Próximos pasos: Login Google, Roles (Docente/Estudiante/UTP), creación de evaluaciones, rendición y
        resultados.
      </p>
    </main>
  );
}
