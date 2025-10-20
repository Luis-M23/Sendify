"use client";

import { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
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
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";

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
  const defaultValues = useMemo<CrearDireccion>(
    () => ({
      id_distrito: undefined,
      direccion: "",
      horario_atencion: "",
    }),
    []
  );
  const [distritoPopoverOpen, setDistritoPopoverOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
    setError,
    clearErrors,
  } = useForm<Direccion>({
    resolver: zodResolver(
      mode === "add" ? CrearDireccionSchema : DireccionSchema
    ),
    defaultValues: mode === "add" ? defaultValues : undefined,
  });

  const handleFormSubmit = (data: Direccion) => {
    if (!data.id_distrito) {
      setError("id_distrito", {
        type: "manual",
        message: "Selecciona un distrito",
      });
      toast.error("Debes seleccionar un distrito antes de continuar");
      return;
    }

    onSubmit(data);
    toast.success(
      mode === "add" ? "Direccion agregado" : "Direccion actualizado"
    );
    onOpenChange(false);
  };

  const handleOpenChange = (state: boolean) => {
    if (!state) {
      reset(defaultValues);
      setDistritoPopoverOpen(false);
    }
    onOpenChange(state);
  };

  const normalizedEditValues = useMemo<Direccion | null>(() => {
    if (mode !== "edit" || !initialData) {
      return null;
    }

    const distritoId =
      initialData.id_distrito ??
      (initialData as { id_distritos?: number }).id_distritos ??
      (initialData as { distritos?: { id?: number } }).distritos?.id;

    return {
      ...initialData,
      id_distrito: distritoId,
    };
  }, [mode, initialData]);

  useEffect(() => {
    if (!open) {
      setDistritoPopoverOpen(false);
      return;
    }

    if (mode === "add") {
      reset(defaultValues);
      return;
    }

    if (normalizedEditValues) {
      reset(normalizedEditValues);
    }
  }, [
    open,
    mode,
    reset,
    defaultValues,
    normalizedEditValues,
    setDistritoPopoverOpen,
  ]);

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
              <Controller
                control={control}
                name="id_distrito"
                rules={{ required: "Selecciona un distrito" }}
                render={({ field }) => {
                  const selectedDistrito = distritos.find(
                    (item) => item.id === field.value
                  );

                  return (
                    <Popover
                      open={distritoPopoverOpen}
                      onOpenChange={setDistritoPopoverOpen}
                    >
                      <PopoverTrigger asChild>
                        <Button
                          type="button"
                          variant="outline"
                          role="combobox"
                          aria-expanded={distritoPopoverOpen}
                          className="w-full justify-between"
                          disabled={distritos.length === 0}
                        >
                          {selectedDistrito
                            ? `${selectedDistrito.distrito}, ${selectedDistrito.municipio}, ${selectedDistrito.departamento}`
                            : "Selecciona un distrito"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent
                        align="start"
                        className="w-[var(--radix-popper-anchor-width)] p-0"
                      >
                        <Command>
                          <CommandInput placeholder="Buscar distrito..." />
                          <CommandEmpty>
                            No se encontraron distritos.
                          </CommandEmpty>
                          <CommandList>
                            <CommandGroup>
                              {distritos.map((distrito) => (
                                <CommandItem
                                  key={distrito.id}
                                  value={`${distrito.distrito} ${distrito.municipio} ${distrito.departamento}`}
                                  onSelect={() => {
                                    field.onChange(distrito.id);
                                    field.onBlur();
                                    clearErrors("id_distrito");
                                    setDistritoPopoverOpen(false);
                                  }}
                                >
                                  {`${distrito.distrito}, ${distrito.municipio}, ${distrito.departamento}`}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  );
                }}
              />
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
              {mode === "add" ? "Agregar Dirección" : "Guardar Cambios"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
