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
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { toast } from "react-toastify";
import { useEffect } from "react";

import {
  CrearCategoriaSchema,
  CategoriaSchema,
  CrearCategoriaData,
  CategoriaData,
} from "@/lib/validation/categoria";

interface CategoriaModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "add" | "edit";
  initialData?: CategoriaData | null;
  onSubmit: (data: CrearCategoriaData | CategoriaData) => void;
}

export function CategoriaModal({
  open,
  onOpenChange,
  mode,
  initialData,
  onSubmit,
}: CategoriaModalProps) {
  const defaultValues: CrearCategoriaData = {
    nombre: "",
    descripcion: "",
    aereo: 1,
    terrestre: 1,
    maritimo: 1,
    notas: "",
    activo: true,
  };

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
    watch,
  } = useForm<CategoriaData>({
    resolver: zodResolver(mode === "add" ? CrearCategoriaSchema : CategoriaSchema),
    defaultValues: mode === "add" ? defaultValues : undefined,
  });

  const handleFormSubmit = (data: CategoriaData) => {
    onSubmit(data);
    toast.success(mode === "add" ? "Categoría agregada" : "Categoría actualizada");
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

  // opciones de permisos
  const permisos = [
    { id: 1, label: "Prohibido" },
    { id: 2, label: "Permitido" },
    { id: 3, label: "Requiere Permiso" },
  ];

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === "add" ? "Agregar Nueva Categoría" : "Editar Categoría"}
          </DialogTitle>
          <DialogDescription>
            {mode === "add"
              ? "Define una nueva categoría de productos"
              : "Actualiza los datos de la categoría"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          {/* Nombre */}
          <div className="space-y-2">
            <Label htmlFor="nombre">Nombre *</Label>
            <Input id="nombre" {...register("nombre")} />
            {errors.nombre && (
              <p className="text-sm text-destructive">{errors.nombre.message}</p>
            )}
          </div>

          {/* Descripción */}
          <div className="space-y-2">
            <Label htmlFor="descripcion">Descripción *</Label>
            <Input id="descripcion" {...register("descripcion")} />
            {errors.descripcion && (
              <p className="text-sm text-destructive">{errors.descripcion.message}</p>
            )}
          </div>

          {/* Selects de permisos */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="aereo">Aéreo *</Label>
              <Select
                onValueChange={(val) => setValue("aereo", Number(val))}
                defaultValue={String(watch("aereo"))}
              >
                <SelectTrigger id="aereo">
                  <SelectValue placeholder="Seleccione" />
                </SelectTrigger>
                <SelectContent>
                  {permisos.map((p) => (
                    <SelectItem key={p.id} value={String(p.id)}>
                      {p.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.aereo && (
                <p className="text-sm text-destructive">{errors.aereo.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="terrestre">Terrestre *</Label>
              <Select
                onValueChange={(val) => setValue("terrestre", Number(val))}
                defaultValue={String(watch("terrestre"))}
              >
                <SelectTrigger id="terrestre">
                  <SelectValue placeholder="Seleccione" />
                </SelectTrigger>
                <SelectContent>
                  {permisos.map((p) => (
                    <SelectItem key={p.id} value={String(p.id)}>
                      {p.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.terrestre && (
                <p className="text-sm text-destructive">{errors.terrestre.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="maritimo">Marítimo *</Label>
              <Select
                onValueChange={(val) => setValue("maritimo", Number(val))}
                defaultValue={String(watch("maritimo"))}
              >
                <SelectTrigger id="maritimo">
                  <SelectValue placeholder="Seleccione" />
                </SelectTrigger>
                <SelectContent>
                  {permisos.map((p) => (
                    <SelectItem key={p.id} value={String(p.id)}>
                      {p.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.maritimo && (
                <p className="text-sm text-destructive">{errors.maritimo.message}</p>
              )}
            </div>
          </div>

          {/* Notas */}
          <div className="space-y-2">
            <Label htmlFor="notas">Notas</Label>
            <Input id="notas" {...register("notas")} />
            {errors.notas && (
              <p className="text-sm text-destructive">{errors.notas.message}</p>
            )}
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
              {mode === "add" ? "Agregar Categoría" : "Guardar Cambios"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
