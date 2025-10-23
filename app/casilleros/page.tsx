"use client";

import { useEffect, useMemo, useState } from "react";
import { Loader2, PackageSearch } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CasilleroService } from "@/lib/supabase/services/casilleroService";
import type { Casillero } from "@/lib/validation/casillero";
import { toast } from "react-toastify";

const numberFormatter = new Intl.NumberFormat("es-SV", {
  maximumFractionDigits: 0,
});

export default function PublicCasillerosPage() {
  const [casilleros, setCasilleros] = useState<Casillero[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCasilleros = async () => {
      try {
        setLoading(true);
        const data = await CasilleroService.getAll();
        setCasilleros(data.filter((casillero) => casillero.activo !== false));
      } catch (error) {
        console.error(error);
        toast.error("No se pudieron cargar los casilleros disponibles.");
      } finally {
        setLoading(false);
      }
    };

    loadCasilleros();
  }, []);

  return (
    <DashboardLayout>
      <section className="space-y-6">
        {loading ? (
          <div className="flex h-40 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : casilleros.length === 0 ? (
          <EmptyState title="No hay casilleros disponibles" />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {casilleros.map((casillero) => (
              <Card key={casillero.id} className="relative overflow-hidden">
                <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/5 via-transparent to-transparent" />
                <CardHeader className="space-y-1">
                  <CardTitle className="flex items-center justify-between text-xl">
                    <span className="font-mono">{casillero.codigo}</span>
                    <Badge className="bg-primary/10 text-primary">
                      {casillero.pais}
                    </Badge>
                  </CardTitle>
                  <CardDescription>
                    {casillero.estado} / {casillero.direccion}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2 text-sm">
                    <InfoRow label="Teléfono" value={casillero.telefono} />
                    <InfoRow
                      label="Costo Aéreo"
                      value={`$${numberFormatter.format(
                        casillero.costo_aereo ?? 0
                      )}/kg`}
                    />
                    <InfoRow
                      label="Costo Marítimo"
                      value={`$${numberFormatter.format(
                        casillero.costo_maritimo ?? 0
                      )}/kg`}
                    />
                    <InfoRow
                      label="Costo Terrestre"
                      value={`$${numberFormatter.format(
                        casillero.costo_terrestre ?? 0
                      )}/kg`}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </DashboardLayout>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-foreground">{value}</span>
    </div>
  );
}

function EmptyState({ title }: { title: string }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-3xl border border-dashed p-10 text-center text-muted-foreground">
      <PackageSearch className="h-10 w-10" />
      <p className="text-sm font-medium">{title}</p>
      <p className="text-xs text-muted-foreground">
        Vuelve más tarde o contáctanos para conocer la disponibilidad de nuevos
        puntos de consolidación.
      </p>
    </div>
  );
}
