"use client";

import { useRef, useState } from "react";

export default function FileDropCsv({
  onText,
}: {
  onText: (csvText: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [name, setName] = useState<string>("");
  const [error, setError] = useState<string>("");

  async function handleFile(file?: File | null) {
    setError("");
    if (!file) return;
    if (!file.name.toLowerCase().endsWith(".csv")) {
      setError("Sube un archivo .csv");
      return;
    }
    setName(file.name);
    const text = await file.text();
    onText(text);
  }

  return (
    <div
      style={{
        border: "1px dashed rgba(255,255,255,0.25)",
        borderRadius: 14,
        padding: 16,
        background: "rgba(255,255,255,0.03)",
      }}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        handleFile(e.dataTransfer.files?.[0]);
      }}
    >
      <div style={{ fontWeight: 800, marginBottom: 6 }}>Lista de estudiantes (CSV)</div>
      <div style={{ opacity: 0.85, marginBottom: 10, fontSize: 13 }}>
        Formato: <b>nombre, mail, rut</b>
      </div>

      <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          style={{
            background: "#2b5cff",
            border: "none",
            color: "white",
            padding: "10px 12px",
            borderRadius: 12,
            fontWeight: 800,
            cursor: "pointer",
          }}
        >
          Seleccionar CSV
        </button>

        <div style={{ fontSize: 13, opacity: 0.9 }}>
          {name ? `Archivo: ${name}` : "o arrastra el archivo aquí"}
        </div>
      </div>

      {error ? <div style={{ marginTop: 10, color: "#ff8080" }}>{error}</div> : null}

      <input
        ref={inputRef}
        type="file"
        accept=".csv,text/csv"
        style={{ display: "none" }}
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
    </div>
  );
}
