"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Recompensa, RecompensaSchema } from "@/lib/validation/recompensa";
import { cn } from "@/lib/utils";

interface RecompensaModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData: Recompensa | null;
  onSubmit: (data: Recompensa) => void;
}

export function RecompensaModal({
  open,
  onOpenChange,
  initialData,
  onSubmit,
}: RecompensaModalProps) {
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Recompensa>({
    resolver: zodResolver(RecompensaSchema),
    defaultValues: initialData ?? undefined,
  });

  useEffect(() => {
    if (initialData) {
      reset({
        ...initialData,
        beneficios: initialData.beneficios ?? "",
      });
    }
  }, [initialData, reset]);

  const handleClose = (nextState: boolean) => {
    if (!nextState && initialData) {
      reset({
        ...initialData,
        beneficios: initialData.beneficios ?? "",
      });
    }
    onOpenChange(nextState);
  };

  const onFormSubmit = (data: Recompensa) => {
    onSubmit({
      ...data,
      beneficios: data.beneficios?.trim() || null,
    });
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      {initialData && (
        <DialogContent className="sm:max-w-[560px]">
          <DialogHeader>
            <DialogTitle>Editar recompensa</DialogTitle>
            <DialogDescription>
              Actualiza los requisitos y beneficios del nivel seleccionado.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-5">
            <input type="hidden" {...register("id", { valueAsNumber: true })} />
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="nivel">Nivel</Label>
                <Input
                  id="nivel"
                  readOnly
                  {...register("nivel")}
                  className={cn(
                    "bg-muted/50",
                    errors.nivel &&
                      "border-destructive focus-visible:ring-destructive"
                  )}
                />
                {errors.nivel && (
                  <p className="text-sm text-destructive">
                    {errors.nivel.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="requisito_compras">Requisito de compras</Label>
              <Input
                id="requisito_compras"
                type="number"
                {...register("requisito_compras", { valueAsNumber: true })}
                className={cn(
                  errors.requisito_compras &&
                    "border-destructive focus-visible:ring-destructive"
                )}
                />
                {errors.requisito_compras && (
                  <p className="text-sm text-destructive">
                    {errors.requisito_compras.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="porcentaje_descuento">
                  Porcentaje de descuento (%)
                </Label>
              <Input
                id="porcentaje_descuento"
                type="number"
                {...register("porcentaje_descuento", { valueAsNumber: true })}
                className={cn(
                  errors.porcentaje_descuento &&
                    "border-destructive focus-visible:ring-destructive"
                )}
                />
                {errors.porcentaje_descuento && (
                  <p className="text-sm text-destructive">
                    {errors.porcentaje_descuento.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="beneficios">
                Beneficios (separados por líneas)
              </Label>
              <Textarea
                id="beneficios"
                rows={7}
                placeholder="Ingresa cada beneficio en una nueva línea"
                {...register("beneficios")}
                className={cn(
                  errors.beneficios &&
                    "border-destructive focus-visible:ring-destructive"
                )}
              />
              {errors.beneficios && (
                <p className="text-sm text-destructive">
                  {errors.beneficios.message}
                </p>
              )}
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => handleClose(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                Guardar cambios
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      )}
    </Dialog>
  );
}
