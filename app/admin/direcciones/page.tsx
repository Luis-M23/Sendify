"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Search, RotateCcw } from "lucide-react";
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
import { DireccionModal } from "@/components/admin/direccion-modal";
import { DireccionService } from "@/lib/supabase/services/direccionService";
import {
  DireccionData,
  CrearDireccionData,
  DireccionSchema,
  CrearDireccionSchema,
} from "@/lib/validation/direccion";
import { toast } from "react-toastify";
import { z } from "zod";

const formatCurrency = (value?: number | null) =>
  `$ ${Number(value ?? 0).toFixed(2)}`;

export default function DireccionesAdminPage() {
  const [direcciones, setDirecciones] = useState<DireccionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [selectedDireccion, setSelectedDireccion] =
    useState<DireccionData | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [restoreDialogOpen, setRestoreDialogOpen] = useState(false);
  const [direccionToDelete, setDireccionToDelete] =
    useState<DireccionData | null>(null);
  const [direccionToRestore, setDireccionToRestore] =
    useState<DireccionData | null>(null);

  const loadDirecciones = async () => {
    try {
      setLoading(true);
      const data = await DireccionService.getAll();
      setDirecciones(data);
    } catch (error: any) {
      toast.error(
        error.message || "Ocurrió un error al cargar las direcciones"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDirecciones();
  }, []);

  const handleAdd = () => {
    setModalMode("add");
    setSelectedDireccion(null);
    setModalOpen(true);
  };

  const handleEdit = (direccion: DireccionData) => {
    setModalMode("edit");
    setSelectedDireccion(direccion);
    setModalOpen(true);
  };

  const handleDelete = (direccion: DireccionData) => {
    setDireccionToDelete(direccion);
    setDeleteDialogOpen(true);
  };

  const handleRestoreDialog = (direccion: DireccionData) => {
    setDireccionToRestore(direccion);
    setRestoreDialogOpen(true);
  };

  const handleRestoreConfirm = async () => {
    if (direccionToRestore) {
      try {
        await DireccionService.restore(direccionToRestore.id!);
        toast.success(
          `Dirección ${direccionToRestore.codigo} restaurada correctamente`
        );
        await loadDirecciones();
      } catch (error: any) {
        toast.error(
          error.message || "Ocurrió un error al restaurar la dirección"
        );
      }
    }
    setRestoreDialogOpen(false);
    setDireccionToRestore(null);
  };

  const handleModalSubmit = async (
    data: CrearDireccionData | DireccionData
  ) => {
    try {
      if (modalMode === "add") {
        CrearDireccionSchema.parse(data);
        await DireccionService.create(data as CrearDireccionData);
      } else {
        DireccionSchema.parse(data);
        await DireccionService.update(data as DireccionData);
      }
      await loadDirecciones();
      setModalOpen(false);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      } else {
        toast.error(error.message || "Ocurrió un error");
      }
    }
  };

  const handleDeleteConfirm = async () => {
    if (direccionToDelete) {
      try {
        await DireccionService.delete(direccionToDelete.id!);
        toast.success(
          `Dirección ${direccionToDelete.codigo} eliminada correctamente`
        );
        await loadDirecciones();
      } catch (error: any) {
        toast.error(
          error.message || "Ocurrió un error al eliminar la dirección"
        );
      }
    }
    setDeleteDialogOpen(false);
    setDireccionToDelete(null);
  };

  const filteredDirecciones = direcciones.filter((direccion) => {
    const term = searchTerm.toLowerCase();
    return (
      direccion.codigo.toLowerCase().includes(term) ||
      direccion.pais.toLowerCase().includes(term) ||
      direccion.estado.toLowerCase().includes(term) ||
      direccion.direccion.toLowerCase().includes(term) ||
      direccion.telefono.toLowerCase().includes(term)
    );
  });

  return (
    <DashboardLayout userRole="admin">
      <div className="space-y-6">
        <Card>
          <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle>Gestión de Direcciones de Envío</CardTitle>
              <CardDescription>
                Administra los orígenes, contactos y costos asociados a tus
                envíos.
              </CardDescription>
            </div>
            <div className="flex w-full flex-col gap-3 md:w-auto md:flex-row md:items-center">
              <div className="relative md:w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar direcciones"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
              <Button onClick={handleAdd} className="md:w-auto">
                <Plus className="mr-2 h-4 w-4" />
                Nueva Dirección
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="py-8 text-center">
                <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
                <p className="mt-2 text-muted-foreground">
                  Cargando direcciones...
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-left">Código</TableHead>
                    <TableHead className="text-left">Direcciones</TableHead>
                    <TableHead className="text-center">
                      Costo Aéreo (USD)
                    </TableHead>
                    <TableHead className="text-center">
                      Costo Terrestre (USD)
                    </TableHead>
                    <TableHead className="text-center">
                      Costo Marítimo (USD)
                    </TableHead>
                    <TableHead className="text-center">Estado</TableHead>
                    <TableHead className="text-center">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDirecciones.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={10} className="py-8 text-center">
                        <p className="text-muted-foreground">
                          No se encontraron direcciones con el criterio
                          proporcionado.
                        </p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredDirecciones.map((direccion) => (
                      <TableRow key={direccion.id}>
                        <TableCell className="text-left">
                          <Badge variant="outline">{direccion.codigo}</Badge>
                        </TableCell>
                        <TableCell className="text-left">
                          <div className="truncate">
                            <div className="font-medium">{direccion.pais}</div>
                            <div className="text-sm text-muted-foreground">
                              {direccion.estado}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {direccion.direccion}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {direccion.telefono}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          {formatCurrency(direccion.costo_aereo)}
                        </TableCell>
                        <TableCell className="text-center">
                          {formatCurrency(direccion.costo_terrestre)}
                        </TableCell>
                        <TableCell className="text-center">
                          {formatCurrency(direccion.costo_maritimo)}
                        </TableCell>
                        <TableCell className="text-center">
                          {direccion.activo ? (
                            <Badge className="border-green-200 bg-green-100 text-green-800">
                              Activa
                            </Badge>
                          ) : (
                            <Badge className="border-red-200 bg-red-100 text-red-800">
                              Inactiva
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="flex items-center justify-center gap-2 pt-7">
                          {!direccion.activo ? (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleRestoreDialog(direccion)}
                            >
                              <RotateCcw className="h-4 w-4" />
                            </Button>
                          ) : (
                            <>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEdit(direccion)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDelete(direccion)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <DireccionModal
          open={modalOpen}
          onOpenChange={setModalOpen}
          mode={modalMode}
          initialData={selectedDireccion}
          onSubmit={handleModalSubmit}
        />

        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Desactivar dirección</AlertDialogTitle>
              <AlertDialogDescription>
                ¿Deseas desactivar la dirección {direccionToDelete?.codigo}?
                Podrás restaurarla más adelante.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteConfirm}
                className="bg-destructive text-destructive-foreground"
              >
                Desactivar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <AlertDialog
          open={restoreDialogOpen}
          onOpenChange={setRestoreDialogOpen}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Restaurar dirección</AlertDialogTitle>
              <AlertDialogDescription>
                ¿Deseas restaurar la dirección {direccionToRestore?.codigo}?
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
      </div>
    </DashboardLayout>
  );
}
