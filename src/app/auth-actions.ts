"use server";

import { redirect } from "next/navigation";

import { createSupabaseServerClient } from "@/lib/supabase/server";

function getString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function getAuthRedirectUrl(path: string) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_URL;

  if (!siteUrl) {
    return undefined;
  }

  const normalizedUrl = siteUrl.startsWith("http") ? siteUrl : `https://${siteUrl}`;
  return new URL(path, normalizedUrl).toString();
}

export async function loginAction(formData: FormData) {
  const email = getString(formData, "email").toLowerCase();
  const password = getString(formData, "password");

  if (!email || !password) {
    redirect("/login?error=Email%20and%20password%20are%20required");
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirect(`/login?error=${encodeURIComponent(error.message)}`);
  }

  redirect("/dashboard");
}

export async function signupAction(formData: FormData) {
  const fullName = getString(formData, "full_name");
  const email = getString(formData, "email").toLowerCase();
  const password = getString(formData, "password");

  if (!fullName || !email || !password) {
    redirect("/signup?error=Full%20name,%20email,%20and%20password%20are%20required");
  }

  if (password.length < 8) {
    redirect("/signup?error=Password%20must%20be%20at%20least%208%20characters");
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
      emailRedirectTo: getAuthRedirectUrl("/dashboard"),
    },
  });

  if (error) {
    redirect(`/signup?error=${encodeURIComponent(error.message)}`);
  }

  if (data.session && data.user) {
    const { error: profileError } = await supabase.from("profiles").upsert(
      {
        id: data.user.id,
        full_name: fullName,
        email,
      },
      {
        onConflict: "id",
        ignoreDuplicates: true,
      }
    );

    if (profileError) {
      redirect(`/signup?error=${encodeURIComponent(profileError.message)}`);
    }

    redirect("/dashboard");
  }

  redirect("/login?message=Check%20your%20email%20to%20confirm%20your%20account");
}

export async function logoutAction() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/login");
}
