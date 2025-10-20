import { createClient } from "../client";
import { supabaseErrorMap } from "../errorMap";
import { RegistroData } from "@/lib/validation/registro";
import type { AuthError } from "@supabase/supabase-js";

const supabase = createClient();

export async function registerService({
  nombre,
  email,
  password,
}: RegistroData) {
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

  try {
    await supabase.auth.signOut();
  } catch (error) {
    throw new Error("Error al cerrar sesión");
  }

  return true;
}
