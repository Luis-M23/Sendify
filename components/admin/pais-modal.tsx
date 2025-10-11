"use client";

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
import { toast } from "react-toastify";

import { useEffect } from "react";
import {
  CrearPaisSchema,
  PaisSchema,
  CrearPaisData,
  PaisData,
} from "@/lib/validation/pais";

interface CountryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "add" | "edit";
  initialData?: PaisData | null;
  onSubmit: (data: CrearPaisData | PaisData) => void;
}

export function PaisModal({
  open,
  onOpenChange,
  mode,
  initialData,
  onSubmit,
}: CountryModalProps) {

  const defaultValues: CrearPaisData = {
    codigo: "",
    nombre_completo: "",
    moneda: "",
    costo_aereo: 0,
    costo_terrestre: 0,
    costo_maritimo: 0,
    activo: true,
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<PaisData>({
    resolver: zodResolver(mode === "add" ? CrearPaisSchema : PaisSchema),
    defaultValues: mode === "add" ? defaultValues : undefined,
  });

  const activo = watch("activo");

  const handleFormSubmit = (data: PaisData) => {
    onSubmit(data);
    toast.success(mode === "add" ? "País agregado" : "País actualizado");
    onOpenChange(false);
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      reset(mode === "add" ? defaultValues : initialData);
    }
    onOpenChange(open);
  };

  useEffect(() => {
    if (mode === "edit" && initialData) {
      reset(initialData);
    }
  }, [mode, initialData, reset]);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === "add" ? "Agregar Nuevo País" : "Editar País"}
          </DialogTitle>
          <DialogDescription>
            {mode === "add"
              ? "Define un nuevo país en el sistema"
              : "Actualiza los datos del país"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="codigo">Código ISO (2-3 letras) *</Label>
              <Input
                id="codigo"

                maxLength={3}
                {...register("codigo")}
              />
              {errors.codigo && (
                <p className="text-sm text-destructive">
                  {errors.codigo.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="moneda">Código de Moneda (3 letras) *</Label>
              <Input
                id="moneda"

                maxLength={3}
                {...register("moneda")}
              />
              {errors.moneda && (
                <p className="text-sm text-destructive">
                  {errors.moneda.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="nombre_completo">Nombre Completo *</Label>
            <Input
              id="nombre_completo"
              {...register("nombre_completo")}
            />
            {errors.nombre_completo && (
              <p className="text-sm text-destructive">
                {errors.nombre_completo.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="costo_aereo">Costo Aéreo (USD/kg)</Label>
              <Input
                id="costo_aereo"
                type="number"
                step={0.01}
                {...register("costo_aereo", { valueAsNumber: true })}
              />
              {errors.costo_aereo && (
                <p className="text-sm text-destructive">
                  {errors.costo_aereo.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="costo_terrestre">Costo Terrestre (USD/kg)</Label>
              <Input
                id="costo_terrestre"
                type="number"
                step={0.01}
                {...register("costo_terrestre", { valueAsNumber: true })}
              />
              {errors.costo_terrestre && (
                <p className="text-sm text-destructive">
                  {errors.costo_terrestre.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="costo_maritimo">Costo Marítimo (USD/kg)</Label>
              <Input
                id="costo_maritimo"
                type="number"
                step={0.01}
                {...register("costo_maritimo", { valueAsNumber: true })}
              />
              {errors.costo_maritimo && (
                <p className="text-sm text-destructive">
                  {errors.costo_maritimo.message}
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit">
              {mode === "add" ? "Agregar País" : "Guardar Cambios"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
