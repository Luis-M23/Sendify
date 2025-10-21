import type { LucideIcon } from "lucide-react";
import {
  Calculator,
  Shield,
  Gift,
  Crown,
  Package,
  Navigation,
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

export const navigation: NavigationItem[] = [
  { name: "Calcular Envío", href: "/calculadora", icon: Calculator },
  { name: "Seguimiento", href: "/tracking", icon: Package },
  { name: "Recompensas", href: "/recompensas", icon: Crown },
  { name: "Promociones", href: "/promociones", icon: Gift },
  { name: "Restricciones", href: "/restricciones", icon: Shield },
  { name: "Reportes", href: "/reports", icon: FileText },
];

export const adminNavigation: NavigationItem[] = [
  {
    name: "Panel de Control",
    href: "/admin",
    icon: Settings,
  },
  {
    name: "Factores de conversión",
    href: "/admin/factores-conversion",
    icon: Package,
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
    name: "Promociones",
    href: "/admin/promociones",
    icon: Gift,
  },
  {
    name: "Recompensas",
    href: "/admin/recompensas",
    icon: Crown,
  },
  {
    name: "Paquetes",
    href: "/admin/paquetes",
    icon: Package,
  },
  {
    name: "Usuarios",
    href: "/admin/usuarios",
    icon: Users,
  },
];
