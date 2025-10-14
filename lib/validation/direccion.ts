import { z } from "zod";

export const DireccionSchema = z.object({
  id: z.number(),
  codigo: z
    .string()
    .min(1, { message: "El código es obligatorio" })
    .max(10, { message: "El código no puede tener más de 10 caracteres" })
    .transform((value) => value.toUpperCase()),
  pais: z
    .string()
    .min(2, { message: "El país debe tener al menos 2 caracteres" }),
  estado: z
    .string()
    .min(2, { message: "El estado o región debe tener al menos 2 caracteres" }),
  direccion: z
    .string()
    .min(5, { message: "La dirección debe tener al menos 5 caracteres" }),
  telefono: z
    .string()
    .min(8, { message: "El teléfono debe tener al menos 8 dígitos" })
    .max(20, { message: "El teléfono no puede tener más de 20 caracteres" }),
  activo: z.boolean().optional(),
  costo_aereo: z
    .number()
    .min(0, { message: "El costo aéreo no puede ser negativo" })
    .transform((value) => Number(value.toFixed(2))),
  costo_terrestre: z
    .number()
    .min(0, { message: "El costo terrestre no puede ser negativo" })
    .transform((value) => Number(value.toFixed(2))),
  costo_maritimo: z
    .number()
    .min(0, { message: "El costo marítimo no puede ser negativo" })
    .transform((value) => Number(value.toFixed(2))),
  created_at: z.string().optional(),
});

export type DireccionData = z.infer<typeof DireccionSchema>;

export const CrearDireccionSchema = DireccionSchema.omit({
  id: true,
  created_at: true,
});

export type CrearDireccionData = z.infer<typeof CrearDireccionSchema>;
