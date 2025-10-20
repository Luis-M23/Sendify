import { z } from "zod";

export const EstadoSeguimientoSchema = z.object({
  nombre: z.string(),
  activo: z.boolean(),
  fecha_actualizado: z.string().nullable(),
});


export type EstadoSeguimiento = z.infer<typeof EstadoSeguimientoSchema>;

export const EstadoSeguimientoDefault: EstadoSeguimiento[] = [
  { nombre: "Recibido en casillero", activo: false, fecha_actualizado: null },
  { nombre: "Asignando Vuelo", activo: false, fecha_actualizado: null },
  { nombre: "Recibido en Aduana", activo: false, fecha_actualizado: null },
  {
    nombre: "Procesado en Centro de Distribución",
    activo: false,
    fecha_actualizado: null,
  },
  { nombre: "Listo para Entregar", activo: false, fecha_actualizado: null },
];
