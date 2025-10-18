import { createClient } from "../client";
import {
  Categoria,
  CrearCategoria,
} from "@/lib/validation/categoria";

import { supabaseErrorMap } from "../errorMap";

const supabase = createClient();

export const CategoriaService = {
  async getAll(): Promise<Categoria[]> {
    const { data, error } = await supabase
      .from("categorias")
      .select("*")
      .order("id");
    if (error)
      throw new Error(
        supabaseErrorMap[error.code] || "Error al obtener categorías"
      );
    return data as Categoria[];
  },

  async getById(id: number): Promise<Categoria | null> {
    const { data, error } = await supabase
      .from("categorias")
      .select("*")
      .eq("id", id)
      .single();
    if (error)
      throw new Error(
        supabaseErrorMap[error.code] || "Error al obtener categoría"
      );
    return data as Categoria;
  },

  async create(data: CrearCategoria): Promise<Categoria> {
    const { data: newData, error } = await supabase
      .from("categorias")
      .insert(data)
      .select()
      .single();
    if (error)
      throw new Error(
        supabaseErrorMap[error.code] || "Error al crear categoría"
      );
    return newData as Categoria;
  },

  async update(data: Categoria): Promise<Categoria> {
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
    return updated as Categoria;
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
