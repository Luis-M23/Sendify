import { CasilleroCostoMap } from "@/lib/map";
import { Cotizacion, CotizacionCalculo } from "@/lib/validation/cotizacion";

export const CalculadoraService = {
  cotizar(payload: CotizacionCalculo): Cotizacion {
    const {
      formDeclaracion,
      formCasillero,
      formCategoria,
      formFactorConversion,
    } = payload;

    const pesoReal = formDeclaracion.peso;

    const dimensiones =
      formDeclaracion.largo * formDeclaracion.ancho * formDeclaracion.alto;

    const factor = formFactorConversion.divisor_vol;
    console.log(formFactorConversion);

    const pesoVolumetrico = dimensiones / factor;
    const pesoFacturable = Math.max(pesoReal, pesoVolumetrico);

    const tarifa =
      pesoFacturable *
      formCasillero[CasilleroCostoMap[formFactorConversion.id]];

    const impuestos = tarifa * 0.3;
    const recargoCombustible = tarifa * 0.08;
    const descuento = tarifa * 0.1;
    const total = tarifa + impuestos + recargoCombustible - descuento;

    return {
      id_casillero: formDeclaracion.id_casillero,
      id_categoria: formDeclaracion.id_categoria,
      id_tipo_transporte: formDeclaracion.id_tipo_transporte,
      codigo: `${formCasillero.codigo}-${Date.now().toString().slice(-8)}`,
      tarifa_aplicada:
        formCasillero[CasilleroCostoMap[formFactorConversion.id]],
      tarifa,
      peso_volumetrico: pesoVolumetrico,
      peso_facturable: pesoFacturable,
      producto: formDeclaracion.producto,
      peso: formDeclaracion.peso,
      largo: formDeclaracion.largo,
      ancho: formDeclaracion.ancho,
      alto: formDeclaracion.alto,
      descuento_aplicado: 0,
      descuento: 0,
      recompensa_aplicado: 0,
      recompensa: 0,
      total,
    };
  },

  async calcularCotizacion(data) {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1));

      const pesoReal = Number.parseFloat(data.peso);
      const dimensiones =
        Number.parseFloat(data.largo) *
        Number.parseFloat(data.ancho) *
        Number.parseFloat(data.alto);
      const factor = data.servicio === "aereo" ? 6000 : 4000;
      const pesoVolumetrico = dimensiones / factor;
      const pesoFacturable = Math.max(pesoReal, pesoVolumetrico);

      const tarifaBase =
        pesoFacturable *
        (data.servicio === "aereo"
          ? 25
          : data.servicio === "maritimo"
          ? 8
          : 15);
      const impuestos = tarifaBase * 0.15;
      const recargoCombustible = tarifaBase * 0.08;
      const descuento = tarifaBase * 0.1;
      const total = tarifaBase + impuestos + recargoCombustible - descuento;

      setFactura({
        pesoReal,
        pesoVolumetrico,
        pesoFacturable,
        tarifaBase,
        impuestos,
        recargoCombustible,
        descuento,
        total,
        tiempoEstimado:
          data.servicio === "aereo"
            ? "3-5 días"
            : data.servicio === "maritimo"
            ? "20-30 días"
            : "7-10 días",
        codigoCotizacion: `COT-${Date.now().toString().slice(-8)}`,
      });

      setIsFormLocked(true);

      // toast.success("Cotización calculada");
    } catch (error) {
      console.error(error);
      toast.error("Error al calcular la cotización");
    }
  },
};
