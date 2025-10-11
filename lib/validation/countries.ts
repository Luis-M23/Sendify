import * as z from "zod"

export const countrySchema = z.object({
  id: z.string().optional(),
  codigo: z.string().length(2, "El código debe ser de exactamente 2 letras").toUpperCase(),
  nombre: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  nombreCompleto: z.string().min(5, "El nombre completo debe tener al menos 5 caracteres"),
  region: z.string().min(3, "La región debe tener al menos 3 caracteres"),
  moneda: z.string().length(3, "El código de moneda debe ser de exactamente 3 letras").toUpperCase(),
  activo: z.boolean().default(true),
  restricciones: z.object({
    aduana: z.boolean().default(false),
    documentacion: z.string().optional(),
    impuestos: z.number().min(0).max(100).default(0),
  }).optional(),
})

export const createCountrySchema = countrySchema.omit({ id: true })
export const updateCountrySchema = countrySchema.partial().required({ id: true })

export type Country = z.infer<typeof countrySchema>
export type CreateCountry = z.infer<typeof createCountrySchema>
export type UpdateCountry = z.infer<typeof updateCountrySchema>
