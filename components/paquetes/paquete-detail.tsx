"use client";

import { ReactNode, useEffect, useMemo, useState } from "react";
import { TipoServicioMap } from "@/lib/map";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { PaqueteDetalle } from "@/lib/validation/paquete";
import { PaqueteDetalleService } from "@/lib/supabase/services/paqueteDetalleService";

type PaqueteDetailProps = {
  codigo: string | null;
  className?: string;
  emptyMessage?: string;
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("es-SV", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);

type InfoRowProps = {
  label: string;
  value: ReactNode;
};

const InfoRow = ({ label, value }: InfoRowProps) => (
  <div className="flex items-start justify-between gap-4 text-sm">
    <span className="font-medium text-foreground">{label}</span>
    <span className="text-right text-muted-foreground">{value}</span>
  </div>
);
export function PaqueteDetail({
  codigo,
  className,
  emptyMessage = "Selecciona un paquete para ver su factura.",
}: PaqueteDetailProps) {
  const [detalle, setDetalle] = useState<PaqueteDetalle | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadDetalle = async () => {
      if (!codigo) {
        setDetalle(null);
        setError(null);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const byCodigo = await PaqueteDetalleService.getByCodigo(codigo);

        let data = byCodigo;

        if (!byCodigo && !Number.isNaN(Number(codigo))) {
          data = await PaqueteDetalleService.getById(Number(codigo));
        }

        if (!isMounted) return;

        if (!data) {
          setDetalle(null);
          setError("No se encontró información para este paquete.");
          return;
        }

        setDetalle(data);
      } catch (err: any) {
        if (!isMounted) return;
        console.error("Error al cargar detalle de paquete:", err);
        setError(
          err?.message || "No se pudo obtener la información del paquete."
        );
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadDetalle();

    return () => {
      isMounted = false;
    };
  }, [codigo]);

  const paquete = detalle;

  const clienteNombre = useMemo(() => {
    if (!paquete) return "Nombre no disponible";
    return paquete.usuario_metadata?.nombre_completo?.trim() ||
      paquete.usuario_metadata?.id_usuario ||
      "Nombre no disponible";
  }, [paquete]);

  if (!codigo) {
    return (
      <div
        className={cn(
          "rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground",
          className
        )}
      >
        {emptyMessage}
      </div>
    );
  }

  if (loading) {
    return (
      <div
        className={cn(
          "rounded-lg border border-border p-6 text-center text-sm text-muted-foreground",
          className
        )}
      >
        Cargando información del paquete...
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={cn(
          "rounded-lg border border-destructive/40 bg-destructive/10 p-6 text-center text-sm text-destructive",
          className
        )}
      >
        {error}
      </div>
    );
  }

  if (!paquete) {
    return null;
  }

  const {
    codigo: codigoPaquete,
    producto,
    total,
    factura,
    activo,
    peso,
    largo,
    ancho,
    alto,
    created_at,
    casillero,
    categoria,
    tipo_servicio,
    id_casillero,
    id_categoria,
    id_tipo_transporte,
  } = paquete;

  const tipoServicioNombre =
    tipo_servicio?.nombre || TipoServicioMap[id_tipo_transporte] || "Sin dato";

  return (
    <div className={cn("space-y-6", className)}>
      <section className="grid gap-4 md:grid-cols-2">
        <div className="space-y-3 rounded-lg border border-border p-4">
          <h3 className="text-lg font-semibold text-foreground">
            Información general
          </h3>
          <div className="space-y-2">
            <InfoRow
              label="Código"
              value={<span className="font-mono">{codigoPaquete}</span>}
            />
            <InfoRow label="Producto" value={producto} />
            <InfoRow
              label="Estado"
              value={
                <span
                  className={cn(
                    "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium",
                    activo
                      ? "border-emerald-300 bg-emerald-100 text-emerald-700"
                      : "border-slate-300 bg-slate-100 text-slate-600"
                  )}
                >
                  <span
                    className={cn(
                      "size-2 rounded-full",
                      activo ? "bg-emerald-500" : "bg-slate-400"
                    )}
                  />
                  {activo ? "Activo" : "Inactivo"}
                </span>
              }
            />
            <InfoRow
              label="Creado"
              value={
                created_at
                  ? new Date(created_at).toLocaleString("es-SV")
                  : "Fecha no disponible"
              }
            />
            <InfoRow label="Total" value={formatCurrency(total)} />
          </div>
        </div>

        <div className="space-y-3 rounded-lg border border-border p-4">
          <h3 className="text-lg font-semibold text-foreground">
            Datos logísticos
          </h3>
          <div className="space-y-2">
            <InfoRow
              label="Casillero"
              value={
                casillero ? (
                  <div className="space-y-1 text-right">
                    <span className="block font-medium text-foreground">
                      {casillero.codigo}
                    </span>
                    <span className="block text-xs text-muted-foreground">
                      {casillero.pais} • {casillero.estado}
                    </span>
                  </div>
                ) : (
                  `ID ${id_casillero}`
                )
              }
            />
            <InfoRow
              label="Categoría"
              value={categoria ? categoria.nombre : `ID ${id_categoria}`}
            />
            <InfoRow label="Tipo de servicio" value={tipoServicioNombre} />
            <InfoRow label="Peso (kg)" value={peso.toFixed(2)} />
            <InfoRow
              label="Dimensiones (cm)"
              value={`${largo.toFixed(2)} × ${ancho.toFixed(
                2
              )} × ${alto.toFixed(2)}`}
            />
          </div>
        </div>
      </section>

      <section className="rounded-lg border border-border p-4">
        <h3 className="text-lg font-semibold text-foreground">
          Datos del cliente
        </h3>
        <div className="mt-3 space-y-2">
          <InfoRow label="Nombre" value={clienteNombre} />
        </div>
      </section>

      <section className="space-y-3 rounded-lg border border-border p-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground">
            Factura detallada
          </h3>
          <p className="text-sm text-muted-foreground">
            Conceptos aplicados al cálculo del envío.
          </p>
        </div>

        <div className="space-y-2">
          {factura.map((item, index) => {
            const isTotal =
              item.prioridad === "important" && index === factura.length - 1;

            const rowClass = cn(
              item.prioridad === "promo" && "text-chart-4",
              item.prioridad === "default" && "text-muted-foreground"
            );

            const valueClass = isTotal
              ? "text-2xl font-bold"
              : "text-sm font-medium";

            return (
              <div key={`${codigoPaquete}-factura-${index}`}>
                <div
                  className={cn(
                    "flex justify-between text-sm",
                    rowClass,
                    !isTotal && "py-1"
                  )}
                >
                  <span className={isTotal ? "text-lg font-semibold" : ""}>
                    {item.clave}
                  </span>
                  <span className={valueClass}>{item.valor}</span>
                </div>
                {index === 2 && <Separator className="my-2" />}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
