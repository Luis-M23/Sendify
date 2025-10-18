"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AddressModal } from "@/components/address-modal"
import {
  Home,
  Building2,
  Package,
  MapPin,
  Clock,
  CheckCircle2,
  Copy,
  Plus,
  Truck,
  Star,
  AlertCircle,
} from "lucide-react"

interface Mailbox {
  numero: string
  direccion: string
  ciudad: string
  pais: string
  codigoPostal: string
  estado: "activo" | "inactivo"
  paquetesRecibidos: number
}

interface PendingPackage {
  id: string
  descripcion: string
  peso: number
  fechaLlegada: string
  estado: "pendiente" | "consolidado"
}

const mockMailbox: Mailbox = {
  numero: "GT-2025-4567",
  direccion: "8701 NW 17th Street, Suite 200",
  ciudad: "Miami",
  pais: "Estados Unidos",
  codigoPostal: "FL 33126",
  estado: "activo",
  paquetesRecibidos: 12,
}

const mockPendingPackages: PendingPackage[] = [
  {
    id: "PKG-001",
    descripcion: "Laptop Dell XPS 15",
    peso: 2.5,
    fechaLlegada: "2025-10-05",
    estado: "pendiente",
  },
  {
    id: "PKG-002",
    descripcion: "Auriculares Sony WH-1000XM5",
    peso: 0.3,
    fechaLlegada: "2025-10-06",
    estado: "pendiente",
  },
  {
    id: "PKG-003",
    descripcion: "Teclado mecánico Keychron",
    peso: 0.8,
    fechaLlegada: "2025-10-07",
    estado: "pendiente",
  },
]

export default function DeliveryPage() {
  const [selectedPackages, setSelectedPackages] = useState<string[]>([])
  const [deliveryMethod, setDeliveryMethod] = useState<"domicilio" | "oficina" | "casillero" | null>(null)
  const [addressModalOpen, setAddressModalOpen] = useState(false)
  const [addressModalMode, setAddressModalMode] = useState<"add" | "edit">("add")
  const [selectedAddress, setSelectedAddress] = useState<any>(null)

  const togglePackageSelection = (id: string) => {
    setSelectedPackages((prev) => (prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]))
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const totalWeight = mockPendingPackages
    .filter((pkg) => selectedPackages.includes(pkg.id))
    .reduce((sum, pkg) => sum + pkg.peso, 0)

  const handleAddAddress = () => {
    setAddressModalMode("add")
    setSelectedAddress(null)
    setAddressModalOpen(true)
  }

  const handleEditAddress = (address: any) => {
    setAddressModalMode("edit")
    setSelectedAddress(address)
    setAddressModalOpen(true)
  }

  const handleAddressSubmit = (data: any) => {
  }

  return (
    <DashboardLayout >
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Opciones de Entrega</h1>
          <p className="text-muted-foreground">Gestiona tus casilleros y opciones de entrega</p>
        </div>

        <Tabs defaultValue="casillero" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="casillero">Mi Casillero</TabsTrigger>
            <TabsTrigger value="metodos">Métodos de Entrega</TabsTrigger>
            <TabsTrigger value="direcciones">Mis Direcciones</TabsTrigger>
          </TabsList>

          {/* Mailbox Tab */}
          <TabsContent value="casillero" className="space-y-6">
            {/* Mailbox Info */}
            <Card className="border-primary/50">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Package className="h-5 w-5" />
                      Tu Casillero Virtual
                    </CardTitle>
                    <CardDescription>Usa esta dirección para tus compras en línea</CardDescription>
                  </div>
                  <Badge className="bg-chart-3/20 text-chart-3 border-chart-3/30">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Activo
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div>
                      <Label className="text-xs text-muted-foreground">Número de Casillero</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="font-mono text-lg font-bold">{mockMailbox.numero}</p>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => copyToClipboard(mockMailbox.numero)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <Label className="text-xs text-muted-foreground">Dirección Completa</Label>
                      <div className="mt-1 space-y-1">
                        <p className="text-sm font-medium">{mockMailbox.direccion}</p>
                        <p className="text-sm text-muted-foreground">
                          {mockMailbox.ciudad}, {mockMailbox.codigoPostal}
                        </p>
                        <p className="text-sm text-muted-foreground">{mockMailbox.pais}</p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-2 bg-transparent"
                        onClick={() =>
                          copyToClipboard(
                            `${mockMailbox.direccion}, ${mockMailbox.ciudad}, ${mockMailbox.codigoPostal}, ${mockMailbox.pais}`,
                          )
                        }
                      >
                        <Copy className="h-3 w-3 mr-2" />
                        Copiar Dirección
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Card className="bg-muted/50">
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <p className="text-3xl font-bold mb-1">{mockMailbox.paquetesRecibidos}</p>
                          <p className="text-sm text-muted-foreground">Paquetes Recibidos</p>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-chart-4/5 border-chart-4/30">
                      <CardContent className="pt-6">
                        <div className="flex gap-3">
                          <Star className="h-5 w-5 text-chart-4 flex-shrink-0" />
                          <div>
                            <p className="text-sm font-medium mb-1">Beneficio VIP</p>
                            <p className="text-xs text-muted-foreground">Consolidación gratuita de hasta 5 paquetes</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                <Separator />

                <div className="bg-muted/30 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    Cómo usar tu casillero
                  </h4>
                  <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                    <li>Copia la dirección de tu casillero</li>
                    <li>Úsala como dirección de envío en tus compras online</li>
                    <li>Incluye tu número de casillero en el campo "Apartamento" o "Suite"</li>
                    <li>Recibirás una notificación cuando tu paquete llegue</li>
                    <li>Consolida varios paquetes o envía individualmente</li>
                  </ol>
                </div>
              </CardContent>
            </Card>

            {/* Pending Packages */}
            <Card>
              <CardHeader>
                <CardTitle>Paquetes Pendientes</CardTitle>
                <CardDescription>Paquetes que han llegado a tu casillero</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {mockPendingPackages.map((pkg) => (
                    <Card
                      key={pkg.id}
                      className={`cursor-pointer transition-colors ${
                        selectedPackages.includes(pkg.id) ? "border-primary bg-primary/5" : ""
                      }`}
                      onClick={() => togglePackageSelection(pkg.id)}
                    >
                      <CardContent className="pt-4">
                        <div className="flex items-start gap-3">
                          <div
                            className={`h-5 w-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                              selectedPackages.includes(pkg.id)
                                ? "bg-primary border-primary"
                                : "border-muted-foreground"
                            }`}
                          >
                            {selectedPackages.includes(pkg.id) && <CheckCircle2 className="h-3 w-3 text-background" />}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between gap-4 mb-1">
                              <div>
                                <p className="font-medium">{pkg.descripcion}</p>
                                <p className="text-sm text-muted-foreground">ID: {pkg.id}</p>
                              </div>
                              <Badge variant="outline">{pkg.peso} kg</Badge>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              Llegó el{" "}
                              {new Date(pkg.fechaLlegada).toLocaleDateString("es-ES", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {selectedPackages.length > 0 && (
                  <>
                    <Separator />
                    <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                      <div>
                        <p className="font-semibold">{selectedPackages.length} paquetes seleccionados</p>
                        <p className="text-sm text-muted-foreground">Peso total: {totalWeight.toFixed(2)} kg</p>
                      </div>
                      <Button>Consolidar y Enviar</Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Delivery Methods Tab */}
          <TabsContent value="metodos" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card
                className={`cursor-pointer transition-colors ${
                  deliveryMethod === "domicilio" ? "border-primary bg-primary/5" : ""
                }`}
                onClick={() => setDeliveryMethod("domicilio")}
              >
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                    <Home className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">Entrega a Domicilio</CardTitle>
                  <CardDescription>Recibe tu paquete en la puerta de tu casa</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>1-2 días adicionales</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>Cobertura nacional</span>
                    </div>
                    <p className="font-semibold text-base mt-3">Desde $5.00</p>
                  </div>
                </CardContent>
              </Card>

              <Card
                className={`cursor-pointer transition-colors ${
                  deliveryMethod === "oficina" ? "border-primary bg-primary/5" : ""
                }`}
                onClick={() => setDeliveryMethod("oficina")}
              >
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-chart-2/10 flex items-center justify-center mb-3">
                    <Building2 className="h-6 w-6 text-chart-2" />
                  </div>
                  <CardTitle className="text-lg">Retiro en Oficina</CardTitle>
                  <CardDescription>Recoge tu paquete en nuestras sucursales</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>Mismo día disponible</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>15 sucursales</span>
                    </div>
                    <p className="font-semibold text-base mt-3">Gratis</p>
                  </div>
                </CardContent>
              </Card>

              <Card
                className={`cursor-pointer transition-colors border-chart-4/50 ${
                  deliveryMethod === "casillero" ? "border-primary bg-primary/5" : "bg-chart-4/5"
                }`}
                onClick={() => setDeliveryMethod("casillero")}
              >
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-chart-4/20 flex items-center justify-center mb-3">
                    <Package className="h-6 w-6 text-chart-4" />
                  </div>
                  <CardTitle className="text-lg">Casillero Virtual</CardTitle>
                  <CardDescription>Consolida múltiples compras en un solo envío</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Star className="h-4 w-4 text-chart-4" />
                      <span>Beneficio VIP</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Truck className="h-4 w-4" />
                      <span>Ahorra en envíos</span>
                    </div>
                    <p className="font-semibold text-base mt-3">Incluido</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {deliveryMethod && (
              <Card className="border-primary/50">
                <CardHeader>
                  <CardTitle>Método Seleccionado</CardTitle>
                  <CardDescription>
                    {deliveryMethod === "domicilio" && "Entrega a Domicilio"}
                    {deliveryMethod === "oficina" && "Retiro en Oficina"}
                    {deliveryMethod === "casillero" && "Casillero Virtual"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Este método de entrega se aplicará a tu próximo envío. Puedes cambiarlo en cualquier momento.
                  </p>
                  <Button>Confirmar Selección</Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Addresses Tab */}
          <TabsContent value="direcciones" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Mis Direcciones</CardTitle>
                    <CardDescription>Gestiona tus direcciones de entrega</CardDescription>
                  </div>
                  <Button onClick={handleAddAddress}>
                    <Plus className="h-4 w-4 mr-2" />
                    Nueva Dirección
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <Card>
                  <CardContent className="pt-4">
                    <div className="flex items-start justify-between">
                      <div className="flex gap-3">
                        <Home className="h-5 w-5 text-muted-foreground mt-0.5" />
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-semibold">Casa</p>
                            <Badge className="bg-primary/20 text-primary border-primary/30">Principal</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">Avenida Reforma 10-00, Zona 10</p>
                          <p className="text-sm text-muted-foreground">Ciudad de Guatemala, Guatemala</p>
                          <p className="text-sm text-muted-foreground">Tel: +502 2345-6789</p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          handleEditAddress({
                            nombre: "Casa",
                            tipo: "casa",
                            direccion: "Avenida Reforma 10-00, Zona 10",
                            ciudad: "Ciudad de Guatemala",
                            departamento: "Guatemala",
                            telefono: "+502 2345-6789",
                          })
                        }
                      >
                        Editar
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-4">
                    <div className="flex items-start justify-between">
                      <div className="flex gap-3">
                        <Building2 className="h-5 w-5 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="font-semibold mb-1">Oficina</p>
                          <p className="text-sm text-muted-foreground">Torre Empresarial, 5to Nivel, Oficina 502</p>
                          <p className="text-sm text-muted-foreground">Zona 4, Ciudad de Guatemala</p>
                          <p className="text-sm text-muted-foreground">Tel: +502 2234-5678</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        Editar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* AddressModal component */}
      <AddressModal
        open={addressModalOpen}
        onOpenChange={setAddressModalOpen}
        mode={addressModalMode}
        initialData={selectedAddress}
        onSubmit={handleAddressSubmit}
      />
    </DashboardLayout>
  )
}
