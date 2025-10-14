import { z } from "zod";

export const RecompensaSchema = z.object({
  id: z.number(),
  nivel: z.string().min(1, { message: "El nivel es obligatorio" }),
  requisito_compras: z
    .number()
    .int()
    .min(0, { message: "El requisito de compras no puede ser negativo" }),
  porcentaje_descuento: z
    .number()
    .int()
    .min(0, { message: "El descuento no puede ser negativo" })
    .max(100, { message: "El descuento no puede superar el 100%" }),
  beneficios: z.string().nullable().optional(),
  created_at: z.string().optional(),
});

export type RecompensaData = z.infer<typeof RecompensaSchema>;

export const CrearRecompensaSchema = RecompensaSchema.omit({
  id: true,
  created_at: true,
});

export type CrearRecompensaData = z.infer<typeof CrearRecompensaSchema>;
