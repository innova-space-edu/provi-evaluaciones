"use client";

import { useState } from "react";

export default function FileDropCsv({
  onParsed,
}: {
  onParsed: (csvText: string) => void;
}) {
  const [name, setName] = useState<string>("");

  async function onFile(file: File) {
    setName(file.name);
    const text = await file.text();
    onParsed(text);
  }

  return (
    <div style={{ border: "1px dashed #999", padding: 16, borderRadius: 12 }}>
      <p><b>Lista de estudiantes (CSV)</b></p>
      <p>Debe incluir columna <code>email</code>.</p>
      <input
        type="file"
        accept=".csv,text/csv"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onFile(f);
        }}
      />
      {name ? <p>Archivo: {name}</p> : null}
    </div>
  );
}
