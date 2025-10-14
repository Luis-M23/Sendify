"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import {
  Star,
  Gift,
  TrendingUp,
  Package,
  Zap,
  Crown,
  Award,
  CheckCircle2,
  Calendar,
  Percent,
  Sparkles,
  Lock,
  Unlock,
} from "lucide-react"

interface VIPLevel {
  nivel: string
  requisito: string
  descuento: number
  beneficios: string[]
  color: string
  icon: typeof Star
}

interface Promotion {
  id: string
  titulo: string
  descripcion: string
  descuento: string
  tipo: "temporada" | "producto" | "volumen"
  fechaInicio: string
  fechaFin: string
  activa: boolean
  condiciones: string[]
}

const vipLevels: VIPLevel[] = [
  {
    nivel: "Bronce",
    requisito: "5 envíos/año",
    descuento: 5,
    beneficios: ["5% descuento en todos los envíos", "Notificaciones prioritarias", "Soporte por email"],
    color: "oklch(0.627 0.265 303.9)",
    icon: Award,
  },
  {
    nivel: "Plata",
    requisito: "15 envíos/año",
    descuento: 10,
    beneficios: [
      "10% descuento en todos los envíos",
      "Casillero virtual gratis",
      "Seguro incluido hasta $500",
      "Consolidación gratuita",
    ],
    color: "oklch(0.708 0 0)",
    icon: Star,
  },
  {
    nivel: "Oro",
    requisito: "30 envíos/año",
    descuento: 15,
    beneficios: [
      "15% descuento en todos los envíos",
      "Envíos express gratis (1 al mes)",
      "Gestor personal asignado",
      "Prioridad en aduana",
      "Seguro incluido hasta $1,000",
    ],
    color: "oklch(0.769 0.188 70.08)",
    icon: Crown,
  },
  {
    nivel: "Platino",
    requisito: "50 envíos/año",
    descuento: 20,
    beneficios: [
      "20% descuento en todos los envíos",
      "Todos los beneficios anteriores",
      "Atención 24/7 exclusiva",
      "Tarifas corporativas",
      "Recolección gratuita ilimitada",
      "Seguro incluido hasta $2,500",
    ],
    color: "oklch(0.645 0.246 16.439)",
    icon: Sparkles,
  },
]

const promotions: Promotion[] = [
  {
    id: "1",
    titulo: "Black Friday 2025",
    descripcion: "Descuento especial en todos los envíos durante el Black Friday",
    descuento: "20%",
    tipo: "temporada",
    fechaInicio: "2025-11-29",
    fechaFin: "2025-12-02",
    activa: false,
    condiciones: ["Válido para todos los servicios", "No acumulable con otros descuentos", "Mínimo 1kg"],
  },
  {
    id: "2",
    titulo: "Envío Gratis en Electrónicos",
    descripcion: "Envío gratuito en compras de electrónicos mayores a $500",
    descuento: "Envío Gratis",
    tipo: "producto",
    fechaInicio: "2025-10-01",
    fechaFin: "2025-10-31",
    activa: true,
    condiciones: ["Solo categoría electrónicos", "Compra mínima $500", "Servicio terrestre"],
  },
  {
    id: "3",
    titulo: "Descuento por Volumen",
    descripcion: "Ahorra más mientras más envíes este mes",
    descuento: "Hasta 15%",
    tipo: "volumen",
    fechaInicio: "2025-10-01",
    fechaFin: "2025-10-31",
    activa: true,
    condiciones: ["5+ envíos: 10% descuento", "10+ envíos: 15% descuento", "Acumulativo mensual"],
  },
  {
    id: "4",
    titulo: "Navidad 2025",
    descripcion: "Descuento especial para tus regalos navideños",
    descuento: "15%",
    tipo: "temporada",
    fechaInicio: "2025-12-15",
    fechaFin: "2025-12-25",
    activa: false,
    condiciones: ["Válido para todos los servicios", "Máximo 5 envíos por cliente"],
  },
]

export default function PromotionsPage() {
  const [currentLevel] = useState("Oro")
  const [currentShipments] = useState(28)
  const [nextLevelShipments] = useState(50)

  const progress = (currentShipments / nextLevelShipments) * 100

  return (
    <DashboardLayout userRole="vip">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Promociones y Programa VIP</h1>
          <p className="text-muted-foreground">Aprovecha descuentos exclusivos y beneficios especiales</p>
        </div>

        <Tabs defaultValue="vip" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="vip">Programa VIP</TabsTrigger>
            <TabsTrigger value="promociones">Promociones Activas</TabsTrigger>
          </TabsList>

          {/* VIP Program Tab */}
          <TabsContent value="vip" className="space-y-6">
            {/* Current Status */}
            <Card className="border-chart-4/50 bg-gradient-to-br from-chart-4/10 to-transparent">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl mb-2 flex items-center gap-2">
                      <Crown className="h-6 w-6 text-chart-4" />
                      Tu Nivel Actual: {currentLevel}
                    </CardTitle>
                    <CardDescription className="text-base">
                      Disfrutas de un 15% de descuento en todos tus envíos
                    </CardDescription>
                  </div>
                  <Badge className="bg-chart-4/20 text-chart-4 border-chart-4/30 text-lg px-4 py-2">
                    <Star className="h-4 w-4 mr-2" />
                    VIP
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium">Progreso al siguiente nivel (Platino)</p>
                    <p className="text-sm text-muted-foreground">
                      {currentShipments} / {nextLevelShipments} envíos
                    </p>
                  </div>
                  <Progress value={progress} className="h-3" />
                  <p className="text-xs text-muted-foreground mt-2">
                    Te faltan {nextLevelShipments - currentShipments} envíos para alcanzar el nivel Platino
                  </p>
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-chart-4/20 flex items-center justify-center">
                      <Package className="h-5 w-5 text-chart-4" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{currentShipments}</p>
                      <p className="text-xs text-muted-foreground">Envíos este año</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-chart-3/20 flex items-center justify-center">
                      <TrendingUp className="h-5 w-5 text-chart-3" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">$342</p>
                      <p className="text-xs text-muted-foreground">Ahorrado en descuentos</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/20 flex items-center justify-center">
                      <Percent className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">15%</p>
                      <p className="text-xs text-muted-foreground">Descuento actual</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* VIP Levels */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {vipLevels.map((level) => {
                const Icon = level.icon
                const isCurrentLevel = level.nivel === currentLevel
                const isUnlocked =
                  vipLevels.findIndex((l) => l.nivel === currentLevel) >=
                  vipLevels.findIndex((l) => l.nivel === level.nivel)

                return (
                  <Card
                    key={level.nivel}
                    className={`relative overflow-hidden ${
                      isCurrentLevel ? "border-chart-4 bg-chart-4/5" : isUnlocked ? "border-chart-3/50" : ""
                    }`}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <div
                              className="h-10 w-10 rounded-lg flex items-center justify-center"
                              style={{ backgroundColor: `${level.color}20` }}
                            >
                              <Icon className="h-5 w-5" style={{ color: level.color }} />
                            </div>
                            <div>
                              <CardTitle className="text-xl">{level.nivel}</CardTitle>
                              <CardDescription className="text-xs">{level.requisito}</CardDescription>
                            </div>
                          </div>
                        </div>
                        {isCurrentLevel ? (
                          <Badge className="bg-chart-4/20 text-chart-4 border-chart-4/30">Actual</Badge>
                        ) : isUnlocked ? (
                          <Unlock className="h-5 w-5 text-chart-3" />
                        ) : (
                          <Lock className="h-5 w-5 text-muted-foreground" />
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Percent className="h-5 w-5 text-muted-foreground" />
                        <span className="text-2xl font-bold">{level.descuento}%</span>
                        <span className="text-sm text-muted-foreground">de descuento</span>
                      </div>

                      <Separator />

                      <div className="space-y-2">
                        <p className="text-sm font-semibold mb-3">Beneficios:</p>
                        {level.beneficios.map((beneficio, index) => (
                          <div key={index} className="flex items-start gap-2">
                            <CheckCircle2 className="h-4 w-4 text-chart-3 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-muted-foreground">{beneficio}</p>
                          </div>
                        ))}
                      </div>

                      {!isUnlocked && (
                        <div className="pt-4">
                          <Button variant="outline" className="w-full bg-transparent" disabled>
                            <Lock className="h-4 w-4 mr-2" />
                            Bloqueado
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {/* Benefits Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gift className="h-5 w-5" />
                  Tus Beneficios Activos
                </CardTitle>
                <CardDescription>Aprovecha todos los beneficios de tu nivel {currentLevel}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="bg-muted/50">
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-3">
                        <div className="h-10 w-10 rounded-lg bg-chart-4/20 flex items-center justify-center flex-shrink-0">
                          <Zap className="h-5 w-5 text-chart-4" />
                        </div>
                        <div>
                          <h3 className="font-semibold mb-1">Envío Express Gratis</h3>
                          <p className="text-sm text-muted-foreground mb-2">1 disponible este mes</p>
                          <Button size="sm" variant="outline" className="bg-transparent">
                            Usar Ahora
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-muted/50">
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-3">
                        <div className="h-10 w-10 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                          <Package className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold mb-1">Consolidación Gratis</h3>
                          <p className="text-sm text-muted-foreground mb-2">Hasta 5 paquetes</p>
                          <Button size="sm" variant="outline" className="bg-transparent">
                            Consolidar
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Promotions Tab */}
          <TabsContent value="promociones" className="space-y-6">
            {/* Active Promotions */}
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-bold mb-2">Promociones Activas</h2>
                <p className="text-sm text-muted-foreground">Aprovecha estas ofertas especiales</p>
              </div>

              {promotions
                .filter((p) => p.activa)
                .map((promo) => (
                  <Card key={promo.id} className="border-primary/50 bg-gradient-to-br from-primary/5 to-transparent">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge
                              className={
                                promo.tipo === "temporada"
                                  ? "bg-chart-5/20 text-chart-5 border-chart-5/30"
                                  : promo.tipo === "producto"
                                    ? "bg-chart-2/20 text-chart-2 border-chart-2/30"
                                    : "bg-chart-4/20 text-chart-4 border-chart-4/30"
                              }
                            >
                              {promo.tipo === "temporada"
                                ? "Temporada"
                                : promo.tipo === "producto"
                                  ? "Por Producto"
                                  : "Por Volumen"}
                            </Badge>
                            <Badge className="bg-chart-3/20 text-chart-3 border-chart-3/30">
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              Activa
                            </Badge>
                          </div>
                          <CardTitle className="text-xl mb-2">{promo.titulo}</CardTitle>
                          <CardDescription>{promo.descripcion}</CardDescription>
                        </div>
                        <div className="text-right">
                          <p className="text-3xl font-bold text-primary">{promo.descuento}</p>
                          <p className="text-xs text-muted-foreground">de descuento</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {new Date(promo.fechaInicio).toLocaleDateString("es-ES", {
                              day: "numeric",
                              month: "short",
                            })}{" "}
                            -{" "}
                            {new Date(promo.fechaFin).toLocaleDateString("es-ES", {
                              day: "numeric",
                              month: "short",
                            })}
                          </span>
                        </div>
                      </div>

                      <Separator />

                      <div>
                        <p className="text-sm font-semibold mb-2">Condiciones:</p>
                        <ul className="space-y-1">
                          {promo.condiciones.map((condicion, index) => (
                            <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                              <span className="text-primary">•</span>
                              <span>{condicion}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <Button className="w-full">Aplicar Promoción</Button>
                    </CardContent>
                  </Card>
                ))}
            </div>

            <Separator />

            {/* Upcoming Promotions */}
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-bold mb-2">Próximas Promociones</h2>
                <p className="text-sm text-muted-foreground">Mantente atento a estas ofertas</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {promotions
                  .filter((p) => !p.activa)
                  .map((promo) => (
                    <Card key={promo.id} className="opacity-75">
                      <CardHeader>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline">Próximamente</Badge>
                          <Badge
                            className={
                              promo.tipo === "temporada"
                                ? "bg-chart-5/20 text-chart-5 border-chart-5/30"
                                : promo.tipo === "producto"
                                  ? "bg-chart-2/20 text-chart-2 border-chart-2/30"
                                  : "bg-chart-4/20 text-chart-4 border-chart-4/30"
                            }
                          >
                            {promo.tipo === "temporada"
                              ? "Temporada"
                              : promo.tipo === "producto"
                                ? "Por Producto"
                                : "Por Volumen"}
                          </Badge>
                        </div>
                        <CardTitle className="text-lg">{promo.titulo}</CardTitle>
                        <CardDescription>{promo.descripcion}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            <span>
                              Inicia el{" "}
                              {new Date(promo.fechaInicio).toLocaleDateString("es-ES", {
                                day: "numeric",
                                month: "long",
                              })}
                            </span>
                          </div>
                          <p className="text-xl font-bold text-primary">{promo.descuento}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
