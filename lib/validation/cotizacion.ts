import * as z from "zod";
import { CalculadoraSchema } from "./calculadora";
import { FactorConversionSchema } from "./factorConversion";
import { CasilleroSchema } from "./casillero";
import { CategoriaSchema } from "./categoria";
import { RecompensaSchema } from "./recompensa";

const CotizacionBaseSchema = z.object({
  formDeclaracion: CalculadoraSchema,
  formFactorConversion: FactorConversionSchema,
  formCasillero: CasilleroSchema,
  formCategoria: CategoriaSchema,
  recompensaActual: RecompensaSchema.nullable(),

  codigo: z.string(),
  peso_volumetrico: z.number(),
  peso_facturable: z.number(),
  tarifa_aplicada: z.number(),
  tarifa: z.number(),
  descuento_aplicado: z.number(),
  descuento: z.number(),
  recompensa_aplicado: z.number(),
  recompensa: z.number(),
  total: z.number(),
});

export const CotizacionCalculoSchema = CotizacionBaseSchema.pick({
  formDeclaracion: true,
  formFactorConversion: true,
  formCasillero: true,
  formCategoria: true,
  recompensaActual: true,
});

export const CotizacionSchema = CotizacionBaseSchema.omit({
  formDeclaracion: true,
  formFactorConversion: true,
  formCasillero: true,
  formCategoria: true,
  recompensaActual: true,
}).merge(CalculadoraSchema);

export type Cotizacion = z.infer<typeof CotizacionSchema>;
export type CotizacionCalculo = z.infer<typeof CotizacionCalculoSchema>;
