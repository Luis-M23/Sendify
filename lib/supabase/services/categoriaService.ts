import { createClient } from "../client";
import {
  CategoriaData,
  CrearCategoriaData,
} from "@/lib/validation/categoria";

import { supabaseErrorMap } from "../errorMap";

const supabase = createClient();

export const CategoriaService = {
  async getAll(): Promise<CategoriaData[]> {
    const { data, error } = await supabase
      .from("categorias")
      .select("*")
      .order("id");
    if (error)
      throw new Error(
        supabaseErrorMap[error.code] || "Error al obtener categorías"
      );
    return data as CategoriaData[];
  },

  async getById(id: number): Promise<CategoriaData | null> {
    const { data, error } = await supabase
      .from("categorias")
      .select("*")
      .eq("id", id)
      .single();
    if (error)
      throw new Error(
        supabaseErrorMap[error.code] || "Error al obtener categoría"
      );
    return data as CategoriaData;
  },

  async create(data: CrearCategoriaData): Promise<CategoriaData> {
    const { data: newData, error } = await supabase
      .from("categorias")
      .insert(data)
      .select()
      .single();
    if (error)
      throw new Error(
        supabaseErrorMap[error.code] || "Error al crear categoría"
      );
    return newData as CategoriaData;
  },

  async update(data: CategoriaData): Promise<CategoriaData> {
    const { id } = data;
    const { data: updated, error } = await supabase
      .from("categorias")
      .update(data)
      .eq("id", id)
      .select()
      .single();
    if (error)
      throw new Error(
        supabaseErrorMap[error.code] || "Error al actualizar categoría"
      );
    return updated as CategoriaData;
  },

  async delete(id: number): Promise<boolean> {
    const { error } = await supabase
      .from("categorias")
      .update({ activo: false })
      .eq("id", id);
    if (error)
      throw new Error(
        supabaseErrorMap[error.code] || "Error al eliminar categoría"
      );
    return true;
  },

  async restore(id: number): Promise<boolean> {
    const { error } = await supabase
      .from("categorias")
      .update({ activo: true })
      .eq("id", id);
    if (error)
      throw new Error(
        supabaseErrorMap[error.code] || "Error al restaurar categoría"
      );
    return true;
  },
};
