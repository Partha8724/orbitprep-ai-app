import { redirect } from "next/navigation";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Profile } from "@/lib/types";

function fallbackProfileFromUser(user: Awaited<ReturnType<typeof getCurrentUser>>): Profile {
  if (!user) {
    throw new Error("Cannot create a fallback profile without a user.");
  }

  return {
    id: user.id,
    full_name: user.user_metadata?.full_name || user.email?.split("@")[0] || "Student",
    email: user.email || "",
    role: "student",
    is_premium: false,
    created_at: user.created_at,
  } as Profile;
}

function isMissingProfilesTableError(error: { code?: string; message?: string }) {
  return (
    error.code === "PGRST205" ||
    error.message?.toLowerCase().includes("could not find the table 'public.profiles'") ||
    error.message?.toLowerCase().includes("relation \"public.profiles\" does not exist")
  );
}

export async function getCurrentUser() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  return user;
}

export async function getCurrentProfile() {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  const supabase = await createSupabaseServerClient();
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("id, full_name, email, role, is_premium, created_at")
      .eq("id", user.id)
      .single();

    if (error) {
      if (!isMissingProfilesTableError(error)) {
        console.warn(`Profile fetch failed; using auth user fallback: ${error.message}`);
      }

      return fallbackProfileFromUser(user);
    }

    return data as Profile;
  } catch (err) {
    console.warn("Unexpected profile fallback:", err);
    return fallbackProfileFromUser(user);
  }
}

export async function requireProfile() {
  const profile = await getCurrentProfile();

  if (!profile) {
    redirect("/login");
  }

  return profile;
}

export async function redirectIfAuthenticated() {
  const user = await getCurrentUser();

  if (user) {
    redirect("/dashboard");
  }
}

export async function requireAdminProfile() {
  const profile = await requireProfile();

  if (profile.role !== "admin") {
    redirect("/dashboard");
  }

  return profile;
}
