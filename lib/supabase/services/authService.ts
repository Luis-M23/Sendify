import { createClient } from "../client";
import { supabaseErrorMap } from "../errorMap";
import { LoginData } from "@/lib/validation/login";
import type { AuthError } from "@supabase/supabase-js";

const supabase = createClient();

const translateError = (error: AuthError | null, fallback: string) => {
  if (!error) return null;
  if (error.code && supabaseErrorMap[error.code]) {
    return supabaseErrorMap[error.code];
  }
  return fallback;
};

export const AuthService = {
  async login({ email, password }: LoginData): Promise<void> {
    const { error }: { error: AuthError | null } =
      await supabase.auth.signInWithPassword({ email, password });

    const translated = translateError(
      error,
      "Ocurrió un error, intenta de nuevo"
    );

    if (translated) {
      throw new Error(translated);
    }
  },

  async logout(): Promise<void> {
    const { error }: { error: AuthError | null } =
      await supabase.auth.signOut();

    const translated = translateError(
      error,
      "Ocurrió un error al cerrar sesión"
    );

    if (translated) {
      throw new Error(translated);
    }
  },
};
