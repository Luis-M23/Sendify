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
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { categorySchema, Category, CreateCategory, UpdateCategory } from "@/lib/validation/categories"
import { countrySchema, Country, CreateCountry, UpdateCountry } from "@/lib/validation/countries"
import { promotionSchema, Promotion, CreatePromotion, UpdatePromotion } from "@/lib/validation/promotions"

// Category Modal
interface CategoryModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: "add" | "edit"
  initialData?: Partial<Category>
  onSubmit: (data: CreateCategory | UpdateCategory) => void
}

export function CategoryModal({ open, onOpenChange, mode, initialData, onSubmit }: CategoryModalProps) {
  const { toast } = useToast()
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<Category>({
    resolver: zodResolver(categorySchema),
    defaultValues: initialData,
  })

  const aereo = watch("aereo")
  const terrestre = watch("terrestre")
  const maritimo = watch("maritimo")
  const activo = watch("activo")

  const handleFormSubmit = (data: Category) => {
    onSubmit(data)
    toast({
      title: mode === "add" ? "Categoría agregada" : "Categoría actualizada",
      description: "Los cambios se han guardado correctamente.",
    })
    onOpenChange(false)
  }

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      reset()
    }
    onOpenChange(open)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{mode === "add" ? "Agregar Nueva Categoría" : "Editar Categoría"}</DialogTitle>
          <DialogDescription>
            {mode === "add" ? "Define una nueva categoría de producto" : "Actualiza los datos de la categoría"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nombre">Nombre de la Categoría *</Label>
            <Input id="nombre" placeholder="Ej: Electrónicos" {...register("nombre")} />
            {errors.nombre && <p className="text-sm text-destructive">{errors.nombre.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="descripcion">Descripción *</Label>
            <Textarea 
              id="descripcion" 
              placeholder="Describe la categoría de producto..." 
              rows={3} 
              {...register("descripcion")} 
            />
            {errors.descripcion && <p className="text-sm text-destructive">{errors.descripcion.message}</p>}
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="aereo">Restricción Aérea *</Label>
              <Select value={aereo} onValueChange={(value) => setValue("aereo", value as any)}>
                <SelectTrigger id="aereo">
                  <SelectValue placeholder="Seleccionar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="permitido">Permitido</SelectItem>
                  <SelectItem value="prohibido">Prohibido</SelectItem>
                  <SelectItem value="requiere-permiso">Requiere Permiso</SelectItem>
                </SelectContent>
              </Select>
              {errors.aereo && <p className="text-sm text-destructive">{errors.aereo.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="terrestre">Restricción Terrestre *</Label>
              <Select value={terrestre} onValueChange={(value) => setValue("terrestre", value as any)}>
                <SelectTrigger id="terrestre">
                  <SelectValue placeholder="Seleccionar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="permitido">Permitido</SelectItem>
                  <SelectItem value="prohibido">Prohibido</SelectItem>
                  <SelectItem value="requiere-permiso">Requiere Permiso</SelectItem>
                </SelectContent>
              </Select>
              {errors.terrestre && <p className="text-sm text-destructive">{errors.terrestre.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="maritimo">Restricción Marítima *</Label>
              <Select value={maritimo} onValueChange={(value) => setValue("maritimo", value as any)}>
                <SelectTrigger id="maritimo">
                  <SelectValue placeholder="Seleccionar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="permitido">Permitido</SelectItem>
                  <SelectItem value="prohibido">Prohibido</SelectItem>
                  <SelectItem value="requiere-permiso">Requiere Permiso</SelectItem>
                </SelectContent>
              </Select>
              {errors.maritimo && <p className="text-sm text-destructive">{errors.maritimo.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notas">Notas Adicionales</Label>
            <Textarea 
              id="notas" 
              placeholder="Información adicional sobre restricciones..." 
              rows={2} 
              {...register("notas")} 
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="activo"
              checked={activo}
              onCheckedChange={(checked) => setValue("activo", checked)}
            />
            <Label htmlFor="activo">Categoría activa</Label>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">{mode === "add" ? "Agregar Categoría" : "Guardar Cambios"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// Country Modal
interface CountryModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: "add" | "edit"
  initialData?: Partial<Country>
  onSubmit: (data: CreateCountry | UpdateCountry) => void
}

export function CountryModal({ open, onOpenChange, mode, initialData, onSubmit }: CountryModalProps) {
  const { toast } = useToast()
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<Country>({
    resolver: zodResolver(countrySchema),
    defaultValues: initialData,
  })

  const activo = watch("activo")
  const aduana = watch("restricciones?.aduana")
  const impuestos = watch("restricciones?.impuestos")

  const handleFormSubmit = (data: Country) => {
    onSubmit(data)
    toast({
      title: mode === "add" ? "País agregado" : "País actualizado",
      description: "Los cambios se han guardado correctamente.",
    })
    onOpenChange(false)
  }

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      reset()
    }
    onOpenChange(open)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{mode === "add" ? "Agregar Nuevo País" : "Editar País"}</DialogTitle>
          <DialogDescription>
            {mode === "add" ? "Define un nuevo país en el sistema" : "Actualiza los datos del país"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="codigo">Código ISO (2 letras) *</Label>
              <Input 
                id="codigo" 
                placeholder="US" 
                maxLength={2}
                {...register("codigo")} 
              />
              {errors.codigo && <p className="text-sm text-destructive">{errors.codigo.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="moneda">Código de Moneda (3 letras) *</Label>
              <Input 
                id="moneda" 
                placeholder="USD" 
                maxLength={3}
                {...register("moneda")} 
              />
              {errors.moneda && <p className="text-sm text-destructive">{errors.moneda.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="nombre">Nombre del País *</Label>
            <Input id="nombre" placeholder="Estados Unidos" {...register("nombre")} />
            {errors.nombre && <p className="text-sm text-destructive">{errors.nombre.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="nombreCompleto">Nombre Completo *</Label>
            <Input id="nombreCompleto" placeholder="Estados Unidos de América" {...register("nombreCompleto")} />
            {errors.nombreCompleto && <p className="text-sm text-destructive">{errors.nombreCompleto.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="region">Región *</Label>
            <Select value={watch("region")} onValueChange={(value) => setValue("region", value)}>
              <SelectTrigger id="region">
                <SelectValue placeholder="Seleccionar región" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="América del Norte">América del Norte</SelectItem>
                <SelectItem value="América Central">América Central</SelectItem>
                <SelectItem value="América del Sur">América del Sur</SelectItem>
                <SelectItem value="Europa">Europa</SelectItem>
                <SelectItem value="Asia">Asia</SelectItem>
                <SelectItem value="África">África</SelectItem>
                <SelectItem value="Oceanía">Oceanía</SelectItem>
              </SelectContent>
            </Select>
            {errors.region && <p className="text-sm text-destructive">{errors.region.message}</p>}
          </div>

          <div className="space-y-4 border rounded-lg p-4">
            <h4 className="text-sm font-medium">Restricciones de Aduana</h4>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="aduana"
                checked={aduana || false}
                onCheckedChange={(checked) => setValue("restricciones.aduana", checked)}
              />
              <Label htmlFor="aduana">Requiere trámites de aduana</Label>
            </div>

            <div className="space-y-2">
              <Label htmlFor="documentacion">Documentación Requerida</Label>
              <Textarea 
                id="documentacion" 
                placeholder="Describe los documentos requeridos..." 
                rows={2} 
                {...register("restricciones.documentacion")} 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="impuestos">Impuestos (%)</Label>
              <Input 
                id="impuestos" 
                type="number" 
                min="0" 
                max="100" 
                step="0.1"
                placeholder="15"
                {...register("restricciones.impuestos", { valueAsNumber: true })} 
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="activo"
              checked={activo}
              onCheckedChange={(checked) => setValue("activo", checked)}
            />
            <Label htmlFor="activo">País activo</Label>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">{mode === "add" ? "Agregar País" : "Guardar Cambios"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// Promotion Modal
interface PromotionModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: "add" | "edit"
  initialData?: Partial<Promotion>
  onSubmit: (data: CreatePromotion | UpdatePromotion) => void
}

export function PromotionModalExtended({ open, onOpenChange, mode, initialData, onSubmit }: PromotionModalProps) {
  const { toast } = useToast()
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<Promotion>({
    resolver: zodResolver(promotionSchema),
    defaultValues: initialData,
  })

  const tipo = watch("tipo")
  const tipoValor = watch("tipoValor")
  const activo = watch("activo")

  const handleFormSubmit = (data: Promotion) => {
    onSubmit(data)
    toast({
      title: mode === "add" ? "Promoción agregada" : "Promoción actualizada",
      description: "Los cambios se han guardado correctamente.",
    })
    onOpenChange(false)
  }

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      reset()
    }
    onOpenChange(open)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
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

          <div className="space-y-2">
            <Label htmlFor="descripcion">Descripción *</Label>
            <Textarea 
              id="descripcion" 
              placeholder="Describe la promoción..." 
              rows={3} 
              {...register("descripcion")} 
            />
            {errors.descripcion && <p className="text-sm text-destructive">{errors.descripcion.message}</p>}
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tipo">Tipo *</Label>
              <Select value={tipo} onValueChange={(value) => setValue("tipo", value as any)}>
                <SelectTrigger id="tipo">
                  <SelectValue placeholder="Seleccionar tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="descuento">Descuento</SelectItem>
                  <SelectItem value="envio-gratis">Envío Gratis</SelectItem>
                  <SelectItem value="volumen">Volumen</SelectItem>
                  <SelectItem value="temporada">Temporada</SelectItem>
                </SelectContent>
              </Select>
              {errors.tipo && <p className="text-sm text-destructive">{errors.tipo.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="valor">Valor *</Label>
              <Input
                id="valor"
                type="number"
                step="0.01"
                placeholder={tipoValor === "porcentaje" ? "20" : "100"}
                {...register("valor", { valueAsNumber: true })}
              />
              {errors.valor && <p className="text-sm text-destructive">{errors.valor.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="tipoValor">Tipo de Valor *</Label>
              <Select value={tipoValor} onValueChange={(value) => setValue("tipoValor", value as any)}>
                <SelectTrigger id="tipoValor">
                  <SelectValue placeholder="Seleccionar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="porcentaje">Porcentaje (%)</SelectItem>
                  <SelectItem value="fijo">Cantidad Fija ($)</SelectItem>
                </SelectContent>
              </Select>
              {errors.tipoValor && <p className="text-sm text-destructive">{errors.tipoValor.message}</p>}
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

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="codigoPromocional">Código Promocional</Label>
              <Input 
                id="codigoPromocional" 
                placeholder="BLACKFRIDAY2025" 
                {...register("codigoPromocional")} 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="limiteUsos">Límite de Usos</Label>
              <Input 
                id="limiteUsos" 
                type="number" 
                min="1"
                placeholder="1000"
                {...register("limiteUsos", { valueAsNumber: true })} 
              />
            </div>
          </div>

          <div className="space-y-4 border rounded-lg p-4">
            <h4 className="text-sm font-medium">Condiciones de Aplicación</h4>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="pesoMinimo">Peso Mínimo (kg)</Label>
                <Input 
                  id="pesoMinimo" 
                  type="number" 
                  min="0"
                  step="0.1"
                  placeholder="1"
                  {...register("condiciones.pesoMinimo", { valueAsNumber: true })} 
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pesoMaximo">Peso Máximo (kg)</Label>
                <Input 
                  id="pesoMaximo" 
                  type="number" 
                  min="0"
                  step="0.1"
                  placeholder="50"
                  {...register("condiciones.pesoMaximo", { valueAsNumber: true })} 
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="nivelVIP">Nivel VIP Requerido</Label>
              <Select 
                value={watch("condiciones.nivelVIP")?.[0] || ""} 
                onValueChange={(value) => setValue("condiciones.nivelVIP", value ? [value] : [])}
              >
                <SelectTrigger id="nivelVIP">
                  <SelectValue placeholder="Seleccionar nivel VIP" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Sin restricción</SelectItem>
                  <SelectItem value="cliente">Cliente</SelectItem>
                  <SelectItem value="vip-bronce">VIP - Bronce</SelectItem>
                  <SelectItem value="vip-plata">VIP - Plata</SelectItem>
                  <SelectItem value="vip-oro">VIP - Oro</SelectItem>
                  <SelectItem value="vip-platino">VIP - Platino</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="activo"
              checked={activo}
              onCheckedChange={(checked) => setValue("activo", checked)}
            />
            <Label htmlFor="activo">Promoción activa</Label>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">{mode === "add" ? "Agregar Promoción" : "Guardar Cambios"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
