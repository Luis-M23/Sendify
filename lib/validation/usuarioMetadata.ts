import { z } from "zod";
import { RolesSistema } from "../enum";

export const DireccionEntregaSchema = z.object({
  direccion: z.string().min(1),
  telefono: z.string().min(1),
});

export const UsuarioMetadataSchema = z.object({
  id: z.string().optional(),
  id_usuario: z.string(),
  compras_realizadas: z.number(),
  nombre_completo: z.string().nullable(),
  direccion_entrega: DireccionEntregaSchema.nullable(),
  rol: z.nativeEnum(RolesSistema),
});

export type DireccionEntrega = z.infer<typeof DireccionEntregaSchema>;
export type UsuarioMetadata = z.infer<typeof UsuarioMetadataSchema>;
