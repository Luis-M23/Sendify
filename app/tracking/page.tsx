"use client";

import { useEffect, useState } from "react";
import { Loader2, Package, CheckCircle2, Clock, Circle, FileText } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PaqueteDetail } from "@/components/paquetes/paquete-detail";
import { useAuth } from "@/components/auth-provider";
import { Paquete } from "@/lib/validation/paquete";
import { PaqueteService } from "@/lib/supabase/services/paqueteService";
import { toast } from "react-toastify";
import Link from "next/link";

const dateTimeFormatter = new Intl.DateTimeFormat("es-SV", {
  dateStyle: "medium",
  timeStyle: "short",
});

const getPaqueteStatusBadgeClass = (activo: boolean) =>
  activo
    ? "border border-emerald-300 bg-emerald-100 text-emerald-700"
    : "border border-slate-300 bg-slate-100 text-slate-600";

const getPaqueteStatusLabel = (activo: boolean) =>
  activo ? "Pendiente" : "Entregado";

export default function TrackingPage() {
  const { usuarioMetadata, cargando, isAutenticado } = useAuth();
  const [loading, setLoading] = useState(true);
  const [paquetes, setPaquetes] = useState<Paquete[]>([]);
  const [selectedCodigo, setSelectedCodigo] = useState<string | null>(null);

  useEffect(() => {
    // if (cargando) {
    //   return;
    // }

    if (!usuarioMetadata) {
      setPaquetes([]);
      setSelectedCodigo(null);
      setLoading(false);
      return;
    }

    const fetchPaquetes = async () => {
      try {
        setLoading(true);
        const data = await PaqueteService.getByUserId(
          usuarioMetadata?.id_usuario || ""
        );
        setPaquetes(data);
      } catch (error: any) {
        console.error("Error al cargar paquetes del usuario:", error);
        toast.error(error?.message || "No se pudieron cargar tus paquetes.");
      } finally {
        setLoading(false);
      }
    };

    fetchPaquetes();
  }, [cargando, usuarioMetadata]);

  useEffect(() => {
    if (paquetes.length === 0) {
      setSelectedCodigo(null);
      return;
    }

    const alreadySelected = paquetes.some(
      (paquete) => paquete.codigo === selectedCodigo
    );

    if (!alreadySelected) {
      setSelectedCodigo(paquetes[0].codigo);
    }
  }, [paquetes, selectedCodigo]);

  const selectedPaquete =
    paquetes.find((paquete) => paquete.codigo === selectedCodigo) ?? null;
  const isPaqueteActivo = selectedPaquete?.activo ?? false;

  if (cargando) {
    return (
      <DashboardLayout>
        <div className="flex h-full min-h-[60vh] items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      </DashboardLayout>
    );
  }

  if (!isAutenticado || !usuarioMetadata) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="items-center justify-center">
            <Card>
              <CardHeader>
                <CardTitle className="text-center">Inicia sesión para rastrear tus envíos</CardTitle>
                <CardDescription className="text-center">
                  Debes iniciar sesión para ver los paquetes asociados a tu
                  cuenta.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Seguimiento de Paquetes</h1>
          <p className="text-muted-foreground">
            Consulta el historial de tus paquetes registrados.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[345px_1fr]">
          <Card>
            <CardHeader>
              <CardTitle>Mis paquetes</CardTitle>
              <CardDescription>
                Selecciona un paquete para ver su historial.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-6">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : paquetes.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No tienes paquetes registrados por el momento.
                </p>
              ) : (
                <div className="space-y-2">
                  {paquetes.map((paquete) => {
                    const isSelected = paquete.codigo === selectedCodigo;
                    const isActive = paquete.activo ?? false;

                    return (
                      <Button
                        key={paquete.codigo}
                        variant={isSelected ? "default" : "ghost"}
                        className="h-auto w-full justify-start gap-3 px-3 py-3"
                        onClick={() => setSelectedCodigo(paquete.codigo)}
                      >
                        <div className="flex w-full items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <Package className="h-4 w-4" />
                            <span className="font-mono text-sm font-medium">
                              {paquete.codigo}
                            </span>
                          </div>
                          <Badge
                            className={getPaqueteStatusBadgeClass(isActive)}
                          >
                            {getPaqueteStatusLabel(isActive)}
                          </Badge>
                          <Button
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
                        </div>
                      </Button>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <CardTitle>Historial de Seguimiento</CardTitle>
                    <CardDescription>
                      Revisa las etapas registradas del paquete seleccionado.
                    </CardDescription>
                  </div>
                  {selectedPaquete && (
                    <Badge
                      className={getPaqueteStatusBadgeClass(isPaqueteActivo)}
                    >
                      {getPaqueteStatusLabel(isPaqueteActivo)}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {selectedPaquete ? (
                  selectedPaquete.estado_seguimiento.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      Este paquete no tiene etapas de seguimiento registradas.
                    </p>
                  ) : (
                    <div className="relative">
                      <div className="absolute left-[14px] top-0 bottom-0 w-0.5 bg-border" />
                      <div className="space-y-6">
                        {selectedPaquete.estado_seguimiento.map(
                          (estado, index) => {
                            const isCurrent = estado.activo;
                            const isCompleted =
                              Boolean(estado.fecha_actualizado) &&
                              !estado.activo;
                            const formattedDate = estado.fecha_actualizado
                              ? (() => {
                                  const parsed = new Date(
                                    estado.fecha_actualizado
                                  );
                                  return Number.isNaN(parsed.getTime())
                                    ? null
                                    : dateTimeFormatter.format(parsed);
                                })()
                              : null;
                            const isLast =
                              index ===
                              selectedPaquete.estado_seguimiento.length - 1;

                            return (
                              <div
                                key={`${selectedPaquete.codigo}-${estado.nombre}-${index}`}
                                className={`relative flex gap-4 ${
                                  isLast ? "" : "pb-6"
                                }`}
                              >
                                <div
                                  className={`relative z-10 flex h-7 w-7 items-center justify-center rounded-full border-2 ${
                                    isCurrent
                                      ? "border-blue-500 bg-blue-500 text-white"
                                      : isCompleted
                                      ? "border-emerald-500 bg-emerald-500 text-white"
                                      : "border-border bg-background text-muted-foreground"
                                  }`}
                                >
                                  {isCompleted ? (
                                    <CheckCircle2 className="h-3.5 w-3.5" />
                                  ) : isCurrent ? (
                                    <Clock className="h-3.5 w-3.5 animate-pulse" />
                                  ) : (
                                    <Circle className="h-2.5 w-2.5" />
                                  )}
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center justify-between gap-4">
                                    <p className="font-medium">
                                      {estado.nombre}
                                    </p>
                                    {formattedDate && (
                                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                                        {formattedDate}
                                      </span>
                                    )}
                                  </div>
                                  {!formattedDate && (
                                    <p className="text-xs text-muted-foreground">
                                      Pendiente
                                    </p>
                                  )}
                                  {isCurrent && (
                                    <span className="mt-2 inline-flex rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-600">
                                      En progreso
                                    </span>
                                  )}
                                </div>
                              </div>
                            );
                          }
                        )}
                      </div>
                    </div>
                  )
                ) : loading ? (
                  <div className="flex justify-center py-6">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Selecciona un paquete de la lista para ver su historial.
                  </p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Factura del paquete</CardTitle>
                <CardDescription>
                  Información comercial del paquete seleccionado.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PaqueteDetail
                  codigo={selectedCodigo}
                  emptyMessage="Selecciona un paquete para visualizar la factura."
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
