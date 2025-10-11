import * as z from "zod"

export const categorySchema = z.object({
  id: z.string().optional(),
  nombre: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  descripcion: z.string().min(10, "La descripción debe tener al menos 10 caracteres"),
  aereo: z.enum(["permitido", "prohibido", "requiere-permiso"]),
  terrestre: z.enum(["permitido", "prohibido", "requiere-permiso"]),
  maritimo: z.enum(["permitido", "prohibido", "requiere-permiso"]),
  notas: z.string().optional(),
  activo: z.boolean().default(true),
})

export const createCategorySchema = categorySchema.omit({ id: true })
export const updateCategorySchema = categorySchema.partial().required({ id: true })

export type Category = z.infer<typeof categorySchema>
export type CreateCategory = z.infer<typeof createCategorySchema>
export type UpdateCategory = z.infer<typeof updateCategorySchema>
