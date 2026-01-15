"use client";

import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase/client";
import { useState } from "react";

const ALLOWED_DOMAIN = process.env.NEXT_PUBLIC_ALLOWED_DOMAIN;

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
        setMsg(`Correo no permitido (${domain}). Usa tu correo institucional @${ALLOWED_DOMAIN}`);
        return;
      }

      const idToken = await res.user.getIdToken();

      const r = await fetch("/api/users/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken })
      });

      const data = await r.json();
      if (!data.ok) {
        setMsg("❌ No se pudo validar el usuario (sync).");
        return;
      }

      const role = data.role as "teacher" | "student" | "utp";
      setMsg(`✅ Bienvenido/a: ${email} (${role})`);

      if (role === "teacher") location.href = "/teacher";
      else if (role === "utp") location.href = "/utp";
      else location.href = "/student";
    } catch (e: any) {
      setMsg("❌ Error de login. Revisa popups y dominios autorizados en Firebase.");
    }
  }

  return (
    <main style={{ padding: 24, maxWidth: 720, margin: "0 auto" }}>
      <h1 style={{ fontSize: 28, fontWeight: 800 }}>Acceso – Provi Evaluaciones</h1>
      <p style={{ marginTop: 8, opacity: 0.85 }}>
        Solo correos institucionales: <b>@{ALLOWED_DOMAIN}</b>
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
      </div>

      <div style={{ marginTop: 18 }}>
        <a href="/" style={{ textDecoration: "none", fontWeight: 700 }}>
          ← Volver al inicio
        </a>
      </div>
    </main>
  );
}

