import { NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase/admin";

type Role = "teacher" | "student" | "utp";

function pickRoleByEmail(email: string): Role {
  const u = (process.env.UTP_EMAILS || "").split(",").map(s => s.trim().toLowerCase()).filter(Boolean);
  const t = (process.env.TEACHER_EMAILS || "").split(",").map(s => s.trim().toLowerCase()).filter(Boolean);

  const e = email.toLowerCase();
  if (u.includes(e)) return "utp";
  if (t.includes(e)) return "teacher";
  return "student";
}

export async function POST(request: Request) {
  try {
    const { idToken } = await request.json();

    if (!idToken) {
      return NextResponse.json({ ok: false, error: "Missing idToken" }, { status: 400 });
    }

    const decoded = await adminAuth.verifyIdToken(idToken);
    const uid = decoded.uid;
    const email = (decoded.email || "").toLowerCase();

    if (!email) {
      return NextResponse.json({ ok: false, error: "No email in token" }, { status: 400 });
    }

    // Dominio permitido (doble seguridad server-side)
    const allowed = (process.env.NEXT_PUBLIC_ALLOWED_DOMAIN || "").toLowerCase();
    const domain = (email.split("@")[1] || "").toLowerCase();
    if (allowed && domain !== allowed) {
      return NextResponse.json({ ok: false, error: "Email domain not allowed" }, { status: 403 });
    }

    const userRef = adminDb.collection("users").doc(uid);
    const snap = await userRef.get();

    if (!snap.exists) {
      const role = pickRoleByEmail(email);
      await userRef.set(
        {
          uid,
          email,
          role,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        { merge: true }
      );
      return NextResponse.json({ ok: true, role, created: true });
    }

    const data = snap.data() || {};
    const role = (data.role as string) || "student";

    await userRef.set({ updatedAt: new Date().toISOString() }, { merge: true });
    return NextResponse.json({ ok: true, role, created: false });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: "Sync failed" }, { status: 500 });
  }
}
