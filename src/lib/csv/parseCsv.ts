export type RosterRow = {
  nombre: string;
  mail: string;
  rut?: string;
};

function normHeader(s: string) {
  return s.trim().toLowerCase().replace(/\s+/g, "");
}

function clean(s: string) {
  return (s || "").toString().trim();
}

function splitCsvLine(line: string): string[] {
  // Parser simple: soporta comillas básicas
  const out: string[] = [];
  let cur = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      inQuotes = !inQuotes;
      continue;
    }
    if (ch === "," && !inQuotes) {
      out.push(cur);
      cur = "";
      continue;
    }
    cur += ch;
  }
  out.push(cur);
  return out.map(v => v.trim());
}

export function parseRosterCsv(csvText: string): RosterRow[] {
  const lines = csvText
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .split("\n")
    .map(l => l.trim())
    .filter(Boolean);

  if (lines.length < 2) return [];

  const headersRaw = splitCsvLine(lines[0]);
  const headers = headersRaw.map(normHeader);

  // Permitimos variantes
  const idxNombre = headers.findIndex(h => ["nombre","nombres","name","alumno","estudiante"].includes(h));
  const idxMail = headers.findIndex(h => ["mail","correo","email","e-mail"].includes(h));
  const idxRut = headers.findIndex(h => ["rut","run"].includes(h));

  if (idxNombre === -1 || idxMail === -1) {
    throw new Error("CSV inválido: se requieren columnas 'nombre' y 'mail' (o equivalentes).");
  }

  const rows: RosterRow[] = [];

  for (let i = 1; i < lines.length; i++) {
    const cols = splitCsvLine(lines[i]);
    const nombre = clean(cols[idxNombre]);
    const mail = clean(cols[idxMail]).toLowerCase();
    const rut = idxRut !== -1 ? clean(cols[idxRut]) : "";

    if (!nombre || !mail) continue;

    rows.push({
      nombre,
      mail,
      rut: rut || undefined,
    });
  }

  return rows;
}
