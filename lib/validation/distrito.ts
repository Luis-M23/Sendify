import { z } from "zod";

export const DistritoSchema = z.object({
  id: z.number(),
  departamento: z.string(),
  municipio: z.string(),
  distrito: z.string(),
  created_at: z.string(),
});

export type Distrito = z.infer<typeof DistritoSchema>;

export const DireccionSchema = z.object({
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

export type Direccion = z.infer<typeof DireccionSchema>;

export const CrearDireccionSchema = DireccionSchema.omit({
  id: true,
  created_at: true,
});

export type CrearDireccion = z.infer<typeof CrearDireccionSchema>;

export const DireccionDistritoSchema = DireccionSchema.extend({
  distritos: DistritoSchema,
});

export type DireccionDistrito = z.infer<typeof DireccionDistritoSchema>;