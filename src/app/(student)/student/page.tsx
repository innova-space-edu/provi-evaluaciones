export default function StudentHomePage() {
  return (
    <main style={{ padding: 24, maxWidth: 900, margin: "0 auto" }}>
      <h1 style={{ fontSize: 28, fontWeight: 800 }}>Panel Estudiante</h1>
      <p style={{ marginTop: 8, opacity: 0.85 }}>
        Aquí podrás rendir evaluaciones y ver resultados.
      </p>

      <div style={{ marginTop: 16, padding: 16, border: "1px solid #ddd", borderRadius: 12 }}>
        <p style={{ margin: 0, fontWeight: 700 }}>Cómo usar</p>
        <ol style={{ marginTop: 10 }}>
          <li>Recibe el link o código de evaluación del docente.</li>
          <li>Ingresa a la evaluación y rinde.</li>
          <li>Al enviar, verás puntaje, nota (exigencia 60% = 4.0) y errores.</li>
        </ol>
      </div>

      <div style={{ marginTop: 18 }}>
        <a href="/" style={{ textDecoration: "none", fontWeight: 700 }}>
          ← Volver al inicio
        </a>
      </div>
    </main>
  );
}
