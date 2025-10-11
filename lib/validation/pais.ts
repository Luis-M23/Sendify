import { z } from "zod";

export const PaisSchema = z.object({
  id: z.number(),
  codigo: z
    .string()
    .min(2, { message: "El código debe tener al menos 2 caracteres" })
    .max(3, { message: "El código no puede tener más de 3 caracteres" })
    .transform((val) => val.toUpperCase()),
  nombre_completo: z
    .string()
    .min(2, { message: "El nombre completo debe tener al menos 2 caracteres" }),
  moneda: z
    .string()
    .min(2, { message: "El código de moneda debe tener al menos 2 caracteres" })
    .max(3, {
      message: "El código de moneda no puede tener más de 3 caracteres",
    })
    .transform((val) => val.toUpperCase()),
  activo: z.boolean().optional(),
  costo_aereo: z
    .number()
    .min(0.01, { message: "El costo aéreo no puede ser menor o igual a cero" })
    .max(1000, { message: "El costo aéreo no puede superar 1000 USD/kg" })
    .transform((val) => Number(val.toFixed(2))),
  costo_terrestre: z
    .number()
    .min(0.01, {
      message: "El costo terrestre no puede ser menor o igual a cero",
    })
    .max(1000, { message: "El costo terrestre no puede superar 1000 USD/kg" })
    .transform((val) => Number(val.toFixed(2))),
  costo_maritimo: z
    .number()
    .min(0.01, {
      message: "El costo marítimo no puede ser menor o igual a cero",
    })
    .max(1000, { message: "El costo marítimo no puede superar 1000 USD/kg" })
    .transform((val) => Number(val.toFixed(2))),
  created_at: z.string().optional(),
});

export type PaisData = z.infer<typeof PaisSchema>;

export const CrearPaisSchema = PaisSchema.omit({ id: true, created_at: true });
export type CrearPaisData = z.infer<typeof CrearPaisSchema>;
