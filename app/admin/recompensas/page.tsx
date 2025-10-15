"use client";

import { useState, useEffect, JSX } from "react";
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
import {
  Plane,
  Truck,
  Ship,
  Save,
  Search,
  Star,
  Award,
  Crown,
  Sparkles,
} from "lucide-react";
import { ModosTransporteService } from "@/lib/supabase/services/factorConversionService";
import { FactorConversionSchema } from "@/lib/validation/factorConversion";
import { toast } from "react-toastify";
import { RecompensaService } from "@/lib/supabase/services/recompensaService";
import { RecompensaData } from "@/lib/validation";

const levelDecorations: Record<
  number,
  {
    color: string;
    Icon: typeof Star;
  }
> = {
  1: { color: "oklch(0.627 0.265 303.9)", Icon: Award },
  2: { color: "oklch(0.708 0 0)", Icon: Star },
  3: { color: "oklch(0.769 0.188 70.08)", Icon: Crown },
  4: { color: "oklch(0.645 0.246 16.439)", Icon: Sparkles },
};

const getLevelDecoration = (nivel: number) =>
  levelDecorations[nivel] ?? {
    color: "oklch(0.7 0.12 220)",
    Icon: Star,
  };

export default function ModosTransportePage() {
  const [recompensas, setRecompensas] = useState<RecompensaData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const loadModos = async () => {
    try {
      setLoading(true);
      const data = await RecompensaService.getAll();
      setRecompensas(data);
    } catch (error: any) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadModos();
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <Card>
          <CardHeader className="flex justify-between items-center">
            <div>
              <CardTitle>Recompensas</CardTitle>
              <CardDescription>
                Gestiona los límites de las recomepensas
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar medio transporte"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 w-64"
                />
              </div>
              <Button
                onClick={handleSaveChanges}
                disabled={saving || recompensas.some((m) => m.error)}
              >
                <Save className="h-4 w-4 mr-2" />{" "}
                {saving ? "Guardando..." : "Guardar"}
              </Button>
            </div>
          </CardHeader>

          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="text-muted-foreground mt-2">
                  Cargando las recompensas...
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredModos.map((modo) => (
                  <Card key={modo.id} className="flex flex-col justify-between">
                    <CardHeader className="flex items-center gap-3">
                      {getIcon(modo.id)}
                      <CardTitle className="text-lg">
                        {recompensas.nombre}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center gap-2">
                      <CardDescription>Divisor Volumétrico</CardDescription>
                      <Input
                        type="number"
                        value={recompensas.divisor_vol}
                        onChange={(e) =>
                          handleDivisorChange(recompensas.id, e.target.value)
                        }
                        className={`text-center ${
                          modo.error ? "border-red-500" : ""
                        }`}
                      />
                      {modo.error && (
                        <span className="text-xs text-red-500">
                          {modo.error}
                        </span>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
