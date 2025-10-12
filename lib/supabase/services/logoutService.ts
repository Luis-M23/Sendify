import { createClient } from "../client";
import { supabaseErrorMap } from "../errorMap";
import type { AuthError } from "@supabase/supabase-js";

const supabase = createClient();

export function logoutService(): Promise<void> {
  return supabase.auth.signOut().then(({ error }: { error: AuthError | null }) => {
    if (error) {
      const translated =
        (error.code && supabaseErrorMap[error.code]) ||
        "Ocurrió un error al cerrar sesión";
      return Promise.reject(new Error(translated));
    }
  });
}
