"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Package,
  Calculator,
  Shield,
  MapPin,
  TrendingUp,
  FileText,
  Settings,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { AuthService } from "@/lib/supabase/services/authService";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-provider";

export default function HomePage() {
  const { isAuthenticated } = useAuth();

  const router = useRouter();

  const handleLogout = async () => {
    try {
      await AuthService.logout();
      toast.success("Sesión cerrada correctamente");
      router.push("/");
    } catch (err: any) {
      toast.error(err.message || "Ocurrió un error al cerrar sesión");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Package className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold">ShipGlobal</h1>
          </div>
          <nav className="flex items-center gap-4">
            <ThemeToggle />
            {isAuthenticated ? (
              <Button variant="secondary" onClick={handleLogout}>
                Cerrar sesión
              </Button>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost">Iniciar Sesión</Button>
                </Link>
                <Link href="/registro">
                  <Button>Registrarse</Button>
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-5xl font-bold mb-6 text-balance">
          Gestión Profesional de Envíos Internacionales
        </h2>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-pretty">
          Plataforma completa para cotizar, rastrear y gestionar tus envíos
          internacionales con total transparencia y control.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/calculadora">
            <Button size="lg" className="gap-2">
              <Calculator className="h-5 w-5" />
              Calcular Envío
            </Button>
          </Link>
          <Link href="/notificaciones">
            <Button
              size="lg"
              variant="outline"
              className="gap-2 bg-transparent"
            >
              <MapPin className="h-5 w-5" />
              Rastrear Pedido
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-16">
        <h3 className="text-3xl font-bold text-center mb-12">
          Módulos del Sistema
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link href="/calculadora">
            <Card className="hover:border-primary transition-colors cursor-pointer h-full">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Calculator className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Cálculo de Envío</CardTitle>
                <CardDescription>
                  Cotiza envíos según peso, dimensiones y tipo de transporte.
                  Calcula tarifas e impuestos automáticamente.
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/restricciones">
            <Card className="hover:border-primary transition-colors cursor-pointer h-full">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-accent" />
                </div>
                <CardTitle>Restricciones</CardTitle>
                <CardDescription>
                  Valida productos prohibidos según el tipo de transporte
                  elegido y normativas internacionales.
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/delivery">
            <Card className="hover:border-primary transition-colors cursor-pointer h-full">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-chart-2/10 flex items-center justify-center mb-4">
                  <MapPin className="h-6 w-6 text-chart-2" />
                </div>
                <CardTitle>Entrega y Casilleros</CardTitle>
                <CardDescription>
                  Elige entre entrega a domicilio, retiro en oficina o casillero
                  virtual para consolidar compras.
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/promociones">
            <Card className="hover:border-primary transition-colors cursor-pointer h-full">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-chart-4/10 flex items-center justify-center mb-4">
                  <TrendingUp className="h-6 w-6 text-chart-4" />
                </div>
                <CardTitle>Promociones y VIP</CardTitle>
                <CardDescription>
                  Accede a descuentos especiales y beneficios exclusivos según
                  tu nivel de membresía.
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/notificaciones">
            <Card className="hover:border-primary transition-colors cursor-pointer h-full">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-chart-3/10 flex items-center justify-center mb-4">
                  <Package className="h-6 w-6 text-chart-3" />
                </div>
                <CardTitle>Seguimiento</CardTitle>
                <CardDescription>
                  Rastrea tus envíos en tiempo real con actualizaciones
                  automáticas y notificaciones.
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/reports">
            <Card className="hover:border-primary transition-colors cursor-pointer h-full">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-chart-5/10 flex items-center justify-center mb-4">
                  <FileText className="h-6 w-6 text-chart-5" />
                </div>
                <CardTitle>Reportes Aduanales</CardTitle>
                <CardDescription>
                  Genera declaraciones de productos, reportes de costos y cartas
                  compromiso automáticamente.
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </div>
      </section>

      {/* Admin Section */}
      <section className="container mx-auto px-4 py-16">
        <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
          <CardHeader className="text-center">
            <div className="h-16 w-16 rounded-lg bg-primary/20 flex items-center justify-center mx-auto mb-4">
              <Settings className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">Panel Administrativo</CardTitle>
            <CardDescription className="text-base">
              Gestiona tarifas, usuarios, impuestos y genera reportes
              gerenciales completos.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Link href="/admin">
              <Button size="lg" variant="outline">
                Acceder al Panel
              </Button>
            </Link>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t border-border mt-20">
        <div className="container mx-auto px-4 py-8 text-center text-muted-foreground">
          <p>
            &copy; 2025 ShipGlobal. Sistema de Gestión de Envíos
            Internacionales.
          </p>
        </div>
      </footer>
    </div>
  );
}
