import * as z from "zod";

export const CalculadoraSchema = z.object({
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
  producto: z
    .string()
    .min(5, "Debe describir la compra (mínimo 5 caracteres)"),
  peso: z
    .string()
    .min(1, "El peso es requerido")
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "El peso debe ser mayor a 0 kg",
    })
    .refine((val) => Number(val) <= 1000, {
      message: "El peso no puede exceder 1000 kg",
    }),
  largo: z
    .string()
    .min(1, "El largo es requerido")
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "El largo debe ser mayor a 0 cm",
    })
    .refine((val) => Number(val) <= 500, {
      message: "El largo no puede exceder 500 cm",
    }),
  ancho: z
    .string()
    .min(1, "El ancho es requerido")
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "El ancho debe ser mayor a 0 cm",
    })
    .refine((val) => Number(val) <= 500, {
      message: "El ancho no puede exceder 500 cm",
    }),
  alto: z
    .string()
    .min(1, "El alto es requerido")
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "El alto debe ser mayor a 0 cm",
    })
    .refine((val) => Number(val) <= 500, {
      message: "El alto no puede exceder 500 cm",
    }),
});

export type Calculadora = z.infer<typeof CalculadoraSchema>;
