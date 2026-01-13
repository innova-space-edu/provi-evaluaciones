export function parseRosterCsv(text: string): string[] {
  const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  if (lines.length < 2) return [];

  const header = lines[0].split(",").map(h => h.trim().toLowerCase());
  const emailIdx = header.indexOf("email");
  if (emailIdx === -1) throw new Error("CSV debe incluir columna 'email'.");

  const emails: string[] = [];
  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(",").map(c => c.trim());
    const email = (cols[emailIdx] || "").toLowerCase();
    if (email) emails.push(email);
  }

  // quitar duplicados
  return Array.from(new Set(emails));
}
