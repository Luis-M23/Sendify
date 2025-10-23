"use client";

import { useEffect, useState } from "react";
import { Clock3, PackageSearch, Loader2 } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DireccionService } from "@/lib/supabase/services/direccionService";
import type { DireccionDistrito } from "@/lib/validation/direccion";
import { toast } from "react-toastify";

export default function PublicDireccionesPage() {
  const [direcciones, setDirecciones] = useState<DireccionDistrito[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDirecciones = async () => {
      try {
        setLoading(true);
        const data = await DireccionService.getAll();
        setDirecciones(data.filter((direccion) => direccion.activo !== false));
      } catch (error) {
        console.error(error);
        toast.error("No se pudieron cargar las direcciones disponibles.");
      } finally {
        setLoading(false);
      }
    };

    loadDirecciones();
  }, []);

  const parseHorarios = (horario?: string | null) =>
    horario
      ?.split(/\r?\n|;/)
      .map((item) => item.trim())
      .filter(Boolean) ?? [];

  return (
    <DashboardLayout>
      <section className="space-y-6">
        {loading ? (
          <div className="flex h-40 items-center justify-center text-muted-foreground">
            <Loader2 className="h-6 w-6 animate-spin" /> Cargando direcciones...
          </div>
        ) : direcciones.length === 0 ? (
          <EmptyState title="No hay direcciones disponibles" />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {direcciones.map((direccion) => (
              <Card key={direccion.id} className="relative overflow-hidden">
                <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/5 via-transparent to-transparent" />
                <CardHeader>
                  <CardTitle className="text-xl">
                    {direccion.direccion}
                  </CardTitle>
                  <CardDescription>
                    {direccion.distritos?.municipio},{" "}
                    {direccion.distritos?.departamento}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {parseHorarios(direccion.horario_atencion).map(
                    (horario, key) => (
                      <InfoLine
                        key={direccion.id + key}
                        icon={Clock3}
                        label="Horario"
                        value={horario}
                      />
                    )
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </DashboardLayout>
  );
}

function SummaryCard({
  label,
  value,
}: {
  label: string;
  value: number | string;
}) {
  return (
    <Card className="border border-primary/20 bg-background/80">
      <CardContent className="space-y-1 px-4 py-5">
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="text-2xl font-semibold text-primary">{value}</p>
      </CardContent>
    </Card>
  );
}

function InfoLine({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: React.ElementType;
}) {
  return (
    <div className="flex items-center gap-3 text-sm text-muted-foreground">
      <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <Icon className="h-4 w-4" />
      </span>
      <div>
        <p className="text-xs uppercase tracking-wide text-muted-foreground/70">
          {label}
        </p>
        <p className="text-sm font-medium text-foreground">{value}</p>
      </div>
    </div>
  );
}

function EmptyState({ title }: { title: string }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-3xl border border-dashed p-10 text-center text-muted-foreground">
      <PackageSearch className="h-10 w-10" />
      <p className="text-sm font-medium">{title}</p>
      <p className="text-xs text-muted-foreground">
        Vuelve pronto o contacta a nuestro equipo para conocer nuevas aperturas.
      </p>
    </div>
  );
}
