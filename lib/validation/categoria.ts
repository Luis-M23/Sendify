import { z } from "zod";

export const CrearCategoriaSchema = z.object({
  nombre: z.string().min(1, "El nombre es obligatorio"),
  descripcion: z.string().min(1, "La descripción es obligatoria"),
  aereo: z
    .number()
    .min(
      1,
      "Valor inválido. Use 1 = prohibido, 2 = permitido o 3 = requiere permiso"
    )
    .max(
      3,
      "Valor inválido. Use 1 = prohibido, 2 = permitido o 3 = requiere permiso"
    ),
  terrestre: z
    .number()
    .min(
      1,
      "Valor inválido. Use 1 = prohibido, 2 = permitido o 3 = requiere permiso"
    )
    .max(
      3,
      "Valor inválido. Use 1 = prohibido, 2 = permitido o 3 = requiere permiso"
    ),
  maritimo: z
    .number()
    .min(
      1,
      "Valor inválido. Use 1 = prohibido, 2 = permitido o 3 = requiere permiso"
    )
    .max(
      3,
      "Valor inválido. Use 1 = prohibido, 2 = permitido o 3 = requiere permiso"
    ),
  notas: z.string().optional().nullable(),
  activo: z.boolean().default(true),
});

export const CategoriaSchema = CrearCategoriaSchema.extend({
  id: z.number(),
  created_at: z.string().optional(),
});

export type CrearCategoria = z.infer<typeof CrearCategoriaSchema>;
export type Categoria = z.infer<typeof CategoriaSchema>;
