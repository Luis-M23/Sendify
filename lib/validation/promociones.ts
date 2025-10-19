import * as z from "zod";

export const PromocionSchema = z.object({
  id: z.number({ message: "Debe ser un digito" }).optional(),
  codigo: z.string().min(3, "El código debe tener al menos 3 caracteres"),
  titulo: z.string().min(3, "El título debe tener al menos 3 caracteres"),
  descripcion: z.string().optional().nullable(),
  fecha_inicio: z.date({ message: "La fecha de inicio es requerida" }),
  fecha_fin: z.date({ message: "La fecha de fin es requerida" }),
  activo: z.boolean().default(true),
  envio_gratis: z.boolean().default(true),
  uso_actual: z.number().min(0).max(1000000).default(0),
  porcentaje_descuento: z
    .number({ message: "Debe ser un digito" })
    .min(1, "El porcentaje debe ser mayor a 1")
    .max(100, "El porcentaje no debe superar el 100%")
    .default(0),
  restricciones_categorias: z
    .array(z.union([z.number(), z.string()]))
    .nullable(),
  created_at: z.string().optional(),
});

export const CrearPromocionSchema = PromocionSchema.omit({
  id: true,
  created_at: true,
});

export const ActualizarPromocionSchema = PromocionSchema.partial().omit({
  created_at: true,
});

export type Promocion = z.infer<typeof PromocionSchema>;
export type CrearPromocion = z.infer<typeof CrearPromocionSchema>;
export type ActualizarPromocion = z.infer<typeof ActualizarPromocionSchema>;
