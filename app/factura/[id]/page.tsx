"use client";

import { use, useEffect, useState } from "react";
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
import { PaqueteDetail } from "@/components/paquetes/paquete-detail";
import { PaqueteDetalleService } from "@/lib/supabase/services/paqueteDetalleService";

export default function FacturaPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [codigo, setCodigo] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const resolveCodigo = async () => {
      const paqueteId = Number(resolvedParams.id);
      const isNumericId = !Number.isNaN(paqueteId);

      if (!isNumericId) {
        setCodigo(resolvedParams.id);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await PaqueteDetalleService.getById(paqueteId);
        if (!data) {
          setError("No se encontró la factura solicitada.");
          setCodigo(null);
          return;
        }
        setCodigo(data.codigo);
      } catch (err: any) {
        console.error("Error obteniendo factura:", err);
        setError(
          err?.message ||
            "No se pudo obtener la información de la factura. Intenta más tarde."
        );
      } finally {
        setLoading(false);
      }
    };

    resolveCodigo();
  }, [resolvedParams.id]);

  return (
    <DashboardLayout>
      <Card>
        <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle>Factura de Paquete</CardTitle>
            <CardDescription>
              Visualiza el detalle comercial del paquete seleccionado.
            </CardDescription>
          </div>
          <div className="flex flex-col gap-2 md:flex-row md:items-center">
            <Button variant="outline" onClick={() => router.back()}>
              Volver
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
          ) : error ? (
            <div className="py-16 text-center text-destructive">{error}</div>
          ) : !codigo ? (
            <div className="py-16 text-center text-muted-foreground">
              No hay datos disponibles para esta factura.
            </div>
          ) : (
            <div className="space-y-8">
              <PaqueteDetail codigo={codigo} />
            </div>
          )}
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
