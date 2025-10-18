"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Shield,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Info,
  Plane,
  Truck,
  Ship,
  Search,
} from "lucide-react";
import { CategoriaService } from "@/lib/supabase/services/categoriaService";
import { Categoria } from "@/lib/validation/categoria";
import { toast } from "react-toastify";

export default function RestrictionsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categorias, setCategorias] = useState<Categoria[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await CategoriaService.getAll();
        setCategorias(data);
      } catch (error) {
        toast.error("Erro al obtener los datos");
        console.error("Error al obtener categorías:", error);
      }
    };
    fetchData();
  }, []);

  const filteredRestrictions = categorias.filter((r) =>
    r.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusIcon = (status: number) => {
    switch (status) {
      case 1:
        return <XCircle className="h-5 w-5 text-destructive" />;
      case 2:
        return <CheckCircle2 className="h-5 w-5 text-chart-3" />;
      case 3:
        return <AlertTriangle className="h-5 w-5 text-chart-4" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: number) => {
    switch (status) {
      case 1:
        return (
          <Badge className="bg-destructive/20 text-destructive hover:bg-destructive/30 border-destructive/30">
            Prohibido
          </Badge>
        );
      case 2:
        return (
          <Badge className="bg-chart-3/20 text-chart-3 hover:bg-chart-3/30 border-chart-3/30">
            Permitido
          </Badge>
        );
      case 3:
        return (
          <Badge className="bg-chart-4/20 text-chart-4 hover:bg-chart-4/30 border-chart-4/30">
            Requiere Permiso
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Matriz de Restricciones</CardTitle>
            <CardDescription>
              Consulta todas las restricciones por categoría de producto
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Buscar categoría"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
            </div>

            <Card>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-0 py-0">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-chart-3" />
                    <div>
                      <p className="text-sm font-medium">Permitido</p>
                      <p className="text-xs text-muted-foreground">
                        Sin restricciones especiales
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="h-5 w-5 text-chart-4" />
                    <div>
                      <p className="text-sm font-medium">Requiere Permiso</p>
                      <p className="text-xs text-muted-foreground">
                        Documentación adicional necesaria
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <XCircle className="h-5 w-5 text-destructive" />
                    <div>
                      <p className="text-sm font-medium">Prohibido</p>
                      <p className="text-xs text-muted-foreground">
                        No se puede enviar por este medio
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-3">
              {filteredRestrictions.map((categorias) => (
                <Card key={categorias.id} className="overflow-hidden">
                  <CardContent className="py-0 px-4">
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">
                          {categorias.nombre}
                        </h3>
                        {categorias.descripcion && (
                          <p className="text-sm font-semibold">
                            {categorias.descripcion}
                          </p>
                        )}
                        {categorias.notas && (
                          <p className="text-sm text-muted-foreground">
                            {categorias.notas}
                          </p>
                        )}
                      </div>

                      <div className="flex gap-3">
                        <div className="flex items-center gap-2 min-w-[120px]">
                          <Plane className="h-4 w-4 text-muted-foreground" />
                          {getStatusBadge(categorias.aereo)}
                        </div>
                        <div className="flex items-center gap-2 min-w-[120px]">
                          <Truck className="h-4 w-4 text-muted-foreground" />
                          {getStatusBadge(categorias.terrestre)}
                        </div>
                        <div className="flex items-center gap-2 min-w-[120px]">
                          <Ship className="h-4 w-4 text-muted-foreground" />
                          {getStatusBadge(categorias.maritimo)}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
