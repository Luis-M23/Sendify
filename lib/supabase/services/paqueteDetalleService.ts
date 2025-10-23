import { createClient } from "../client";
import { supabaseErrorMap } from "../errorMap";
import {
  PaqueteDetalle,
  PaqueteDetalleSchema,
} from "@/lib/validation/paquete";

const supabase = createClient();
const TABLE_NAME = "paquetes";

const DETAIL_SELECT = `
  *,
  casillero:casilleros(*),
  categoria:categorias(*),
  tipo_servicio:tipo_servicio(*),
  usuario_metadata:usuario_metadata(*)
`;

const parseDetalle = (payload: unknown): PaqueteDetalle => {
  const result = PaqueteDetalleSchema.safeParse(payload);

  if (!result.success) {
    console.error(
      "Respuesta de detalle de paquete inválida:",
      result.error.flatten()
    );
    throw new Error(
      "Los datos del detalle de paquete no tienen el formato esperado."
    );
  }

  return result.data;
};

const handleSingleError = (code?: string) => {
  if (code === "PGRST116") {
    return null;
  }

  throw new Error(
    (code && supabaseErrorMap[code]) ||
      "Error al obtener el detalle del paquete."
  );
};

export const PaqueteDetalleService = {
  async getById(id: number): Promise<PaqueteDetalle | null> {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select(DETAIL_SELECT)
      .eq("id", id)
      .maybeSingle();

    if (error) {
      return handleSingleError(error.code);
    }

    return data ? parseDetalle(data) : null;
  },

  async getByCodigo(codigo: string): Promise<PaqueteDetalle | null> {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select(DETAIL_SELECT)
      .eq("codigo", codigo)
      .maybeSingle();

    if (error) {
      return handleSingleError(error.code);
    }

    return data ? parseDetalle(data) : null;
  },

  async getByUserId(userId: string): Promise<PaqueteDetalle[]> {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select(DETAIL_SELECT)
      .eq("id_usuario", userId)
      .order("id", { ascending: false });

    if (error) {
      throw new Error(
        supabaseErrorMap[error.code] ||
          "Error al obtener los detalles de paquetes del usuario."
      );
    }

    return (data ?? []).map(parseDetalle);
  },

  async getAll(): Promise<PaqueteDetalle[]> {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select(DETAIL_SELECT)
      .order("id", { ascending: false });

    if (error) {
      throw new Error(
        supabaseErrorMap[error.code] ||
          "Error al obtener los detalles de los paquetes."
      );
    }

    return (data ?? []).map(parseDetalle);
  },
};

