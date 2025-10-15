"use client"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

const addressSchema = z.object({
  nombre: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  direccion: z.string().min(10, "La dirección debe tener al menos 10 caracteres"),
  ciudad: z.string().min(2, "La ciudad es requerida"),
  departamento: z.string().min(2, "El departamento es requerido"),
  codigoPostal: z.string().optional(),
  telefono: z.string().regex(/^\+?[0-9]{8,15}$/, "Teléfono inválido"),
  tipo: z.enum(["casa", "oficina", "otro"]),
})

type AddressFormData = z.infer<typeof addressSchema>

interface AddressModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: "add" | "edit"
  initialData?: Partial<AddressFormData>
  onSubmit: (data: AddressFormData) => void
}

export function AddressModal({ open, onOpenChange, mode, initialData, onSubmit }: AddressModalProps) {
  const { toast } = useToast()
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: initialData,
  })

  const tipo = watch("tipo")

  const handleFormSubmit = (data: AddressFormData) => {
    onSubmit(data)
    toast({
      title: mode === "add" ? "Casillero agregado" : "Casillero actualizado",
      description: "Los cambios se han guardado correctamente.",
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{mode === "add" ? "Agregar Nuevo Casillero" : "Editar Casillero"}</DialogTitle>
          <DialogDescription>
            {mode === "add"
              ? "Completa los datos de tu nueva dirección de entrega"
              : "Actualiza los datos de tu dirección"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nombre">Nombre de la dirección *</Label>
            <Input id="nombre" placeholder="Ej: Casa, Oficina" {...register("nombre")} />
            {errors.nombre && <p className="text-sm text-destructive">{errors.nombre.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="tipo">Tipo de dirección *</Label>
            <Select value={tipo} onValueChange={(value) => setValue("tipo", value as "casa" | "oficina" | "otro")}>
              <SelectTrigger id="tipo">
                <SelectValue placeholder="Seleccionar tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="casa">Casa</SelectItem>
                <SelectItem value="oficina">Oficina</SelectItem>
                <SelectItem value="otro">Otro</SelectItem>
              </SelectContent>
            </Select>
            {errors.tipo && <p className="text-sm text-destructive">{errors.tipo.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="direccion">Dirección completa *</Label>
            <Input id="direccion" placeholder="Calle, número, zona" {...register("direccion")} />
            {errors.direccion && <p className="text-sm text-destructive">{errors.direccion.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="ciudad">Ciudad *</Label>
              <Input id="ciudad" placeholder="Ciudad" {...register("ciudad")} />
              {errors.ciudad && <p className="text-sm text-destructive">{errors.ciudad.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="departamento">Departamento *</Label>
              <Input id="departamento" placeholder="Departamento" {...register("departamento")} />
              {errors.departamento && <p className="text-sm text-destructive">{errors.departamento.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="codigoPostal">Código Postal</Label>
              <Input id="codigoPostal" placeholder="01001" {...register("codigoPostal")} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="telefono">Teléfono *</Label>
              <Input id="telefono" placeholder="+502 2345-6789" {...register("telefono")} />
              {errors.telefono && <p className="text-sm text-destructive">{errors.telefono.message}</p>}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">{mode === "add" ? "Agregar Dirección" : "Guardar Cambios"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
