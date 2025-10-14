'use client'
import { DashboardLayout } from "@/components/dashboard-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Package,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/components/auth-provider";


export default function DashboardPage() {
  const { rol, user } = useAuth();
console.log({user});
 
  return (
    <DashboardLayout userRole="vip">
      <div className="space-y-8">
        {/* Welcome Section */}
        <div>
          <h1 className="text-3xl font-bold mb-2">Bienvenido {user?.user_metadata?.nombre}</h1>
          <p className="text-muted-foreground">
            Gestiona tus envíos internacionales desde un solo lugar
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Envíos Activos
              </CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground mt-1">
                +2 desde el mes pasado
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                En Tránsito
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground mt-1">
                Llegada estimada 3-7 días
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Entregados
              </CardTitle>
              <CheckCircle2 className="h-4 w-4 text-chart-3" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">45</div>
              <p className="text-xs text-muted-foreground mt-1">Este año</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Ahorro VIP
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-chart-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$342</div>
              <p className="text-xs text-muted-foreground mt-1">
                15% de descuento aplicado
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Acciones Rápidas</CardTitle>
              <CardDescription>Operaciones frecuentes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href="/calculator">
                <Button
                  className="w-full justify-start bg-transparent"
                  variant="outline"
                >
                  <Package className="mr-2 h-4 w-4" />
                  Nuevo Envío
                </Button>
              </Link>
              <Link href="/tracking">
                <Button
                  className="w-full justify-start bg-transparent"
                  variant="outline"
                >
                  <Clock className="mr-2 h-4 w-4" />
                  Rastrear Pedido
                </Button>
              </Link>
              <Link href="/delivery">
                <Button
                  className="w-full justify-start bg-transparent"
                  variant="outline"
                >
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Mi Casillero
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Envíos Recientes</CardTitle>
              <CardDescription>Últimas actualizaciones</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="h-2 w-2 rounded-full bg-chart-3 mt-2" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">ENV-2025-001234</p>
                  <p className="text-xs text-muted-foreground">
                    Entregado - Miami, FL
                  </p>
                </div>
                <span className="text-xs text-muted-foreground">Hoy</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">ENV-2025-001235</p>
                  <p className="text-xs text-muted-foreground">
                    En tránsito - Nueva York
                  </p>
                </div>
                <span className="text-xs text-muted-foreground">Ayer</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-2 w-2 rounded-full bg-chart-4 mt-2" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">ENV-2025-001236</p>
                  <p className="text-xs text-muted-foreground">
                    En aduana - Los Ángeles
                  </p>
                </div>
                <span className="text-xs text-muted-foreground">2d</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Alerts */}
        <Card className="border-chart-4/50 bg-chart-4/5">
          <CardHeader>
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-chart-4 mt-0.5" />
              <div>
                <CardTitle className="text-base">
                  Beneficio VIP Disponible
                </CardTitle>
                <CardDescription>
                  Tienes un envío express gratis disponible este mes.
                  ¡Aprovéchalo antes de que expire!
                </CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>
      </div>
    </DashboardLayout>
  );
}
