import { createClient } from "../client";
import {
  DireccionData,
  CrearDireccionData,
} from "@/lib/validation/direccion";
import { supabaseErrorMap } from "../errorMap";

const supabase = createClient();
const TABLE_NAME = "direcciones";

export const DireccionService = {
  async getAll(): Promise<DireccionData[]> {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select("*")
      .order("id");

    if (error) {
      throw new Error(
        supabaseErrorMap[error.code] ||
          "Error al obtener las direcciones de envío"
      );
    }

    return data as DireccionData[];
  },

  async getById(id: number): Promise<DireccionData | null> {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      throw new Error(
        supabaseErrorMap[error.code] ||
          "Error al obtener la dirección solicitada"
      );
    }

    return data as DireccionData;
  },

  async create(data: CrearDireccionData): Promise<DireccionData> {
    const { data: created, error } = await supabase
      .from(TABLE_NAME)
      .insert(data)
      .select()
      .single();

    if (error) {
      throw new Error(
        supabaseErrorMap[error.code] ||
          "Error al registrar la nueva dirección"
      );
    }

    return created as DireccionData;
  },

  async update(data: DireccionData): Promise<DireccionData> {
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
          "Error al actualizar la dirección seleccionada"
      );
    }

    return updated as DireccionData;
  },

  async delete(id: number): Promise<boolean> {
    const { error } = await supabase
      .from(TABLE_NAME)
      .update({ activo: false })
      .eq("id", id);

    if (error) {
      throw new Error(
        supabaseErrorMap[error.code] ||
          "Error al desactivar la dirección seleccionada"
      );
    }

    return true;
  },

  async restore(id: number): Promise<boolean> {
    const { error } = await supabase
      .from(TABLE_NAME)
      .update({ activo: true })
      .eq("id", id);

    if (error) {
      throw new Error(
        supabaseErrorMap[error.code] ||
          "Error al restaurar la dirección seleccionada"
      );
    }

    return true;
  },
};
