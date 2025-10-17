"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";

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
import { Switch } from "@/components/ui/switch";

import {
  DireccionData,
  CrearDireccionData,
  DireccionSchema,
  CrearDireccionSchema,
} from "@/lib/validation/direccion";

interface CasilleroModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "add" | "edit";
  initialData?: DireccionData | null;
  onSubmit: (data: CrearDireccionData | DireccionData) => void;
}

export function CasilleroModal({
  open,
  onOpenChange,
  mode,
  initialData,
  onSubmit,
}: CasilleroModalProps) {
  const defaultValues: CrearDireccionData = {
    codigo: "",
    pais: "",
    estado: "",
    direccion: "",
    telefono: "",
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
  } = useForm<DireccionData>({
    resolver: zodResolver(
      mode === "add" ? CrearDireccionSchema : DireccionSchema
    ),
    defaultValues: mode === "add" ? defaultValues : undefined,
  });

  const activo = watch("activo");

  const handleFormSubmit = (data: DireccionData) => {
    onSubmit(data);
    toast.success(
      mode === "add" ? "Dirección agregada" : "Dirección actualizada"
    );
    onOpenChange(false);
  };

  const handleOpenChange = (state: boolean) => {
    if (!state) {
      reset(mode === "add" ? defaultValues : initialData || undefined);
    }
    onOpenChange(state);
  };

  useEffect(() => {
    if (mode === "edit" && initialData) {
      reset(initialData);
    }
  }, [mode, initialData, reset]);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[680px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === "add" ? "Agregar Nuevo Casillero" : "Editar Casillero"}
          </DialogTitle>
          <DialogDescription>
            {mode === "add"
              ? "Registra una nueva dirección para envíos"
              : "Actualiza los datos de la dirección seleccionada"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="codigo">Código *</Label>
              <Input id="codigo" maxLength={10} {...register("codigo")} />
              {errors.codigo && (
                <p className="text-sm text-destructive">
                  {errors.codigo.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="pais">País *</Label>
              <Input id="pais" {...register("pais")} />
              {errors.pais && (
                <p className="text-sm text-destructive">
                  {errors.pais.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="estado">Estado / Provincia *</Label>
            <Input id="estado" {...register("estado")} />
            {errors.estado && (
              <p className="text-sm text-destructive">
                {errors.estado.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="direccion">Dirección *</Label>
            <Input id="direccion" {...register("direccion")} />
            {errors.direccion && (
              <p className="text-sm text-destructive">
                {errors.direccion.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="telefono">Teléfono *</Label>
              <Input id="telefono" {...register("telefono")} />
              {errors.telefono && (
                <p className="text-sm text-destructive">
                  {errors.telefono.message}
                </p>
              )}
            </div>

            {/* <div className="space-y-2">
              <Label htmlFor="activo">Estado</Label>
              <div className="flex items-center gap-3 rounded-md border p-2">
                <Switch
                  id="activo"
                  checked={Boolean(activo)}
                  onCheckedChange={(checked) => setValue("activo", checked)}
                />
                <span className="text-sm text-muted-foreground">
                  {activo ? "Activo" : "Inactivo"}
                </span>
              </div>
            </div> */}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="costo_aereo">Costo Aéreo (USD)</Label>
              <Input
                id="costo_aereo"
                type="number"
                step={0.01}
                min={0}
                {...register("costo_aereo", { valueAsNumber: true })}
              />
              {errors.costo_aereo && (
                <p className="text-sm text-destructive">
                  {errors.costo_aereo.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="costo_terrestre">Costo Terrestre (USD)</Label>
              <Input
                id="costo_terrestre"
                type="number"
                step={0.01}
                min={0}
                {...register("costo_terrestre", { valueAsNumber: true })}
              />
              {errors.costo_terrestre && (
                <p className="text-sm text-destructive">
                  {errors.costo_terrestre.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="costo_maritimo">Costo Marítimo (USD)</Label>
              <Input
                id="costo_maritimo"
                type="number"
                step={0.01}
                min={0}
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
              {mode === "add" ? "Agregar Dirección" : "Guardar Cambios"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
