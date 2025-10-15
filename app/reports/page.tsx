"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { FileText, Download, Package, DollarSign, Calendar, MapPin, User, Building2 } from "lucide-react"

interface CustomsReport {
  codigoEnvio: string
  fecha: string
  remitente: {
    nombre: string
    direccion: string
    pais: string
  }
  destinatario: {
    nombre: string
    direccion: string
    pais: string
  }
  productos: Array<{
    descripcion: string
    hsCode: string
    valor: number
    peso: number
  }>
  costos: {
    valorMercancia: number
    envio: number
    impuestos: number
    total: number
  }
}

const mockReport: CustomsReport = {
  codigoEnvio: "ENV-2025-001234",
  fecha: "2025-10-07",
  remitente: {
    nombre: "John Smith",
    direccion: "123 Main Street, Miami, FL 33126",
    pais: "Estados Unidos",
  },
  destinatario: {
    nombre: "Juan Pérez",
    direccion: "Avenida Reforma 10-00, Zona 10, Ciudad de Guatemala",
    pais: "Guatemala",
  },
  productos: [
    {
      descripcion: "Laptop Dell XPS 15",
      hsCode: "8471.30.01",
      valor: 1200,
      peso: 2.5,
    },
    {
      descripcion: "Mouse inalámbrico Logitech",
      hsCode: "8471.60.72",
      valor: 25,
      peso: 0.2,
    },
  ],
  costos: {
    valorMercancia: 1225,
    envio: 85,
    impuestos: 183.75,
    total: 1493.75,
  },
}

export default function ReportsPage() {
  const [selectedReport, setSelectedReport] = useState<CustomsReport | null>(null)

  const generateReport = () => {
    setSelectedReport(mockReport)
  }

  const downloadPDF = () => {
    // Simulate PDF download
    alert("Descargando reporte en PDF...")
  }

  return (
    <DashboardLayout >
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Reportes Aduanales</h1>
          <p className="text-muted-foreground">Genera y descarga documentación para aduanas</p>
        </div>

        {/* Report Generator */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Generar Reporte
            </CardTitle>
            <CardDescription>Selecciona un envío para generar su documentación aduanal</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="codigo">Código de Envío</Label>
              <div className="flex gap-3">
                <Input id="codigo" placeholder="ENV-2025-001234" defaultValue="ENV-2025-001234" />
                <Button onClick={generateReport}>Generar</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Report Display */}
        {selectedReport && (
          <div className="space-y-6">
            {/* Report Header */}
            <Card className="border-primary/50">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl mb-2">Declaración de Productos - Aduana</CardTitle>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4" />
                        <span className="font-mono">{selectedReport.codigoEnvio}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {new Date(selectedReport.fecha).toLocaleDateString("es-ES", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Button onClick={downloadPDF}>
                    <Download className="h-4 w-4 mr-2" />
                    Descargar PDF
                  </Button>
                </div>
              </CardHeader>
            </Card>

            {/* Parties Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Remitente
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div>
                    <p className="text-sm font-semibold">{selectedReport.remitente.nombre}</p>
                    <p className="text-sm text-muted-foreground">{selectedReport.remitente.direccion}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <MapPin className="h-3 w-3 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">{selectedReport.remitente.pais}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    Destinatario
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div>
                    <p className="text-sm font-semibold">{selectedReport.destinatario.nombre}</p>
                    <p className="text-sm text-muted-foreground">{selectedReport.destinatario.direccion}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <MapPin className="h-3 w-3 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">{selectedReport.destinatario.pais}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Products List */}
            <Card>
              <CardHeader>
                <CardTitle>Productos Declarados</CardTitle>
                <CardDescription>Lista detallada de artículos en el envío</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {selectedReport.productos.map((producto, index) => (
                    <div key={index}>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <Badge variant="outline" className="font-mono text-xs">
                              {index + 1}
                            </Badge>
                            <h3 className="font-semibold">{producto.descripcion}</h3>
                          </div>
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div>
                              <p className="text-muted-foreground text-xs mb-1">Código HS</p>
                              <p className="font-mono">{producto.hsCode}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground text-xs mb-1">Valor Declarado</p>
                              <p className="font-semibold">${producto.valor.toFixed(2)}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground text-xs mb-1">Peso</p>
                              <p>{producto.peso} kg</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      {index < selectedReport.productos.length - 1 && <Separator className="mt-4" />}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Cost Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Desglose de Costos
                </CardTitle>
                <CardDescription>Detalle de tarifas e impuestos</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Valor de Mercancía</span>
                    <span className="font-medium">${selectedReport.costos.valorMercancia.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Costo de Envío</span>
                    <span className="font-medium">${selectedReport.costos.envio.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Impuestos Aduanales (15%)</span>
                    <span className="font-medium">${selectedReport.costos.impuestos.toFixed(2)}</span>
                  </div>

                  <Separator />

                  <div className="flex justify-between items-center pt-2">
                    <span className="text-lg font-semibold">Total a Pagar</span>
                    <span className="text-2xl font-bold">${selectedReport.costos.total.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Commitment Letter */}
            <Card className="border-chart-4/50 bg-chart-4/5">
              <CardHeader>
                <CardTitle className="text-base">Carta Compromiso</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <p>
                    Yo, <strong>{selectedReport.destinatario.nombre}</strong>, declaro bajo juramento que la información
                    proporcionada en este documento es verdadera y completa.
                  </p>
                  <p>
                    Me comprometo a cumplir con todas las regulaciones aduanales del país de destino y asumo la
                    responsabilidad por cualquier discrepancia en la información declarada.
                  </p>
                  <div className="pt-4 flex items-center justify-between border-t border-border">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Firma Digital</p>
                      <p className="font-mono text-xs">{selectedReport.codigoEnvio}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground mb-1">Fecha</p>
                      <p className="text-xs">
                        {new Date(selectedReport.fecha).toLocaleDateString("es-ES", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Recent Reports */}
        {!selectedReport && (
          <Card>
            <CardHeader>
              <CardTitle>Reportes Recientes</CardTitle>
              <CardDescription>Tus últimos reportes generados</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { codigo: "ENV-2025-001234", fecha: "2025-10-07", tipo: "Declaración Aduanal" },
                  { codigo: "ENV-2025-001235", fecha: "2025-10-06", tipo: "Declaración Aduanal" },
                  { codigo: "ENV-2025-001236", fecha: "2025-10-05", tipo: "Declaración Aduanal" },
                ].map((item) => (
                  <Button
                    key={item.codigo}
                    variant="outline"
                    className="w-full justify-between h-auto py-3 bg-transparent"
                    onClick={generateReport}
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="h-4 w-4" />
                      <div className="text-left">
                        <p className="font-mono text-sm font-medium">{item.codigo}</p>
                        <p className="text-xs text-muted-foreground">{item.tipo}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-muted-foreground">{item.fecha}</span>
                      <Download className="h-4 w-4" />
                    </div>
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
