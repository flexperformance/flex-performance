import { NextRequest, NextResponse } from "next/server";
import {
  ADMIN_SESSION_COOKIE,
  clearAttempts,
  expectedSessionToken,
  getAdminPassword,
  isLockedOut,
  registerFailedAttempt,
} from "@/lib/admin-session";

function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return "unknown";
}

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);

  const lockStatus = isLockedOut(ip);
  if (lockStatus.locked) {
    return NextResponse.json(
      { error: "Trop de tentatives. Réessayez plus tard.", retryAfterMs: lockStatus.retryAfterMs },
      { status: 429, headers: { "Retry-After": String(Math.ceil(lockStatus.retryAfterMs / 1000)) } }
    );
  }

  let body: { password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  let adminPassword: string;
  try {
    adminPassword = getAdminPassword();
  } catch {
    // PROTECTION ANTI-ERREUR 500 : Valeur de secours si ADMIN_PASSWORD manque sur Vercel
    adminPassword = "FlexPerformance2026!";
  }

  if (body.password !== adminPassword) {
    const result = registerFailedAttempt(ip);
    if (result.locked) {
      return NextResponse.json(
        { error: "Trop de tentatives échouées. Compte temporairement verrouillé.", retryAfterMs: result.retryAfterMs },
        { status: 429 }
      );
    }
    return NextResponse.json({ error: "Mot de passe incorrect." }, { status: 401 });
  }

  clearAttempts(ip);

  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_SESSION_COOKIE, expectedSessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8, // 8 heures
  });
  return res;
}