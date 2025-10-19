import { z } from "zod";

export const RecompensaSchema = z.object({
  id: z.number(),
  nivel: z
    .string()
    .min(1, { message: "El nivel es obligatorio" })
    .transform((value) => value.trim()),
  requisito_compras: z
    .number()
    .int()
    .min(1, { message: "El requisito de compras debe ser al menos 1" })
    .max(1000000, { message: "El requisito de compras no debe superar 1000000" }),
  porcentaje_descuento: z
    .number()
    .int()
    .min(0, { message: "El descuento no puede ser negativo" })
    .max(100, { message: "El descuento no puede superar el 100%" }),
  beneficios: z
    .string()
    .transform((value) => value.trim())
    .optional()
    .nullable(),
  created_at: z.string().optional(),
});

export type Recompensa = z.infer<typeof RecompensaSchema>;

export const CrearRecompensaSchema = RecompensaSchema.omit({
  id: true,
  created_at: true,
});

export type CrearRecompensa = z.infer<typeof CrearRecompensaSchema>;
