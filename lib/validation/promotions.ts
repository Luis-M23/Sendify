import * as z from "zod"

export const promotionSchema = z.object({
  id: z.number().optional(),
  titulo: z.string().min(3, "El título debe tener al menos 3 caracteres"),
  descripcion: z.string().optional().nullable(),
  fecha_inicio: z.string().min(1, "La fecha de inicio es requerida"),
  fecha_fin: z.string().min(1, "La fecha de fin es requerida"),
  activo: z.boolean().default(true),
  uso_actual: z.number().min(0).default(0),
  uso_max: z.number().min(0).default(0),
  restricciones: z.array(z.number()).optional().nullable(),
  created_at: z.string().optional(),
})

export const createPromotionSchema = promotionSchema.omit({ id: true, uso_actual: true, created_at: true })
export const updatePromotionSchema = promotionSchema.partial().required({ id: true })

export type Promotion = z.infer<typeof promotionSchema>
export type CreatePromotion = z.infer<typeof createPromotionSchema>
export type UpdatePromotion = z.infer<typeof updatePromotionSchema>

// Aliases for consistency with other services
export type PromocionData = Promotion
export type CrearPromocionData = CreatePromotion
