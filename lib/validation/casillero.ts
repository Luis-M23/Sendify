import { z } from "zod";

export const DistritoSchema = z.object({
  id: z.number(),
  departamento: z.string(),
  municipio: z.string(),
  distrito: z.string(),
  created_at: z.string(),
});
export type Distrito = z.infer<typeof DistritoSchema>;

export const CasilleroSchema = z.object({
  id: z.number(),
  id_distrito: z.number().optional(), 
  direccion: z
    .string()
    .min(5, { message: "La dirección debe tener al menos 5 caracteres" }),
  horario_atencion: z
    .string()
    .min(5, {
      message: "El horario de atención debe tener al menos 5 caracteres",
    }),
  activo: z.boolean().optional(),
  created_at: z.string().optional(),
});
export type Casillero = z.infer<typeof CasilleroSchema>;

export const CrearCasilleroSchema = CasilleroSchema.omit({
  id: true,
  created_at: true,
});
export type CrearCasillero = z.infer<typeof CrearCasilleroSchema>;

export const CasilleroCompletoSchema = CasilleroSchema.extend({
  distritos: DistritoSchema,
});
export type CasilleroCompleto = z.infer<typeof CasilleroCompletoSchema>;