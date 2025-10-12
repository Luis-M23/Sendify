"use client";

import { useState, useEffect, ReactNode } from "react";
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
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RotateCcw,
} from "lucide-react";
import { CategoriaModal } from "@/components/admin/categorias-modal";
import { CategoriaService } from "@/lib/supabase/services/categoriaService";
import { CategoriaData, CrearCategoriaData } from "@/lib/validation/categoria";
import { toast } from "react-toastify";
import { permisoMap } from "@/lib/map";

export default function CategoriesAdminPage() {
  const [categories, setCategories] = useState<CategoriaData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [selectedCategory, setSelectedCategory] =
    useState<CategoriaData | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [restoreDialogOpen, setRestoreDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] =
    useState<CategoriaData | null>(null);

  const [categoryToRestore, setCategoryToRestore] =
    useState<CategoriaData | null>(null);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const data = await CategoriaService.getAll();
      setCategories(data);
    } catch (error) {
      console.error("Error loading categories:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const filteredCategories = categories.filter(
    (category) =>
      category.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddCategory = () => {
    setModalMode("add");
    setSelectedCategory(null);
    setModalOpen(true);
  };

  const handleEditCategory = (category: CategoriaData) => {
    setModalMode("edit");
    setSelectedCategory(category);
    setModalOpen(true);
  };

  const handleDeleteCategory = (category: CategoriaData) => {
    setCategoryToDelete(category);
    setDeleteDialogOpen(true);
  };

  const handleModalSubmit = async (
    data: CategoriaData | CrearCategoriaData
  ) => {
    try {
      if (modalMode === "add") {
        await CategoriaService.create(data as CrearCategoriaData);
      } else {
        await CategoriaService.update(data as CategoriaData);
      }
      await loadCategories();
    } catch (error) {
      console.error("Error saving category:", error);
    }
  };

  const handleDeleteConfirm = async () => {
    if (categoryToDelete) {
      try {
        await CategoriaService.delete(categoryToDelete.id!);
        await loadCategories();
      } catch (error) {
        console.error("Error deleting category:", error);
      }
    }
    setDeleteDialogOpen(false);
    setCategoryToDelete(null);
  };

  const handleRestoreDialog = (country: CategoriaData) => {
    setCategoryToRestore(country);
    setRestoreDialogOpen(true);
  };

  const handleRestoreConfirm = async () => {
    if (categoryToRestore) {
      try {
        await CategoriaService.restore(categoryToRestore.id!);
        toast.success(
          `Categoría ${categoryToRestore.nombre} restaurado correctamente`
        );
        await loadCategories();
      } catch (error: any) {
        toast.error(
          error.message || "Ocurrió un error al restaurar la categoría"
        );
      }
    }
    setRestoreDialogOpen(false);
    setCategoryToRestore(null);
  };

  interface StatusMapItem {
    icon: ReactNode;
    badge: ReactNode;
  }

  const statusMap: Record<number, StatusMapItem> = {
    1: {
      icon: <XCircle className="h-4 w-4 text-destructive" />,
      badge: (
        <Badge className="bg-destructive/20 text-destructive hover:bg-destructive/30 border-destructive/30">
          {permisoMap[1]}
        </Badge>
      ),
    },
    2: {
      icon: <CheckCircle2 className="h-4 w-4 text-chart-3" />,
      badge: (
        <Badge className="bg-chart-3/20 text-chart-3 hover:bg-chart-3/30 border-chart-3/30">
          {permisoMap[2]}
        </Badge>
      ),
    },
    3: {
      icon: <AlertTriangle className="h-4 w-4 text-chart-4" />,
      badge: (
        <Badge className="bg-chart-4/20 text-chart-4 hover:bg-chart-4/30 border-chart-4/30">
          {permisoMap[3]}
        </Badge>
      ),
    },
  };

  const getStatusIcon = (status: number) => {
    return statusMap[status]?.icon || null;
  };

  const getStatusBadge = (status: number) => {
    return statusMap[status]?.badge || null;
  };

  return (
    <DashboardLayout userRole="admin">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Gestión de Categorías</CardTitle>
                <CardDescription>
                  Gestiona las categorías y sus restricciones por tipo de
                  transporte
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar categorías..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8 w-64"
                  />
                </div>
                <Button onClick={handleAddCategory}>
                  <Plus className="h-4 w-4 mr-2" />
                  Nueva Categoría
                </Button>
              </div>
            </div>

            <Card className="my-2">
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-chart-3" />
                    <div>
                      <p className="text-sm font-medium">Permitido</p>
                      <p className="text-xs text-muted-foreground">
                        Sin restricciones especiales
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="h-5 w-5 text-chart-4" />
                    <div>
                      <p className="text-sm font-medium">Requiere Permiso</p>
                      <p className="text-xs text-muted-foreground">
                        Documentación adicional necesaria
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <XCircle className="h-5 w-5 text-destructive" />
                    <div>
                      <p className="text-sm font-medium">Prohibido</p>
                      <p className="text-xs text-muted-foreground">
                        No se puede enviar por este medio
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="text-muted-foreground mt-2">
                  Cargando categorías...
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Categoría</TableHead>
                    <TableHead>Descripción & Notas</TableHead>
                    <TableHead className="text-center">Aéreo</TableHead>
                    <TableHead className="text-center">Terrestre</TableHead>
                    <TableHead className="text-center">Marítimo</TableHead>
                    <TableHead className="text-center">Estado</TableHead>
                    <TableHead className="text-center">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCategories.map((category) => (
                    <TableRow key={category.id}>
                      <TableCell className="font-medium">
                        {category.nombre}
                      </TableCell>
                      <TableCell className="max-w-xs">
                        <div className="truncate">
                          <div className="font-medium">
                            {category.descripcion}
                          </div>
                          {category.notas && (
                            <div className="text-sm text-muted-foreground truncate">
                              {category.notas}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          {getStatusIcon(category.aereo)}
                          {getStatusBadge(category.aereo)}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          {getStatusIcon(category.terrestre)}
                          {getStatusBadge(category.terrestre)}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          {getStatusIcon(category.maritimo)}
                          {getStatusBadge(category.maritimo)}
                        </div>
                      </TableCell>

                      <TableCell className="text-center">
                        {category.activo ? (
                          <Badge className="bg-green-100 text-green-800 border-green-200">
                            Activo
                          </Badge>
                        ) : (
                          <Badge className="bg-red-100 text-red-800 border-red-200">
                            Inactivo
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right flex gap-2 justify-center">
                        {!category.activo ? (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRestoreDialog(category)}
                          >
                            <RotateCcw className="h-4 w-4" />
                          </Button>
                        ) : (
                          <>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEditCategory(category)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteCategory(category)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </>
                        )}
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
      <CategoriaModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        mode={modalMode}
        initialData={selectedCategory}
        onSubmit={handleModalSubmit}
      />

      {/* Delete Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminar Categoría</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro de que deseas eliminar la categoría{" "}
              {categoryToDelete?.nombre}?
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
            <AlertDialogTitle>Restaurar Categoría</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro de que deseas restaurar la categoría{" "}
              {categoryToRestore?.nombre}?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRestoreConfirm}
              className="bg-success text-success-foreground"
            >
              Restaurar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
}
