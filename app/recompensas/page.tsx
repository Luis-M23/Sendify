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
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Star,
  Package,
  Crown,
  Award,
  CheckCircle2,
  Percent,
  Sparkles,
  Lock,
} from "lucide-react";
import { toast } from "react-toastify";
import { RecompensaService } from "@/lib/supabase/services/recompensaService";
import { Recompensa } from "@/lib/validation/recompensa";
import { useAuth } from "@/components/auth-provider";

const levelDecorations: Record<
  string,
  {
    color: string;
    Icon: typeof Star;
  }
> = {
  bronce: { color: "oklch(0.627 0.265 303.9)", Icon: Award },
  plata: { color: "oklch(0.708 0 0)", Icon: Star },
  oro: { color: "oklch(0.769 0.188 70.08)", Icon: Crown },
  platino: { color: "oklch(0.645 0.246 16.439)", Icon: Sparkles },
};

const getLevelDecoration = (nivel: string) =>
  levelDecorations[nivel.toLowerCase()] ?? {
    color: "oklch(0.7 0.12 220)",
    Icon: Star,
  };

const parseBeneficios = (beneficios?: string | null) =>
  beneficios
    ? beneficios
        .split(/\r?\n|;/)
        .map((item) => item.trim())
        .filter(Boolean)
    : [];

export default function RecompensasPage() {
  const { recompensa, usuarioMetadata } = useAuth();
  const [currentLevel] = useState(recompensa?.id);
  const [recompensas, setRecompensas] = useState<Recompensa[]>([]);
  const [loadingLevels, setLoadingLevels] = useState(true);

  const sortedLevels = useMemo(
    () =>
      [...recompensas].sort(
        (a, b) => a.requisito_compras - b.requisito_compras
      ),
    [recompensas]
  );

  useEffect(() => {
    const fetchRecompensas = async () => {
      try {
        setLoadingLevels(true);
        const data = await RecompensaService.getAll();
        setRecompensas(data);
      } catch (error: any) {
        toast.error(
          error.message ||
            "Ocurrió un error al cargar el programa de recompensas"
        );
      } finally {
        setLoadingLevels(false);
      }
    };

    fetchRecompensas();
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <Card className="border-chart-4/50 bg-gradient-to-br from-chart-4/10 to-transparent">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="mb-2 flex items-center gap-2 text-2xl">
                  <Crown className="h-6 w-6 text-chart-4" />
                  Tu Nivel Actual
                </CardTitle>
                <CardDescription className="text-base">
                  Disfrutas de un {recompensa?.porcentaje_descuento || "0"}% de
                  descuento en todos tus envíos
                </CardDescription>
              </div>
              <Badge className="border-chart-4/30 bg-chart-4/20 px-4 py-2 text-lg text-chart-4">
                <Star className="mr-2 h-4 w-4" />
                {recompensa?.nivel || "Miembro"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Separator />

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-4/20">
                  <Package className="h-5 w-5 text-chart-4" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {usuarioMetadata?.compras_realizadas}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Envíos realizados
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20">
                  <Percent className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {recompensa?.porcentaje_descuento || "0"}%
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Descuento actual
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {loadingLevels ? (
            <Card className="md:col-span-2">
              <CardContent className="py-10 text-center text-muted-foreground">
                Cargando niveles disponibles...
              </CardContent>
            </Card>
          ) : sortedLevels.length === 0 ? (
            <Card className="md:col-span-2">
              <CardContent className="py-10 text-center text-muted-foreground">
                Todavía no hay niveles configurados en el programa.
              </CardContent>
            </Card>
          ) : (
            sortedLevels.map((level) => {
              const { color, Icon } = getLevelDecoration(level.nivel);
              const isCurrentLevel = level.id === currentLevel;
              const beneficios = parseBeneficios(level.beneficios);
              return (
                <Card
                  key={level.id}
                  className={`relative overflow-hidden ${
                    isCurrentLevel ? "border-chart-4 bg-chart-4/5" : ""
                  }`}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="mb-2 flex items-center gap-2">
                          <div
                            className="flex h-10 w-10 items-center justify-center rounded-lg"
                            style={{ backgroundColor: `${color}20` }}
                          >
                            <Icon className="h-5 w-5" style={{ color }} />
                          </div>
                          <div>
                            <CardTitle className="text-xl">
                              {level.nivel}
                            </CardTitle>
                            <CardDescription className="text-xs">
                              Requiere {level.requisito_compras} compras
                              registradas
                            </CardDescription>
                          </div>
                        </div>
                      </div>
                      {isCurrentLevel && (
                        <Badge className="border-chart-4/30 bg-chart-4/20 text-chart-4">
                          Actual
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold">
                        {level.porcentaje_descuento}%
                      </span>
                      <span className="text-sm text-muted-foreground">
                        de descuento
                      </span>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <p className="mb-3 text-sm font-semibold">Beneficios:</p>
                      {beneficios.length === 0 ? (
                        <p className="text-sm text-muted-foreground">
                          Aún no se definieron beneficios específicos para este
                          nivel.
                        </p>
                      ) : (
                        beneficios.map((beneficio, idx) => (
                          <div key={idx} className="flex items-start gap-2">
                            <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-chart-3" />
                            <p className="text-sm text-muted-foreground">
                              {beneficio}
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
