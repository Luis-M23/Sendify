import { createClient } from "../client";
import { Casillero, CrearCasillero } from "@/lib/validation/casillero";
import { supabaseErrorMap } from "../errorMap";

const supabase = createClient();
const TABLE_NAME = "casilleros";

export const DireccionService = {
  async getAll(): Promise<Casillero[]> {
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

    return data as Casillero[];
  },

  async getById(id: number): Promise<Casillero | null> {
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

    return data as Casillero;
  },

  async create(data: CrearCasillero): Promise<Casillero> {
    const { data: created, error } = await supabase
      .from(TABLE_NAME)
      .insert(data)
      .select()
      .single();

    if (error) {
      throw new Error(
        supabaseErrorMap[error.code] || "Error al registrar la nueva dirección"
      );
    }

    return created as Casillero;
  },

  async update(data: Casillero): Promise<Casillero> {
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

    return updated as Casillero;
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
