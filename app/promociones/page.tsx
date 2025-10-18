"use client";

import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent } from "@/components/ui/card";
import { PromocionService } from "@/lib/supabase/services/promocionService";
import { useEffect, useState } from "react";
import { Promocion } from "@/lib/validation";
import { PromocionCard } from "@/components/promociones/promocion-card";
import { Loader2 } from "lucide-react";
import { CategoriaMap } from "@/lib/map";

export default function PromocionesPage() {
  const [promocionesActivas, setPromocionesActivas] = useState<Promocion[]>([]);
  const [promocionesFuturas, setPromocionesFuturas] = useState<Promocion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const categorias = await CategoriaMap();

        const activas = await PromocionService.promocionesActivas();
        setPromocionesActivas(
          activas.map((promo) => ({
            ...promo,
            restricciones_categorias:
              promo.restricciones_categorias?.map(
                (cat) => categorias[Number(cat)]
              ) || [],
          }))
        );

        const futuras = await PromocionService.promocionesFuturas();
        setPromocionesFuturas(
          futuras.map((promo) => ({
            ...promo,
            restricciones_categorias:
              promo.restricciones_categorias?.map(
                (cat) => categorias[Number(cat)]
              ) || [],
          }))
        );
      } catch (error) {
        console.error("Error al cargar promociones futuras:", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-10">
        <header>
          <h1 className="text-3xl font-bold">Promociones</h1>
          <p className="text-muted-foreground">
            Descubre las ofertas activas y las que están próximas a lanzarse.
          </p>
        </header>

        <section className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold">Promociones Activas</h2>
            <p className="text-sm text-muted-foreground">
              Aprovecha estas ofertas exclusivas para tus próximos envíos.
            </p>
          </div>

          {loading ? (
            <Card>
              <CardContent className="flex items-center justify-center gap-2 py-10 text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Cargando promociones activas...
              </CardContent>
            </Card>
          ) : promocionesActivas.length === 0 ? (
            <Card>
              <CardContent className="py-10 text-center text-muted-foreground">
                No hay promociones activas en este momento.
              </CardContent>
            </Card>
          ) : (
            promocionesActivas.map((promo) => (
              <PromocionCard
                key={promo.id}
                promocion={promo}
                statusLabel="Activa"
                statusClasses="border-chart-3/30 bg-chart-3/20 text-chart-3"
              />
            ))
          )}
        </section>

        <section className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold">Promociones Futuras</h2>
            <p className="text-sm text-muted-foreground">
              Planifica con anticipación y aprovecha la próxima ola de
              descuentos.
            </p>
          </div>

          {loading ? (
            <Card>
              <CardContent className="flex items-center justify-center gap-2 py-10 text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Cargando promociones futuras...
              </CardContent>
            </Card>
          ) : promocionesFuturas.length === 0 ? (
            <Card>
              <CardContent className="py-10 text-center text-muted-foreground">
                No hay promociones futuras en este momento.
              </CardContent>
            </Card>
          ) : (
            promocionesFuturas.map((promo) => (
              <PromocionCard
                key={promo.id}
                promocion={promo}
                statusLabel="Próximamente"
                statusClasses="border-amber-300 bg-amber-100 text-amber-700"
              />
            ))
          )}
        </section>
      </div>
    </DashboardLayout>
  );
}
