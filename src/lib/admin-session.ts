import { createHash } from "crypto";

export const ADMIN_SESSION_COOKIE = "flex_admin_session";
export const MAX_LOGIN_ATTEMPTS = 5;
export const LOCKOUT_DURATION_MS = 60 * 1000; // 1 minute

/**
 * Le mot de passe admin et le secret de session ne doivent JAMAIS être
 * préfixés par NEXT_PUBLIC_ — sinon ils sont inclus dans le bundle JS
 * envoyé au navigateur. Ils ne doivent exister que côté serveur.
 *
 * À ajouter dans .env.local :
 *   ADMIN_PASSWORD=votre_mot_de_passe
 *   ADMIN_SESSION_SECRET=une_longue_chaine_aleatoire_différente_du_mot_de_passe
 */
export function getAdminPassword(): string {
  const pwd = process.env.ADMIN_PASSWORD;
  if (!pwd) {
    throw new Error(
      "ADMIN_PASSWORD n'est pas défini côté serveur (fichier .env.local)."
    );
  }
  return pwd;
}

function getSessionSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) {
    throw new Error(
      "ADMIN_SESSION_SECRET n'est pas défini côté serveur (fichier .env.local)."
    );
  }
  return secret;
}

/** Valeur de cookie attendue pour une session admin valide. */
export function expectedSessionToken(): string {
  return createHash("sha256").update(getSessionSecret()).digest("hex");
}

export function isValidSessionToken(token: string | undefined): boolean {
  if (!token) return false;
  return token === expectedSessionToken();
}

/**
 * Limitation de tentatives en mémoire, par IP.
 * NOTE : sur un déploiement serverless multi-instances, ce compteur n'est
 * pas partagé entre instances (chacune a sa propre mémoire). Pour un
 * atelier avec un usage admin restreint, c'est suffisant en pratique.
 * Pour une protection plus robuste à grande échelle, utiliser un store
 * partagé (ex. Upstash Redis) ou un service de rate limiting dédié.
 */
type AttemptRecord = { count: number; lockedUntil: number | null };
const attempts = new Map<string, AttemptRecord>();

export function registerFailedAttempt(ip: string): { locked: boolean; retryAfterMs: number } {
  const record = attempts.get(ip) || { count: 0, lockedUntil: null };

  if (record.lockedUntil && Date.now() < record.lockedUntil) {
    return { locked: true, retryAfterMs: record.lockedUntil - Date.now() };
  }

  record.count += 1;
  if (record.count >= MAX_LOGIN_ATTEMPTS) {
    record.lockedUntil = Date.now() + LOCKOUT_DURATION_MS;
    attempts.set(ip, record);
    return { locked: true, retryAfterMs: LOCKOUT_DURATION_MS };
  }

  attempts.set(ip, record);
  return { locked: false, retryAfterMs: 0 };
}

export function isLockedOut(ip: string): { locked: boolean; retryAfterMs: number } {
  const record = attempts.get(ip);
  if (!record || !record.lockedUntil) return { locked: false, retryAfterMs: 0 };
  if (Date.now() >= record.lockedUntil) return { locked: false, retryAfterMs: 0 };
  return { locked: true, retryAfterMs: record.lockedUntil - Date.now() };
}

export function clearAttempts(ip: string): void {
  attempts.delete(ip);
}
