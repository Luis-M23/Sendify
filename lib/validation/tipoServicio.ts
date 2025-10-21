import { z } from "zod";

export const TipoServicioSchema = z
  .object({
    id: z.number(),
    nombre: z.string(),
    descripcion: z.string().optional().nullable(),
    activo: z.boolean().optional(),
    created_at: z.string().optional(),
  })
  .passthrough();

export type TipoServicio = z.infer<typeof TipoServicioSchema>;

