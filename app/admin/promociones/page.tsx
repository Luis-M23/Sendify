"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Plus, Edit, Trash2, Search, Calendar, Percent, Users, Copy } from "lucide-react"
import { PromotionModalExtended } from "@/components/admin-modals-extended"
import { PromotionsService } from "@/lib/services/promotionsService"
import { Promotion, CreatePromotion, UpdatePromotion } from "@/lib/validation/promotions"
import { useToast } from "@/hooks/use-toast"

export default function PromotionsAdminPage() {
  const [promotions, setPromotions] = useState<Promotion[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [modalOpen, setModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<"add" | "edit">("add")
  const [selectedPromotion, setSelectedPromotion] = useState<Promotion | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [promotionToDelete, setPromotionToDelete] = useState<Promotion | null>(null)
  const [showInactive, setShowInactive] = useState(false)
  const { toast } = useToast()

  const loadPromotions = async () => {
    try {
      setLoading(true)
      const data = showInactive 
        ? await PromotionsService.getAllIncludingInactive()
        : await PromotionsService.getAll()
      setPromotions(data)
    } catch (error) {
      console.error("Error loading promotions:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPromotions()
  }, [showInactive])

  const filteredPromotions = promotions.filter(promotion =>
    promotion.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    promotion.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
    promotion.codigoPromocional?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleAddPromotion = () => {
    setModalMode("add")
    setSelectedPromotion(null)
    setModalOpen(true)
  }

  const handleEditPromotion = (promotion: Promotion) => {
    setModalMode("edit")
    setSelectedPromotion(promotion)
    setModalOpen(true)
  }

  const handleDeletePromotion = (promotion: Promotion) => {
    setPromotionToDelete(promotion)
    setDeleteDialogOpen(true)
  }

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code)
    toast({
      title: "Código copiado",
      description: `El código ${code} ha sido copiado al portapapeles.`,
    })
  }

  const handleModalSubmit = async (data: CreatePromotion | UpdatePromotion) => {
    try {
      if (modalMode === "add") {
        await PromotionsService.create(data as CreatePromotion)
      } else {
        await PromotionsService.update(selectedPromotion!.id!, data as UpdatePromotion)
      }
      await loadPromotions()
    } catch (error) {
      console.error("Error saving promotion:", error)
    }
  }

  const handleDeleteConfirm = async () => {
    if (promotionToDelete) {
      try {
        await PromotionsService.delete(promotionToDelete.id!)
        await loadPromotions()
      } catch (error) {
        console.error("Error deleting promotion:", error)
      }
    }
    setDeleteDialogOpen(false)
    setPromotionToDelete(null)
  }

  const getTypeColor = (tipo: string) => {
    const colors: Record<string, string> = {
      "descuento": "bg-blue-100 text-blue-800 border-blue-200",
      "envio-gratis": "bg-green-100 text-green-800 border-green-200",
      "volumen": "bg-purple-100 text-purple-800 border-purple-200",
      "temporada": "bg-orange-100 text-orange-800 border-orange-200",
    }
    return colors[tipo] || "bg-gray-100 text-gray-800 border-gray-200"
  }

  const getTypeLabel = (tipo: string) => {
    const labels: Record<string, string> = {
      "descuento": "Descuento",
      "envio-gratis": "Envío Gratis",
      "volumen": "Volumen",
      "temporada": "Temporada",
    }
    return labels[tipo] || tipo
  }

  const isActive = (promotion: Promotion) => {
    const now = new Date()
    const startDate = new Date(promotion.fechaInicio)
    const endDate = new Date(promotion.fechaFin)
    return promotion.activo && startDate <= now && endDate >= now
  }

  const isExpired = (promotion: Promotion) => {
    const now = new Date()
    const endDate = new Date(promotion.fechaFin)
    return endDate < now
  }

  const getUsagePercentage = (promotion: Promotion) => {
    if (!promotion.limiteUsos) return 0
    return (promotion.usosActuales / promotion.limiteUsos) * 100
  }

  return (
    <DashboardLayout userRole="admin">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Gestión de Promociones</h1>
          <p className="text-muted-foreground">Administra promociones y descuentos para clientes</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Promociones Activas</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {promotions.filter(isActive).length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Promociones</CardTitle>
              <Percent className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{promotions.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Uso Total</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {promotions.reduce((sum, p) => sum + p.usosActuales, 0)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Expiradas</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {promotions.filter(isExpired).length}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Promociones</CardTitle>
                <CardDescription>Gestiona todas las promociones y descuentos disponibles</CardDescription>
              </div>
              <div className="flex gap-2">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="showInactive"
                    checked={showInactive}
                    onChange={(e) => setShowInactive(e.target.checked)}
                    className="rounded"
                  />
                  <label htmlFor="showInactive" className="text-sm">Mostrar inactivas</label>
                </div>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar promociones..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8 w-64"
                  />
                </div>
                <Button onClick={handleAddPromotion}>
                  <Plus className="h-4 w-4 mr-2" />
                  Nueva Promoción
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="text-muted-foreground mt-2">Cargando promociones...</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Promoción</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Período</TableHead>
                    <TableHead>Código</TableHead>
                    <TableHead>Uso</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPromotions.map((promotion) => (
                    <TableRow key={promotion.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{promotion.nombre}</div>
                          <div className="text-sm text-muted-foreground max-w-xs truncate">
                            {promotion.descripcion}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getTypeColor(promotion.tipo)}>
                          {getTypeLabel(promotion.tipo)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">
                          {promotion.tipoValor === "porcentaje" 
                            ? `${promotion.valor}%`
                            : `$${promotion.valor}`
                          }
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{new Date(promotion.fechaInicio).toLocaleDateString()}</div>
                          <div className="text-muted-foreground">
                            {new Date(promotion.fechaFin).toLocaleDateString()}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {promotion.codigoPromocional ? (
                          <div className="flex items-center gap-1">
                            <Badge variant="outline" className="font-mono">
                              {promotion.codigoPromocional}
                            </Badge>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => handleCopyCode(promotion.codigoPromocional!)}
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {promotion.limiteUsos ? (
                          <div className="text-sm">
                            <div>{promotion.usosActuales}/{promotion.limiteUsos}</div>
                            <div className="w-16 bg-muted rounded-full h-1.5 mt-1">
                              <div 
                                className="bg-primary h-1.5 rounded-full" 
                                style={{ width: `${getUsagePercentage(promotion)}%` }}
                              />
                            </div>
                          </div>
                        ) : (
                          <span className="font-medium">{promotion.usosActuales}</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {!promotion.activo ? (
                          <Badge className="bg-gray-100 text-gray-800 border-gray-200">Inactiva</Badge>
                        ) : isExpired(promotion) ? (
                          <Badge className="bg-destructive/20 text-destructive border-destructive/30">Expirada</Badge>
                        ) : isActive(promotion) ? (
                          <Badge className="bg-chart-3/20 text-chart-3 border-chart-3/30">Activa</Badge>
                        ) : (
                          <Badge className="bg-chart-4/20 text-chart-4 border-chart-4/30">Próxima</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditPromotion(promotion)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeletePromotion(promotion)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Modal */}
      <PromotionModalExtended
        open={modalOpen}
        onOpenChange={setModalOpen}
        mode={modalMode}
        initialData={selectedPromotion || undefined}
        onSubmit={handleModalSubmit}
      />

      {/* Delete Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminar Promoción</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro de que deseas eliminar la promoción "{promotionToDelete?.nombre}"? 
              Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive text-destructive-foreground">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  )
}
