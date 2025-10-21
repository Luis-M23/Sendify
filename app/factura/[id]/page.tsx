"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { DashboardLayout } from "@/components/dashboard-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

import { Paquete } from "@/lib/validation/paquete";
import { PaqueteService } from "@/lib/supabase/services/paqueteService";
import { EstadoSeguimiento } from "@/lib/validation/estadoEnvio";

type FacturaPageProps = {
  params: {
    id: string;
  };
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("es-SV", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);

const prioridadVariant: Record<
  "default" | "important" | "promo",
  "secondary" | "default" | "outline"
> = {
  important: "default",
  default: "secondary",
  promo: "outline",
};

export default function FacturaPage({ params }: FacturaPageProps) {
  const router = useRouter();
  const [paquete, setPaquete] = useState<Paquete | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadFactura = async () => {
      const paqueteId = Number(params.id);
      const isNumericId = !Number.isNaN(paqueteId);

      try {
        setLoading(true);

        const data = isNumericId
          ? await PaqueteService.getById(paqueteId)
          : await PaqueteService.getByCodigo(params.id);

        if (!data) {
          setError("No se encontró la factura solicitada.");
          return;
        }

        setPaquete(data);
      } catch (err: any) {
        console.error("Error cargando factura:", err);
        setError(
          err?.message ||
            "No se pudo obtener la información de la factura. Intenta más tarde."
        );
      } finally {
        setLoading(false);
      }
    };

    loadFactura();
  }, [params.id]);

  const estadoActual = useMemo(() => {
    if (!paquete) return null;

    const activo = paquete.estado_seguimiento.find((estado) => estado.activo);
    if (activo) return activo;

    const completados = [...paquete.estado_seguimiento]
      .reverse()
      .find((estado) => estado.fecha_actualizado);

    return completados ?? null;
  }, [paquete]);

  return (
    <DashboardLayout>
      <Card>
        <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle>Factura de Paquete</CardTitle>
            <CardDescription>
              Visualiza el detalle de cobro y el progreso del paquete.
            </CardDescription>
          </div>
          <div className="flex flex-col gap-2 md:flex-row md:items-center">
            <Button variant="outline" onClick={() => router.back()}>
              Volver
            </Button>
            <Button asChild>
              <Link href="/admin/paquetes">Gestionar paquetes</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-16 text-center text-muted-foreground">
              Cargando factura...
            </div>
          ) : error ? (
            <div className="py-16 text-center text-destructive">{error}</div>
          ) : !paquete ? (
            <div className="py-16 text-center text-muted-foreground">
              No hay datos disponibles para esta factura.
            </div>
          ) : (
            <div className="space-y-8">
              <section className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-3 rounded-lg border border-border p-4">
                  <h2 className="text-lg font-semibold">Resumen</h2>
                  <div className="text-sm text-muted-foreground">
                    <p>
                      <span className="font-medium text-foreground">
                        Código:
                      </span>{" "}
                      {paquete.codigo}
                    </p>
                    {paquete.id && (
                      <p>
                        <span className="font-medium text-foreground">ID:</span>{" "}
                        {paquete.id}
                      </p>
                    )}
                    <p>
                      <span className="font-medium text-foreground">
                        Producto:
                      </span>{" "}
                      {paquete.producto}
                    </p>
                    <p>
                      <span className="font-medium text-foreground">
                        Casillero:
                      </span>{" "}
                      {paquete.id_casillero ?? "Sin asignar"}
                    </p>
                    <p>
                      <span className="font-medium text-foreground">
                        Total:
                      </span>{" "}
                      {formatCurrency(paquete.total)}
                    </p>
                  </div>
                </div>

                <div className="space-y-3 rounded-lg border border-border p-4">
                  <h2 className="text-lg font-semibold">Estado actual</h2>
                  {estadoActual ? (
                    <div className="text-sm text-muted-foreground">
                      <p>
                        <span className="font-medium text-foreground">
                          Etapa:
                        </span>{" "}
                        {estadoActual.nombre}
                      </p>
                      <p>
                        <span className="font-medium text-foreground">
                          Actualizado:
                        </span>{" "}
                        {estadoActual.fecha_actualizado
                          ? new Date(
                              estadoActual.fecha_actualizado
                            ).toLocaleString("es-SV")
                          : "En progreso"}
                      </p>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Sin avances registrados.
                    </p>
                  )}
                </div>
              </section>

              <section className="space-y-3">
                <div>
                  <h2 className="text-lg font-semibold">Factura detallada</h2>
                  <p className="text-sm text-muted-foreground">
                    Revisa cada concepto aplicado al cálculo del envío.
                  </p>
                </div>

                <div className="overflow-x-auto rounded-lg border border-border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Prioridad</TableHead>
                        <TableHead>Clave</TableHead>
                        <TableHead>Valor</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paquete.factura.map((item, idx) => (
                        <TableRow key={`${paquete.codigo}-factura-${idx}`}>
                          <TableCell>
                            <Badge variant={prioridadVariant[item.prioridad]}>
                              {item.prioridad === "promo"
                                ? "Promoción"
                                : item.prioridad === "important"
                                ? "Importante"
                                : "Detalle"}
                            </Badge>
                          </TableCell>
                          <TableCell>{item.clave}</TableCell>
                          <TableCell>{item.valor}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </section>

              <section className="space-y-3">
                <div>
                  <h2 className="text-lg font-semibold">Seguimiento</h2>
                  <p className="text-sm text-muted-foreground">
                    Estados recorridos por el paquete.
                  </p>
                </div>

                <div className="overflow-x-auto rounded-lg border border-border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Etapa</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead>Última actualización</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paquete.estado_seguimiento.map(
                        (estado: EstadoSeguimiento, idx: number) => (
                          <TableRow key={`${paquete.codigo}-estado-${idx}`}>
                            <TableCell>{estado.nombre}</TableCell>
                            <TableCell>
                              <Badge
                                variant={estado.activo ? "default" : "secondary"}
                              >
                                {estado.activo ? "Activo" : "Inactivo"}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {estado.fecha_actualizado
                                ? new Date(
                                    estado.fecha_actualizado
                                  ).toLocaleString("es-SV")
                                : "—"}
                            </TableCell>
                          </TableRow>
                        )
                      )}
                    </TableBody>
                  </Table>
                </div>
              </section>
            </div>
          )}
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
