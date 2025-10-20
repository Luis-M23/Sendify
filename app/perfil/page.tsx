"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { User, Mail, MapPin, Shield } from "lucide-react";
import { useAuth } from "@/components/auth-provider";
import { AuthService } from "@/lib/supabase/services/authService";

const perfilSchema = z.object({
  nombre: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
});

const direccionSchema = z.object({
  direccion: z.string().min(5, "La dirección debe tener al menos 5 caracteres"),
  telefono: z.string().min(8, "El teléfono debe tener al menos 8 caracteres"),
});

const passwordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(6, "La contraseña debe tener al menos 6 caracteres"),
    newPassword: z
      .string()
      .min(6, "La nueva contraseña debe tener al menos 6 caracteres"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

type ProfileFormData = z.infer<typeof perfilSchema>;
type AddressFormData = z.infer<typeof direccionSchema>;
type PasswordFormData = z.infer<typeof passwordSchema>;

export default function ProfilePage() {
  const { user, recompensa } = useAuth();

  const profileForm = useForm<ProfileFormData>({
    resolver: zodResolver(perfilSchema),
    defaultValues: {
      nombre: user?.user_metadata?.nombre,
    },
  });

  const addressForm = useForm<AddressFormData>({
    resolver: zodResolver(direccionSchema),
    defaultValues: {
      direccion: "",
      telefono: "",
    },
  });

  const passwordForm = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  });

  const onProfileSubmit = async (data: ProfileFormData) => {
    try {
      await AuthService.updateProfile(data);
      toast.success("Perfil actualizado");
    } catch (error) {
      toast.success("Error al actualizar el perfil");
      console.error("Profile change error:", data);
    }
  };

  const onAddressSubmit = (data: AddressFormData) => {
    toast.success("Dirección actualizada");
  };

  const onPasswordSubmit = async (data: PasswordFormData) => {
    try {
      await AuthService.changePassword({
        current_password: data.currentPassword,
        new_password: data.newPassword,
      });
      toast.success("Contraseña actualizada");
      passwordForm.reset();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Error al actualizar la contraseña";
      toast.error(message);
      console.error("Password change error:", error);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Mi Perfil</h1>
          <p className="text-muted-foreground">
            Gestiona tu información personal y configuración de cuenta
          </p>
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
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Datos Personales</CardTitle>
                    <CardDescription>
                      Actualiza tu información personal
                    </CardDescription>
                    <CardDescription>
                      <Badge className="bg-chart-4/20 text-chart-4">
                        {recompensa?.nivel || "Miembro"}
                      </Badge>
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <form
                  onSubmit={profileForm.handleSubmit(onProfileSubmit)}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        value={user?.email}
                        disabled={true}
                        className="pl-9"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">Nombre de Contacto</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="firstName"
                          {...profileForm.register("nombre")}
                          className="pl-9"
                        />
                      </div>
                      {profileForm.formState.errors.nombre && (
                        <p className="text-sm text-destructive">
                          {profileForm.formState.errors.nombre.message}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button type="submit">Guardar Cambios</Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="address" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Dirección de Entrega</CardTitle>
                <CardDescription>
                  Actualiza tu dirección de envío predeterminada
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form
                  onSubmit={addressForm.handleSubmit(onAddressSubmit)}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label htmlFor="direccion">Dirección</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="direccion"
                        {...addressForm.register("direccion")}
                        className="pl-9"
                        placeholder="San Salvador, San Salvador, Calle Principal Avenida Norte"
                      />
                    </div>
                    {addressForm.formState.errors.direccion && (
                      <p className="text-sm text-destructive">
                        {addressForm.formState.errors.direccion.message}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="telefono">Teléfono</Label>
                      <Input id="telefono" {...addressForm.register("telefono")} placeholder="+503 7060-8050"/>
                      {addressForm.formState.errors.telefono && (
                        <p className="text-sm text-destructive">
                          {addressForm.formState.errors.telefono.message}
                        </p>
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
                <CardDescription>
                  Actualiza tu contraseña para mantener tu cuenta segura
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form
                  onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
                  className="space-y-4"
                >
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
                      <p className="text-sm text-destructive">
                        {passwordForm.formState.errors.newPassword.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">
                      Confirmar Nueva Contraseña
                    </Label>
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
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
