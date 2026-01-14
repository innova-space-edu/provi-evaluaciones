import { NextResponse } from "next/server";

export async function POST() {
  // TODO: aquí luego recibimos CSV y lo guardamos en Firestore.
  return NextResponse.json(
    {
      ok: true,
      message: "Roster upload endpoint listo (placeholder)."
    },
    { status: 200 }
  );
}
