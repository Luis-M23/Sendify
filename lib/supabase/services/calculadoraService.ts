import { CasilleroCostoMap } from "@/lib/map";
import {
  Cotizacion,
  CotizacionCalculo,
  FacturaItem,
} from "@/lib/validation/cotizacion";

export const CalculadoraService = {
  cotizar(payload: CotizacionCalculo): Cotizacion {
    const factura: FacturaItem[] = [];

    const {
      formDeclaracion,
      formCasillero,
      formCategoria,
      formFactorConversion,
      recompensaActual,
    } = payload;

    const pesoReal = formDeclaracion.peso;

    factura.push({
      prioridad: "important",
      clave: "Peso Real (kg)",
      valor: String(pesoReal.toFixed(2)),
    });

    const dimensiones =
      formDeclaracion.largo * formDeclaracion.ancho * formDeclaracion.alto;

    const factor = formFactorConversion.divisor_vol;

    const pesoVolumetrico = dimensiones / factor;
    const pesoFacturable = Math.max(pesoReal, pesoVolumetrico);

    factura.push({
      prioridad: "important",
      clave: "Peso Volumétrico (kg)",
      valor: String(pesoVolumetrico.toFixed(2)),
    });

    factura.push({
      prioridad: "important",
      clave: "Peso Facturable (kg)",
      valor: String(pesoFacturable.toFixed(2)),
    });

    const casilleroPrecio =
      formCasillero[CasilleroCostoMap[formFactorConversion.id]];

    const tarifa = pesoFacturable * casilleroPrecio;

    factura.push({
      prioridad: "default",
      clave: `Tarifa Aplicada ($${casilleroPrecio}/kg)`,
      valor: String(tarifa.toFixed(2)),
    });

    const impuestos = tarifa * 0.13;
    const descuento_aplicado = recompensaActual?.porcentaje_descuento || 0;
    const descuento = tarifa * descuento_aplicado;

    factura.push({
      prioridad: "default",
      clave: `Impuestos (13%)`,
      valor: String(impuestos.toFixed(2)),
    });

    factura.push({
      prioridad: "promo",
      clave: `Recompensa (${descuento_aplicado}%)`,
      valor: String(descuento.toFixed(2)),
    });

    const total = tarifa + impuestos - descuento;

    factura.push({
      prioridad: "important",
      clave: `Total ($)`,
      valor: String(total.toFixed(2)),
    });

    return {
      ...formDeclaracion,
      codigo: `${formCasillero.codigo}-${Date.now().toString().slice(-8)}`,
      total: +total.toFixed(2),
      factura,
    };
  },
};
