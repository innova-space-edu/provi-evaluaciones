export type UserRole = "teacher" | "student" | "utp" | "admin";

export function defaultRole(): UserRole {
  return "student";
}
