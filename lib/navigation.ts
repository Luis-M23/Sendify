import type { LucideIcon } from "lucide-react";
import {
  Calculator,
  Shield,
  Gift,
  Crown,
  Package,
  Wrench,
  FileText,
  Settings,
  Globe,
  MapPin,
  Folder,
  Users,
} from "lucide-react";

export type NavigationItem = {
  name: string;
  href: string;
  icon: LucideIcon;
  description?: string;
};

export const clienteNavigation: NavigationItem[] = [
  { name: "Calcular Envío", href: "/calculadora", icon: Calculator },
  { name: "Seguimiento", href: "/tracking", icon: Package },
  { name: "Recompensas", href: "/recompensas", icon: Crown },
  { name: "Promociones", href: "/promociones", icon: Gift },
  { name: "Restricciones", href: "/restricciones", icon: Shield },
  { name: "Reportes", href: "/reports", icon: FileText },
];

export const operadorNavigation: NavigationItem[] = [
  {
    name: "Estadísticas",
    href: "/admin",
    icon: Settings,
  },
  {
    name: "Promociones",
    href: "/admin/promociones",
    icon: Gift,
  },
  {
    name: "Paquetes",
    href: "/admin/paquetes",
    icon: Package,
  },
];

export const adminNavigation: NavigationItem[] = [
  {
    name: "Factores de Conversión",
    href: "/admin/factores-conversion",
    icon: Wrench,
  },
  {
    name: "Casilleros",
    href: "/admin/casilleros",
    icon: Globe,
  },
  {
    name: "Direcciones",
    href: "/admin/direcciones",
    icon: MapPin,
  },
  {
    name: "Categorías",
    href: "/admin/categorias",
    icon: Folder,
  },
  {
    name: "Recompensas",
    href: "/admin/recompensas",
    icon: Crown,
  },

  {
    name: "Usuarios",
    href: "/admin/usuarios",
    icon: Users,
  },
];
