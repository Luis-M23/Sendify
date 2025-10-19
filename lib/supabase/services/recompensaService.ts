import { createClient } from "../client";
import { Recompensa, CrearRecompensa } from "@/lib/validation/recompensa";
import { supabaseErrorMap } from "../errorMap";

const supabase = createClient();
const TABLE_NAME = "recompensas";

export const RecompensaService = {
  async getAll(): Promise<Recompensa[]> {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select("*")
      .order("requisito_compras", { ascending: true });

    if (error) {
      throw new Error(
        supabaseErrorMap[error.code] ||
          "Error al obtener el programa de recompensas"
      );
    }

    return data as Recompensa[];
  },

  async getById(id: number): Promise<Recompensa | null> {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      throw new Error(
        supabaseErrorMap[error.code] ||
          "Error al obtener la recompensa solicitada"
      );
    }

    return data as Recompensa;
  },

  async getNivel(requisito_compras: number): Promise<Recompensa | null> {
    try {
      const { data, error } = await supabase
        .from(TABLE_NAME)
        .select("*")
        .lte("requisito_compras", requisito_compras)
        .order("requisito_compras", { ascending: false })
        .limit(1);

      if (error) {
        const mensaje =
          supabaseErrorMap[error.code] ||
          `Error al obtener el nivel de recompensa: ${error.message}`;
        throw new Error(mensaje);
      }

      if (!data || data.length === 0) {
        return null;
      }

      return data[0] as Recompensa;
    } catch (err: any) {
      console.error("Error inesperado en getNivel:", err);
      throw new Error("Error inesperado al obtener el nivel de recompensa");
    }
  },

  async create(data: CrearRecompensa): Promise<Recompensa> {
    const { data: created, error } = await supabase
      .from(TABLE_NAME)
      .insert(data)
      .select()
      .single();

    if (error) {
      throw new Error(
        supabaseErrorMap[error.code] || "Error al registrar la nueva recompensa"
      );
    }

    return created as Recompensa;
  },

  async update(data: Recompensa): Promise<Recompensa> {
    const { id, created_at, ...rest } = data;

    const { data: updated, error } = await supabase
      .from(TABLE_NAME)
      .update(rest)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw new Error(
        supabaseErrorMap[error.code] ||
          "Error al actualizar la recompensa seleccionada"
      );
    }

    return updated as Recompensa;
  },

  async delete(id: number): Promise<boolean> {
    const { error } = await supabase.from(TABLE_NAME).delete().eq("id", id);

    if (error) {
      throw new Error(
        supabaseErrorMap[error.code] ||
          "Error al eliminar la recompensa seleccionada"
      );
    }

    return true;
  },
};
