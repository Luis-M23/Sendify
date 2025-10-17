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

import {
  Direccion,
  CrearDireccion,
  DireccionSchema,
  CrearDireccionSchema,
} from "@/lib/validation/direccion";
import { Textarea } from "../ui/textarea";
import { Distrito } from "@/lib/validation/distrito";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface DireccionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "add" | "edit";
  initialData?: Direccion | null;
  onSubmit: (data: CrearDireccion | Direccion) => void;
  distritos: Distrito[];
}

export function DireccionModal({
  open,
  onOpenChange,
  mode,
  initialData,
  onSubmit,
  distritos,
}: DireccionModalProps) {
  const defaultValues: CrearDireccion = {
    id_distrito: undefined,
    direccion: "",
    horario_atencion: "",
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<Direccion>({
    resolver: zodResolver(
      mode === "add" ? CrearDireccionSchema : DireccionSchema
    ),
    defaultValues: mode === "add" ? defaultValues : undefined,
  });

  const handleFormSubmit = (data: Direccion) => {
    onSubmit(data);
    toast.success(
      mode === "add" ? "Direccion agregado" : "Direccion actualizado"
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
            {mode === "add" ? "Agregar Nuevo Direccion" : "Editar Direccion"}
          </DialogTitle>
          <DialogDescription>
            {mode === "add"
              ? "Registra un nuevo casillero para envíos"
              : "Actualiza los datos del casillero seleccionado"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols gap-4">
            <div className="space-y-2">
              <Label htmlFor="pais">Distrito *</Label>
              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecciona un distrito" />
                </SelectTrigger>
                <SelectContent>
                  {distritos.map((distrito) => (
                    <SelectItem key={distrito.id} value={String(distrito.id)}>
                      {`${distrito.distrito}, ${distrito.municipio}, ${distrito.departamento}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.id_distrito && (
                <p className="text-sm text-destructive">
                  {errors.id_distrito.message}
                </p>
              )}
            </div>
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
              <Label htmlFor="horario_atencion">Horario de Atención *</Label>
              <Textarea
                id="horario_atencion"
                rows={5}
                {...register("horario_atencion")}
              />
              {errors.horario_atencion && (
                <p className="text-sm text-destructive">
                  {errors.horario_atencion.message}
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
              {mode === "add" ? "Agregar Direccion" : "Guardar Cambios"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
