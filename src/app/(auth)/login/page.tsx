"use client";

export default function LoginPage() {
  return (
    <main style={{ padding: 24, maxWidth: 720, margin: "0 auto" }}>
      <h1 style={{ fontSize: 28, fontWeight: 800 }}>Acceso – Provi Evaluaciones</h1>
      <p style={{ marginTop: 8, opacity: 0.85 }}>
        Ingresa con tu correo institucional para crear o rendir evaluaciones.
      </p>

      <div
        style={{
          marginTop: 16,
          padding: 16,
          border: "1px solid #ddd",
          borderRadius: 12
        }}
      >
        <button
          type="button"
          style={{
            padding: "10px 14px",
            borderRadius: 10,
            border: "1px solid #ccc",
            cursor: "pointer",
            fontWeight: 700
          }}
          onClick={() => alert("Luego conectamos Google Login con Firebase Auth")}
        >
          Entrar con Google
        </button>

        <p style={{ marginTop: 10, fontSize: 13, opacity: 0.7 }}>
          *Solo correos del dominio del colegio.
        </p>
      </div>

      <div style={{ marginTop: 18 }}>
        <a href="/" style={{ textDecoration: "none", fontWeight: 700 }}>
          ← Volver al inicio
        </a>
      </div>
    </main>
  );
}
