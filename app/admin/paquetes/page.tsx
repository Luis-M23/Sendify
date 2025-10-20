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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { toast } from "react-toastify";

import { Paquete } from "@/lib/validation/paquete";
import { PaqueteService } from "@/lib/supabase/services/paqueteService";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("es-SV", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);

type EstadoOption = {
  index: number;
  nombre: string;
};

export default function PaquetesAdminPage() {
  const [paquetes, setPaquetes] = useState<Paquete[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const loadPaquetes = async () => {
    try {
      setLoading(true);
      const data = await PaqueteService.getAll();
      setPaquetes(data);
    } catch (error: any) {
      console.error("Error cargando paquetes:", error);
      toast.error(
        error?.message ||
          "No se pudieron cargar los paquetes. Intenta de nuevo más tarde."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPaquetes();
  }, []);

  const getNextEstadoOption = (
    estados: Paquete["estado_seguimiento"]
  ): EstadoOption | null => {
    const activeIndex = estados.findIndex((estado) => estado.activo);

    if (activeIndex >= 0 && activeIndex < estados.length - 1) {
      const nextIndex = activeIndex + 1;
      return { index: nextIndex, nombre: estados[nextIndex].nombre };
    }

    if (activeIndex === -1) {
      const pendingIndex = estados.findIndex(
        (estado) => estado.fecha_actualizado === null
      );
      if (pendingIndex >= 0) {
        return { index: pendingIndex, nombre: estados[pendingIndex].nombre };
      }
    }

    return null;
  };

  const getEstadoResumen = (estados: Paquete["estado_seguimiento"]): string => {
    const activo = estados.find((estado) => estado.activo);
    if (activo) {
      return activo.nombre;
    }

    for (let idx = estados.length - 1; idx >= 0; idx--) {
      if (estados[idx].fecha_actualizado) {
        return estados[idx].nombre;
      }
    }

    return "Sin estado";
  };

  const updateSeguimiento = async (paquete: Paquete, nextIndex: number) => {
    const utcNow = new Date().toISOString();
    const lastIndex = paquete.estado_seguimiento.length - 1;

    const updatedEstados = paquete.estado_seguimiento.map((estado, idx) => {
      if (idx < nextIndex) {
        return {
          ...estado,
          activo: false,
          fecha_actualizado: estado.fecha_actualizado ?? utcNow,
        };
      }

      if (idx === nextIndex) {
        return {
          ...estado,
          activo: nextIndex < lastIndex,
          fecha_actualizado: utcNow,
        };
      }

      return { ...estado, activo: false, fecha_actualizado: null };
    });

    try {
      const updatedPaquete = await PaqueteService.updateEstadoSeguimiento(
        paquete.codigo,
        updatedEstados
      );

      setPaquetes((prev) =>
        prev.map((item) =>
          item.codigo === paquete.codigo ? updatedPaquete : item
        )
      );
      toast.success(
        `Estado actualizado a "${updatedPaquete.estado_seguimiento[nextIndex].nombre}"`
      );
    } catch (error: any) {
      console.error("Error actualizando estado de paquete:", error);
      toast.error(
        error?.message || "No se pudo actualizar el estado del paquete."
      );
    }
  };

  const filteredPaquetes = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) {
      return paquetes;
    }

    return paquetes.filter((paquete) => {
      const estadoResumen = getEstadoResumen(paquete.estado_seguimiento);

      return (
        paquete.codigo.toLowerCase().includes(term) ||
        paquete.producto.toLowerCase().includes(term) ||
        estadoResumen.toLowerCase().includes(term) ||
        paquete.estado_seguimiento.some((estado) =>
          estado.nombre.toLowerCase().includes(term)
        )
      );
    });
  }, [paquetes, searchTerm]);

  return (
    <DashboardLayout>
      <Card>
        <CardHeader className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle>Gestión de Paquetes</CardTitle>
            <CardDescription>
              Revisa el progreso de envío y actualiza el estado de los paquetes.
            </CardDescription>
          </div>
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por código, producto o estado"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-10 text-center text-muted-foreground">
              Cargando paquetes...
            </div>
          ) : filteredPaquetes.length === 0 ? (
            <div className="py-10 text-center text-muted-foreground">
              No se encontraron paquetes.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>

                    <TableHead className="w-2">Código</TableHead>
                    <TableHead>Producto</TableHead>
                    <TableHead className="text-center">Total</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-center">Acción</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPaquetes.map((paquete) => {
                    const nextEstado = getNextEstadoOption(
                      paquete.estado_seguimiento
                    );
                    const activeIndex = paquete.estado_seguimiento.findIndex(
                      (estado) => estado.activo
                    );
                    const etapasCompletadas =
                      activeIndex >= 0
                        ? activeIndex + 1
                        : paquete.estado_seguimiento.filter(
                            (estado) => estado.fecha_actualizado
                          ).length;
                    const totalEtapas = paquete.estado_seguimiento.length;
                    const progresoEtapas = Math.min(
                      etapasCompletadas,
                      totalEtapas
                    );
                    const progresoPorcentaje =
                      totalEtapas > 0
                        ? (progresoEtapas / totalEtapas) * 100
                        : 0;
                    const ultimaEtapaActualizada = (() => {
                      if (activeIndex >= 0) {
                        return activeIndex;
                      }
                      for (let idx = totalEtapas - 1; idx >= 0; idx--) {
                        if (paquete.estado_seguimiento[idx].fecha_actualizado) {
                          return idx;
                        }
                      }
                      return -1;
                    })();

                    return (
                      <TableRow key={paquete.codigo}>
                        <TableCell className="font-medium">
                          {paquete.id}
                        </TableCell>
                        <TableCell className="font-medium">
                          {paquete.codigo}
                        </TableCell>
                        <TableCell>{paquete.producto}</TableCell>
                        <TableCell className="text-center">
                          {formatCurrency(paquete.total)}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-3 m">
                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-sm font-medium">
                                <span>Progreso</span>
                                <span>
                                  {progresoEtapas}/{totalEtapas} etapas
                                </span>
                              </div>
                              <Progress value={progresoPorcentaje} />
                              <div className="space-y-2">
                                {paquete.estado_seguimiento.map(
                                  (estado, idx) => {
                                    const isCurrent =
                                      idx === ultimaEtapaActualizada;
                                    const isCompleted =
                                      idx < ultimaEtapaActualizada;
                                    const stateClass = isCurrent
                                      ? "text-sm font-semibold text-primary"
                                      : isCompleted
                                      ? "text-sm text-foreground"
                                      : "text-sm text-muted-foreground";

                                    return (
                                      <div
                                        key={`${paquete.codigo}-${idx}`}
                                        className={stateClass}
                                      >
                                        {estado.nombre}
                                      </div>
                                    );
                                  }
                                )}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-2">
                            <Button
                              onClick={() => {
                                if (nextEstado) {
                                  updateSeguimiento(paquete, nextEstado.index);
                                }
                              }}
                              disabled={!nextEstado}
                              className="w-full"
                            >
                              Avanzar
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
