"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { Globe, Bell, Mail, MessageSquare, DollarSign, Trash2 } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export default function SettingsPage() {
  const { toast } = useToast()
  const [settings, setSettings] = useState({
    language: "es",
    currency: "USD",
    timezone: "America/Mexico_City",
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    orderUpdates: true,
    promotions: true,
    newsletter: false,
    autoQuote: false,
    saveAddresses: true,
  })

  const updateSetting = (key: string, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
    toast({
      title: "Configuración actualizada",
      description: "Tus preferencias han sido guardadas.",
    })
  }

  const handleDeleteAccount = () => {
    toast({
      title: "Cuenta eliminada",
      description: "Tu cuenta ha sido eliminada permanentemente.",
      variant: "destructive",
    })
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Configuración</h1>
          <p className="text-muted-foreground">Personaliza tu experiencia en ShipGlobal</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Preferencias Regionales
            </CardTitle>
            <CardDescription>Configura tu idioma, moneda y zona horaria</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="language">Idioma</Label>
              <Select value={settings.language} onValueChange={(value) => updateSetting("language", value)}>
                <SelectTrigger id="language">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="es">Español</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="pt">Português</SelectItem>
                  <SelectItem value="fr">Français</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="currency">Moneda</Label>
              <Select value={settings.currency} onValueChange={(value) => updateSetting("currency", value)}>
                <SelectTrigger id="currency">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD - Dólar Estadounidense</SelectItem>
                  <SelectItem value="EUR">EUR - Euro</SelectItem>
                  <SelectItem value="MXN">MXN - Peso Mexicano</SelectItem>
                  <SelectItem value="COP">COP - Peso Colombiano</SelectItem>
                  <SelectItem value="ARS">ARS - Peso Argentino</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="timezone">Zona Horaria</Label>
              <Select value={settings.timezone} onValueChange={(value) => updateSetting("timezone", value)}>
                <SelectTrigger id="timezone">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="America/Mexico_City">Ciudad de México (GMT-6)</SelectItem>
                  <SelectItem value="America/New_York">Nueva York (GMT-5)</SelectItem>
                  <SelectItem value="America/Los_Angeles">Los Ángeles (GMT-8)</SelectItem>
                  <SelectItem value="America/Bogota">Bogotá (GMT-5)</SelectItem>
                  <SelectItem value="America/Buenos_Aires">Buenos Aires (GMT-3)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notificaciones
            </CardTitle>
            <CardDescription>Gestiona cómo y cuándo recibes notificaciones</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <Label htmlFor="emailNotifications">Notificaciones por Email</Label>
                  </div>
                  <p className="text-sm text-muted-foreground">Recibe actualizaciones por correo electrónico</p>
                </div>
                <Switch
                  id="emailNotifications"
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) => updateSetting("emailNotifications", checked)}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    <Label htmlFor="smsNotifications">Notificaciones por SMS</Label>
                  </div>
                  <p className="text-sm text-muted-foreground">Recibe mensajes de texto importantes</p>
                </div>
                <Switch
                  id="smsNotifications"
                  checked={settings.smsNotifications}
                  onCheckedChange={(checked) => updateSetting("smsNotifications", checked)}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <Bell className="h-4 w-4 text-muted-foreground" />
                    <Label htmlFor="pushNotifications">Notificaciones Push</Label>
                  </div>
                  <p className="text-sm text-muted-foreground">Recibe notificaciones en tu navegador</p>
                </div>
                <Switch
                  id="pushNotifications"
                  checked={settings.pushNotifications}
                  onCheckedChange={(checked) => updateSetting("pushNotifications", checked)}
                />
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h4 className="font-medium">Preferencias de Contenido</h4>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="orderUpdates">Actualizaciones de Pedidos</Label>
                  <p className="text-sm text-muted-foreground">Notificaciones sobre el estado de tus envíos</p>
                </div>
                <Switch
                  id="orderUpdates"
                  checked={settings.orderUpdates}
                  onCheckedChange={(checked) => updateSetting("orderUpdates", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="promotions">Promociones y Ofertas</Label>
                  <p className="text-sm text-muted-foreground">Recibe descuentos y ofertas especiales</p>
                </div>
                <Switch
                  id="promotions"
                  checked={settings.promotions}
                  onCheckedChange={(checked) => updateSetting("promotions", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="newsletter">Newsletter</Label>
                  <p className="text-sm text-muted-foreground">Noticias y actualizaciones mensuales</p>
                </div>
                <Switch
                  id="newsletter"
                  checked={settings.newsletter}
                  onCheckedChange={(checked) => updateSetting("newsletter", checked)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Preferencias de Envío
            </CardTitle>
            <CardDescription>Configura opciones predeterminadas para tus envíos</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="autoQuote">Cotización Automática</Label>
                <p className="text-sm text-muted-foreground">Calcular automáticamente el costo al ingresar datos</p>
              </div>
              <Switch
                id="autoQuote"
                checked={settings.autoQuote}
                onCheckedChange={(checked) => updateSetting("autoQuote", checked)}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="saveAddresses">Guardar Direcciones</Label>
                <p className="text-sm text-muted-foreground">Guardar direcciones usadas frecuentemente</p>
              </div>
              <Switch
                id="saveAddresses"
                checked={settings.saveAddresses}
                onCheckedChange={(checked) => updateSetting("saveAddresses", checked)}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <Trash2 className="h-5 w-5" />
              Zona de Peligro
            </CardTitle>
            <CardDescription>Acciones irreversibles en tu cuenta</CardDescription>
          </CardHeader>
          <CardContent>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">Eliminar Cuenta</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>¿Estás completamente seguro?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta acción no se puede deshacer. Esto eliminará permanentemente tu cuenta y todos tus datos de
                    nuestros servidores.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteAccount} className="bg-destructive hover:bg-destructive/90">
                    Sí, eliminar mi cuenta
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
