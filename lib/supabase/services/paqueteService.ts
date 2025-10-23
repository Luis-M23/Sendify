import { UsuarioMetadata } from "@/lib/validation/usuarioMetadata";
import { createClient } from "../client";
import { supabaseErrorMap } from "../errorMap";
import { Paquete, PaqueteSchema } from "@/lib/validation/paquete";

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
      .order("id", { ascending: false });

    if (error) {
      throw new Error(
        supabaseErrorMap[error.code] || "Error al obtener los paquetes."
      );
    }

    return (data ?? []).map(parsePaquete);
  },

  async getById(id: number): Promise<Paquete | null> {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select("*")
      .eq("id", id)
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

  async getByUserId(userId: string): Promise<Paquete[]> {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select("*")
      .eq("id_usuario", userId)
      .order("id", { ascending: false });

    if (error) {
      throw new Error(
        supabaseErrorMap[error.code] ||
          "Error al obtener los paquetes del usuario."
      );
    }

    return (data ?? []).map(parsePaquete);
  },

  async create(user: UsuarioMetadata, payload: Paquete): Promise<Paquete> {
    const paquete = parsePaquete(payload);

    const { data, error } = await supabase
      .from(TABLE_NAME)
      .insert({ id_usuario: user.id_usuario, ...paquete })
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
    const activo = estadoSeguimiento.some((estado) => estado.activo);

    const { data, error } = await supabase
      .from(TABLE_NAME)
      .update({ estado_seguimiento: estadoSeguimiento, activo })
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

  async getTotalCount(): Promise<number> {
    const { count, error } = await supabase
      .from(TABLE_NAME)
      .select("*", { count: "exact", head: true });

    if (error) {
      throw new Error(
        supabaseErrorMap[error.code] ||
          "Error al obtener el total de paquetes procesados."
      );
    }

    return count ?? 0;
  },
};
