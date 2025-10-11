import { z } from "zod";

export const FactorConversionSchema = z.object({
  id: z.number(),
  nombre: z.string(),
  divisor_vol: z
    .number()
    .min(1, { message: "El divisor debe ser mayor a 0" })
    .max(20000, { message: "El divisor no puede ser mayor a 20000" }),
});

export type FactorConversionData = z.infer<typeof FactorConversionSchema>;
