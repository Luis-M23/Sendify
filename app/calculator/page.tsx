"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Calculator, Package, Plane, Ship, Truck, CheckCircle2, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const calculatorSchema = z.object({
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
  servicio: z.string().min(1, "Selecciona un tipo de servicio"),
  origen: z.string().min(1, "Selecciona el país de origen"),
  destino: z.string().min(1, "Selecciona el país de destino"),
})

type CalculatorFormData = z.infer<typeof calculatorSchema>

interface QuoteResult {
  pesoReal: number
  pesoVolumetrico: number
  pesoFacturable: number
  tarifaBase: number
  impuestos: number
  recargoCombustible: number
  descuento: number
  total: number
  tiempoEstimado: string
  codigoCotizacion: string
}

export default function CalculatorPage() {
  const { toast } = useToast()
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CalculatorFormData>({
    resolver: zodResolver(calculatorSchema),
    defaultValues: {
      peso: "",
      largo: "",
      ancho: "",
      alto: "",
      servicio: "",
      origen: "",
      destino: "",
    },
  })

  const [quote, setQuote] = useState<QuoteResult | null>(null)

  const servicio = watch("servicio")

  const calcularCotizacion = async (data: CalculatorFormData) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const pesoReal = Number.parseFloat(data.peso)
      const dimensiones = Number.parseFloat(data.largo) * Number.parseFloat(data.ancho) * Number.parseFloat(data.alto)
      const factor = data.servicio === "aereo" ? 6000 : 4000
      const pesoVolumetrico = dimensiones / factor
      const pesoFacturable = Math.max(pesoReal, pesoVolumetrico)

      const tarifaBase = pesoFacturable * (data.servicio === "aereo" ? 25 : data.servicio === "maritimo" ? 8 : 15)
      const impuestos = tarifaBase * 0.15
      const recargoCombustible = tarifaBase * 0.08
      const descuento = tarifaBase * 0.1 // 10% VIP discount
      const total = tarifaBase + impuestos + recargoCombustible - descuento

      setQuote({
        pesoReal,
        pesoVolumetrico,
        pesoFacturable,
        tarifaBase,
        impuestos,
        recargoCombustible,
        descuento,
        total,
        tiempoEstimado:
          data.servicio === "aereo" ? "3-5 días" : data.servicio === "maritimo" ? "20-30 días" : "7-10 días",
        codigoCotizacion: `COT-${Date.now().toString().slice(-8)}`,
      })

      toast({
        title: "Cotización calculada",
        description: "Tu cotización ha sido generada exitosamente",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Hubo un problema al calcular la cotización",
        variant: "destructive",
      })
    }
  }

  const servicioIcons = {
    aereo: Plane,
    terrestre: Truck,
    maritimo: Ship,
  }

  return (
    <DashboardLayout userRole="vip">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Calculadora de Envíos</h1>
          <p className="text-muted-foreground">Cotiza tu envío internacional en segundos</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calculator Form */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Datos del Envío
              </CardTitle>
              <CardDescription>Ingresa la información de tu paquete para calcular el costo</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(calcularCotizacion)} className="space-y-6">
                {/* Service Type */}
                <div className="space-y-2">
                  <Label>Tipo de Servicio</Label>
                  {errors.servicio && (
                    <p className="text-sm text-destructive flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.servicio.message}
                    </p>
                  )}
                  <div className="grid grid-cols-3 gap-3">
                    <Button
                      type="button"
                      variant={servicio === "aereo" ? "default" : "outline"}
                      className="h-auto flex-col gap-2 py-4"
                      onClick={() => setValue("servicio", "aereo", { shouldValidate: true })}
                    >
                      <Plane className="h-6 w-6" />
                      <span className="text-sm">Aéreo</span>
                      <span className="text-xs text-muted-foreground">3-5 días</span>
                    </Button>
                    <Button
                      type="button"
                      variant={servicio === "terrestre" ? "default" : "outline"}
                      className="h-auto flex-col gap-2 py-4"
                      onClick={() => setValue("servicio", "terrestre", { shouldValidate: true })}
                    >
                      <Truck className="h-6 w-6" />
                      <span className="text-sm">Terrestre</span>
                      <span className="text-xs text-muted-foreground">7-10 días</span>
                    </Button>
                    <Button
                      type="button"
                      variant={servicio === "maritimo" ? "default" : "outline"}
                      className="h-auto flex-col gap-2 py-4"
                      onClick={() => setValue("servicio", "maritimo", { shouldValidate: true })}
                    >
                      <Ship className="h-6 w-6" />
                      <span className="text-sm">Marítimo</span>
                      <span className="text-xs text-muted-foreground">20-30 días</span>
                    </Button>
                  </div>
                </div>

                <Separator />

                {/* Origin and Destination */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="origen">País de Origen</Label>
                    <Select onValueChange={(value) => setValue("origen", value, { shouldValidate: true })}>
                      <SelectTrigger id="origen" className={errors.origen ? "border-destructive" : ""}>
                        <SelectValue placeholder="Seleccionar país" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="us">Estados Unidos</SelectItem>
                        <SelectItem value="cn">China</SelectItem>
                        <SelectItem value="mx">México</SelectItem>
                        <SelectItem value="es">España</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.origen && (
                      <p className="text-sm text-destructive flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.origen.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="destino">País de Destino</Label>
                    <Select onValueChange={(value) => setValue("destino", value, { shouldValidate: true })}>
                      <SelectTrigger id="destino" className={errors.destino ? "border-destructive" : ""}>
                        <SelectValue placeholder="Seleccionar país" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gt">Guatemala</SelectItem>
                        <SelectItem value="sv">El Salvador</SelectItem>
                        <SelectItem value="hn">Honduras</SelectItem>
                        <SelectItem value="cr">Costa Rica</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.destino && (
                      <p className="text-sm text-destructive flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.destino.message}
                      </p>
                    )}
                  </div>
                </div>

                <Separator />

                {/* Weight and Dimensions */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="peso">Peso Real (kg)</Label>
                    <Input
                      id="peso"
                      type="number"
                      placeholder="5.5"
                      step="0.1"
                      min="0"
                      {...register("peso")}
                      className={errors.peso ? "border-destructive" : ""}
                    />
                    {errors.peso && (
                      <p className="text-sm text-destructive flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.peso.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label className="mb-2 block">Dimensiones (cm)</Label>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="space-y-2">
                        <Label htmlFor="largo" className="text-xs text-muted-foreground">
                          Largo
                        </Label>
                        <Input
                          id="largo"
                          type="number"
                          placeholder="30"
                          min="0"
                          {...register("largo")}
                          className={errors.largo ? "border-destructive" : ""}
                        />
                        {errors.largo && (
                          <p className="text-xs text-destructive flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            {errors.largo.message}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="ancho" className="text-xs text-muted-foreground">
                          Ancho
                        </Label>
                        <Input
                          id="ancho"
                          type="number"
                          placeholder="20"
                          min="0"
                          {...register("ancho")}
                          className={errors.ancho ? "border-destructive" : ""}
                        />
                        {errors.ancho && (
                          <p className="text-xs text-destructive flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            {errors.ancho.message}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="alto" className="text-xs text-muted-foreground">
                          Alto
                        </Label>
                        <Input
                          id="alto"
                          type="number"
                          placeholder="15"
                          min="0"
                          {...register("alto")}
                          className={errors.alto ? "border-destructive" : ""}
                        />
                        {errors.alto && (
                          <p className="text-xs text-destructive flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            {errors.alto.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                  {isSubmitting ? "Calculando..." : "Calcular Cotización"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Quote Result */}
          <div className="space-y-4">
            {quote ? (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Cotización</CardTitle>
                    <CardDescription className="font-mono text-xs">{quote.codigoCotizacion}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Peso Real</span>
                        <span className="font-medium">{quote.pesoReal.toFixed(2)} kg</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Peso Volumétrico</span>
                        <span className="font-medium">{quote.pesoVolumetrico.toFixed(2)} kg</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Peso Facturable</span>
                        <span className="font-semibold">{quote.pesoFacturable.toFixed(2)} kg</span>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Tarifa Base</span>
                        <span>${quote.tarifaBase.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Impuestos (15%)</span>
                        <span>${quote.impuestos.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Recargo Combustible</span>
                        <span>${quote.recargoCombustible.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm text-chart-4">
                        <span>Descuento VIP (10%)</span>
                        <span>-${quote.descuento.toFixed(2)}</span>
                      </div>
                    </div>

                    <Separator />

                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold">Total</span>
                      <span className="text-2xl font-bold">${quote.total.toFixed(2)}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Package className="h-4 w-4" />
                      <span>Tiempo estimado: {quote.tiempoEstimado}</span>
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
                        <p className="text-sm font-medium">Beneficio VIP Aplicado</p>
                        <p className="text-xs text-muted-foreground">
                          Ahorraste ${quote.descuento.toFixed(2)} con tu membresía Oro
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
                    <p className="text-sm">Completa el formulario para ver tu cotización</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Info Cards */}
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
                    Se calcula dividiendo (Largo × Ancho × Alto) entre el factor del servicio
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
                  <p className="text-sm text-muted-foreground">Aéreo: 6000 | Terrestre/Marítimo: 4000</p>
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
                  <p className="text-sm text-muted-foreground">Se cobra el mayor entre peso real y volumétrico</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
