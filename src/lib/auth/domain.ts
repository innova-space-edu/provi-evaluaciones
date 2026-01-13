export function isAllowedDomain(email: string | null | undefined): boolean {
  if (!email) return false;
  const allowed = process.env.NEXT_PUBLIC_ALLOWED_DOMAIN!;
  return email.toLowerCase().endsWith("@" + allowed.toLowerCase());
}
