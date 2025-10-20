"use client";

import { type ReactNode, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Package,
  Calculator,
  Shield,
  MapPin,
  FileText,
  Settings,
  Menu,
  X,
  LogOut,
  User,
  Bell,
  Globe,
  Folder,
  Gift,
  Users,
  Crown,
  Navigation,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { AuthService } from "@/lib/supabase/services/authService";
import { toast } from "react-toastify";
import { RolesSistema } from "@/lib/enum";
import { useAuth } from "./auth-provider";

interface DashboardLayoutProps {
  children: ReactNode;
}

const navigation = [
  { name: "Calcular Envío", href: "/calculadora", icon: Calculator },
  { name: "Restricciones", href: "/restricciones", icon: Shield },
  { name: "Promociones", href: "/promociones", icon: Gift },
  { name: "Recompensas", href: "/recompensas", icon: Crown },
  { name: "Seguimiento", href: "/tracking", icon: Package },
  { name: "Mis Paquetes", href: "/delivery", icon: Navigation },
  { name: "Reportes", href: "/reports", icon: FileText },
];

const adminNavigation = [
  { name: "Panel Admin", href: "/admin", icon: Settings },
  {
    name: "Factores de conversión",
    href: "/admin/factores-conversion",
    icon: Package,
  },
  { name: "Casilleros", href: "/admin/casilleros", icon: Globe },
  { name: "Direcciones", href: "/admin/direcciones", icon: MapPin },
  { name: "Categorías", href: "/admin/categorias", icon: Folder },
  { name: "Promociones", href: "/admin/promociones", icon: Gift },
  {
    name: "Recompensas",
    href: "/admin/recompensas",
    icon: Crown,
  },
  { name: "Usuarios", href: "/admin/usuarios", icon: Users },
];

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const { rol, user, recompensa } = useAuth();

  const handleLogout = async () => {
    try {
      await AuthService.logout();
      toast.success("Sesión cerrada correctamente");
      router.push("/");
    } catch (err: any) {
      toast.error(err.message || "Ocurrió un error al cerrar sesión");
    }
  };

  const isAdmin = rol === RolesSistema.ADMINISTRADOR;
  const isVIP = true;

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-full w-64 bg-card border-r border-border transition-transform duration-300 lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <Link href="/dashboard" className="flex items-center gap-2">
              <Package className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold">ShipGlobal</span>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link key={item.name} href={item.href}>
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    className={cn(
                      "w-full justify-start gap-3",
                      isActive &&
                        "bg-primary/10 text-primary hover:bg-primary/20"
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.name}
                  </Button>
                </Link>
              );
            })}

            {isAdmin && (
              <>
                <div className="pt-4 pb-2">
                  <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Administración
                  </p>
                </div>
                {adminNavigation.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link key={item.name} href={item.href}>
                      <Button
                        variant={isActive ? "secondary" : "ghost"}
                        className={cn(
                          "w-full justify-start gap-3",
                          isActive &&
                            "bg-primary/10 text-primary hover:bg-primary/20"
                        )}
                      >
                        <item.icon className="h-5 w-5" />
                        {item.name}
                      </Button>
                    </Link>
                  );
                })}
              </>
            )}
          </nav>

          {/* User info */}
          <div className="p-4 border-t border-border">
            <div className="flex items-center gap-3 mb-2">
              <Avatar>
                <AvatarFallback>JC</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground truncate">
                  {user?.email}
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-card border-b border-border">
          <div className="flex items-center justify-between px-4 py-3">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>

            <div className="flex-1" />

            <div className="flex items-center gap-2">
              <ThemeToggle />

              <Link href="/notifications">
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-1 right-1 h-2 w-2 bg-destructive rounded-full" />
                </Button>
              </Link>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>{" "}
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel>
                    <Badge className="w-full justify-center bg-chart-4/20 text-chart-4">
                      {recompensa?.nivel || "Miembro"}
                    </Badge>
                  </DropdownMenuLabel>
                  <DropdownMenuItem asChild>
                    <Link href="/perfil" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      Perfil
                    </Link>
                  </DropdownMenuItem>
                  {/* <DropdownMenuItem asChild>
                    <Link href="/settings" className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      Configuración
                    </Link>
                  </DropdownMenuItem> */}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-destructive"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Cerrar Sesión
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
