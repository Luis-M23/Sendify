import { createClient } from "../client";
import { Casillero, CrearCasillero } from "@/lib/validation/casillero";
import { supabaseErrorMap } from "../errorMap";

const supabase = createClient();
const TABLE_NAME = "casilleros";

export const CasilleroService = {
  async getAll(): Promise<Casillero[]> {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select("*")
      .order("id");

    if (error) {
      throw new Error(
        supabaseErrorMap[error.code] ||
          "Error al obtener los casilleros de envío"
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
          "Error al obtener el casillero solicitado"
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
        supabaseErrorMap[error.code] || "Error al registrar el casillero"
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
          "Error al actualizar el casillero"
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
          "Error al desactivar el casillero"
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
          "Error al restaurar el casillero"
      );
    }

    return true;
  },

  async countActivos(): Promise<number> {
    const { count, error } = await supabase
      .from(TABLE_NAME)
      .select("*", { count: "exact", head: true })
      .eq("activo", true);

    if (error) {
      throw new Error(
        supabaseErrorMap[error.code] ||
          "Error al contar los casilleros activos"
      );
    }

    return count ?? 0;
  },
};
