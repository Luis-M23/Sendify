import * as z from "zod";
import { CalculadoraSchema } from "./calculadora";
import { FactorConversionSchema } from "./factorConversion";
import { CasilleroSchema } from "./casillero";
import { CategoriaSchema } from "./categoria";
import { RecompensaSchema } from "./recompensa";
import { EstadoSeguimientoSchema } from "./estadoEnvio";

export const FacturaItemSchema = z.object({
  clave: z.string().min(1, "La clave es obligatoria"),
  valor: z.string().min(1, "El valor es obligatorio"),
  prioridad: z.enum(["default", "important", "promo"], {
    required_error: "La prioridad es obligatoria",
    invalid_type_error: "Prioridad inválida",
  }),
});

export const FacturaSchema = z.array(FacturaItemSchema);

const CotizacionBaseSchema = z.object({
  formDeclaracion: CalculadoraSchema,
  formFactorConversion: FactorConversionSchema,
  formCasillero: CasilleroSchema,
  formCategoria: CategoriaSchema,
  recompensaActual: RecompensaSchema.nullable(),

  codigo: z.string(),
  total: z.number(),
  factura: FacturaSchema,
  estado_seguimiento: z.array(EstadoSeguimientoSchema),
});

export const CotizacionSchema = CotizacionBaseSchema.pick({
  formDeclaracion: true,
  formFactorConversion: true,
  formCasillero: true,
  formCategoria: true,
  recompensaActual: true,
});

// export const CotizacionSchema = CotizacionBaseSchema.omit({
//   formDeclaracion: true,
//   formFactorConversion: true,
//   formCasillero: true,
//   formCategoria: true,
//   recompensaActual: true,
// }).merge(CalculadoraSchema);

export type Factura = z.infer<typeof FacturaSchema>;
export type FacturaItem = z.infer<typeof FacturaItemSchema>;

export type Cotizacion = z.infer<typeof CotizacionSchema>;
// export type Paquetes = z.infer<typeof Coti>;
