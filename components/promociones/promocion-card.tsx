"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calendar, CheckCircle2 } from "lucide-react";
import { Promocion } from "@/lib/validation";

interface PromocionCardProps {
  promocion: Promocion;
  statusLabel: string;
  statusClasses: string;
}

export function PromocionCard({
  promocion,
  statusLabel,
  statusClasses,
}: PromocionCardProps) {
  const fechaInicio = new Date(promocion.fecha_inicio);
  const fechaFin = new Date(promocion.fecha_fin);

  return (
    <Card className="border-primary/50 bg-gradient-to-br from-primary/5 to-transparent">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="mb-2 flex items-center gap-2">
              <Badge className={statusClasses}>
                <CheckCircle2 className="mr-1 h-3 w-3" />
                {statusLabel}
              </Badge>
            </div>
            <CardTitle className="mb-2 text-xl">{promocion.titulo}</CardTitle>
            <CardDescription>{promocion.descripcion}</CardDescription>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-primary">
              {promocion.codigo}{" "}
            </p>
            <p className="text-3xl font-bold text-primary">
              {promocion.porcentaje_descuento}%
            </p>
            <p className="text-sm font-bold text-muted-foreground">Código</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>
            {fechaInicio.toLocaleDateString("es-ES", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}{" "}
            -{" "}
            {fechaFin.toLocaleDateString("es-ES", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </span>
        </div>

        <Separator />

        <div>
          <p className="mb-2 text-sm font-semibold">Condiciones:</p>
          {promocion.restricciones_categorias?.length ? (
            <ul className="space-y-1">
              {promocion.restricciones_categorias.map((condicion, index) => (
                <li
                  key={index}
                  className="flex items-start gap-2 text-sm text-muted-foreground"
                >
                  <span className="text-primary">•</span>
                  <span>{condicion}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm italic text-muted-foreground">
              Sin restricciones
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
