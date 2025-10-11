import { createClient } from "../client";
import {
  PaisData,
  CrearPaisData,
} from "@/lib/validation/pais";

import { supabaseErrorMap } from "../errorMap";

const supabase = createClient();

export const PaisService = {
  async getAll(): Promise<PaisData[]> {
    const { data, error } = await supabase
      .from("paises")
      .select("*")
      .order("id");
    if (error)
      throw new Error(
        supabaseErrorMap[error.code] || "Error al obtener países"
      );
    return data as PaisData[];
  },

  async getById(id: number): Promise<PaisData | null> {
    const { data, error } = await supabase
      .from("paises")
      .select("*")
      .eq("id", id)
      .single();
    if (error)
      throw new Error(supabaseErrorMap[error.code] || "Error al obtener país");
    return data as PaisData;
  },

  async create(data: CrearPaisData): Promise<PaisData> {
    const { data: newData, error } = await supabase
      .from("paises")
      .insert(data)
      .select()
      .single();
    if (error)
      throw new Error(supabaseErrorMap[error.code] || "Error al crear país");
    return newData as PaisData;
  },

  async update(data: PaisData): Promise<PaisData> {
    const { id } = data;
    const { data: updated, error } = await supabase
      .from("paises")
      .update(data)
      .eq("id", id)
      .select()
      .single();
    if (error)
      throw new Error(
        supabaseErrorMap[error.code] || "Error al actualizar país"
      );
    return updated as PaisData;
  },

  async delete(id: number): Promise<boolean> {
    const { error } = await supabase
      .from("paises")
      .update({ activo: false })
      .eq("id", id);
    if (error)
      throw new Error(supabaseErrorMap[error.code] || "Error al eliminar país");
    return true;
  },

  async restore(id: number): Promise<boolean> {
    const { error } = await supabase
      .from("paises")
      .update({ activo: true })
      .eq("id", id);
    if (error)
      throw new Error(supabaseErrorMap[error.code] || "Error al eliminar país");
    return true;
  },
};
