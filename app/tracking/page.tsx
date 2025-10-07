"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Package, Search, MapPin, Clock, CheckCircle2, Truck, Plane, Ship, AlertCircle, Calendar } from "lucide-react"

interface TrackingEvent {
  estado: string
  descripcion: string
  ubicacion: string
  fecha: string
  hora: string
  completado: boolean
}

interface ShipmentTracking {
  codigo: string
  estado: string
  origen: string
  destino: string
  servicio: string
  fechaEnvio: string
  fechaEstimada: string
  eventos: TrackingEvent[]
}

const mockShipment: ShipmentTracking = {
  codigo: "ENV-2025-001234",
  estado: "EN_TRANSITO_INTERNACIONAL",
  origen: "Miami, FL, Estados Unidos",
  destino: "Ciudad de Guatemala, Guatemala",
  servicio: "Aéreo Express",
  fechaEnvio: "2025-10-05",
  fechaEstimada: "2025-10-10",
  eventos: [
    {
      estado: "ENTREGADO",
      descripcion: "Paquete entregado",
      ubicacion: "Ciudad de Guatemala",
      fecha: "2025-10-10",
      hora: "14:30",
      completado: false,
    },
    {
      estado: "EN_REPARTO",
      descripcion: "En camino al destinatario",
      ubicacion: "Centro de distribución local",
      fecha: "2025-10-09",
      hora: "08:00",
      completado: false,
    },
    {
      estado: "EN_BODEGA_DESTINO",
      descripcion: "Llegó a bodega de destino",
      ubicacion: "Guatemala City Hub",
      fecha: "2025-10-08",
      hora: "16:45",
      completado: false,
    },
    {
      estado: "LIBERADO_ADUANA",
      descripcion: "Liberado por aduana",
      ubicacion: "Aduana Guatemala",
      fecha: "2025-10-08",
      hora: "12:30",
      completado: false,
    },
    {
      estado: "EN_ADUANA",
      descripcion: "En proceso aduanal",
      ubicacion: "Aduana Guatemala",
      fecha: "2025-10-07",
      hora: "09:15",
      completado: true,
    },
    {
      estado: "EN_TRANSITO_INTERNACIONAL",
      descripcion: "En vuelo internacional",
      ubicacion: "En tránsito",
      fecha: "2025-10-06",
      hora: "22:00",
      completado: true,
    },
    {
      estado: "EN_BODEGA_ORIGEN",
      descripcion: "Procesado en bodega de origen",
      ubicacion: "Miami Distribution Center",
      fecha: "2025-10-06",
      hora: "14:20",
      completado: true,
    },
    {
      estado: "RECOGIDO",
      descripcion: "Paquete recolectado",
      ubicacion: "Miami, FL",
      fecha: "2025-10-05",
      hora: "10:00",
      completado: true,
    },
    {
      estado: "RESERVADO",
      descripcion: "Reserva confirmada",
      ubicacion: "Sistema",
      fecha: "2025-10-05",
      hora: "08:30",
      completado: true,
    },
  ],
}

export default function TrackingPage() {
  const [trackingCode, setTrackingCode] = useState("")
  const [shipment, setShipment] = useState<ShipmentTracking | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSearch = () => {
    setLoading(true)
    // Simulate API call
    setTimeout(() => {
      setShipment(mockShipment)
      setLoading(false)
    }, 800)
  }

  const getServiceIcon = (servicio: string) => {
    if (servicio.toLowerCase().includes("aéreo") || servicio.toLowerCase().includes("aereo")) {
      return <Plane className="h-5 w-5" />
    }
    if (servicio.toLowerCase().includes("marítimo") || servicio.toLowerCase().includes("maritimo")) {
      return <Ship className="h-5 w-5" />
    }
    return <Truck className="h-5 w-5" />
  }

  const getStatusColor = (estado: string) => {
    switch (estado) {
      case "ENTREGADO":
        return "bg-chart-3/20 text-chart-3 border-chart-3/30"
      case "EN_REPARTO":
      case "EN_TRANSITO_INTERNACIONAL":
        return "bg-primary/20 text-primary border-primary/30"
      case "EN_ADUANA":
        return "bg-chart-4/20 text-chart-4 border-chart-4/30"
      default:
        return "bg-muted text-muted-foreground border-border"
    }
  }

  return (
    <DashboardLayout userRole="vip">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Seguimiento de Envíos</h1>
          <p className="text-muted-foreground">Rastrea tus paquetes en tiempo real</p>
        </div>

        {/* Search Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Buscar Envío
            </CardTitle>
            <CardDescription>Ingresa el código de seguimiento para ver el estado de tu paquete</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3">
              <div className="flex-1">
                <Input
                  placeholder="ENV-2025-001234"
                  value={trackingCode}
                  onChange={(e) => setTrackingCode(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
              </div>
              <Button onClick={handleSearch} disabled={!trackingCode || loading}>
                {loading ? "Buscando..." : "Rastrear"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tracking Results */}
        {shipment && (
          <div className="space-y-6">
            {/* Shipment Info */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Package className="h-4 w-4" />
                    Información del Envío
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Código de Seguimiento</p>
                    <p className="font-mono text-sm font-semibold">{shipment.codigo}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Servicio</p>
                    <div className="flex items-center gap-2">
                      {getServiceIcon(shipment.servicio)}
                      <span className="text-sm font-medium">{shipment.servicio}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Estado Actual</p>
                    <Badge className={getStatusColor(shipment.estado)}>{shipment.estado.replace(/_/g, " ")}</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Ruta
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Origen</p>
                    <p className="text-sm font-medium">{shipment.origen}</p>
                  </div>
                  <Separator />
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Destino</p>
                    <p className="text-sm font-medium">{shipment.destino}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Fechas
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Fecha de Envío</p>
                    <p className="text-sm font-medium">
                      {new Date(shipment.fechaEnvio).toLocaleDateString("es-ES", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <Separator />
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Entrega Estimada</p>
                    <p className="text-sm font-medium">
                      {new Date(shipment.fechaEstimada).toLocaleDateString("es-ES", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>Historial de Seguimiento</CardTitle>
                <CardDescription>Eventos y actualizaciones del envío</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  {/* Timeline line */}
                  <div className="absolute left-[15px] top-0 bottom-0 w-0.5 bg-border" />

                  {/* Events */}
                  <div className="space-y-6">
                    {shipment.eventos.map((evento, index) => (
                      <div key={index} className="relative flex gap-4">
                        {/* Timeline dot */}
                        <div
                          className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 ${
                            evento.completado
                              ? "bg-chart-3 border-chart-3"
                              : index === shipment.eventos.findIndex((e) => !e.completado)
                                ? "bg-primary border-primary animate-pulse"
                                : "bg-muted border-border"
                          }`}
                        >
                          {evento.completado ? (
                            <CheckCircle2 className="h-4 w-4 text-background" />
                          ) : index === shipment.eventos.findIndex((e) => !e.completado) ? (
                            <Clock className="h-4 w-4 text-background" />
                          ) : (
                            <div className="h-2 w-2 rounded-full bg-muted-foreground" />
                          )}
                        </div>

                        {/* Event content */}
                        <div className="flex-1 pb-6">
                          <div className="flex items-start justify-between gap-4 mb-1">
                            <h3 className="font-semibold">{evento.descripcion}</h3>
                            <div className="text-right text-sm text-muted-foreground whitespace-nowrap">
                              <p>{evento.fecha}</p>
                              <p>{evento.hora}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <MapPin className="h-3 w-3" />
                            <span>{evento.ubicacion}</span>
                          </div>
                          {index === shipment.eventos.findIndex((e) => !e.completado) && (
                            <Badge className="mt-2 bg-primary/20 text-primary border-primary/30">Estado Actual</Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Alert if in customs */}
            {shipment.estado === "EN_ADUANA" && (
              <Card className="border-chart-4/50 bg-chart-4/5">
                <CardContent className="pt-6">
                  <div className="flex gap-3">
                    <AlertCircle className="h-5 w-5 text-chart-4 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium mb-1">Tu paquete está en aduana</p>
                      <p className="text-sm text-muted-foreground">
                        El proceso aduanal puede tomar de 1 a 3 días hábiles. Asegúrate de tener tu documentación lista
                        en caso de ser requerida.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Recent Shipments */}
        {!shipment && (
          <Card>
            <CardHeader>
              <CardTitle>Envíos Recientes</CardTitle>
              <CardDescription>Tus últimos paquetes rastreados</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { codigo: "ENV-2025-001234", estado: "En tránsito", fecha: "Hoy" },
                  { codigo: "ENV-2025-001235", estado: "Entregado", fecha: "Ayer" },
                  { codigo: "ENV-2025-001236", estado: "En aduana", fecha: "2 días" },
                ].map((item) => (
                  <Button
                    key={item.codigo}
                    variant="outline"
                    className="w-full justify-between h-auto py-3 bg-transparent"
                    onClick={() => {
                      setTrackingCode(item.codigo)
                      handleSearch()
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <Package className="h-4 w-4" />
                      <div className="text-left">
                        <p className="font-mono text-sm font-medium">{item.codigo}</p>
                        <p className="text-xs text-muted-foreground">{item.estado}</p>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground">{item.fecha}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}
