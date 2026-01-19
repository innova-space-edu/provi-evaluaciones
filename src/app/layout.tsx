import type { Metadata } from "next";
import AppShell from "@/components/AppShell";

export const metadata: Metadata = {
  title: "Provi Evaluaciones",
  description: "Plataforma de evaluaciones online - Colegio Providencia",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body style={{ margin: 0, fontFamily: "system-ui, Arial, sans-serif" }}>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
