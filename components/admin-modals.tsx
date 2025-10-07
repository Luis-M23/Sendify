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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"

// Tariff Modal Schema
const tariffSchema = z.object({
  servicio: z.enum(["aereo", "terrestre", "maritimo"]),
  origen: z.string().length(2, "Código de país debe ser de 2 letras"),
  destino: z.string().length(2, "Código de país debe ser de 2 letras"),
  pesoMin: z.number().min(0, "El peso mínimo debe ser mayor o igual a 0"),
  pesoMax: z.number().min(0, "El peso máximo debe ser mayor a 0"),
  tarifa: z.number().min(0, "La tarifa debe ser mayor a 0"),
})

type TariffFormData = z.infer<typeof tariffSchema>

interface TariffModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: "add" | "edit"
  initialData?: Partial<TariffFormData>
  onSubmit: (data: TariffFormData) => void
}

export function TariffModal({ open, onOpenChange, mode, initialData, onSubmit }: TariffModalProps) {
  const { toast } = useToast()
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<TariffFormData>({
    resolver: zodResolver(tariffSchema),
    defaultValues: initialData,
  })

  const servicio = watch("servicio")

  const handleFormSubmit = (data: TariffFormData) => {
    onSubmit(data)
    toast({
      title: mode === "add" ? "Tarifa agregada" : "Tarifa actualizada",
      description: "Los cambios se han guardado correctamente.",
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{mode === "add" ? "Agregar Nueva Tarifa" : "Editar Tarifa"}</DialogTitle>
          <DialogDescription>
            {mode === "add" ? "Define una nueva tarifa de envío" : "Actualiza los datos de la tarifa"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="servicio">Tipo de Servicio *</Label>
            <Select
              value={servicio}
              onValueChange={(value) => setValue("servicio", value as "aereo" | "terrestre" | "maritimo")}
            >
              <SelectTrigger id="servicio">
                <SelectValue placeholder="Seleccionar servicio" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="aereo">Aéreo</SelectItem>
                <SelectItem value="terrestre">Terrestre</SelectItem>
                <SelectItem value="maritimo">Marítimo</SelectItem>
              </SelectContent>
            </Select>
            {errors.servicio && <p className="text-sm text-destructive">{errors.servicio.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="origen">País Origen *</Label>
              <Input id="origen" placeholder="US" maxLength={2} {...register("origen")} />
              {errors.origen && <p className="text-sm text-destructive">{errors.origen.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="destino">País Destino *</Label>
              <Input id="destino" placeholder="GT" maxLength={2} {...register("destino")} />
              {errors.destino && <p className="text-sm text-destructive">{errors.destino.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="pesoMin">Peso Mínimo (kg) *</Label>
              <Input
                id="pesoMin"
                type="number"
                step="0.1"
                placeholder="0"
                {...register("pesoMin", { valueAsNumber: true })}
              />
              {errors.pesoMin && <p className="text-sm text-destructive">{errors.pesoMin.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="pesoMax">Peso Máximo (kg) *</Label>
              <Input
                id="pesoMax"
                type="number"
                step="0.1"
                placeholder="10"
                {...register("pesoMax", { valueAsNumber: true })}
              />
              {errors.pesoMax && <p className="text-sm text-destructive">{errors.pesoMax.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tarifa">Tarifa ($/kg) *</Label>
            <Input
              id="tarifa"
              type="number"
              step="0.01"
              placeholder="25.00"
              {...register("tarifa", { valueAsNumber: true })}
            />
            {errors.tarifa && <p className="text-sm text-destructive">{errors.tarifa.message}</p>}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">{mode === "add" ? "Agregar Tarifa" : "Guardar Cambios"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// User Modal Schema
const userSchema = z.object({
  nombre: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  email: z.string().email("Email inválido"),
  telefono: z.string().regex(/^\+?[0-9]{8,15}$/, "Teléfono inválido"),
  rol: z.enum(["cliente", "vip-bronce", "vip-plata", "vip-oro", "vip-platino", "operador", "admin"]),
  estado: z.enum(["activo", "inactivo"]),
})

type UserFormData = z.infer<typeof userSchema>

interface UserModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: "add" | "edit"
  initialData?: Partial<UserFormData>
  onSubmit: (data: UserFormData) => void
}

export function UserModal({ open, onOpenChange, mode, initialData, onSubmit }: UserModalProps) {
  const { toast } = useToast()
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: initialData,
  })

  const rol = watch("rol")
  const estado = watch("estado")

  const handleFormSubmit = (data: UserFormData) => {
    onSubmit(data)
    toast({
      title: mode === "add" ? "Usuario agregado" : "Usuario actualizado",
      description: "Los cambios se han guardado correctamente.",
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{mode === "add" ? "Agregar Nuevo Usuario" : "Editar Usuario"}</DialogTitle>
          <DialogDescription>
            {mode === "add" ? "Crea un nuevo usuario en el sistema" : "Actualiza los datos del usuario"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nombre">Nombre Completo *</Label>
            <Input id="nombre" placeholder="Juan Pérez" {...register("nombre")} />
            {errors.nombre && <p className="text-sm text-destructive">{errors.nombre.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input id="email" type="email" placeholder="juan@ejemplo.com" {...register("email")} />
            {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="telefono">Teléfono *</Label>
            <Input id="telefono" placeholder="+502 2345-6789" {...register("telefono")} />
            {errors.telefono && <p className="text-sm text-destructive">{errors.telefono.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="rol">Rol *</Label>
              <Select
                value={rol}
                onValueChange={(value) =>
                  setValue(
                    "rol",
                    value as "cliente" | "vip-bronce" | "vip-plata" | "vip-oro" | "vip-platino" | "operador" | "admin",
                  )
                }
              >
                <SelectTrigger id="rol">
                  <SelectValue placeholder="Seleccionar rol" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cliente">Cliente</SelectItem>
                  <SelectItem value="vip-bronce">VIP - Bronce</SelectItem>
                  <SelectItem value="vip-plata">VIP - Plata</SelectItem>
                  <SelectItem value="vip-oro">VIP - Oro</SelectItem>
                  <SelectItem value="vip-platino">VIP - Platino</SelectItem>
                  <SelectItem value="operador">Operador</SelectItem>
                  <SelectItem value="admin">Administrador</SelectItem>
                </SelectContent>
              </Select>
              {errors.rol && <p className="text-sm text-destructive">{errors.rol.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="estado">Estado *</Label>
              <Select value={estado} onValueChange={(value) => setValue("estado", value as "activo" | "inactivo")}>
                <SelectTrigger id="estado">
                  <SelectValue placeholder="Seleccionar estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="activo">Activo</SelectItem>
                  <SelectItem value="inactivo">Inactivo</SelectItem>
                </SelectContent>
              </Select>
              {errors.estado && <p className="text-sm text-destructive">{errors.estado.message}</p>}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">{mode === "add" ? "Agregar Usuario" : "Guardar Cambios"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// Promotion Modal Schema
const promotionSchema = z.object({
  nombre: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  tipo: z.enum(["temporada", "producto", "volumen"]),
  descuento: z.number().min(1, "El descuento debe ser mayor a 0").max(100, "El descuento no puede ser mayor a 100"),
  fechaInicio: z.string().min(1, "La fecha de inicio es requerida"),
  fechaFin: z.string().min(1, "La fecha de fin es requerida"),
  descripcion: z.string().min(10, "La descripción debe tener al menos 10 caracteres"),
  condiciones: z.string().optional(),
})

type PromotionFormData = z.infer<typeof promotionSchema>

interface PromotionModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: "add" | "edit"
  initialData?: Partial<PromotionFormData>
  onSubmit: (data: PromotionFormData) => void
}

export function PromotionModal({ open, onOpenChange, mode, initialData, onSubmit }: PromotionModalProps) {
  const { toast } = useToast()
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<PromotionFormData>({
    resolver: zodResolver(promotionSchema),
    defaultValues: initialData,
  })

  const tipo = watch("tipo")

  const handleFormSubmit = (data: PromotionFormData) => {
    onSubmit(data)
    toast({
      title: mode === "add" ? "Promoción agregada" : "Promoción actualizada",
      description: "Los cambios se han guardado correctamente.",
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{mode === "add" ? "Agregar Nueva Promoción" : "Editar Promoción"}</DialogTitle>
          <DialogDescription>
            {mode === "add" ? "Crea una nueva promoción para clientes" : "Actualiza los datos de la promoción"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nombre">Nombre de la Promoción *</Label>
            <Input id="nombre" placeholder="Ej: Black Friday 2025" {...register("nombre")} />
            {errors.nombre && <p className="text-sm text-destructive">{errors.nombre.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tipo">Tipo *</Label>
              <Select
                value={tipo}
                onValueChange={(value) => setValue("tipo", value as "temporada" | "producto" | "volumen")}
              >
                <SelectTrigger id="tipo">
                  <SelectValue placeholder="Seleccionar tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="temporada">Temporada</SelectItem>
                  <SelectItem value="producto">Producto</SelectItem>
                  <SelectItem value="volumen">Volumen</SelectItem>
                </SelectContent>
              </Select>
              {errors.tipo && <p className="text-sm text-destructive">{errors.tipo.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="descuento">Descuento (%) *</Label>
              <Input
                id="descuento"
                type="number"
                placeholder="20"
                {...register("descuento", { valueAsNumber: true })}
              />
              {errors.descuento && <p className="text-sm text-destructive">{errors.descuento.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fechaInicio">Fecha Inicio *</Label>
              <Input id="fechaInicio" type="date" {...register("fechaInicio")} />
              {errors.fechaInicio && <p className="text-sm text-destructive">{errors.fechaInicio.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="fechaFin">Fecha Fin *</Label>
              <Input id="fechaFin" type="date" {...register("fechaFin")} />
              {errors.fechaFin && <p className="text-sm text-destructive">{errors.fechaFin.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="descripcion">Descripción *</Label>
            <Textarea id="descripcion" placeholder="Describe la promoción..." rows={3} {...register("descripcion")} />
            {errors.descripcion && <p className="text-sm text-destructive">{errors.descripcion.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="condiciones">Condiciones (opcional)</Label>
            <Textarea
              id="condiciones"
              placeholder="Términos y condiciones de la promoción..."
              rows={2}
              {...register("condiciones")}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">{mode === "add" ? "Agregar Promoción" : "Guardar Cambios"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// Delete Confirmation Dialog
interface DeleteConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  itemName: string
  onConfirm: () => void
}

export function DeleteConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  itemName,
  onConfirm,
}: DeleteConfirmDialogProps) {
  const { toast } = useToast()

  const handleConfirm = () => {
    onConfirm()
    toast({
      title: "Elemento eliminado",
      description: `${itemName} ha sido eliminado correctamente.`,
      variant: "destructive",
    })
    onOpenChange(false)
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm} className="bg-destructive text-destructive-foreground">
            Eliminar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
