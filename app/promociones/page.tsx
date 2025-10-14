"use client";

import { DashboardLayout } from "@/components/dashboard-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Calendar, CheckCircle2 } from "lucide-react";

interface Promotion {
  id: string;
  titulo: string;
  descripcion: string;
  descuento: string;
  tipo: "temporada" | "producto" | "volumen";
  fechaInicio: string;
  fechaFin: string;
  activa: boolean;
  condiciones: string[];
}

const promotions: Promotion[] = [
  {
    id: "1",
    titulo: "Black Friday 2025",
    descripcion: "Descuento especial en todos los envíos durante el Black Friday",
    descuento: "20%",
    tipo: "temporada",
    fechaInicio: "2025-11-29",
    fechaFin: "2025-12-02",
    activa: false,
    condiciones: [
      "Válido para todos los servicios",
      "No acumulable con otros descuentos",
      "Mínimo 1kg",
    ],
  },
  {
    id: "2",
    titulo: "Envío Gratis en Electrónicos",
    descripcion: "Envío gratuito en compras de electrónicos mayores a $500",
    descuento: "Envío Gratis",
    tipo: "producto",
    fechaInicio: "2025-10-01",
    fechaFin: "2025-10-31",
    activa: true,
    condiciones: [
      "Solo categoría electrónicos",
      "Compra mínima $500",
      "Servicio terrestre",
    ],
  },
  {
    id: "3",
    titulo: "Descuento por Volumen",
    descripcion: "Ahorra más mientras más envíes este mes",
    descuento: "Hasta 15%",
    tipo: "volumen",
    fechaInicio: "2025-10-01",
    fechaFin: "2025-10-31",
    activa: true,
    condiciones: [
      "5+ envíos: 10% descuento",
      "10+ envíos: 15% descuento",
      "Acumulativo mensual",
    ],
  },
  {
    id: "4",
    titulo: "Navidad 2025",
    descripcion: "Descuento especial para tus regalos navideños",
    descuento: "15%",
    tipo: "temporada",
    fechaInicio: "2025-12-15",
    fechaFin: "2025-12-25",
    activa: false,
    condiciones: [
      "Válido para todos los servicios",
      "Máximo 5 envíos por cliente",
    ],
  },
];

export default function PromocionesPage() {
  const activePromotions = promotions.filter((promo) => promo.activa);
  const upcomingPromotions = promotions.filter((promo) => !promo.activa);

  return (
    <DashboardLayout userRole="vip">
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

          {activePromotions.length === 0 ? (
            <Card>
              <CardContent className="py-10 text-center text-muted-foreground">
                No hay promociones activas en este momento.
              </CardContent>
            </Card>
          ) : (
            activePromotions.map((promo) => (
              <Card
                key={promo.id}
                className="border-primary/50 bg-gradient-to-br from-primary/5 to-transparent"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="mb-2 flex items-center gap-2">
                        <Badge
                          className={
                            promo.tipo === "temporada"
                              ? "border-chart-5/30 bg-chart-5/20 text-chart-5"
                              : promo.tipo === "producto"
                                ? "border-chart-2/30 bg-chart-2/20 text-chart-2"
                                : "border-chart-4/30 bg-chart-4/20 text-chart-4"
                          }
                        >
                          {promo.tipo === "temporada"
                            ? "Temporada"
                            : promo.tipo === "producto"
                              ? "Por Producto"
                              : "Por Volumen"}
                        </Badge>
                        <Badge className="border-chart-3/30 bg-chart-3/20 text-chart-3">
                          <CheckCircle2 className="mr-1 h-3 w-3" />
                          Activa
                        </Badge>
                      </div>
                      <CardTitle className="mb-2 text-xl">{promo.titulo}</CardTitle>
                      <CardDescription>{promo.descripcion}</CardDescription>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-bold text-primary">{promo.descuento}</p>
                      <p className="text-xs text-muted-foreground">de descuento</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {new Date(promo.fechaInicio).toLocaleDateString("es-ES", {
                        day: "numeric",
                        month: "short",
                      })}{" "}
                      -{" "}
                      {new Date(promo.fechaFin).toLocaleDateString("es-ES", {
                        day: "numeric",
                        month: "short",
                      })}
                    </span>
                  </div>

                  <Separator />

                  <div>
                    <p className="mb-2 text-sm font-semibold">Condiciones:</p>
                    <ul className="space-y-1">
                      {promo.condiciones.map((condicion, index) => (
                        <li
                          key={index}
                          className="flex items-start gap-2 text-sm text-muted-foreground"
                        >
                          <span className="text-primary">•</span>
                          <span>{condicion}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Button className="w-full">Aplicar Promoción</Button>
                </CardContent>
              </Card>
            ))
          )}
        </section>

        <Separator />

        <section className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold">Próximas Promociones</h2>
            <p className="text-sm text-muted-foreground">
              Mantente atento para aprovechar estas ofertas en cuanto se activen.
            </p>
          </div>

          {upcomingPromotions.length === 0 ? (
            <Card>
              <CardContent className="py-10 text-center text-muted-foreground">
                No hay promociones programadas por el momento.
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {upcomingPromotions.map((promo) => (
                <Card key={promo.id} className="opacity-80">
                  <CardHeader>
                    <div className="mb-2 flex items-center gap-2">
                      <Badge variant="outline">Próximamente</Badge>
                      <Badge
                        className={
                          promo.tipo === "temporada"
                            ? "border-chart-5/30 bg-chart-5/20 text-chart-5"
                            : promo.tipo === "producto"
                              ? "border-chart-2/30 bg-chart-2/20 text-chart-2"
                              : "border-chart-4/30 bg-chart-4/20 text-chart-4"
                        }
                      >
                        {promo.tipo === "temporada"
                          ? "Temporada"
                          : promo.tipo === "producto"
                            ? "Por Producto"
                            : "Por Volumen"}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg">{promo.titulo}</CardTitle>
                    <CardDescription>{promo.descripcion}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>
                        Inicia el{" "}
                        {new Date(promo.fechaInicio).toLocaleDateString("es-ES", {
                          day: "numeric",
                          month: "long",
                        })}
                      </span>
                    </div>
                    <p className="text-xl font-bold text-primary">{promo.descuento}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>
      </div>
    </DashboardLayout>
  );
}
