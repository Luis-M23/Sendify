// lib/supabase/services/usuarioService.ts
import { RolesSistema } from "@/lib/enum";
import { createAdminClient } from "../admin";
import { supabaseErrorMap } from "../errorMap";

export type UserRow = {
  id: string;
  email: string;
  rol: RolesSistema;
  activo: boolean;
};

const supabase = createAdminClient();

export const UsuarioService = {
  // Obtener todos los usuarios
  async getAll(): Promise<UserRow[]> {
    const { data, error } = await supabase.auth.admin.listUsers();
    if (error) throw new Error(supabaseErrorMap[error.code] || "Error al obtener usuarios");

    return data.map((u) => ({
      id: u.id,
      email: u.email ?? "",
      role: (u.user_metadata?.role as UserRow["role"]) || "cliente",
      activo: !(u?.disabled ?? false), // Supabase marca usuarios inactivos como disabled
    }));
  },

  // Obtener un usuario por ID
  async getById(id: string): Promise<UserRow | null> {
    const { data, error } = await supabase.auth.admin.getUserById(id);
    if (error) throw new Error(supabaseErrorMap[error.code] || "Error al obtener usuario");

    if (!data) return null;

    return {
      id: data.id,
      email: data.email ?? "",
      rol: (data.user_metadata?.role as UserRow["role"]) || "cliente",
      activo: !(data.disabled ?? false),
    };
  },

  // Actualizar rol de un usuario
  async updateRole(id: string, role: UserRow["role"]): Promise<UserRow> {
    const { data, error } = await supabase.auth.admin.updateUserById(id, {
      user_metadata: { role },
    });
    if (error) throw new Error(supabaseErrorMap[error.code] || "Error al actualizar rol");

    return {
      id: data.id,
      email: data.email ?? "",
      role: (data.user_metadata?.role as UserRow["role"]) || "cliente",
      activo: !(data.disabled ?? false),
    };
  },

  // Activar / desactivar usuario
  async setActive(id: string, activo: boolean): Promise<UserRow> {
    const { data, error } = await supabase.auth.admin.updateUserById(id, {
      disabled: !activo,
    });
    if (error) throw new Error(supabaseErrorMap[error.code] || "Error al actualizar estado");

    return {
      id: data.id,
      email: data.email ?? "",
      role: (data.user_metadata?.role as UserRow["role"]) || "cliente",
      activo: !(data.disabled ?? false),
    };
  },
};
