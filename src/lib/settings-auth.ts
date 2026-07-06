import "server-only";

import { createHash } from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const SETTINGS_COOKIE_NAME = "stars-saying-settings";

export function getSettingsSessionValue() {
  const passwordSeed = process.env.SETTINGS_PASSWORD || "settings-disabled";
  return createHash("sha256").update(`stars-saying-settings:${passwordSeed}`).digest("hex");
}

export async function isSettingsUnlocked() {
  const cookieStore = await cookies();
  return cookieStore.get(SETTINGS_COOKIE_NAME)?.value === getSettingsSessionValue();
}

export async function requireSettingsAccess() {
  if (!(await isSettingsUnlocked())) {
    redirect("/admin");
  }
}
