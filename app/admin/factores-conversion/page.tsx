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
import { Plane, Truck, Ship, Save, Search, Plus } from "lucide-react";
import { ModosTransporteService } from "@/lib/supabase/services/factorConversionService";
import { FactorConversionSchema } from "@/lib/validation/factorConversion";
import { toast } from "react-toastify";
import { FactorConversionData } from "@/lib/validation/factorConversion";

export default function ModosTransportePage() {
  const [modos, setModos] = useState<
    (FactorConversionData & { error?: string })[]
  >([]);
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
            FactorConversionSchema.parse({ ...m, divisor_vol: num });
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
        <Card>
          <CardHeader className="flex justify-between items-center">
            <div>
              <CardTitle>Factores de Conversión</CardTitle>
              <CardDescription>
                Gestiona los factores de conversión (peso volumétrico)
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
                disabled={saving || modos.some((m) => m.error)}
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
