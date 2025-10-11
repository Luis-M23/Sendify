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
import { Plane, Truck, Ship } from "lucide-react";
import {
  ModosTransporteService,
} from "@/lib/supabase/services/factorConversionService";
import { factorConversionSchema } from "@/lib/validation/factorConversion";
import { toast } from "react-toastify";
import { FactorConversion } from "@/lib/validation/factorConversion";


export default function ModosTransportePage() {
  const [modos, setModos] = useState<(FactorConversion & { error?: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [saving, setSaving] = useState(false);

  const loadModos = async () => {
    try {
      setLoading(true);
      const data = await ModosTransporteService.getAll();
      setModos(data);
    } catch (error: any) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadModos();
  }, []);

  const handleDivisorChange = (id: number, value: string) => {
    setModos((prev) =>
      prev.map((m) => {
        if (m.id === id) {
          const num = Number(value);
          let error;
          try {
            factorConversionSchema.parse({ ...m, divisor_vol: num });
          } catch (e: any) {
            error = e.errors[0]?.message;
          }
          return { ...m, divisor_vol: num, error };
        }
        return m;
      })
    );
  };

  const handleSaveChanges = async () => {
    const invalid = modos.find((m) => m.error);
    if (invalid) return;

    try {
      setSaving(true);
      await ModosTransporteService.updateAll(modos);
      toast.success("Factores actualizados");
      loadModos();
    } catch (error: any) {
      console.error(error);
      toast.error("Error al actualizar");
    } finally {
      setSaving(false);
    }
  };

  const iconsMap: Record<number, JSX.Element> = {
    1: <Plane className="h-6 w-6 text-blue-500" />,
    2: <Truck className="h-6 w-6 text-green-500" />,
    3: <Ship className="h-6 w-6 text-cyan-500" />,
  };

  const getIcon = (id: number) => {
    return iconsMap[id] || null;
  };

  const filteredModos = modos.filter((m) =>
    m.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout userRole="admin">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-1">Factores de conversión</h1>
            <p className="text-muted-foreground">
              Gestiona los factores de conversión (peso volumétrico)
            </p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Input
              placeholder="Buscar modo de transporte..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-64"
            />
            <Button
              onClick={handleSaveChanges}
              disabled={saving || modos.some((m) => m.error)}
            >
              {saving ? "Guardando..." : "Guardar Cambios"}
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground mt-2">
              Cargando modos de transporte...
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredModos.map((modo) => (
              <Card key={modo.id} className="flex flex-col justify-between">
                <CardHeader className="flex items-center gap-3">
                  {getIcon(modo.id)}
                  <CardTitle className="text-lg">{modo.nombre}</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center gap-2">
                  <CardDescription>Divisor Volumétrico</CardDescription>
                  <Input
                    type="number"
                    value={modo.divisor_vol}
                    onChange={(e) =>
                      handleDivisorChange(modo.id, e.target.value)
                    }
                    className={`text-center ${
                      modo.error ? "border-red-500" : ""
                    }`}
                  />
                  {modo.error && (
                    <span className="text-xs text-red-500">{modo.error}</span>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
