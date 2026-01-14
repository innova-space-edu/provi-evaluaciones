import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    // Placeholder: luego leeremos JSON con datos de la evaluación
    return NextResponse.json(
      {
        ok: true,
        message: "Assessment create endpoint activo",
        note: "Aquí se creará la evaluación en Firestore"
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: "Error creando evaluación"
      },
      { status: 500 }
    );
  }
}
