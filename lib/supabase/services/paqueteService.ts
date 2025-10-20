import { createClient } from "../client";
import { supabaseErrorMap } from "../errorMap";
import { Paquete, PaqueteSchema } from "@/lib/validation/paquete";
import { User } from "@supabase/supabase-js";

const supabase = createClient();
const TABLE_NAME = "paquetes";

const parsePaquete = (payload: unknown): Paquete => {
  const result = PaqueteSchema.safeParse(payload);

  if (!result.success) {
    console.error("Respuesta de paquete inválida:", result.error.flatten());
    throw new Error("Los datos del paquete no tienen el formato esperado");
  }

  return result.data;
};

export const PaqueteService = {
  async getAll(): Promise<Paquete[]> {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(
        supabaseErrorMap[error.code] || "Error al obtener los paquetes."
      );
    }

    return (data ?? []).map(parsePaquete);
  },

  async getByCodigo(codigo: string): Promise<Paquete | null> {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select("*")
      .eq("codigo", codigo)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return null;
      }

      throw new Error(
        supabaseErrorMap[error.code] || "Error al obtener el paquete."
      );
    }

    return data ? parsePaquete(data) : null;
  },

  async create(user: User, payload: Paquete): Promise<Paquete> {
    const paquete = parsePaquete(payload);

    const { data, error } = await supabase
      .from(TABLE_NAME)
      .insert({ id_usuario: user.id, ...paquete })
      .select()
      .single();

    if (error) {
      throw new Error(
        supabaseErrorMap[error.code] || "Error al registrar el paquete."
      );
    }

    return parsePaquete(data);
  },

  async updateEstadoSeguimiento(
    codigo: string,
    estadoSeguimiento: Paquete["estado_seguimiento"]
  ): Promise<Paquete> {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .update({ estado_seguimiento: estadoSeguimiento })
      .eq("codigo", codigo)
      .select()
      .single();

    if (error) {
      throw new Error(
        supabaseErrorMap[error.code] ||
          "Error al actualizar el estado de seguimiento."
      );
    }

    return parsePaquete(data);
  },
};
