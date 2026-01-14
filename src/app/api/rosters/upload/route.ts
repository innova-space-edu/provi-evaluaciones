import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    // Placeholder: luego recibiremos FormData con CSV
    return NextResponse.json(
      {
        ok: true,
        message: "Roster upload endpoint activo",
        note: "Aquí se procesará CSV de estudiantes"
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: "Error en upload de roster"
      },
      { status: 500 }
    );
  }
}
