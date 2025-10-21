import * as z from "zod";
import { CalculadoraSchema } from "./calculadora";
import { EstadoSeguimientoSchema } from "./estadoEnvio";
import { CasilleroSchema } from "./casillero";
import { CategoriaSchema } from "./categoria";
import { TipoServicioSchema } from "./tipoServicio";
import { UsuarioMetadataSchema } from "./usuarioMetadata";

export const FacturaItemSchema = z.object({
  clave: z.string().min(1, "La clave es obligatoria"),
  valor: z.string().min(1, "El valor es obligatorio"),
  prioridad: z.enum(["default", "important", "promo"], {
    required_error: "La prioridad es obligatoria",
    invalid_type_error: "Prioridad inválida",
  }),
});

export const FacturaSchema = z.array(FacturaItemSchema);

export const PaqueteSchema = z
  .object({
    id: z.number().optional(),
    codigo: z.string(),
    total: z.number(),
    factura: FacturaSchema,
    estado_seguimiento: z.array(EstadoSeguimientoSchema),
    activo: z.boolean().default(true),
    created_at: z.string().optional(),
  })
  .merge(CalculadoraSchema);

export type Paquete = z.infer<typeof PaqueteSchema>;

export const PaqueteDetalleSchema = PaqueteSchema.extend({
  casillero: CasilleroSchema.optional().nullable(),
  categoria: CategoriaSchema.optional().nullable(),
  tipo_servicio: TipoServicioSchema.optional().nullable(),
  usuario_metadata: UsuarioMetadataSchema.optional().nullable(),
});

export type PaqueteDetalle = z.infer<typeof PaqueteDetalleSchema>;
