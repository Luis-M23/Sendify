import * as z from "zod";

export const CalculadoraSchema = z.object({
  id_direccion: z.nullable(
    z
      .number({
        invalid_type_error: "Selecciona una dirección válida",
      })
      .positive("Selecciona una dirección válida")
  ),
  id_casillero: z
    .nullable(z.number())
    .refine((val) => val !== null && val !== 0, {
      message: "Debe seleccionar el casillero",
    }),
  id_categoria: z
    .nullable(z.number())
    .refine((val) => val !== null && val !== 0, {
      message: "Debe seleccionar la categoría",
    }),
  id_tipo_transporte: z
    .nullable(z.number())
    .refine((val) => val !== null && val !== 0, {
      message: "Debe seleccionar la categoría",
    }),
  producto: z.string().min(5, "Debe describir la compra (mínimo 5 caracteres)"),
  peso: z.coerce
    .number({ invalid_type_error: "El peso debe ser un número." })
    .min(1, "El peso debe ser mayor a 0 kg")
    .max(1000, "El peso no puede exceder 1000 kg"),
  largo: z.coerce
    .number({ invalid_type_error: "El largo debe ser un número entero." })
    .int("El largo debe ser un número entero.")
    .min(1, "El largo debe ser mayor a 0 cm")
    .max(500, "El largo no puede exceder 500 cm"),
  ancho: z.coerce
    .number({ invalid_type_error: "El ancho debe ser un número entero." })
    .int("El ancho debe ser un número entero.")
    .min(1, "El ancho debe ser mayor a 0 cm")
    .max(500, "El ancho no puede exceder 500 cm"),
  alto: z.coerce
    .number({ invalid_type_error: "El alto debe ser un número entero." })
    .int("El alto debe ser un número entero.")
    .min(1, "El alto debe ser mayor a 0 cm")
    .max(500, "El alto no puede exceder 500 cm"),
});

export type Calculadora = z.infer<typeof CalculadoraSchema>;
