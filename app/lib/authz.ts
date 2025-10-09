import { Session } from "next-auth";

export function isMainAdmin(session: Session | null): boolean {
  const configured = (process.env.ADMIN_EMAIL || process.env.NEXT_PUBLIC_ADMIN_EMAIL || "").trim().toLowerCase();
  const userEmail = (session?.user?.email || "").trim().toLowerCase();
  if (configured) return userEmail === configured;
  // Fallback: allow known owner email if env is missing
  if (userEmail === "nksmanya@gmail.com") return true;
  return false;
}

export function getConfiguredAdminEmail(): string {
  return (process.env.ADMIN_EMAIL || process.env.NEXT_PUBLIC_ADMIN_EMAIL || "").trim();
}

export function isAdmin(session: Session | null): boolean {
  const role = (session as any)?.user?.role;
  return role === 'ADMIN' || isMainAdmin(session);
}


