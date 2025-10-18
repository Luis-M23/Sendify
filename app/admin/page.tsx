"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  DollarSign,
  Users,
  Package,
  TrendingUp,
  TrendingDown,
  FileText,
  Download,
  Edit,
  Trash2,
  Plus,
  BarChart3,
} from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { TariffModal, UserModal, PromotionModal, DeleteConfirmDialog } from "@/components/admin-modals"

const revenueData = [
  { mes: "Ene", ingresos: 45000, envios: 320 },
  { mes: "Feb", ingresos: 52000, envios: 380 },
  { mes: "Mar", ingresos: 48000, envios: 350 },
  { mes: "Abr", ingresos: 61000, envios: 420 },
  { mes: "May", ingresos: 55000, envios: 390 },
  { mes: "Jun", ingresos: 67000, envios: 450 },
]

const serviceData = [
  { name: "Aéreo", value: 45, color: "oklch(0.488 0.243 264.376)" },
  { name: "Terrestre", value: 35, color: "oklch(0.696 0.17 162.48)" },
  { name: "Marítimo", value: 20, color: "oklch(0.769 0.188 70.08)" },
]

const tarifas = [
  { id: 1, servicio: "Aéreo", origen: "US", destino: "GT", pesoMin: 0, pesoMax: 5, tarifa: 25 },
  { id: 2, servicio: "Aéreo", origen: "US", destino: "GT", pesoMin: 5, pesoMax: 10, tarifa: 22 },
  { id: 3, servicio: "Terrestre", origen: "US", destino: "GT", pesoMin: 0, pesoMax: 10, tarifa: 15 },
  { id: 4, servicio: "Marítimo", origen: "CN", destino: "GT", pesoMin: 0, pesoMax: 50, tarifa: 8 },
]

const usuarios = [
  { id: 1, nombre: "Juan Pérez", email: "juan@ejemplo.com", rol: "VIP - Oro", envios: 45, estado: "activo" },
  { id: 2, nombre: "María García", email: "maria@ejemplo.com", rol: "VIP - Plata", envios: 28, estado: "activo" },
  { id: 3, nombre: "Carlos López", email: "carlos@ejemplo.com", rol: "Cliente", envios: 12, estado: "activo" },
  { id: 4, nombre: "Ana Martínez", email: "ana@ejemplo.com", rol: "VIP - Platino", envios: 67, estado: "activo" },
]

export default function AdminPage() {
  const [tariffModalOpen, setTariffModalOpen] = useState(false)
  const [tariffModalMode, setTariffModalMode] = useState<"add" | "edit">("add")
  const [selectedTariff, setSelectedTariff] = useState<any>(null)

  const [userModalOpen, setUserModalOpen] = useState(false)
  const [userModalMode, setUserModalMode] = useState<"add" | "edit">("add")
  const [selectedUser, setSelectedUser] = useState<any>(null)

  const [promotionModalOpen, setPromotionModalOpen] = useState(false)
  const [promotionModalMode, setPromotionModalMode] = useState<"add" | "edit">("add")
  const [selectedPromotion, setSelectedPromotion] = useState<any>(null)

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleteItem, setDeleteItem] = useState<{ type: string; name: string; id: any } | null>(null)

  const handleAddTariff = () => {
    setTariffModalMode("add")
    setSelectedTariff(null)
    setTariffModalOpen(true)
  }

  const handleEditTariff = (tariff: any) => {
    setTariffModalMode("edit")
    setSelectedTariff(tariff)
    setTariffModalOpen(true)
  }

  const handleTariffSubmit = (data: any) => {
  }

  const handleAddUser = () => {
    setUserModalMode("add")
    setSelectedUser(null)
    setUserModalOpen(true)
  }

  const handleEditUser = (user: any) => {
    setUserModalMode("edit")
    setSelectedUser(user)
    setUserModalOpen(true)
  }

  const handleUserSubmit = (data: any) => {
  }

  const handleAddPromotion = () => {
    setPromotionModalMode("add")
    setSelectedPromotion(null)
    setPromotionModalOpen(true)
  }

  const handleDeleteClick = (type: string, name: string, id: any) => {
    setDeleteItem({ type, name, id })
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = () => {
  }

  return (
    <DashboardLayout >
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Panel Administrativo</h1>
          <p className="text-muted-foreground">Gestión completa del sistema de envíos</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Ingresos del Mes</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$67,000</div>
              <div className="flex items-center gap-1 text-xs text-chart-3 mt-1">
                <TrendingUp className="h-3 w-3" />
                <span>+12.5% vs mes anterior</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Envíos Totales</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">450</div>
              <div className="flex items-center gap-1 text-xs text-chart-3 mt-1">
                <TrendingUp className="h-3 w-3" />
                <span>+8.2% vs mes anterior</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Clientes Activos</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,234</div>
              <div className="flex items-center gap-1 text-xs text-chart-3 mt-1">
                <TrendingUp className="h-3 w-3" />
                <span>+5.1% vs mes anterior</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Ticket Promedio</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$148.89</div>
              <div className="flex items-center gap-1 text-xs text-destructive mt-1">
                <TrendingDown className="h-3 w-3" />
                <span>-2.3% vs mes anterior</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Ingresos y Envíos</CardTitle>
              <CardDescription>Últimos 6 meses</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.269 0 0)" />
                  <XAxis dataKey="mes" stroke="oklch(0.708 0 0)" />
                  <YAxis stroke="oklch(0.708 0 0)" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "oklch(0.205 0 0)",
                      border: "1px solid oklch(0.269 0 0)",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey="ingresos" fill="oklch(0.488 0.243 264.376)" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Distribución por Servicio</CardTitle>
              <CardDescription>Porcentaje de envíos</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={serviceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {serviceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "oklch(0.205 0 0)",
                      border: "1px solid oklch(0.269 0 0)",
                      borderRadius: "8px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-2">
                {serviceData.map((item) => (
                  <div key={item.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <span>{item.name}</span>
                    </div>
                    <span className="font-semibold">{item.value}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="cursor-pointer hover:border-primary transition-colors" onClick={() => window.location.href = '/admin/categorias'}>
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-chart-1/10 flex items-center justify-center mb-3">
                <Package className="h-6 w-6 text-chart-1" />
              </div>
              <CardTitle className="text-lg">Categorías</CardTitle>
              <CardDescription>Gestiona categorías de productos y restricciones</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full bg-transparent">
                <Package className="h-4 w-4 mr-2" />
                Administrar Categorías
              </Button>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:border-primary transition-colors" onClick={() => window.location.href = '/admin/paises'}>
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-chart-2/10 flex items-center justify-center mb-3">
                <Users className="h-6 w-6 text-chart-2" />
              </div>
              <CardTitle className="text-lg">Países</CardTitle>
              <CardDescription>Administra países y configuraciones de aduana</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full bg-transparent">
                <Users className="h-4 w-4 mr-2" />
                Administrar Países
              </Button>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:border-primary transition-colors" onClick={() => window.location.href = '/admin/promociones'}>
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-chart-4/10 flex items-center justify-center mb-3">
                <TrendingUp className="h-6 w-6 text-chart-4" />
              </div>
              <CardTitle className="text-lg">Promociones</CardTitle>
              <CardDescription>Gestiona promociones y descuentos</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full bg-transparent">
                <TrendingUp className="h-4 w-4 mr-2" />
                Administrar Promociones
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Management Tabs */}
        <Tabs defaultValue="tarifas" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="tarifas">Tarifas</TabsTrigger>
            <TabsTrigger value="usuarios">Usuarios</TabsTrigger>
            <TabsTrigger value="promociones">Promociones</TabsTrigger>
            <TabsTrigger value="reportes">Reportes</TabsTrigger>
          </TabsList>

          {/* Tarifas Tab */}
          <TabsContent value="tarifas" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Gestión de Tarifas</CardTitle>
                    <CardDescription>Administra las tarifas por servicio y ruta</CardDescription>
                  </div>
                  <Button onClick={handleAddTariff}>
                    <Plus className="h-4 w-4 mr-2" />
                    Nueva Tarifa
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Servicio</TableHead>
                      <TableHead>Ruta</TableHead>
                      <TableHead>Peso (kg)</TableHead>
                      <TableHead>Tarifa ($/kg)</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tarifas.map((tarifa) => (
                      <TableRow key={tarifa.id}>
                        <TableCell>
                          <Badge variant="outline">{tarifa.servicio}</Badge>
                        </TableCell>
                        <TableCell>
                          {tarifa.origen} → {tarifa.destino}
                        </TableCell>
                        <TableCell>
                          {tarifa.pesoMin} - {tarifa.pesoMax}
                        </TableCell>
                        <TableCell className="font-semibold">${tarifa.tarifa}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon" onClick={() => handleEditTariff(tarifa)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() =>
                                handleDeleteClick(
                                  "tarifa",
                                  `${tarifa.servicio} ${tarifa.origen}→${tarifa.destino}`,
                                  tarifa.id,
                                )
                              }
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Configuración de Impuestos</CardTitle>
                <CardDescription>Ajusta los porcentajes de impuestos y recargos</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="impuesto">Impuesto Aduanal (%)</Label>
                    <Input id="impuesto" type="number" defaultValue="15" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="combustible">Recargo Combustible (%)</Label>
                    <Input id="combustible" type="number" defaultValue="8" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="seguro">Seguro (%)</Label>
                    <Input id="seguro" type="number" defaultValue="2" />
                  </div>
                </div>
                <Button>Guardar Cambios</Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Usuarios Tab */}
          <TabsContent value="usuarios" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Gestión de Usuarios</CardTitle>
                    <CardDescription>Administra clientes y sus niveles VIP</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Input placeholder="Buscar usuario..." className="w-64" />
                    <Button onClick={handleAddUser}>
                      <Plus className="h-4 w-4 mr-2" />
                      Nuevo Usuario
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Nivel</TableHead>
                      <TableHead>Envíos</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {usuarios.map((usuario) => (
                      <TableRow key={usuario.id}>
                        <TableCell className="font-medium">{usuario.nombre}</TableCell>
                        <TableCell>{usuario.email}</TableCell>
                        <TableCell>
                          <Badge
                            className={
                              usuario.rol.includes("Platino")
                                ? "bg-chart-5/20 text-chart-5 border-chart-5/30"
                                : usuario.rol.includes("Oro")
                                  ? "bg-chart-4/20 text-chart-4 border-chart-4/30"
                                  : usuario.rol.includes("Plata")
                                    ? "bg-chart-2/20 text-chart-2 border-chart-2/30"
                                    : "bg-muted text-muted-foreground"
                            }
                          >
                            {usuario.rol}
                          </Badge>
                        </TableCell>
                        <TableCell>{usuario.envios}</TableCell>
                        <TableCell>
                          <Badge className="bg-chart-3/20 text-chart-3 border-chart-3/30">{usuario.estado}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon" onClick={() => handleEditUser(usuario)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteClick("usuario", usuario.nombre, usuario.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Promociones Tab */}
          <TabsContent value="promociones" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Gestión de Promociones</CardTitle>
                    <CardDescription>Administra promociones y descuentos</CardDescription>
                  </div>
                  <Button onClick={() => window.location.href = '/admin/promociones'}>
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Ir a Gestión de Promociones
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <TrendingUp className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>La gestión completa de promociones se ha movido a una sección dedicada</p>
                  <p className="text-sm mt-2">Haz clic en el botón de arriba para acceder a todas las funcionalidades</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reportes Tab */}
          <TabsContent value="reportes" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Generador de Reportes</CardTitle>
                <CardDescription>Genera reportes personalizados del sistema</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="tipo-reporte">Tipo de Reporte</Label>
                    <Select>
                      <SelectTrigger id="tipo-reporte">
                        <SelectValue placeholder="Seleccionar tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ingresos">Ingresos</SelectItem>
                        <SelectItem value="envios">Envíos</SelectItem>
                        <SelectItem value="clientes">Clientes</SelectItem>
                        <SelectItem value="productos">Productos</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fecha-inicio">Fecha Inicio</Label>
                    <Input id="fecha-inicio" type="date" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fecha-fin">Fecha Fin</Label>
                    <Input id="fecha-fin" type="date" />
                  </div>
                </div>
                <Button className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Generar Reporte
                </Button>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="cursor-pointer hover:border-primary transition-colors">
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">Reporte de Ingresos</CardTitle>
                  <CardDescription>Análisis detallado de ingresos por período</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full bg-transparent">
                    <Download className="h-4 w-4 mr-2" />
                    Descargar
                  </Button>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:border-primary transition-colors">
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-chart-2/10 flex items-center justify-center mb-3">
                    <Package className="h-6 w-6 text-chart-2" />
                  </div>
                  <CardTitle className="text-lg">Reporte de Envíos</CardTitle>
                  <CardDescription>Estadísticas de envíos por servicio y destino</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full bg-transparent">
                    <Download className="h-4 w-4 mr-2" />
                    Descargar
                  </Button>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:border-primary transition-colors">
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-chart-4/10 flex items-center justify-center mb-3">
                    <Users className="h-6 w-6 text-chart-4" />
                  </div>
                  <CardTitle className="text-lg">Reporte de Clientes</CardTitle>
                  <CardDescription>Análisis de clientes y niveles VIP</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full bg-transparent">
                    <Download className="h-4 w-4 mr-2" />
                    Descargar
                  </Button>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:border-primary transition-colors">
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-chart-3/10 flex items-center justify-center mb-3">
                    <BarChart3 className="h-6 w-6 text-chart-3" />
                  </div>
                  <CardTitle className="text-lg">Reporte Ejecutivo</CardTitle>
                  <CardDescription>Resumen general del negocio</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full bg-transparent">
                    <Download className="h-4 w-4 mr-2" />
                    Descargar
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Modal Components */}
      <TariffModal
        open={tariffModalOpen}
        onOpenChange={setTariffModalOpen}
        mode={tariffModalMode}
        initialData={selectedTariff}
        onSubmit={handleTariffSubmit}
      />

      <UserModal
        open={userModalOpen}
        onOpenChange={setUserModalOpen}
        mode={userModalMode}
        initialData={selectedUser}
        onSubmit={handleUserSubmit}
      />

      <PromotionModal
        open={promotionModalOpen}
        onOpenChange={setPromotionModalOpen}
        mode={promotionModalMode}
        initialData={selectedPromotion}
        onSubmit={handleAddPromotion}
      />

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title={`Eliminar ${deleteItem?.type}`}
        description={`¿Estás seguro de que deseas eliminar "${deleteItem?.name}"? Esta acción no se puede deshacer.`}
        itemName={deleteItem?.name || ""}
        onConfirm={handleDeleteConfirm}
      />
    </DashboardLayout>
  )
}
