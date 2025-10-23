"use client";

import { useState, useEffect, useMemo } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { RolesSistema } from "@/lib/enum";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Plus,
  Edit,
  Trash2,
  Search,
  Calendar,
  Users,
  RotateCcw,
  Sigma,
} from "lucide-react";
import { PromocionService } from "@/lib/supabase/services/promocionService";
import { Promocion } from "@/lib/validation/promociones";
import { CategoriaService } from "@/lib/supabase/services/categoriaService";
import { Categoria } from "@/lib/validation/categoria";
import { PromocionModal } from "@/components/admin/promocion-modal";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { toast } from "react-toastify";

const isActiveOrFuture = (promotion: Promocion) => {
  const now = new Date();
  const startDate = new Date(promotion.fecha_inicio);
  const endDate = new Date(promotion.fecha_fin);

  const isActive = startDate <= now && endDate >= now;
  const isFuture = startDate > now;

  return isActive || isFuture;
};

export default function PromotionsAdminPage() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [promociones, setPromociones] = useState<Promocion[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [promocionSeleccionada, setPromocionSeleccionada] =
    useState<Promocion | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [restoreDialogOpen, setRestoreDialogOpen] = useState(false);
  const [promotionToDelete, setPromotionToDelete] = useState<Promocion | null>(
    null
  );
  const [promotionToRestore, setPromotionToRestore] =
    useState<Promocion | null>(null);
  const [mostrarInactivos, setMostrarInactivos] = useState(false);

  const promocionesMemo = useMemo(() => {
    let filtradas = [];

    if (mostrarInactivos) {
      filtradas = [...promociones];
    } else {
      filtradas = [
        ...promociones.filter(isActiveOrFuture),
      ];
    }

    if (searchTerm) {
      return filtradas.filter(
        (promotion) =>
          promotion.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
          promotion.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (promotion.descripcion &&
            promotion.descripcion
              .toLowerCase()
              .includes(searchTerm.toLowerCase()))
      );
    }

    return filtradas;
  }, [mostrarInactivos, promociones, searchTerm]);

  const loadPromociones = async () => {
    try {
      const data = await PromocionService.getAll();
      setPromociones(data);
    } catch (error) {
      console.error("Error loading promociones:", error);
      toast.error("Hubo un error al cargar las promociones.");
    }
  };

  const initialData = async () => {
    setLoading(true);
    try {
      await loadPromociones();
      const data = await CategoriaService.getAll();
      setCategorias(data);
    } catch (error) {
      console.error("Error loading categorias:", error);
      toast.error(error);
    }

    setLoading(false);
  };

  useEffect(() => {
    initialData();
  }, []);

  const filteredPromotions = promociones.filter(
    (promotion) =>
      promotion.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (promotion.descripcion &&
        promotion.descripcion.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleAddPromotion = () => {
    setModalMode("add");
    setPromocionSeleccionada(null);
    setModalOpen(true);
  };

  const handleEditPromotion = (promotion: Promocion) => {
    setModalMode("edit");
    setPromocionSeleccionada(promotion);
    setModalOpen(true);
  };

  const handleDeletePromotion = (promotion: Promocion) => {
    setPromotionToDelete(promotion);
    setDeleteDialogOpen(true);
  };

  const handleRestorePromotion = (promotion: Promocion) => {
    setPromotionToRestore(promotion);
    setRestoreDialogOpen(true);
  };

  const handleModalSubmit = async (data: any) => {
    try {
      if (modalMode === "add") {
        await PromocionService.create(data);
      } else {
        await PromocionService.update(data);
      }

      loadPromociones();
      toast.success(
        modalMode === "add" ? "Promoción creada" : "Promoción actualizada"
      );
    } catch (error) {
      console.error("Error al guardar la promoción:", error);
      toast.error(
        `No se pudo guardar la promoción. Inténtalo de nuevo. ${error}`
      );
    }
  };

  const handleDeleteConfirm = async () => {
    if (promotionToDelete) {
      try {
        await PromocionService.delete(promotionToDelete.id!);
        loadPromociones();
        toast.success("Promoción eliminada");
      } catch (error) {
        console.error("Error deleting promotion:", error);
        toast.error(error);
      }
    }
    setDeleteDialogOpen(false);
    setPromotionToDelete(null);
  };

  const handleRestoreConfirm = async () => {
    if (promotionToRestore) {
      try {
        await PromocionService.restore(promotionToRestore.id!);
        loadPromociones();
        toast.success("Promoción restaurada");
      } catch (error) {
        console.error("Error restoring promotion:", error);
        toast.error(error);
      }
    }
    setRestoreDialogOpen(false);
    setPromotionToRestore(null);
  };



  const isExpired = (promotion: Promocion) => {
    const now = new Date();
    const endDate = new Date(promotion.fecha_fin);
    return endDate < now;
  };

  function parseLocalDate(dateString: string) {
    const [year, month, day] = dateString.split("-").map(Number);
    return new Date(year, month - 1, day);
  }

  const getCategoryNamesList = (
    restrictionIds: number[] | null | undefined
  ) => {
    if (!restrictionIds || restrictionIds.length === 0)
      return <span>Todas las categorías</span>;

    return (
      <ul className="list-disc list-inside">
        {restrictionIds.map((id) => {
          const category = categorias.find((c) => c.id === id);
          return <li key={id}>{category?.nombre || `ID ${id}`}</li>;
        })}
      </ul>
    );
  };
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Promociones</CardTitle>
                <CardDescription>
                  Gestiona todas las promociones y descuentos disponibles
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="mostrarInactivos"
                    checked={mostrarInactivos}
                    onChange={(e) => setMostrarInactivos(e.target.checked)}
                    className="rounded"
                  />
                  <label htmlFor="mostrarInactivos" className="text-sm">
                    Mostrar todas
                  </label>
                </div>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar promociones"
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Activas
                  </CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {promocionesMemo.filter(isActiveOrFuture).length}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Inactivas
                  </CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {promociones.filter(isExpired).length}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Total Promociones
                  </CardTitle>
                  <Sigma className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{promociones.length}</div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="text-muted-foreground mt-2">
                  Cargando promociones...
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-left">Promoción</TableHead>
                    <TableHead className="text-center">Período</TableHead>
                    <TableHead className="text-left">Categorías</TableHead>
                    <TableHead className="text-center">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {promocionesMemo.map((promotion) => (
                    <TableRow key={promotion.id}>
                      <TableCell className="text-left">
                        <div>
                          <div className="font-medium">
                            {promotion.codigo} -{" "}
                            {promotion.porcentaje_descuento}%{" "}
                          </div>
                          <div className="font-medium text-muted-foreground">
                            {promotion.titulo}
                          </div>
                          <div className="text-sm text-muted-foreground max-w-xs truncate">
                            {promotion.descripcion || "Sin descripción"}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="text-sm">
                          <div>
                            {format(parseISO(promotion.fecha_inicio), "PPP", {
                              locale: es,
                            })}
                          </div>
                          <div className="text-muted-foreground">
                            {format(parseISO(promotion.fecha_fin), "PPP", {
                              locale: es,
                            })}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-left">
                        <div className="text-sm max-w-xs">
                          <div className="truncate">
                            {getCategoryNamesList(
                              promotion.restricciones_categorias
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right flex gap-2 justify-center">
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
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      <PromocionModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        mode={modalMode}
        initialData={promocionSeleccionada}
        onSubmit={handleModalSubmit}
        categorias={categorias}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminar Promoción</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro de que deseas eliminar la promoción "
              {promotionToDelete?.titulo}"? Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Restore Dialog */}
      <AlertDialog open={restoreDialogOpen} onOpenChange={setRestoreDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Restaurar Promoción</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro de que deseas restaurar la promoción "
              {promotionToRestore?.titulo}"? La promoción volverá a estar
              activa.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRestoreConfirm}
              className="bg-primary text-white"
            >
              Restaurar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
}
