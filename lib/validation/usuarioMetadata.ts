import { z } from "zod";

export const UsuarioMetadataSchema = z.object({
  id: z.string(),
  compras_realizadas: z.number(),
  nombre_completo: z.string(),
});

export type UsuarioMetadata = z.infer<typeof UsuarioMetadataSchema>;
