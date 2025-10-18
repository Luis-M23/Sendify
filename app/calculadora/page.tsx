"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DashboardLayout } from "@/components/dashboard-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Calculator,
  Package,
  Plane,
  Ship,
  Truck,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { CalculadoraSchema, Calculadora } from "@/lib/validation/calculadora";
import { FactorConversion } from "@/lib/validation/factorConversion";
import { Casillero } from "@/lib/validation/casillero";
import { CasilleroService } from "@/lib/supabase/services/casilleroService";
import { FactorConversionService } from "@/lib/supabase/services/factorConversionService";
import { toast } from "react-toastify";
import { CategoriaService } from "@/lib/supabase/services/categoriaService";
import { Categoria } from "@/lib/validation/categoria";
import { PermisoMap } from "@/lib/map";
import { idTipoServicioEnum } from "@/lib/enum";

interface QuoteResult {
  pesoReal: number;
  pesoVolumetrico: number;
  pesoFacturable: number;
  tarifaBase: number;
  impuestos: number;
  recargoCombustible: number;
  descuento: number;
  total: number;
  tiempoEstimado: string;
  codigoCotizacion: string;
}

type CostoKey = "costo_aereo" | "costo_maritimo" | "costo_terrestre";

type MedioKey = "aereo" | "maritimo" | "terrestre";

const defaultCalculadoraValues: Calculadora = {
  id_casillero: null,
  id_categoria: null,
  servicio: undefined,
  producto: "",
  peso: "",
  largo: "",
  ancho: "",
  alto: "",
};

export default function CalculatorPage() {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<Calculadora>({
    resolver: zodResolver(CalculadoraSchema),
    defaultValues: defaultCalculadoraValues,
  });

  const idCasillero = watch("id_casillero");
  const idCategoria = watch("id_categoria");
  const idTipoTransporte = watch("id_tipo_transporte");

  const servicio = watch("servicio");

  const [factura, setFactura] = useState<QuoteResult | null>(null);
  const [isFormLocked, setIsFormLocked] = useState(false);
  const [formResetKey, setFormResetKey] = useState(0);

  const [casilleros, setCasilleros] = useState<Casillero[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);

  const [factoresConversion, setFactoresConversion] = useState<
    FactorConversion[]
  >([]);

  const [selectedCasillero, setSelectedCasillero] = useState<Casillero | null>(
    null
  );
  const [selectedCategoria, setSelectedCategoria] = useState<Categoria | null>(
    null
  );

  const loadData = async () => {
    try {
      const casilleros = await CasilleroService.getAll();
      setCasilleros(casilleros);

      const factores = await FactorConversionService.getAll();
      setFactoresConversion(factores);

      const categorias = await CategoriaService.getAll();
      setCategorias(categorias);
    } catch (error: any) {
      toast.error(error.message || "Ocurrió un error al cargar los datos");
    } finally {
    }
  };

  useEffect(() => {
    if (
      typeof idCasillero === "number" &&
      !Number.isNaN(idCasillero) &&
      casilleros.length > 0
    ) {
      const casilleroFind = casilleros.find((c) => c.id === idCasillero);
      setSelectedCasillero(casilleroFind || null);
    } else {
      setSelectedCasillero(null);
    }
  }, [idCasillero, casilleros]);

  useEffect(() => {
    if (
      typeof idCategoria === "number" &&
      !Number.isNaN(idCategoria) &&
      categorias.length > 0
    ) {
      const categoriaFind = categorias.find((c) => c.id === idCategoria);
      setSelectedCategoria(categoriaFind || null);
    } else {
      setSelectedCategoria(null);
    }
  }, [idCategoria, categorias]);

  useEffect(() => {
    setValue("id_tipo_transporte", null, { shouldValidate: false });
  }, [idCasillero, idCategoria, setValue]);

  const mapCostToMedio = (costKey: CostoKey): MedioKey => {
    return costKey.slice(6) as MedioKey;
  };

  const transporteDesactivado = (medio: CostoKey): boolean => {
    if (selectedCasillero === null) return true;

    if (selectedCasillero[medio] === 0) return true;

    if (selectedCategoria === null) {
      return true;
    }

    const categoriaKey = mapCostToMedio(medio);

    if (selectedCategoria[categoriaKey] === 1) {
      return true;
    }

    return false;
  };

  const formatoPermiso = (id: number | undefined): string => {
    return PermisoMap[id || 0] || "-";
  };

  const formatoPrecioKg = (price: number | null | undefined): string => {
    if (!selectedCasillero) return "-";

    if (price === null || price === undefined || isNaN(price) || price === 0) {
      return "N/A";
    }

    const formattedPrice = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(price);

    return `${formattedPrice} / kg`;
  };

  useEffect(() => {
    loadData();
  }, []);

  const calcularCotizacion = async (data: Calculadora) => {
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
      const descuento = tarifaBase * 0.1; // 10% VIP discount
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

      toast.success("Cotización calculada");
    } catch (error) {
      console.error(error);
      toast.error("Error al calcular la cotización");
    }
  };

  const handleClearForm = () => {
    setFactura(null);
    reset({ ...defaultCalculadoraValues });
    setValue("id_casillero", null, { shouldValidate: false });
    setValue("id_categoria", null, { shouldValidate: false });
    setValue("id_tipo_transporte", null, { shouldValidate: false });
    setSelectedCasillero(null);
    setSelectedCategoria(null);
    setIsFormLocked(false);
    setFormResetKey((key) => key + 1);
  };

  const onSubmit = (data: Calculadora) => {
    if (isFormLocked) {
      return;
    }
    calcularCotizacion(data);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Package className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Peso Volumétrico</h3>
                  <p className="text-sm text-muted-foreground">
                    Se calcula dividiendo (Largo × Ancho × Alto) entre el factor
                    del servicio
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-lg bg-chart-2/10 flex items-center justify-center flex-shrink-0">
                  <Plane className="h-5 w-5 text-chart-2" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Factor Volumétrico</h3>
                  {factoresConversion.map((factorConversion) => (
                    <p
                      className="text-sm text-muted-foreground"
                      key={factorConversion.id}
                    >
                      {factorConversion.nombre}: {factorConversion.divisor_vol}
                    </p>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-lg bg-chart-4/10 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="h-5 w-5 text-chart-4" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Peso Facturable</h3>
                  <p className="text-sm text-muted-foreground">
                    Se cobra el mayor entre peso real y volumétrico
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calculator Form */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Calculadora de Envíos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="id_casillero">Casillero</Label>
                    <Select
                      key={`casillero-${formResetKey}`}
                      disabled={isFormLocked}
                      value={
                        idCasillero !== null && idCasillero !== undefined
                          ? String(idCasillero)
                          : undefined
                      }
                      onValueChange={(value) =>
                        setValue("id_casillero", +value, {
                          shouldValidate: true,
                        })
                      }
                    >
                      <SelectTrigger
                        id="id_casillero"
                        className={
                          errors.id_casillero ? "border-destructive" : ""
                        }
                      >
                        <SelectValue placeholder="Seleccionar casillero" />
                      </SelectTrigger>
                      <SelectContent>
                        {casilleros.map((casillero) => (
                          <SelectItem
                            key={String(casillero.id)}
                            value={String(casillero.id)}
                          >
                            {casillero.codigo}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.id_casillero && (
                      <p className="text-sm text-destructive flex items-center gap-1">
                        {errors.id_casillero.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="casillero">Categoría</Label>
                    <Select
                      key={`categoria-${formResetKey}`}
                      disabled={isFormLocked}
                      value={
                        idCategoria !== null && idCategoria !== undefined
                          ? String(idCategoria)
                          : undefined
                      }
                      onValueChange={(value) =>
                        setValue("id_categoria", +value, {
                          shouldValidate: true,
                        })
                      }
                    >
                      <SelectTrigger
                        id="id_categoria"
                        className={
                          errors.id_categoria ? "border-destructive" : ""
                        }
                      >
                        <SelectValue placeholder="Seleccionar categoría" />
                      </SelectTrigger>
                      <SelectContent>
                        {categorias.map((categoria) => (
                          <SelectItem
                            key={String(categoria.id)}
                            value={String(categoria.id)}
                          >
                            {categoria.nombre}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.id_categoria && (
                      <p className="text-sm text-destructive flex items-center gap-1">
                        {errors.id_categoria.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="truncate">
                      <div className="font-medium">
                        {selectedCasillero?.pais}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {selectedCasillero?.estado}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {selectedCasillero?.direccion}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {selectedCasillero?.telefono}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Service Type */}
                <div className="space-y-2">
                  <Label>Tipo de Servicio</Label>

                  <div className="grid grid-cols-3 gap-4">
                    <Button
                      disabled={
                        transporteDesactivado("costo_aereo") || isFormLocked
                      }
                      type="button"
                      variant={
                        idTipoTransporte === idTipoServicioEnum.AEREO
                          ? "default"
                          : "outline"
                      }
                      className="h-auto flex-col gap-1 py-2"
                      onClick={() =>
                        setValue(
                          "id_tipo_transporte",
                          idTipoServicioEnum.AEREO,
                          {
                            shouldValidate: true,
                          }
                        )
                      }
                    >
                      <Plane className="h-6 w-6" />
                      <span className="text-md">Aéreo</span>
                      <span className="text-md">
                        {formatoPermiso(selectedCategoria?.aereo)}
                      </span>
                      <span className="text-md">
                        {formatoPrecioKg(selectedCasillero?.costo_aereo)}
                      </span>
                    </Button>
                    <Button
                      disabled={
                        transporteDesactivado("costo_terrestre") || isFormLocked
                      }
                      type="button"
                      variant={
                        idTipoTransporte === idTipoServicioEnum.TERRESTRE
                          ? "default"
                          : "outline"
                      }
                      className="h-auto flex-col gap-1 py-2"
                      onClick={() =>
                        setValue(
                          "id_tipo_transporte",
                          idTipoServicioEnum.TERRESTRE,
                          {
                            shouldValidate: true,
                          }
                        )
                      }
                    >
                      <Truck className="h-6 w-6" />
                      <span className="text-md">Terrestre</span>
                      <span className="text-md">
                        {formatoPermiso(selectedCategoria?.terrestre)}
                      </span>
                      <span className="text-md">
                        {formatoPrecioKg(selectedCasillero?.costo_terrestre)}
                      </span>
                    </Button>
                    <Button
                      disabled={
                        transporteDesactivado("costo_maritimo") || isFormLocked
                      }
                      type="button"
                      variant={
                        idTipoTransporte === idTipoServicioEnum.MARITIMO
                          ? "default"
                          : "outline"
                      }
                      className="h-auto flex-col gap-1 py-2"
                      onClick={() =>
                        setValue(
                          "id_tipo_transporte",
                          idTipoServicioEnum.MARITIMO,
                          {
                            shouldValidate: true,
                          }
                        )
                      }
                    >
                      <Ship className="h-6 w-6" />
                      <span className="text-md">Marítimo</span>
                      <span className="text-md">
                        {formatoPermiso(selectedCategoria?.maritimo)}
                      </span>
                      <span className="text-md">
                        {formatoPrecioKg(selectedCasillero?.costo_maritimo)}
                      </span>
                    </Button>
                  </div>
                  {errors.id_tipo_transporte && (
                    <p className="text-sm text-destructive flex items-center gap-1">
                      {errors.id_tipo_transporte.message}
                    </p>
                  )}
                </div>

                <Separator/>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="producto">Producto</Label>
                    <Textarea
                      id="producto"
                      placeholder="Describe el producto"
                      {...register("producto")}
                      disabled={isFormLocked}
                      className={errors.producto ? "border-destructive" : ""}
                    />
                    {errors.producto && (
                      <p className="text-sm text-destructive flex items-center gap-1">
                        {errors.producto.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="peso">Peso Real (kg)</Label>
                    <Input
                      id="peso"
                      type="number"
                      placeholder="5.5"
                      step="0.1"
                      min="0"
                      {...register("peso")}
                      disabled={isFormLocked}
                      className={errors.peso ? "border-destructive" : ""}
                    />
                    {errors.peso && (
                      <p className="text-sm text-destructive flex items-center gap-1">
                        {errors.peso.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label className="mb-2 block">Dimensiones (cm)</Label>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="space-y-2">
                        <Label
                          htmlFor="largo"
                          className="text-xs text-muted-foreground"
                        >
                          Largo
                        </Label>
                        <Input
                          id="largo"
                          type="number"
                          placeholder="30"
                          min="0"
                          {...register("largo")}
                          disabled={isFormLocked}
                          className={errors.largo ? "border-destructive" : ""}
                        />
                        {errors.largo && (
                          <p className="text-xs text-destructive flex items-center gap-1">
                            {errors.largo.message}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label
                          htmlFor="ancho"
                          className="text-xs text-muted-foreground"
                        >
                          Ancho
                        </Label>
                        <Input
                          id="ancho"
                          type="number"
                          placeholder="20"
                          min="0"
                          {...register("ancho")}
                          disabled={isFormLocked}
                          className={errors.ancho ? "border-destructive" : ""}
                        />
                        {errors.ancho && (
                          <p className="text-xs text-destructive flex items-center gap-1">
                            {errors.ancho.message}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label
                          htmlFor="alto"
                          className="text-xs text-muted-foreground"
                        >
                          Alto
                        </Label>
                        <Input
                          id="alto"
                          type="number"
                          placeholder="15"
                          min="0"
                          {...register("alto")}
                          disabled={isFormLocked}
                          className={errors.alto ? "border-destructive" : ""}
                        />
                        {errors.alto && (
                          <p className="text-xs text-destructive flex items-center gap-1">
                            {errors.alto.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button
                    type="submit"
                    className="w-full sm:w-auto"
                    size="lg"
                    disabled={isSubmitting || isFormLocked}
                  >
                    {isSubmitting ? "Calculando..." : "Calcular Cotización"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full sm:w-auto"
                    size="lg"
                    onClick={handleClearForm}
                    disabled={isSubmitting}
                  >
                    Restablecer formulario
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Quote Result */}
          <div className="space-y-4">
            {factura ? (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Cotización</CardTitle>
                    <CardDescription className="font-mono text-xs">
                      {factura.codigoCotizacion}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Peso Real</span>
                        <span className="font-medium">
                          {factura.pesoReal.toFixed(2)} kg
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          Peso Volumétrico
                        </span>
                        <span className="font-medium">
                          {factura.pesoVolumetrico.toFixed(2)} kg
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          Peso Facturable
                        </span>
                        <span className="font-semibold">
                          {factura.pesoFacturable.toFixed(2)} kg
                        </span>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          Tarifa Base
                        </span>
                        <span>${factura.tarifaBase.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          Impuestos (15%)
                        </span>
                        <span>${factura.impuestos.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          Recargo Combustible
                        </span>
                        <span>${factura.recargoCombustible.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm text-chart-4">
                        <span>Descuento VIP (10%)</span>
                        <span>-${factura.descuento.toFixed(2)}</span>
                      </div>
                    </div>

                    <Separator />

                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold">Total</span>
                      <span className="text-2xl font-bold">
                        ${factura.total.toFixed(2)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Package className="h-4 w-4" />
                      <span>Tiempo estimado: {factura.tiempoEstimado}</span>
                    </div>

                    <Button className="w-full" size="lg">
                      Confirmar Reserva
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-chart-4/50 bg-chart-4/5">
                  <CardContent className="pt-6">
                    <div className="flex gap-3">
                      <CheckCircle2 className="h-5 w-5 text-chart-4 flex-shrink-0 mt-0.5" />
                      <div className="space-y-1">
                        <p className="text-sm font-medium">
                          Beneficio VIP Aplicado
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Ahorraste ${factura.descuento.toFixed(2)} con tu
                          membresía Oro
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-8 text-muted-foreground">
                    <Calculator className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p className="text-sm">
                      Completa el formulario para ver tu cotización
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
