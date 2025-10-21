import { z } from "zod";

export const NotificacionTipoSchema = z.enum(["tracking", "info", "promo"]);

export const NotificacionSchema = z.object({
  id: z.number(),
  id_usuario: z.string(),
  tipo: NotificacionTipoSchema,
  comentario: z.string(),
  leido: z.boolean(),
  created_at: z.string(),
});

export type Notificacion = z.infer<typeof NotificacionSchema>;
export type NotificacionTipo = z.infer<typeof NotificacionTipoSchema>;

