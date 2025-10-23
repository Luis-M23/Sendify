"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
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
import { Eye, EyeOff, FileText, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "react-toastify";
import { Paquete } from "@/lib/validation/paquete";
import { PaqueteService } from "@/lib/supabase/services/paqueteService";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});

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
                    <TableHead className="text-center">Entrega</TableHead>
                    <TableHead className="text-center">Total</TableHead>
                    <TableHead className="text-center">Entregado</TableHead>
                    <TableHead className="text-center">Estado</TableHead>
                    <TableHead className="text-center">Acciones</TableHead>
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
                    const isProgressVisible =
                      expandedRows[paquete.codigo] ?? false;

                    return (
                      <TableRow key={paquete.codigo}>
                        <TableCell>{paquete.id}</TableCell>
                        <TableCell>{paquete.codigo}</TableCell>
                        <TableCell>{paquete.producto}</TableCell>
                        <TableCell className="text-center">
                          {paquete.id_direccion ? (
                            <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                              Retiro en local
                            </Badge>
                          ) : (
                            <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                              Envío a domicilio
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-center">
                          {formatCurrency(paquete.total)}
                        </TableCell>
                        <TableCell className="text-center">
                          {paquete.activo ? (
                            <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                              Pendiente Entrega
                            </Badge>
                          ) : (
                            <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                              Entregado
                            </Badge>
                          )}
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
                              {isProgressVisible && (
                                <div className="space-y-2">
                                  {paquete.estado_seguimiento.map(
                                    (estado, idx) => {
                                      const isCurrent =
                                        idx === ultimaEtapaActualizada;
                                      const isCompleted =
                                        idx < ultimaEtapaActualizada;
                                      const stateClass = `text-sm rounded-md px-3 py-2 transition-colors hover:bg-muted/60 ${
                                        isCurrent
                                          ? "font-semibold text-primary"
                                          : isCompleted
                                          ? "text-foreground"
                                          : "text-muted-foreground"
                                      }`;

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
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <TooltipProvider delayDuration={150}>
                            <div className="flex items-center justify-center gap-2">
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    onClick={() => {
                                      if (nextEstado) {
                                        updateSeguimiento(
                                          paquete,
                                          nextEstado.index
                                        );
                                      }
                                    }}
                                    disabled={!nextEstado}
                                    size="sm"
                                    className="w-fit px-3 bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-400"
                                  >
                                    Avanzar
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent side="top">
                                  <p>
                                    {nextEstado
                                      ? `Cambiar estado a "${nextEstado.nombre}"`
                                      : "Paquete completado"}
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="secondary"
                                    size="icon"
                                    className="h-8 w-8 bg-muted text-muted-foreground hover:bg-muted/80"
                                    onClick={() =>
                                      setExpandedRows((prev) => ({
                                        ...prev,
                                        [paquete.codigo]: !prev[paquete.codigo],
                                      }))
                                    }
                                  >
                                    {isProgressVisible ? (
                                      <EyeOff className="h-4 w-4" />
                                    ) : (
                                      <Eye className="h-4 w-4" />
                                    )}
                                    <span className="sr-only">
                                      {isProgressVisible
                                        ? "Ocultar progreso"
                                        : "Ver progreso"}
                                    </span>
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent side="top">
                                  <p>
                                    {isProgressVisible
                                      ? "Ocultar detalle de progreso"
                                      : "Ver detalle de progreso"}
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    asChild
                                    variant="secondary"
                                    size="icon"
                                    className="h-8 w-8 bg-muted text-muted-foreground hover:bg-muted/80"
                                  >
                                    <Link
                                      href={`/factura/${paquete.codigo}`}
                                      className="flex h-8 w-8 items-center justify-center"
                                    >
                                      <FileText className="h-4 w-4" />
                                      <span className="sr-only">
                                        Ver factura
                                      </span>
                                    </Link>
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent side="top">
                                  <p>Ver factura</p>
                                </TooltipContent>
                              </Tooltip>
                            </div>
                          </TooltipProvider>
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
