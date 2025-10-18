"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DatePicker } from "@/components/ui/date-picker";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";
import { CategoriaData } from "@/lib/validation/categoria";
import {
  PromocionSchema,
  Promocion,
  ActualizarPromocion,
  CrearPromocion,
} from "@/lib/validation";

export type PromotionAPIData = {
  id: number | null;
  codigo: string;
  titulo: string;
  descripcion?: string | null;
  fecha_inicio: string;
  fecha_fin: string;
  activo: boolean;
  uso_max: number;
  porcentaje_descuento: number;
  restricciones_categorias?: number[] | null;
};

interface PromotionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "add" | "edit";
  initialData?: ActualizarPromocion | null;
  onSubmit: (data: CrearPromocion | ActualizarPromocion) => void;
  categorias?: CategoriaData[];
}

export function PromocionModal({
  open,
  onOpenChange,
  mode,
  initialData,
  onSubmit,
  categorias = [],
}: PromotionModalProps) {
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
    clearErrors,
  } = useForm<Promocion>({
    resolver: zodResolver(PromocionSchema),
    defaultValues: {
      activo: true,
      uso_max: 0,
      porcentaje_descuento: 0,
      restricciones_categorias: [],
      fecha_inicio: initialData?.fecha_inicio
        ? new Date(initialData.fecha_inicio)
        : new Date(),
      fecha_fin: initialData?.fecha_fin
        ? new Date(initialData.fecha_fin)
        : new Date(),
      ...initialData,
    },
  });

  const restricciones_categorias = watch("restricciones_categorias") || [];
  const activo = watch("activo");
  const fechaInicio = watch("fecha_inicio");
  const fechaFin = watch("fecha_fin");

  const defaultForm = {
    codigo: "",
    titulo: "",
    descripcion: "",
    fecha_inicio: undefined,
    fecha_fin: undefined,
    activo: true,
    uso_max: "",
    porcentaje_descuento: "",
    restricciones_categorias: [],
  };

  useEffect(() => {
    if (open) {
      const defaultValues = {
        id: initialData?.id || undefined,
        codigo: initialData?.codigo || "",
        titulo: initialData?.titulo || "",
        descripcion: initialData?.descripcion || "",
        fecha_inicio: initialData?.fecha_inicio
          ? new Date(initialData.fecha_inicio)
          : undefined,
        fecha_fin: initialData?.fecha_fin
          ? new Date(initialData.fecha_fin)
          : undefined,
        activo: initialData?.activo ?? true,
        uso_max: initialData?.uso_max || "",
        porcentaje_descuento: initialData?.porcentaje_descuento || "",
        restricciones_categorias: initialData?.restricciones_categorias || [],
      };
      reset(defaultValues);
      clearErrors();
    }
  }, [open, mode, initialData, reset, clearErrors]);

  const handleFormSubmit = (data: Promocion) => {
    console.log({ data, type: "form" });
    const formattedData: ActualizarPromocion = {
      id: data?.id,
      codigo: data.codigo,
      titulo: data.titulo,
      descripcion: data.descripcion || null,
      // fecha_inicio: new Date(data.fecha_inicio).toISOString().split("T")[0],
      fecha_inicio: new Date(data.fecha_inicio),
      fecha_fin: new Date(data.fecha_fin),
      activo: data.activo,
      uso_max: data.uso_max,
      porcentaje_descuento: data.porcentaje_descuento,
      restricciones_categorias:
        data.restricciones_categorias &&
        data.restricciones_categorias.length > 0
          ? data.restricciones_categorias
          : null,
    };
    onSubmit(formattedData);
    toast({
      title: mode === "add" ? "Promoción agregada" : "Promoción actualizada",
      description: "Los cambios se han guardado correctamente.",
    });
    handleSuccessfulSubmit();
  };

  const toggleCategory = (categoryId: number) => {
    const currentRestrictions = restricciones_categorias || [];
    if (currentRestrictions.includes(categoryId)) {
      setValue(
        "restricciones_categorias",
        currentRestrictions.filter((id) => id !== categoryId)
      );
    } else {
      setValue("restricciones_categorias", [
        ...currentRestrictions,
        categoryId,
      ]);
    }
  };

  const handleModalClose = (open: boolean) => {
    if (!open) {
      reset(defaultForm);
      clearErrors();
    }
    onOpenChange(open);
  };

  const handleSuccessfulSubmit = () => {
    reset(defaultForm);
    clearErrors();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleModalClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "add" ? "Agregar Nueva Promoción" : "Editar Promoción"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="codigo">Código *</Label>
            <Input id="codigo" {...register("codigo")} />
            {errors.codigo && (
              <p className="text-sm text-destructive">
                {errors.codigo.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="titulo">Título *</Label>
            <Input id="titulo" {...register("titulo")} />
            {errors.titulo && (
              <p className="text-sm text-destructive">
                {errors.titulo.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="descripcion">Descripción</Label>
            <Textarea id="descripcion" {...register("descripcion")} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Fecha Inicio *</Label>
              <DatePicker
                value={fechaInicio}
                onChange={(date) => setValue("fecha_inicio", date)}
                minDate={new Date()} 
              />
              {errors.fecha_inicio && (
                <p className="text-sm text-destructive">
                  {errors.fecha_inicio.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Fecha Fin *</Label>
              <DatePicker
                value={fechaFin}
                onChange={(date) => setValue("fecha_fin", date)}
                minDate={fechaInicio || new Date()} 
                disabled={!!!fechaInicio}
              />
              {errors.fecha_fin && (
                <p className="text-sm text-destructive">
                  {errors.fecha_fin.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="uso_max">Uso Máximo *</Label>
              <Input
                type="number"
                {...register("uso_max", { valueAsNumber: true })}
              />
              {errors.uso_max && (
                <p className="text-sm text-destructive">
                  {errors.uso_max.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="porcentaje_descuento">Descuento % *</Label>
              <Input
                type="number"
                {...register("porcentaje_descuento", { valueAsNumber: true })}
              />
              {errors.porcentaje_descuento && (
                <p className="text-sm text-destructive">
                  {errors.porcentaje_descuento.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Restricciones por Categorías</Label>
            <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto border rounded-md p-2">
              {categorias.map((category) => (
                <div key={category.id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={`category-${category.id}`}
                    checked={restricciones_categorias.includes(category.id)}
                    onChange={() => toggleCategory(category.id)}
                    className="rounded"
                  />
                  <Label
                    htmlFor={`category-${category.id}`}
                    className="text-sm"
                  >
                    {category.nombre}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleModalClose(false)}
            >
              Cancelar
            </Button>
            <Button type="submit">
              {mode === "add" ? "Agregar Promoción" : "Guardar Cambios"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
