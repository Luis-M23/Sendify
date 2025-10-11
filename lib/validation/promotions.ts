import * as z from "zod"

export const promotionSchema = z.object({
  id: z.string().optional(),
  nombre: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  descripcion: z.string().min(10, "La descripción debe tener al menos 10 caracteres"),
  tipo: z.enum(["descuento", "envio-gratis", "volumen", "temporada"]),
  valor: z.number().min(0, "El valor debe ser mayor o igual a 0"),
  tipoValor: z.enum(["porcentaje", "fijo"]),
  fechaInicio: z.string().min(1, "La fecha de inicio es requerida"),
  fechaFin: z.string().min(1, "La fecha de fin es requerida"),
  condiciones: z.object({
    paisOrigen: z.array(z.string()).optional(),
    paisDestino: z.array(z.string()).optional(),
    servicio: z.array(z.enum(["aereo", "terrestre", "maritimo"])).optional(),
    pesoMinimo: z.number().min(0).optional(),
    pesoMaximo: z.number().min(0).optional(),
    nivelVIP: z.array(z.enum(["cliente", "vip-bronce", "vip-plata", "vip-oro", "vip-platino"])).optional(),
  }).optional(),
  activo: z.boolean().default(true),
  codigoPromocional: z.string().optional(),
  limiteUsos: z.number().min(1).optional(),
  usosActuales: z.number().min(0).default(0),
})

export const createPromotionSchema = promotionSchema.omit({ id: true, usosActuales: true })
export const updatePromotionSchema = promotionSchema.partial().required({ id: true })

export type Promotion = z.infer<typeof promotionSchema>
export type CreatePromotion = z.infer<typeof createPromotionSchema>
export type UpdatePromotion = z.infer<typeof updatePromotionSchema>
