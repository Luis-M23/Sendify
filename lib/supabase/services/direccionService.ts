import { createClient } from "../client";
import {
  Direccion,
  DireccionDistrito,
  CrearDireccion,
} from "@/lib/validation/direccion";
import { supabaseErrorMap } from "../errorMap";

const supabase = createClient();
const TABLE_NAME = "direcciones";

export const DireccionService = {
  async getAll(): Promise<DireccionDistrito[]> {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select("*, distritos(*)")
      .order("id");

    if (error) {
      throw new Error(
        supabaseErrorMap[error.code] ||
          "Error al obtener las direcciones de los locales"
      );
    }

    return data as DireccionDistrito[];
  },

  async getById(id: number): Promise<Direccion | null> {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      throw new Error(
        supabaseErrorMap[error.code] || "Error al obtener la dirección"
      );
    }

    return data as Direccion;
  },

  async create(data: CrearDireccion): Promise<Direccion> {
    const { data: created, error } = await supabase
      .from(TABLE_NAME)
      .insert(data)
      .select()
      .single();

    if (error) {
      throw new Error(
        supabaseErrorMap[error.code] || "Error al registrar la dirección"
      );
    }

    return created as Direccion;
  },

  async update(data: Direccion): Promise<Direccion> {
    const { id, created_at, ...rest } = data;

    const { data: updated, error } = await supabase
      .from(TABLE_NAME)
      .update(rest)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error(error);
      throw new Error(
        supabaseErrorMap[error.code] || "Error al actualizar la dirección"
      );
    }

    return updated as Direccion;
  },

  async delete(id: number): Promise<boolean> {
    const { error } = await supabase
      .from(TABLE_NAME)
      .update({ activo: false })
      .eq("id", id);

    if (error) {
      throw new Error(
        supabaseErrorMap[error.code] || "Error al desactivar la dirección"
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
        supabaseErrorMap[error.code] || "Error al restaurar la dirección"
      );
    }

    return true;
  },

  async countActivas(): Promise<number> {
    const { count, error } = await supabase
      .from(TABLE_NAME)
      .select("*", { count: "exact", head: true })
      .eq("activo", true);

    if (error) {
      throw new Error(
        supabaseErrorMap[error.code] ||
          "Error al contar las direcciones activas"
      );
    }

    return count ?? 0;
  },
};
