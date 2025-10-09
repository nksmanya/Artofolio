import { Session } from "next-auth";

export function isMainAdmin(session: Session | null): boolean {
  const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase();
  const userEmail = (session?.user?.email || "").toLowerCase();
  return !!adminEmail && userEmail === adminEmail;
}


