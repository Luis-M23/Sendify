import { createClient } from "../client";
import { supabaseErrorMap } from "../errorMap";
import { LoginData } from "@/lib/validation/login";
import { ChangePasswordData } from "@/lib/validation/password";
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

  async changePassword({
    current_password,
    new_password,
  }: ChangePasswordData): Promise<void> {
    const {
      data: { user },
      error: getUserError,
    } = await supabase.auth.getUser();

    if (getUserError) {
      throw new Error("Error al obtener la sesión");
    }

    const { error: verifyError }: { error: AuthError | null } =
      await supabase.auth.signInWithPassword({
        email: user?.email || "",
        password: current_password,
      });

    if (verifyError) {
      throw new Error("La credencial es inválida");
    }

    const { error: updateError }: { error: AuthError | null } =
      await supabase.auth.updateUser({ password: new_password });

    const updateTranslated = translateError(
      updateError,
      "No se pudo actualizar la contraseña"
    );

    if (updateTranslated) {
      throw new Error(updateTranslated);
    }
  },

  async updateProfile({ nombre }: { nombre?: string }): Promise<void> {
    const {
      data: { user },
      error: getUserError,
    } = await supabase.auth.getUser();

    const getUserTranslated = translateError(
      getUserError,
      "No se pudo obtener la sesión del usuario"
    );

    if (getUserTranslated) {
      throw new Error(getUserTranslated);
    }

    if (!user) {
      throw new Error("No se encontró un usuario autenticado");
    }

    const { error: updateError } = await supabase.auth.updateUser({
      data: {
        ...user.user_metadata,
        nombre: nombre ?? user.user_metadata?.nombre,
      },
    });

    const updateTranslated = translateError(
      updateError,
      "No se pudo actualizar el perfil del usuario"
    );

    if (updateTranslated) {
      throw new Error(updateTranslated);
    }
  },
};
