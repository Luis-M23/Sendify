import { createClient } from "../client";
import { supabaseErrorMap } from "../errorMap";
import {
  Notificacion,
  NotificacionSchema,
  NotificacionTipo,
} from "@/lib/validation/notificacion";

const supabase = createClient();
const TABLE_NAME = "notificaciones";

const parseNotificacion = (payload: unknown): Notificacion => {
  const result = NotificacionSchema.safeParse(payload);

  if (!result.success) {
    console.error(
      "Respuesta de notificación inválida:",
      result.error.flatten()
    );
    throw new Error(
      "Los datos de la notificación no tienen el formato esperado."
    );
  }

  return result.data;
};

export const NotificacionService = {
  async getByUserId(userId: string): Promise<Notificacion[]> {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select("*")
      .eq("id_usuario", userId)
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(
        supabaseErrorMap[error.code] ||
          "Error al obtener las notificaciones del usuario."
      );
    }

    return (data ?? []).map(parseNotificacion);
  },

  async markAsRead(id: number): Promise<void> {
    const { error } = await supabase
      .from(TABLE_NAME)
      .update({ leido: true })
      .eq("id", id);

    if (error) {
      throw new Error(
        supabaseErrorMap[error.code] ||
          "No se pudo marcar la notificación como leída."
      );
    }
  },

  async markAllAsRead(userId: string): Promise<void> {
    const { error } = await supabase
      .from(TABLE_NAME)
      .update({ leido: true })
      .eq("id_usuario", userId)
      .eq("leido", false);

    if (error) {
      throw new Error(
        supabaseErrorMap[error.code] ||
          "No se pudieron marcar las notificaciones como leídas."
      );
    }
  },

  async delete(id: number): Promise<void> {
    const { error } = await supabase
      .from(TABLE_NAME)
      .delete()
      .eq("id", id);

    if (error) {
      throw new Error(
        supabaseErrorMap[error.code] ||
          "No se pudo eliminar la notificación."
      );
    }
  },

  async deleteRead(userId: string): Promise<void> {
    const { error } = await supabase
      .from(TABLE_NAME)
      .delete()
      .eq("id_usuario", userId)
      .eq("leido", true);

    if (error) {
      throw new Error(
        supabaseErrorMap[error.code] ||
          "No se pudieron eliminar las notificaciones leídas."
      );
    }
  },

  async hasUnread(userId: string): Promise<boolean> {
    const { data, error, count } = await supabase
      .from(TABLE_NAME)
      .select("id", { count: "exact", head: true })
      .eq("id_usuario", userId)
      .eq("leido", false)
      .limit(1);

    if (error) {
      throw new Error(
        supabaseErrorMap[error.code] ||
          "Error al verificar notificaciones pendientes."
      );
    }

    if (typeof count === "number") {
      return count > 0;
    }

    return Boolean(data && data.length > 0);
  },
};
