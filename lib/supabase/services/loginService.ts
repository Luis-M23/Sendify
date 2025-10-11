import { createClient } from "../client";
import { supabaseErrorMap } from "../errorMap";
import { LoginData } from "@/lib/validation/login";
import type { AuthError } from "@supabase/supabase-js";

const supabase = createClient();

export async function loginService({ email, password }: LoginData) {
  const { error }: { error: AuthError | null } =
    await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    const translated =
      (error.code && supabaseErrorMap[error.code]) ||
      "Ocurrió un error, intenta de nuevo";
    throw new Error(translated);
  }

  return true;
}
