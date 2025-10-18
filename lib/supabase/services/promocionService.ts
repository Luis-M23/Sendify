import { createClient } from "../client";
import {
  Promocion,
  CrearPromocion,
  ActualizarPromocion,
} from "@/lib/validation/promociones";
import { supabaseErrorMap } from "../errorMap";

const supabase = createClient();
const DEFAULT_TIMEZONE = "America/El_Salvador";

const getTodayDateString = (timeZone = DEFAULT_TIMEZONE) => {
  const now = new Date();
  const localized = new Date(now.toLocaleString("en-US", { timeZone }));
  return localized.toISOString().split("T")[0];
};

export const PromocionService = {
  async getAll(): Promise<Promocion[]> {
    const { data, error } = await supabase
      .from("promociones")
      .select("*")
      .order("id", { ascending: false });
    if (error)
      throw new Error(
        supabaseErrorMap[error.code] || "Error al obtener promociones"
      );
    return data as Promocion[];
  },

  async getById(id: number): Promise<Promocion | null> {
    const { data, error } = await supabase
      .from("promociones")
      .select("*")
      .eq("id", id)
      .single();
    if (error) {
      if (error.code === "PGRST116") return null;
      throw new Error(
        supabaseErrorMap[error.code] || "Error al obtener promoción"
      );
    }
    return data as Promocion;
  },

  async create(data: CrearPromocion): Promise<Promocion> {
    const { ...payload } = data;
    const { data: created, error } = await supabase
      .from("promociones")
      .insert(payload)
      .select()
      .single();
    if (error)
      throw new Error(
        supabaseErrorMap[error.code] || "Error al crear promoción"
      );
    return created as Promocion;
  },

  async update(data: ActualizarPromocion): Promise<Promocion> {
    const { id, ...payload } = data;
    const updateData = {
      ...payload,
      restricciones: data.restricciones_categorias || null,
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
    return updatedData as Promocion;
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
    const { error } = await supabase.rpc("increment_promotion_usage", {
      promotion_id: id,
    });
    if (error)
      throw new Error(
        supabaseErrorMap[error.code] || "Error al incrementar uso de promoción"
      );
    return true;
  },

  async promocionesActivas(): Promise<Promocion[]> {
    const today = getTodayDateString();

    const { data, error } = await supabase
      .from("promociones")
      .select("*")
      .eq("activo", true)
      .lte("fecha_inicio", today)
      .gte("fecha_fin", today)
      .order("fecha_inicio", { ascending: true });

    if (error)
      throw new Error(
        supabaseErrorMap[error.code] || "Error al obtener promociones activas"
      );

    return data as Promocion[];
  },

  async promocionesFuturas(): Promise<Promocion[]> {
    const today = getTodayDateString();

    const { data, error } = await supabase
      .from("promociones")
      .select("*")
      .eq("activo", true)
      .gt("fecha_inicio", today)
      .order("fecha_inicio", { ascending: true });

    if (error)
      throw new Error(
        supabaseErrorMap[error.code] || "Error al obtener promociones futuras"
      );
    return data as Promocion[];
  },

  async search(query: string): Promise<Promocion[]> {
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
    return data as Promocion[];
  },
};
