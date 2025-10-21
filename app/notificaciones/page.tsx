"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import {
  Bell,
  Package,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Clock,
  Trash2,
  Check,
  Filter,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface Notification {
  id: string;
  type: "order" | "promotion" | "alert" | "success" | "tracking" | "promo";
  title: string;
  message: string;
  time: string;
  read: boolean;
}

export default function NotificationsPage() {
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      type: "tracking",
      title: "Paquete en tránsito",
      message:
        "Tu envío ENV-2025-001234 está en camino. Llegada estimada: 2 días.",
      time: "Hace 5 minutos",
      read: false,
    },
    {
      id: "2",
      type: "success",
      title: "Paquete entregado",
      message: "Tu envío ENV-2025-001233 ha sido entregado exitosamente.",
      time: "Hace 2 horas",
      read: false,
    },
    {
      id: "3",
      type: "promo",
      title: "Promoción especial",
      message: "20% de descuento en envíos aéreos este fin de semana.",
      time: "Hace 5 horas",
      read: true,
    },
    {
      id: "4",
      type: "alert",
      title: "Documentación requerida",
      message:
        "Se necesita documentación adicional para tu envío ENV-2025-001235.",
      time: "Hace 1 día",
      read: false,
    },
    {
      id: "5",
      type: "order",
      title: "Paquete en aduana",
      message: "Tu envío ENV-2025-001232 está siendo procesado en aduana.",
      time: "Hace 2 días",
      read: true,
    },
    {
      id: "6",
      type: "success",
      title: "Cotización aprobada",
      message: "Tu cotización COT-2025-005678 ha sido aprobada.",
      time: "Hace 3 días",
      read: true,
    },
  ]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    toast({
      title: "Notificación marcada como leída",
    });
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    toast({
      title: "Todas las notificaciones marcadas como leídas",
    });
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    toast({
      title: "Notificación eliminada",
    });
  };

  const deleteAllRead = () => {
    setNotifications((prev) => prev.filter((n) => !n.read));
    toast({
      title: "Notificaciones leídas eliminadas",
    });
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "tracking":
        return <Package className="h-5 w-5 text-primary" />;
      case "promo":
        return <TrendingUp className="h-5 w-5 text-chart-2" />;
      default:
        return <Bell className="h-5 w-5 h-5 w-5 text-chart-4" />;
    }
  };

  const filterByType = (type: string) => {
    if (type === "all") return notifications;
    return notifications.filter((n) => n.type === type);
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Notificaciones</h1>
            <p className="text-muted-foreground">
              Tienes {unreadCount}{" "}
              {unreadCount === 1
                ? "notificación nueva"
                : "notificaciones nuevas"}
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={markAllAsRead}
              disabled={unreadCount === 0}
            >
              <Check className="mr-2 h-4 w-4" />
              Marcar todas como leídas
            </Button>
            <Button variant="outline" size="sm" onClick={deleteAllRead}>
              <Trash2 className="mr-2 h-4 w-4" />
              Eliminar leídas
            </Button>
          </div>
        </div>

        <Tabs defaultValue="all" className="space-y-6">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="all">
                Todas
                {notifications.length > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {notifications.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="unread">
                No leídas
                {unreadCount > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {unreadCount}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="order">Pedidos</TabsTrigger>
              <TabsTrigger value="promotion">Promociones</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="all" className="space-y-4">
            {notifications.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Bell className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-lg font-medium">
                    No tienes notificaciones
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Te notificaremos cuando haya novedades
                  </p>
                </CardContent>
              </Card>
            ) : (
              notifications.map((notification) => (
                <Card
                  key={notification.id}
                  className={cn(
                    "transition-colors",
                    !notification.read && "bg-primary/5 border-primary/20"
                  )}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="mt-1">{getIcon(notification.type)}</div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-semibold">
                            {notification.title}
                          </h3>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {notification.message}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {notification.time}
                        </div>
                      </div>
                      <div className="flex gap-1">
                        {!notification.read && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => markAsRead(notification.id)}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteNotification(notification.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="unread" className="space-y-4">
            {notifications.filter((n) => !n.read).length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <CheckCircle2 className="h-12 w-12 text-chart-2 mb-4" />
                  <p className="text-lg font-medium">Todo al día</p>
                  <p className="text-sm text-muted-foreground">
                    No tienes notificaciones sin leer
                  </p>
                </CardContent>
              </Card>
            ) : (
              notifications
                .filter((n) => !n.read)
                .map((notification) => (
                  <Card
                    key={notification.id}
                    className="bg-primary/5 border-primary/20"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div className="mt-1">{getIcon(notification.type)}</div>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="font-semibold">
                              {notification.title}
                            </h3>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {notification.message}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {notification.time}
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => markAsRead(notification.id)}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteNotification(notification.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
            )}
          </TabsContent>

          <TabsContent value="order" className="space-y-4">
            {filterByType("order").map((notification) => (
              <Card
                key={notification.id}
                className={cn(
                  "transition-colors",
                  !notification.read && "bg-primary/5 border-primary/20"
                )}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="mt-1">{getIcon(notification.type)}</div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-semibold">{notification.title}</h3>
                        {!notification.read && (
                          <Badge variant="secondary">Nueva</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {notification.message}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {notification.time}
                      </div>
                    </div>
                    <div className="flex gap-1">
                      {!notification.read && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => markAsRead(notification.id)}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteNotification(notification.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="promotion" className="space-y-4">
            {filterByType("promotion").map((notification) => (
              <Card
                key={notification.id}
                className={cn(
                  "transition-colors",
                  !notification.read && "bg-primary/5 border-primary/20"
                )}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="mt-1">{getIcon(notification.type)}</div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-semibold">{notification.title}</h3>
                        {!notification.read && (
                          <Badge variant="secondary">Nueva</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {notification.message}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {notification.time}
                      </div>
                    </div>
                    <div className="flex gap-1">
                      {!notification.read && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => markAsRead(notification.id)}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteNotification(notification.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
