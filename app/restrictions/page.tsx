"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Shield, AlertTriangle, CheckCircle2, XCircle, Info, Plane, Truck, Ship, Search } from "lucide-react"

interface Restriction {
  categoria: string
  aereo: "permitido" | "prohibido" | "requiere-permiso"
  terrestre: "permitido" | "prohibido" | "requiere-permiso"
  maritimo: "permitido" | "prohibido" | "requiere-permiso"
  notas?: string
}

const restricciones: Restriction[] = [
  {
    categoria: "Líquidos inflamables",
    aereo: "prohibido",
    terrestre: "permitido",
    maritimo: "permitido",
    notas: "Requiere embalaje especial para transporte terrestre y marítimo",
  },
  {
    categoria: "Gases presurizados",
    aereo: "prohibido",
    terrestre: "permitido",
    maritimo: "permitido",
    notas: "Incluye aerosoles, extintores, tanques de gas",
  },
  {
    categoria: "Baterías de litio",
    aereo: "requiere-permiso",
    terrestre: "permitido",
    maritimo: "permitido",
    notas: "Aéreo: máximo 100Wh sin permiso especial",
  },
  {
    categoria: "Productos químicos",
    aereo: "prohibido",
    terrestre: "requiere-permiso",
    maritimo: "permitido",
    notas: "Requiere hoja de seguridad (MSDS)",
  },
  {
    categoria: "Alimentos perecederos",
    aereo: "permitido",
    terrestre: "requiere-permiso",
    maritimo: "prohibido",
    notas: "Requiere refrigeración y empaque especial",
  },
  {
    categoria: "Electrónicos",
    aereo: "permitido",
    terrestre: "permitido",
    maritimo: "permitido",
    notas: "Sin restricciones especiales",
  },
  {
    categoria: "Medicamentos",
    aereo: "requiere-permiso",
    terrestre: "permitido",
    maritimo: "permitido",
    notas: "Requiere receta médica o permiso sanitario",
  },
  {
    categoria: "Armas y municiones",
    aereo: "prohibido",
    terrestre: "prohibido",
    maritimo: "prohibido",
    notas: "Prohibido en todos los servicios",
  },
  {
    categoria: "Materiales radioactivos",
    aereo: "prohibido",
    terrestre: "prohibido",
    maritimo: "prohibido",
    notas: "Prohibido en todos los servicios",
  },
  {
    categoria: "Joyas y metales preciosos",
    aereo: "permitido",
    terrestre: "permitido",
    maritimo: "permitido",
    notas: "Requiere seguro adicional",
  },
]

export default function RestrictionsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedService, setSelectedService] = useState<string>("todos")
  const [selectedProduct, setSelectedProduct] = useState("")
  const [validationResult, setValidationResult] = useState<Restriction | null>(null)

  const filteredRestrictions = restricciones.filter((r) => r.categoria.toLowerCase().includes(searchTerm.toLowerCase()))

  const validateProduct = () => {
    const result = restricciones.find((r) => r.categoria === selectedProduct)
    setValidationResult(result || null)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "permitido":
        return <CheckCircle2 className="h-5 w-5 text-chart-3" />
      case "prohibido":
        return <XCircle className="h-5 w-5 text-destructive" />
      case "requiere-permiso":
        return <AlertTriangle className="h-5 w-5 text-chart-4" />
      default:
        return null
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "permitido":
        return <Badge className="bg-chart-3/20 text-chart-3 hover:bg-chart-3/30 border-chart-3/30">Permitido</Badge>
      case "prohibido":
        return (
          <Badge className="bg-destructive/20 text-destructive hover:bg-destructive/30 border-destructive/30">
            Prohibido
          </Badge>
        )
      case "requiere-permiso":
        return (
          <Badge className="bg-chart-4/20 text-chart-4 hover:bg-chart-4/30 border-chart-4/30">Requiere Permiso</Badge>
        )
      default:
        return null
    }
  }

  return (
    <DashboardLayout userRole="vip">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Restricciones de Productos</h1>
          <p className="text-muted-foreground">Consulta qué productos puedes enviar según el tipo de transporte</p>
        </div>

        {/* Validation Tool */}
        <Card className="border-primary/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Validador de Productos
            </CardTitle>
            <CardDescription>Verifica si tu producto puede ser enviado</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="product">Categoría de Producto</Label>
                <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                  <SelectTrigger id="product">
                    <SelectValue placeholder="Seleccionar categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    {restricciones.map((r) => (
                      <SelectItem key={r.categoria} value={r.categoria}>
                        {r.categoria}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button className="w-full" onClick={validateProduct} disabled={!selectedProduct}>
                  <Search className="mr-2 h-4 w-4" />
                  Validar Producto
                </Button>
              </div>
            </div>

            {validationResult && (
              <div className="mt-6 p-4 rounded-lg border bg-card">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Info className="h-5 w-5 text-primary" />
                  Resultado de Validación: {validationResult.categoria}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-background">
                    <Plane className="h-6 w-6 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="text-sm font-medium mb-1">Aéreo</p>
                      {getStatusBadge(validationResult.aereo)}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-lg bg-background">
                    <Truck className="h-6 w-6 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="text-sm font-medium mb-1">Terrestre</p>
                      {getStatusBadge(validationResult.terrestre)}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-lg bg-background">
                    <Ship className="h-6 w-6 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="text-sm font-medium mb-1">Marítimo</p>
                      {getStatusBadge(validationResult.maritimo)}
                    </div>
                  </div>
                </div>

                {validationResult.notas && (
                  <div className="flex gap-3 p-3 rounded-lg bg-muted/50">
                    <AlertTriangle className="h-5 w-5 text-chart-4 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium mb-1">Notas Importantes</p>
                      <p className="text-sm text-muted-foreground">{validationResult.notas}</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Search and Filter */}
        <Card>
          <CardHeader>
            <CardTitle>Matriz de Restricciones</CardTitle>
            <CardDescription>Consulta todas las restricciones por categoría de producto</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Buscar categoría..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
            </div>

            <Separator />

            {/* Restrictions Table */}
            <div className="space-y-3">
              {filteredRestrictions.map((restriction) => (
                <Card key={restriction.categoria} className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">{restriction.categoria}</h3>
                        {restriction.notas && <p className="text-sm text-muted-foreground">{restriction.notas}</p>}
                      </div>

                      <div className="flex gap-3">
                        <div className="flex items-center gap-2 min-w-[120px]">
                          <Plane className="h-4 w-4 text-muted-foreground" />
                          {getStatusBadge(restriction.aereo)}
                        </div>
                        <div className="flex items-center gap-2 min-w-[120px]">
                          <Truck className="h-4 w-4 text-muted-foreground" />
                          {getStatusBadge(restriction.terrestre)}
                        </div>
                        <div className="flex items-center gap-2 min-w-[120px]">
                          <Ship className="h-4 w-4 text-muted-foreground" />
                          {getStatusBadge(restriction.maritimo)}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Legend */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Leyenda</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-chart-3" />
                <div>
                  <p className="text-sm font-medium">Permitido</p>
                  <p className="text-xs text-muted-foreground">Sin restricciones especiales</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-5 w-5 text-chart-4" />
                <div>
                  <p className="text-sm font-medium">Requiere Permiso</p>
                  <p className="text-xs text-muted-foreground">Documentación adicional necesaria</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <XCircle className="h-5 w-5 text-destructive" />
                <div>
                  <p className="text-sm font-medium">Prohibido</p>
                  <p className="text-xs text-muted-foreground">No se puede enviar por este medio</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
