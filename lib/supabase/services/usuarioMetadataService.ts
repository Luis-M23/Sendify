import {
  DireccionEntrega,
  UsuarioMetadata,
} from "@/lib/validation/usuarioMetadata";
import { createClient } from "../client";
import { supabaseErrorMap } from "../errorMap";

const supabase = createClient();
const TABLE_NAME = "usuario_metadata";

export const UsuarioMetadataService = {
  async getById(id_usuario: string): Promise<UsuarioMetadata | null> {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select("*")
      .eq("id_usuario", id_usuario)
      .single();

    if (error && error.code !== "PGRST116") {
      throw new Error(
        supabaseErrorMap[error.code] ||
          "Error al obtener los metadatos del usuario"
      );
    }

    return (data as UsuarioMetadata) || null;
  },

  async firstOrCreate(id_usuario: string): Promise<UsuarioMetadata> {
    const existente = await this.getById(id_usuario);
    if (existente) {
      return existente;
    }

    const { data, error } = await supabase
      .from(TABLE_NAME)
      .insert([{ id_usuario }])
      .select()
      .single();

    if (error) {
      throw new Error(
        supabaseErrorMap[error.code] ||
          "Error al crear el registro en usuario_metadata"
      );
    }

    return data as UsuarioMetadata;
  },

  async incrementarCompras(id_usuario: string): Promise<UsuarioMetadata> {
    const { data: usuario, error: getError } = await supabase
      .from(TABLE_NAME)
      .select("*")
      .eq("id_usuario", id_usuario)
      .single();

    if (getError) {
      throw new Error(
        supabaseErrorMap[getError.code] ||
          "Error al obtener los metadatos del usuario"
      );
    }

    const nuevoValor = (usuario?.compras_realizadas || 0) + 1;

    const { data, error: updateError } = await supabase
      .from(TABLE_NAME)
      .update({ compras_realizadas: nuevoValor })
      .eq("id_usuario", id_usuario)
      .select()
      .single();

    if (updateError) {
      throw new Error(
        supabaseErrorMap[updateError.code] ||
          "Error al incrementar compras_realizadas"
      );
    }

    return data as UsuarioMetadata;
  },

  async updateNombreCompleto(
    id_usuario: string,
    nombre_completo: string
  ): Promise<UsuarioMetadata> {
    await this.firstOrCreate(id_usuario);

    const { data, error } = await supabase
      .from(TABLE_NAME)
      .update({ nombre_completo })
      .eq("id_usuario", id_usuario)
      .select()
      .single();

    if (error) {
      throw new Error(
        supabaseErrorMap[error.code] ||
          "Error al actualizar el nombre completo del usuario"
      );
    }

    return data as UsuarioMetadata;
  },

  async updateDireccionEntrega(
    id_usuario: string,
    direccion_entrega: DireccionEntrega
  ): Promise<UsuarioMetadata> {
    await this.firstOrCreate(id_usuario);

    const { data, error } = await supabase
      .from(TABLE_NAME)
      .update({ direccion_entrega })
      .eq("id_usuario", id_usuario)
      .select()
      .single();

    if (error) {
      throw new Error(
        supabaseErrorMap[error.code] ||
          "Error al actualizar la dirección de entrega"
      );
    }

    return data as UsuarioMetadata;
  },
};
