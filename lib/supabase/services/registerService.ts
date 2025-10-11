import { createClient } from "../client";
import { supabaseErrorMap } from "../errorMap";
import { RegisterData } from "@/lib/validation/register";
import type { AuthError } from "@supabase/supabase-js";

const supabase = createClient();

export async function registerService({
  nombre,
  email,
  password,
}: RegisterData) {
  const { error }: { error: AuthError | null } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { nombre },
    },
  });

  if (error) {
    const translated =
      (error.code && supabaseErrorMap[error.code]) ||
      "Ocurrió un error, intenta de nuevo";
    throw new Error(translated);
  }

  return true;
}
