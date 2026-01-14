type Props = { params: { attemptId: string } };

export default function StudentResultPage({ params }: Props) {
  return (
    <main style={{ padding: 24, maxWidth: 900, margin: "0 auto" }}>
      <h1 style={{ fontSize: 26, fontWeight: 800 }}>Resultados</h1>
      <p style={{ marginTop: 8, opacity: 0.85 }}>
        Intento ID: <code>{params.attemptId}</code>
      </p>

      <div style={{ marginTop: 16, padding: 16, border: "1px solid #ddd", borderRadius: 12 }}>
        <p style={{ margin: 0, fontWeight: 700 }}>Pendiente de conectar</p>
        <ul style={{ marginTop: 10 }}>
          <li>Puntaje</li>
          <li>Nota (exigencia 60% = 4.0)</li>
          <li>Lista de errores + explicación</li>
        </ul>

        <p style={{ marginTop: 10, fontSize: 13, opacity: 0.75 }}>
          Luego conectamos esta página a Firestore: <code>attempts/{params.attemptId}</code>.
        </p>
      </div>

      <div style={{ marginTop: 18, display: "flex", gap: 12 }}>
        <a href="/student" style={{ textDecoration: "none", fontWeight: 700 }}>
          ← Panel Estudiante
        </a>
        <a href="/" style={{ textDecoration: "none", fontWeight: 700 }}>
          Inicio
        </a>
      </div>
    </main>
  );
}
