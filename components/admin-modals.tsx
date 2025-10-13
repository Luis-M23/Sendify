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
import { DatePicker } from "@/components/ui/date-picker"
import { useToast } from "@/hooks/use-toast"
import { CategoriaData } from "@/lib/validation/categoria"
import { useEffect } from "react"

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
  titulo: z.string().min(3, "El título debe tener al menos 3 caracteres"),
  descripcion: z.string().optional(),
  fecha_inicio: z.date({
    required_error: "La fecha de inicio es requerida",
  }),
  fecha_fin: z.date({
    required_error: "La fecha de fin es requerida",
  }),
  activo: z.boolean().default(true),
  uso_max: z.number().min(0, "El uso máximo debe ser mayor o igual a 0"),
  restricciones: z.array(z.number()).optional().nullable(),
})

type PromotionFormData = z.infer<typeof promotionSchema>

// API data type (with string dates)
type PromotionAPIData = {
  titulo: string
  descripcion?: string | null
  fecha_inicio: string
  fecha_fin: string
  activo: boolean
  uso_max: number
  restricciones?: number[] | null
}

interface PromotionModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: "add" | "edit"
  initialData?: Partial<PromotionAPIData>
  onSubmit: (data: PromotionAPIData) => void
  categories?: CategoriaData[]
}

export function PromotionModal({ open, onOpenChange, mode, initialData, onSubmit, categories = [] }: PromotionModalProps) {
  const { toast } = useToast()
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
    clearErrors,
  } = useForm<PromotionFormData>({
    resolver: zodResolver(promotionSchema),
    defaultValues: {
      activo: true,
      uso_max: 0,
      restricciones: [],
      fecha_inicio: initialData?.fecha_inicio ? new Date(initialData.fecha_inicio) : undefined,
      fecha_fin: initialData?.fecha_fin ? new Date(initialData.fecha_fin) : undefined,
      ...initialData,
    },
  })

  const restricciones = watch("restricciones") || []
  const activo = watch("activo")
  const fechaInicio = watch("fecha_inicio")
  const fechaFin = watch("fecha_fin")

  // Reset form when modal opens with new data or mode changes
  useEffect(() => {
    if (open) {
      const defaultValues = {
        titulo: initialData?.titulo || "",
        descripcion: initialData?.descripcion || "",
        fecha_inicio: initialData?.fecha_inicio ? new Date(initialData.fecha_inicio) : undefined,
        fecha_fin: initialData?.fecha_fin ? new Date(initialData.fecha_fin) : undefined,
        activo: initialData?.activo ?? true,
        uso_max: initialData?.uso_max || 0,
        restricciones: initialData?.restricciones || [],
      }
      reset(defaultValues)
      clearErrors()
    }
  }, [open, mode, initialData, reset, clearErrors])

  const handleFormSubmit = (data: PromotionFormData) => {
    // Convert dates to ISO string format for the API
    const formattedData: PromotionAPIData = {
      titulo: data.titulo,
      descripcion: data.descripcion || null,
      fecha_inicio: data.fecha_inicio.toISOString().split('T')[0], // YYYY-MM-DD format
      fecha_fin: data.fecha_fin.toISOString().split('T')[0], // YYYY-MM-DD format
      activo: data.activo,
      uso_max: data.uso_max,
      // Set restricciones to null if empty array, otherwise keep the array of IDs
      restricciones: data.restricciones && data.restricciones.length > 0 ? data.restricciones : null,
    }
    onSubmit(formattedData)
    toast({
      title: mode === "add" ? "Promoción agregada" : "Promoción actualizada",
      description: "Los cambios se han guardado correctamente.",
    })
    handleSuccessfulSubmit()
  }

  const toggleCategory = (categoryId: number) => {
    const currentRestrictions = restricciones || []
    if (currentRestrictions.includes(categoryId)) {
      setValue("restricciones", currentRestrictions.filter(id => id !== categoryId))
    } else {
      setValue("restricciones", [...currentRestrictions, categoryId])
    }
  }

  const handleModalClose = (open: boolean) => {
    if (!open) {
      // Reset form and clear errors when closing modal
      reset({
        titulo: "",
        descripcion: "",
        fecha_inicio: undefined,
        fecha_fin: undefined,
        activo: true,
        uso_max: 0,
        restricciones: [],
      })
      clearErrors()
    }
    onOpenChange(open)
  }

  // Also reset when successfully submitting
  const handleSuccessfulSubmit = () => {
    reset({
      titulo: "",
      descripcion: "",
      fecha_inicio: undefined,
      fecha_fin: undefined,
      activo: true,
      uso_max: 0,
      restricciones: [],
    })
    clearErrors()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleModalClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{mode === "add" ? "Agregar Nueva Promoción" : "Editar Promoción"}</DialogTitle>
          <DialogDescription>
            {mode === "add" ? "Crea una nueva promoción para clientes" : "Actualiza los datos de la promoción"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="titulo">Título de la Promoción *</Label>
            <Input id="titulo" placeholder="Ej: Black Friday 2025" {...register("titulo")} />
            {errors.titulo && <p className="text-sm text-destructive">{errors.titulo.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="descripcion">Descripción</Label>
            <Textarea id="descripcion" placeholder="Describe la promoción..." rows={3} {...register("descripcion")} />
            {errors.descripcion && <p className="text-sm text-destructive">{errors.descripcion.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Fecha Inicio *</Label>
              <DatePicker
                value={fechaInicio}
                onChange={(date) => setValue("fecha_inicio", date)}
                placeholder="Seleccionar fecha inicio"
              />
              {errors.fecha_inicio && <p className="text-sm text-destructive">{errors.fecha_inicio.message}</p>}
            </div>

            <div className="space-y-2">
              <Label>Fecha Fin *</Label>
              <DatePicker
                value={fechaFin}
                onChange={(date) => setValue("fecha_fin", date)}
                placeholder="Seleccionar fecha fin"
              />
              {errors.fecha_fin && <p className="text-sm text-destructive">{errors.fecha_fin.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="uso_max">Uso Máximo</Label>
            <Input
              id="uso_max"
              type="number"
              placeholder="0 (sin límite)"
              {...register("uso_max", { valueAsNumber: true })}
            />
            {errors.uso_max && <p className="text-sm text-destructive">{errors.uso_max.message}</p>}
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="activo"
              checked={activo}
              onChange={(e) => setValue("activo", e.target.checked)}
              className="rounded"
            />
            <Label htmlFor="activo">Promoción activa</Label>
          </div>

          <div className="space-y-2">
            <Label>Restricciones por Categorías</Label>
            <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto border rounded-md p-2">
              {categories.map((category) => (
                <div key={category.id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={`category-${category.id}`}
                    checked={restricciones.includes(category.id)}
                    onChange={() => toggleCategory(category.id)}
                    className="rounded"
                  />
                  <Label htmlFor={`category-${category.id}`} className="text-sm">
                    {category.nombre}
                  </Label>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              Selecciona las categorías que aplican para esta promoción. Si no se selecciona ninguna, la promoción aplicará a todas las categorías.
            </p>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => handleModalClose(false)}>
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
