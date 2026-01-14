"use client";

import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase/client";
import { useState } from "react";

const ALLOWED_DOMAIN = process.env.NEXT_PUBLIC_ALLOWED_DOMAIN; // ej: "colegioprovidencia.cl"

export default function LoginPage() {
  const [msg, setMsg] = useState<string>("");

  async function handleLogin() {
    setMsg("");
    try {
      const provider = new GoogleAuthProvider();
      const res = await signInWithPopup(auth, provider);

      const email = res.user.email || "";
      const domain = email.split("@")[1] || "";

      if (ALLOWED_DOMAIN && domain.toLowerCase() !== ALLOWED_DOMAIN.toLowerCase()) {
        await signOut(auth);
        setMsg(`Correo no permitido (${domain}). Usa tu correo institucional.`);
        return;
      }

      setMsg(`✅ Bienvenido/a: ${email}`);
      // Luego aquí redirigimos según rol (docente/estudiante/UTP)
      // location.href = "/teacher" o "/student" según corresponda
    } catch (e: any) {
      setMsg("❌ No se pudo iniciar sesión. Revisa dominios autorizados y popups.");
    }
  }

  return (
    <main style={{ padding: 24, maxWidth: 720, margin: "0 auto" }}>
      <h1 style={{ fontSize: 28, fontWeight: 800 }}>Acceso – Provi Evaluaciones</h1>
      <p style={{ marginTop: 8, opacity: 0.85 }}>
        Ingresa con tu correo institucional para crear o rendir evaluaciones.
      </p>

      <div style={{ marginTop: 16, padding: 16, border: "1px solid #ddd", borderRadius: 12 }}>
        <button
          type="button"
          style={{
            padding: "10px 14px",
            borderRadius: 10,
            border: "1px solid #ccc",
            cursor: "pointer",
            fontWeight: 700
          }}
          onClick={handleLogin}
        >
          Entrar con Google
        </button>

        {msg ? <p style={{ marginTop: 12 }}>{msg}</p> : null}

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
