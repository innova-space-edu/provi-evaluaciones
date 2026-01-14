import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    // Placeholder: luego leeremos respuestas del estudiante
    // Aquí irá la corrección automática y cálculo de nota
    return NextResponse.json(
      {
        ok: true,
        message: "Assessment submit endpoint activo",
        note: "Aquí se corregirá y guardará el intento"
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: "Error enviando respuestas"
      },
      { status: 500 }
    );
  }
}
