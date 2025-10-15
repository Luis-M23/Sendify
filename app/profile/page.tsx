"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { User, Mail, Phone, MapPin, Building, CreditCard, Upload, Shield } from "lucide-react"

const profileSchema = z.object({
  firstName: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  lastName: z.string().min(2, "El apellido debe tener al menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  phone: z.string().min(8, "Teléfono debe tener al menos 8 dígitos"),
  company: z.string().optional(),
  taxId: z.string().optional(),
})

const addressSchema = z.object({
  street: z.string().min(5, "La dirección debe tener al menos 5 caracteres"),
  city: z.string().min(2, "La ciudad es requerida"),
  state: z.string().min(2, "El estado/provincia es requerido"),
  zipCode: z.string().min(4, "El código postal es requerido"),
  country: z.string().min(2, "El país es requerido"),
})

const passwordSchema = z
  .object({
    currentPassword: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
    newPassword: z.string().min(8, "La nueva contraseña debe tener al menos 8 caracteres"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  })

type ProfileFormData = z.infer<typeof profileSchema>
type AddressFormData = z.infer<typeof addressSchema>
type PasswordFormData = z.infer<typeof passwordSchema>

export default function ProfilePage() {
  const { toast } = useToast()
  const [isEditing, setIsEditing] = useState(false)

  const profileForm = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: "Juan",
      lastName: "Pérez",
      email: "juan@ejemplo.com",
      phone: "+1234567890",
      company: "Mi Empresa S.A.",
      taxId: "123456789",
    },
  })

  const addressForm = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      street: "Calle Principal 123",
      city: "Ciudad",
      state: "Estado",
      zipCode: "12345",
      country: "País",
    },
  })

  const passwordForm = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  })

  const onProfileSubmit = (data: ProfileFormData) => {
    console.log("[v0] Profile data:", data)
    toast({
      title: "Perfil actualizado",
      description: "Tus datos personales han sido actualizados exitosamente.",
    })
    setIsEditing(false)
  }

  const onAddressSubmit = (data: AddressFormData) => {
    console.log("[v0] Address data:", data)
    toast({
      title: "Dirección actualizada",
      description: "Tu dirección ha sido actualizada exitosamente.",
    })
  }

  const onPasswordSubmit = (data: PasswordFormData) => {
    console.log("[v0] Password change:", data)
    toast({
      title: "Contraseña actualizada",
      description: "Tu contraseña ha sido cambiada exitosamente.",
    })
    passwordForm.reset()
  }

  return (
    <DashboardLayout >
      <div className="max-w-5xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Mi Perfil</h1>
          <p className="text-muted-foreground">Gestiona tu información personal y configuración de cuenta</p>
        </div>

        <Tabs defaultValue="personal" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="personal">Información Personal</TabsTrigger>
            <TabsTrigger value="address">Dirección</TabsTrigger>
            <TabsTrigger value="security">Seguridad</TabsTrigger>
          </TabsList>

          <TabsContent value="personal" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>Foto de Perfil</CardTitle>
                    <CardDescription>Actualiza tu foto de perfil</CardDescription>
                  </div>
                  <Badge className="bg-chart-4/20 text-chart-4">VIP - Oro</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-6">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src="/placeholder.svg?height=96&width=96" />
                    <AvatarFallback className="text-2xl">JP</AvatarFallback>
                  </Avatar>
                  <div className="space-y-2">
                    <Button variant="outline" size="sm">
                      <Upload className="mr-2 h-4 w-4" />
                      Subir nueva foto
                    </Button>
                    <p className="text-xs text-muted-foreground">JPG, PNG o GIF. Máximo 2MB.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Datos Personales</CardTitle>
                    <CardDescription>Actualiza tu información personal</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setIsEditing(!isEditing)}>
                    {isEditing ? "Cancelar" : "Editar"}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">Nombre</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="firstName"
                          {...profileForm.register("firstName")}
                          disabled={!isEditing}
                          className="pl-9"
                        />
                      </div>
                      {profileForm.formState.errors.firstName && (
                        <p className="text-sm text-destructive">{profileForm.formState.errors.firstName.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="lastName">Apellido</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="lastName"
                          {...profileForm.register("lastName")}
                          disabled={!isEditing}
                          className="pl-9"
                        />
                      </div>
                      {profileForm.formState.errors.lastName && (
                        <p className="text-sm text-destructive">{profileForm.formState.errors.lastName.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="email"
                          type="email"
                          {...profileForm.register("email")}
                          disabled={!isEditing}
                          className="pl-9"
                        />
                      </div>
                      {profileForm.formState.errors.email && (
                        <p className="text-sm text-destructive">{profileForm.formState.errors.email.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Teléfono</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input id="phone" {...profileForm.register("phone")} disabled={!isEditing} className="pl-9" />
                      </div>
                      {profileForm.formState.errors.phone && (
                        <p className="text-sm text-destructive">{profileForm.formState.errors.phone.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="company">Empresa (Opcional)</Label>
                      <div className="relative">
                        <Building className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="company"
                          {...profileForm.register("company")}
                          disabled={!isEditing}
                          className="pl-9"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="taxId">RFC/NIT (Opcional)</Label>
                      <div className="relative">
                        <CreditCard className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input id="taxId" {...profileForm.register("taxId")} disabled={!isEditing} className="pl-9" />
                      </div>
                    </div>
                  </div>

                  {isEditing && (
                    <div className="flex justify-end">
                      <Button type="submit">Guardar Cambios</Button>
                    </div>
                  )}
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="address" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Dirección Principal</CardTitle>
                <CardDescription>Actualiza tu dirección de envío predeterminada</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={addressForm.handleSubmit(onAddressSubmit)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="street">Calle y Número</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input id="street" {...addressForm.register("street")} className="pl-9" />
                    </div>
                    {addressForm.formState.errors.street && (
                      <p className="text-sm text-destructive">{addressForm.formState.errors.street.message}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">Ciudad</Label>
                      <Input id="city" {...addressForm.register("city")} />
                      {addressForm.formState.errors.city && (
                        <p className="text-sm text-destructive">{addressForm.formState.errors.city.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="state">Estado/Provincia</Label>
                      <Input id="state" {...addressForm.register("state")} />
                      {addressForm.formState.errors.state && (
                        <p className="text-sm text-destructive">{addressForm.formState.errors.state.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="zipCode">Código Postal</Label>
                      <Input id="zipCode" {...addressForm.register("zipCode")} />
                      {addressForm.formState.errors.zipCode && (
                        <p className="text-sm text-destructive">{addressForm.formState.errors.zipCode.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="country">País</Label>
                      <Input id="country" {...addressForm.register("country")} />
                      {addressForm.formState.errors.country && (
                        <p className="text-sm text-destructive">{addressForm.formState.errors.country.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button type="submit">Actualizar Dirección</Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Cambiar Contraseña</CardTitle>
                <CardDescription>Actualiza tu contraseña para mantener tu cuenta segura</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Contraseña Actual</Label>
                    <div className="relative">
                      <Shield className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="currentPassword"
                        type="password"
                        {...passwordForm.register("currentPassword")}
                        className="pl-9"
                      />
                    </div>
                    {passwordForm.formState.errors.currentPassword && (
                      <p className="text-sm text-destructive">
                        {passwordForm.formState.errors.currentPassword.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="newPassword">Nueva Contraseña</Label>
                    <div className="relative">
                      <Shield className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="newPassword"
                        type="password"
                        {...passwordForm.register("newPassword")}
                        className="pl-9"
                      />
                    </div>
                    {passwordForm.formState.errors.newPassword && (
                      <p className="text-sm text-destructive">{passwordForm.formState.errors.newPassword.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirmar Nueva Contraseña</Label>
                    <div className="relative">
                      <Shield className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="confirmPassword"
                        type="password"
                        {...passwordForm.register("confirmPassword")}
                        className="pl-9"
                      />
                    </div>
                    {passwordForm.formState.errors.confirmPassword && (
                      <p className="text-sm text-destructive">
                        {passwordForm.formState.errors.confirmPassword.message}
                      </p>
                    )}
                  </div>

                  <div className="flex justify-end">
                    <Button type="submit">Cambiar Contraseña</Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Autenticación de Dos Factores</CardTitle>
                <CardDescription>Agrega una capa extra de seguridad a tu cuenta</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Estado: Desactivado</p>
                    <p className="text-sm text-muted-foreground">Protege tu cuenta con autenticación de dos factores</p>
                  </div>
                  <Button variant="outline">Activar 2FA</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
