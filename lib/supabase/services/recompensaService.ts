import { createClient } from "../client";
import {
  RecompensaData,
  CrearRecompensaData,
} from "@/lib/validation/recompensa";
import { supabaseErrorMap } from "../errorMap";

const supabase = createClient();
const TABLE_NAME = "recompensas";

export const RecompensaService = {
  async getAll(): Promise<RecompensaData[]> {
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

    return data as RecompensaData[];
  },

  async getById(id: number): Promise<RecompensaData | null> {
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

    return data as RecompensaData;
  },

  async create(data: CrearRecompensaData): Promise<RecompensaData> {
    const { data: created, error } = await supabase
      .from(TABLE_NAME)
      .insert(data)
      .select()
      .single();

    if (error) {
      throw new Error(
        supabaseErrorMap[error.code] ||
          "Error al registrar la nueva recompensa"
      );
    }

    return created as RecompensaData;
  },

  async update(data: RecompensaData): Promise<RecompensaData> {
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

    return updated as RecompensaData;
  },

  async delete(id: number): Promise<boolean> {
    const { error } = await supabase
      .from(TABLE_NAME)
      .delete()
      .eq("id", id);

    if (error) {
      throw new Error(
        supabaseErrorMap[error.code] ||
          "Error al eliminar la recompensa seleccionada"
      );
    }

    return true;
  },
};
