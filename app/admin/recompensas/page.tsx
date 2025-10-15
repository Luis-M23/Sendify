"use client";

import { useEffect, useMemo, useState } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, Edit2 } from "lucide-react";
import { toast } from "react-toastify";
import { RecompensaModal } from "@/components/admin/recompensa-modal";
import { RecompensaService } from "@/lib/supabase/services/recompensaService";
import { RecompensaData } from "@/lib/validation/recompensa";

const parseBeneficios = (beneficios?: string | null) =>
  beneficios
    ?.split(/\r?\n|;/)
    .map((item) => item.trim())
    .filter(Boolean) ?? [];

export default function AdminRecompensasPage() {
  const [recompensas, setRecompensas] = useState<RecompensaData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRecompensa, setSelectedRecompensa] =
    useState<RecompensaData | null>(null);

  const loadRecompensas = async () => {
    try {
      setLoading(true);
      const data = await RecompensaService.getAll();
      setRecompensas(data);
    } catch (error: any) {
      toast.error(
        error.message || "Ocurrió un error al obtener las recompensas"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecompensas();
  }, []);

  const filteredRecompensas = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return recompensas;
    return recompensas.filter((recompensa) => {
      const beneficios = parseBeneficios(recompensa.beneficios).join(" ");
      return (
        recompensa.nivel.toLowerCase().includes(term) ||
        beneficios.toLowerCase().includes(term) ||
        recompensa.requisito_compras.toString().includes(term) ||
        recompensa.porcentaje_descuento.toString().includes(term)
      );
    });
  }, [recompensas, searchTerm]);

  const handleEdit = (recompensa: RecompensaData) => {
    setSelectedRecompensa({
      ...recompensa,
      beneficios: recompensa.beneficios ?? "",
    });
    setModalOpen(true);
  };

  const handleModalSubmit = async (data: RecompensaData) => {
    try {
      await RecompensaService.update({
        ...data,
        beneficios: data.beneficios?.trim() || null,
      });
      toast.success(`Nivel ${data.nivel} actualizado correctamente`);
      setModalOpen(false);
      setSelectedRecompensa(null);
      await loadRecompensas();
    } catch (error: any) {
      toast.error(error.message || "No se pudo actualizar la recompensa");
    }
  };

  const handleModalOpenChange = (open: boolean) => {
    setModalOpen(open);
    if (!open) {
      setSelectedRecompensa(null);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <Card>
          <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle>Programa de Recompensas</CardTitle>
              <CardDescription>
                Administra los requisitos y beneficios de cada nivel VIP.
              </CardDescription>
            </div>
            <div className="flex w-full flex-col gap-3 md:w-auto md:flex-row md:items-center">
              <div className="relative md:w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar nivel o beneficio"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  className="pl-8"
                />
              </div>
              <Button
                variant="outline"
                onClick={loadRecompensas}
                disabled={loading}
              >
                {loading ? "Actualizando..." : "Recargar"}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="py-8 text-center">
                <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-primary" />
                <p className="mt-2 text-muted-foreground">
                  Cargando recompensas...
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nivel</TableHead>
                    <TableHead className="text-center">
                      Requisito de compras
                    </TableHead>
                    <TableHead className="text-center">
                      % Descuento
                    </TableHead>
                    <TableHead>Beneficios</TableHead>
                    <TableHead className="text-center">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRecompensas.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="py-8 text-center text-muted-foreground"
                      >
                        No se encontraron recompensas con el término
                        proporcionado.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredRecompensas.map((recompensa) => {
                      const beneficios = parseBeneficios(
                        recompensa.beneficios
                      );
                      return (
                        <TableRow key={recompensa.id}>
                          <TableCell>
                            <Badge variant="outline">{recompensa.nivel}</Badge>
                          </TableCell>
                          <TableCell className="text-center font-medium">
                            {recompensa.requisito_compras}
                          </TableCell>
                          <TableCell className="text-center font-medium">
                            {recompensa.porcentaje_descuento}%
                          </TableCell>
                          <TableCell>
                            {beneficios.length === 0 ? (
                              <p className="text-sm text-muted-foreground">
                                Sin beneficios registrados.
                              </p>
                            ) : (
                              <ul className="space-y-1 text-sm text-muted-foreground">
                                {beneficios.map((beneficio, index) => (
                                  <li key={`${recompensa.id}-${index}`}>
                                    • {beneficio}
                                  </li>
                                ))}
                              </ul>
                            )}
                          </TableCell>
                          <TableCell className="text-center">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEdit(recompensa)}
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <RecompensaModal
          open={modalOpen}
          onOpenChange={handleModalOpenChange}
          initialData={selectedRecompensa}
          onSubmit={handleModalSubmit}
        />
      </div>
    </DashboardLayout>
  );
}
