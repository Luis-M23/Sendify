"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Search, RotateCcw } from "lucide-react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { PaisModal } from "@/components/admin/pais-modal";
import { PaisService } from "@/lib/supabase/services/paisService";
import {
  PaisData,
  CrearPaisSchema,
  CrearPaisData,
  PaisSchema,
} from "@/lib/validation/pais";
import { z } from "zod";
import { toast } from "react-toastify";

export default function CountriesAdminPage() {
  const [countries, setCountries] = useState<PaisData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [selectedCountry, setSelectedCountry] = useState<PaisData | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [restoreDialogOpen, setRestoreDialogOpen] = useState(false);
  const [countryToDelete, setCountryToDelete] = useState<PaisData | null>(null);
  const [countryToRestore, setCountryToRestore] = useState<PaisData | null>(
    null
  );

  const loadCountries = async () => {
    try {
      setLoading(true);
      const data = await PaisService.getAll();
      setCountries(data);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCountries();
  }, []);

  const handleAdd = () => {
    setModalMode("add");
    setSelectedCountry(null);
    setModalOpen(true);
  };

  const handleEdit = (country: PaisData) => {
    setModalMode("edit");
    setSelectedCountry(country);
    setModalOpen(true);
  };

  const handleDelete = (country: PaisData) => {
    setCountryToDelete(country);
    setDeleteDialogOpen(true);
  };

  const handleRestoreDialog = (country: PaisData) => {
    setCountryToRestore(country);
    setRestoreDialogOpen(true);
  };

  const handleRestoreConfirm = async () => {
    if (countryToRestore) {
      try {
        await PaisService.restore(countryToRestore.id!);
        toast.success(
          `País ${countryToRestore.nombre_completo} restaurado correctamente`
        );
        await loadCountries();
      } catch (error: any) {
        toast.error(error.message || "Ocurrió un error al restaurar el país");
      }
    }
    setRestoreDialogOpen(false);
    setCountryToRestore(null);
  };

  const handleModalSubmit = async (data: CrearPaisData | PaisData) => {
    try {
      if (modalMode === "add") {
        CrearPaisSchema.parse(data);
        await PaisService.create(data as CrearPaisData);
      } else {
        PaisSchema.parse(data);
        await PaisService.update(data as PaisData);
      }
      await loadCountries();
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
    if (countryToDelete) {
      try {
        await PaisService.delete(countryToDelete.id!);
        toast.success(
          `País ${countryToDelete.nombre_completo} eliminado correctamente`
        );
        await loadCountries();
      } catch (error: any) {
        toast.error(error.message);
      }
    }
    setDeleteDialogOpen(false);
    setCountryToDelete(null);
  };

  const filteredCountries = countries.filter(
    (c) =>
      c.nombre_completo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.codigo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout userRole="admin">
      <div className="space-y-6">
        <Card>
          <CardHeader className="flex justify-between items-center">
            <div>
              <CardTitle>Gestión de Países</CardTitle>
              <CardDescription>
                Administra los países y costos de envío
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar países"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 w-64"
                />
              </div>
              <Button onClick={handleAdd}>
                <Plus className="h-4 w-4 mr-2" /> Nuevo País
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="text-muted-foreground mt-2">Cargando países...</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-left">Código</TableHead>
                    <TableHead className="text-left">País</TableHead>
                    <TableHead className="text-center">Moneda</TableHead>
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
                  {filteredCountries.map((country) => (
                    <TableRow key={country.id}>
                      <TableCell className="text-left">
                        <Badge variant="outline">{country.codigo}</Badge>
                      </TableCell>
                      <TableCell className="text-left">
                        {country.nombre_completo}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline">{country.moneda}</Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        $ {country.costo_aereo.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-center">
                        $ {country.costo_terrestre.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-center">
                        $ {country.costo_maritimo.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-center">
                        {country.activo ? (
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
                        {!country.activo ? (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRestoreDialog(country)}
                          >
                            <RotateCcw className="h-4 w-4" />
                          </Button>
                        ) : (
                          <>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEdit(country)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(country)}
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

        <PaisModal
          open={modalOpen}
          onOpenChange={setModalOpen}
          mode={modalMode}
          initialData={selectedCountry}
          onSubmit={handleModalSubmit}
        />

        {/* Delete Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Eliminar País</AlertDialogTitle>
              <AlertDialogDescription>
                ¿Estás seguro de que deseas eliminar el país {countryToDelete?.nombre_completo}?
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
        <AlertDialog
          open={restoreDialogOpen}
          onOpenChange={setRestoreDialogOpen}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Restaurar País</AlertDialogTitle>
              <AlertDialogDescription>
                ¿Estás seguro de que deseas restaurar el país {countryToRestore?.nombre_completo}?
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
