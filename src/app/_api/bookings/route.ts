import { NextResponse } from "next/server";
import { db } from "@/db";
import { bookings } from "@/db/schema";

function makeReference(): string {
  const year = new Date().getFullYear();
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `FLX-${year}-${rand}`;
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Corps de requête invalide" }, { status: 400 });
  }

  const b = body as Record<string, unknown>;
  const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");

  const name = str(b.name);
  const phone = str(b.phone);
  const email = str(b.email);
  const brand = str(b.brand);
  const model = str(b.model);
  const service = str(b.service);

  if (name.length < 2 || !/^[+0-9 ().-]{8,}$/.test(phone) || !email.includes("@") || !brand || !model || !service) {
    return NextResponse.json(
      { error: "Champs obligatoires manquants ou invalides" },
      { status: 400 },
    );
  }

  const reference = makeReference();

  try {
    await db.insert(bookings).values({
      reference,
      name,
      phone,
      email,
      brand,
      model,
      engine: str(b.engine) || null,
      service,
      preferredDate: str(b.preferredDate) || null,
      message: str(b.message) || null,
    });
  } catch (err) {
    console.error("Erreur insertion booking:", err);
    return NextResponse.json({ error: "Erreur d'enregistrement, réessayez" }, { status: 500 });
  }

  return NextResponse.json({ reference, status: "nouvelle" }, { status: 201 });
}
