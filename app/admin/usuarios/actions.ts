// app/admin/users/actions.ts
"use server";

import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Obtiene todos los usuarios con sus roles y estado activo/inactivo
 */
export async function getAllUsers() {
  const supabase = createAdminClient();
  const { data, error } = await supabase.auth.admin.listUsers({
    page: 1,
    perPage: 100,
  });

  const { users } = data;

  if (error) throw new Error(error.message);

  return users.map((user) => ({
    rol: user?.app_metadata?.rol || "cliente",
    ...user,
  }));
}

/**
 * Actualiza el rol de un usuario
 */
export async function updateUserRole(userId: string, role: string) {
  const supabase = createAdminClient();

  const { error } = await supabase.auth.admin.updateUserById(userId, {
    app_metadata: { rol: role },
  });

  if (error) throw new Error(error.message);

  return true;
}

/**
 * Activa o desactiva un usuario
 */
export async function setUserActive(userId: string, active: boolean) {
  const supabase = createAdminClient();

  const { error } = await supabase.auth.admin.updateUserById(userId, {
    disabled: !active,
  });

  if (error) throw new Error(error.message);

  return true;
}
