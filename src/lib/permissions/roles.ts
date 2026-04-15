import { getCurrentProfile } from "@/lib/auth";
import type { Profile, UserRole } from "@/lib/types";

export function canManageContent(role: UserRole) {
  return role === "admin" || role === "editor";
}

export async function requireApiProfile() {
  const profile = await getCurrentProfile();

  if (!profile) {
    return { profile: null, error: Response.json({ ok: false, error: { code: "UNAUTHORIZED", message: "Authentication required." } }, { status: 401 }) };
  }

  return { profile, error: null };
}

export async function requireContentManagerApi() {
  const { profile, error } = await requireApiProfile();

  if (error || !profile) {
    return { profile: null, error };
  }

  if (!canManageContent(profile.role)) {
    return { profile: null, error: Response.json({ ok: false, error: { code: "FORBIDDEN", message: "Editor or admin access required." } }, { status: 403 }) };
  }

  return { profile: profile as Profile, error: null };
}

export async function requireAdminApi() {
  const { profile, error } = await requireApiProfile();

  if (error || !profile) {
    return { profile: null, error };
  }

  if (profile.role !== "admin") {
    return { profile: null, error: Response.json({ ok: false, error: { code: "FORBIDDEN", message: "Admin access required." } }, { status: 403 }) };
  }

  return { profile, error: null };
}
