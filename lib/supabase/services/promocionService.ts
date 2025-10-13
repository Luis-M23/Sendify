import { createClient } from "../client";
import {
  PromocionData,
  CrearPromocionData,
  UpdatePromotion,
} from "@/lib/validation/promotions";

import { supabaseErrorMap } from "../errorMap";

const supabase = createClient();

export const PromocionService = {
  async getAll(): Promise<PromocionData[]> {
    const { data, error } = await supabase
      .from("promociones")
      .select("*")
      .eq("activo", true)
      .order("created_at", { ascending: false });
    if (error)
      throw new Error(
        supabaseErrorMap[error.code] || "Error al obtener promociones"
      );
    return data as PromocionData[];
  },

  async getAllIncludingInactive(): Promise<PromocionData[]> {
    const { data, error } = await supabase
      .from("promociones")
      .select("*")
      .order("created_at", { ascending: false });
    if (error)
      throw new Error(
        supabaseErrorMap[error.code] || "Error al obtener promociones"
      );
    return data as PromocionData[];
  },

  async getById(id: number): Promise<PromocionData | null> {
    const { data, error } = await supabase
      .from("promociones")
      .select("*")
      .eq("id", id)
      .single();
    if (error) {
      if (error.code === 'PGRST116') {
        return null; // No se encontró el registro
      }
      throw new Error(
        supabaseErrorMap[error.code] || "Error al obtener promoción"
      );
    }
    return data as PromocionData;
  },

  async create(data: CrearPromocionData): Promise<PromocionData> {
    const { data: newData, error } = await supabase
      .from("promociones")
      .insert({
        ...data,
        uso_actual: 0,
        restricciones: data.restricciones || null,
      })
      .select()
      .single();
    if (error)
      throw new Error(
        supabaseErrorMap[error.code] || "Error al crear promoción"
      );
    return newData as PromocionData;
  },

  async update(id: number, data: UpdatePromotion): Promise<PromocionData> {
    const updateData = {
      ...data,
      // Ensure restricciones is properly handled as null or array
      restricciones: data.restricciones || null,
    };
    const { data: updatedData, error } = await supabase
      .from("promociones")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();
    if (error)
      throw new Error(
        supabaseErrorMap[error.code] || "Error al actualizar promoción"
      );
    return updatedData as PromocionData;
  },

  async delete(id: number): Promise<boolean> {
    const { error } = await supabase
      .from("promociones")
      .update({ activo: false })
      .eq("id", id);
    if (error)
      throw new Error(
        supabaseErrorMap[error.code] || "Error al eliminar promoción"
      );
    return true;
  },

  async restore(id: number): Promise<boolean> {
    const { error } = await supabase
      .from("promociones")
      .update({ activo: true })
      .eq("id", id);
    if (error)
      throw new Error(
        supabaseErrorMap[error.code] || "Error al restaurar promoción"
      );
    return true;
  },

  async incrementUsage(id: number): Promise<boolean> {
    // Nota: Necesitas crear esta función RPC en Supabase:
    // CREATE OR REPLACE FUNCTION increment_promotion_usage(promotion_id INTEGER)
    // RETURNS BOOLEAN AS $$
    // BEGIN
    //   UPDATE promociones 
    //   SET uso_actual = uso_actual + 1 
    //   WHERE id = promotion_id;
    //   RETURN FOUND;
    // END;
    // $$ LANGUAGE plpgsql;
    
    const { error } = await supabase.rpc('increment_promotion_usage', {
      promotion_id: id
    });
    if (error)
      throw new Error(
        supabaseErrorMap[error.code] || "Error al incrementar uso de promoción"
      );
    return true;
  },

  async getActivePromotions(): Promise<PromocionData[]> {
    const now = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
    const { data, error } = await supabase
      .from("promociones")
      .select("*")
      .eq("activo", true)
      .lte("fecha_inicio", now)
      .gte("fecha_fin", now)
      .order("created_at", { ascending: false });
    if (error)
      throw new Error(
        supabaseErrorMap[error.code] || "Error al obtener promociones activas"
      );
    return data as PromocionData[];
  },

  async search(query: string): Promise<PromocionData[]> {
    const { data, error } = await supabase
      .from("promociones")
      .select("*")
      .eq("activo", true)
      .or(`titulo.ilike.%${query}%,descripcion.ilike.%${query}%`)
      .order("created_at", { ascending: false });
    if (error)
      throw new Error(
        supabaseErrorMap[error.code] || "Error al buscar promociones"
      );
    return data as PromocionData[];
  },
};
