"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { getSettingsSessionValue, SETTINGS_COOKIE_NAME } from "@/lib/settings-auth";
import { verifySettingsPassword } from "@/lib/model-config";

export async function unlockSettings(formData: FormData) {
  const password = String(formData.get("password") ?? "");

  if (!verifySettingsPassword(password)) {
    redirect("/settings?error=1");
  }

  const cookieStore = await cookies();
  cookieStore.set(SETTINGS_COOKIE_NAME, getSettingsSessionValue(), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8,
  });

  redirect("/settings");
}

export async function lockSettings() {
  const cookieStore = await cookies();
  cookieStore.delete(SETTINGS_COOKIE_NAME);
}
