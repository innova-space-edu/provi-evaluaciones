import Link from "next/link";

export default function AppShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={wrap}>
      <header style={header}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontWeight: 950, letterSpacing: 0.2 }}>Provi Evaluaciones</div>
          <div style={{ fontSize: 12, opacity: 0.75 }}>
            Plataforma de evaluaciones online — Colegio Providencia
          </div>
        </div>

        <nav style={nav}>
          <Link style={navLink} href="/">Inicio</Link>
          <Link style={navLink} href="/teacher">Docente</Link>
          <Link style={navLink} href="/student">Estudiante</Link>
        </nav>
      </header>

      <main style={main}>
        <div style={panel}>{children}</div>
      </main>

      <footer style={footer}>
        <span style={{ opacity: 0.7 }}>© {new Date().getFullYear()} Innova Space</span>
      </footer>
    </div>
  );
}

const wrap: React.CSSProperties = {
  minHeight: "100vh",
  background:
    "radial-gradient(900px 500px at 20% 10%, rgba(43,92,255,0.28), transparent 60%)," +
    "radial-gradient(700px 420px at 85% 25%, rgba(33,197,93,0.18), transparent 55%)," +
    "linear-gradient(180deg, #070A14, #03040A)",
  color: "white",
};

const header: React.CSSProperties = {
  position: "sticky",
  top: 0,
  zIndex: 10,
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 12,
  padding: "14px 18px",
  borderBottom: "1px solid rgba(255,255,255,0.08)",
  background: "rgba(2, 3, 10, 0.75)",
  backdropFilter: "blur(10px)",
};

const nav: React.CSSProperties = {
  display: "flex",
  gap: 10,
  alignItems: "center",
  flexWrap: "wrap",
};

const navLink: React.CSSProperties = {
  color: "white",
  textDecoration: "none",
  fontWeight: 800,
  fontSize: 13,
  padding: "8px 10px",
  borderRadius: 12,
  border: "1px solid rgba(255,255,255,0.10)",
  background: "rgba(255,255,255,0.04)",
};

const main: React.CSSProperties = {
  padding: "18px",
  display: "grid",
  placeItems: "start center",
};

const panel: React.CSSProperties = {
  width: "min(980px, 100%)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: 18,
  padding: "16px",
  background: "rgba(255,255,255,0.03)",
  boxShadow: "0 30px 80px rgba(0,0,0,0.55)",
};

const footer: React.CSSProperties = {
  padding: "18px",
  textAlign: "center",
  fontSize: 12,
  borderTop: "1px solid rgba(255,255,255,0.08)",
};
