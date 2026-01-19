import Link from "next/link";

export default function AppShell({
  title,
  children,
}: {
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ minHeight: "100vh", background: "#0b1020", color: "#e8ecff" }}>
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          backdropFilter: "blur(10px)",
          background: "rgba(11,16,32,0.7)",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <div
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            padding: "14px 18px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
          }}
        >
          <div>
            <div style={{ fontWeight: 900, letterSpacing: 0.3 }}>
              Provi Evaluaciones
            </div>
            <div style={{ fontSize: 12, opacity: 0.8 }}>
              {title || "Plataforma de evaluaciones online"}
            </div>
          </div>

          <nav style={{ display: "flex", gap: 14, fontSize: 14 }}>
            <Link style={{ color: "#e8ecff", textDecoration: "none", opacity: 0.9 }} href="/">
              Inicio
            </Link>
            <Link style={{ color: "#e8ecff", textDecoration: "none", opacity: 0.9 }} href="/login">
              Login
            </Link>
            <Link style={{ color: "#e8ecff", textDecoration: "none", opacity: 0.9 }} href="/teacher">
              Docente
            </Link>
            <Link style={{ color: "#e8ecff", textDecoration: "none", opacity: 0.9 }} href="/student">
              Estudiante
            </Link>
            <Link style={{ color: "#e8ecff", textDecoration: "none", opacity: 0.9 }} href="/utp">
              UTP
            </Link>
          </nav>
        </div>
      </header>

      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "22px 18px" }}>
        <div
          style={{
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 16,
            padding: 18,
            background: "rgba(255,255,255,0.03)",
            boxShadow: "0 20px 60px rgba(0,0,0,0.45)",
          }}
        >
          {children}
        </div>
      </main>

      <footer style={{ padding: 18, opacity: 0.65, textAlign: "center", fontSize: 12 }}>
        Innova Space Education — Providencia Evaluaciones
      </footer>
    </div>
  );
}
