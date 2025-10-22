"use client";

import { useEffect, useMemo, useState } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Bell,
  Package,
  TrendingUp,
  Info,
  CheckCircle2,
  Clock,
  Trash2,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Notificacion, NotificacionTipo } from "@/lib/validation/notificacion";
import { NotificacionService } from "@/lib/supabase/services/notificacionService";
import { useAuth } from "@/components/auth-provider";
import { toast } from "react-toastify";

export default function NotificationsPage() {
  const {
    usuarioMetadata,
    cargando: authLoading,
    setNotificacionesActivas,
    notificacionesActivas,
  } = useAuth();

  const [notifications, setNotifications] = useState<Notificacion[]>([]);
  const [cargando, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadNotifications = async () => {
    if (authLoading) return;

    if (!usuarioMetadata) {
      setNotifications([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const data = await NotificacionService.getByUserId(
        usuarioMetadata.id_usuario
      );
      setNotifications(data);
    } catch (err: any) {
      console.error("Error cargando notificaciones:", err);
      setError(
        err?.message ||
          "No se pudieron cargar tus notificaciones. Intenta más tarde."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, [authLoading, usuarioMetadata]);

  useEffect(() => {
    if (notificacionesActivas) {
      loadNotifications();
    }
  }, [notificacionesActivas]);

  setNotificacionesActivas(false);

  const unreadCount = notifications.filter((n) => !n.leido).length;

  const formatDate = (iso: string) => {
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) {
      return "Fecha inválida";
    }

    return new Intl.DateTimeFormat("es-SV", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(date);
  };

  const markAsRead = async (id: number) => {
    try {
      await NotificacionService.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, leido: true } : n))
      );
      toast.success("Notificación marcada como leída");
    } catch (err: any) {
      console.error("Error marcando notificación como leída:", err);
      toast.error("No se pudo marcar como leída");
    }
  };

  const markAllAsRead = async () => {
    if (!usuarioMetadata) return;
    try {
      await NotificacionService.markAllAsRead(usuarioMetadata.id_usuario);
      setNotifications((prev) => prev.map((n) => ({ ...n, leido: true })));
      toast.success("Todas las notificaciones marcadas como leídas");
    } catch (err: any) {
      console.error("Error marcando todas como leídas:", err);
      toast.error("No se pudieron marcar como leídas");
    }
  };

  const deleteNotification = async (id: number) => {
    try {
      await NotificacionService.delete(id);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      toast.success("Notificación eliminada");
    } catch (err: any) {
      console.error("Error eliminando notificación:", err);
      toast.error("No se pudo eliminar la notificación");
    }
  };

  const deleteAllRead = async () => {
    if (!usuarioMetadata) return;
    try {
      await NotificacionService.deleteRead(usuarioMetadata.id_usuario);
      setNotifications((prev) => prev.filter((n) => !n.leido));
      toast.success("Notificaciones leídas eliminadas");
    } catch (err: any) {
      console.error("Error eliminando notificaciones leídas:", err);
      toast.error("No se pudieron eliminar");
    }
  };

  const getIcon = (type: NotificacionTipo) => {
    switch (type) {
      case "tracking":
        return <Package className="h-5 w-5 text-primary" />;
      case "promo":
        return <TrendingUp className="h-5 w-5 text-chart-2" />;
      case "info":
        return <Info className="h-5 w-5 text-muted-foreground" />;
      default:
        return <Bell className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const filteredByType = useMemo(() => {
    return {
      tracking: notifications.filter((n) => n.tipo === "tracking"),
      info: notifications.filter((n) => n.tipo === "info"),
      promo: notifications.filter((n) => n.tipo === "promo"),
    };
  }, [notifications]);

  const renderNotifications = (items: Notificacion[]) => {
    if (items.length === 0) {
      return (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Bell className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium">Sin notificaciones</p>
            <p className="text-sm text-muted-foreground">
              Te notificaremos cuando haya novedades.
            </p>
          </CardContent>
        </Card>
      );
    }

    return items.map((notification) => (
      <Card
        key={notification.id}
        className={cn(
          "transition-colors",
          !notification.leido && "bg-primary/5 border-primary/20"
        )}
      >
        <CardContent className="p-4">
          <div className="flex items-start gap-4">
            <div className="mt-1">{getIcon(notification.tipo)}</div>
            <div className="flex-1 space-y-1">
              <p className="text-sm text-muted-foreground">
                {notification.comentario}
              </p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                {formatDate(notification.created_at)}
              </div>
            </div>
            <div className="flex gap-1">
              {!notification.leido && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => markAsRead(notification.id)}
                  aria-label="Marcar como leída"
                >
                  <Check className="h-4 w-4" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => deleteNotification(notification.id)}
                className="text-destructive hover:text-destructive"
                aria-label="Eliminar notificación"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    ));
  };

  const unreadNotifications = notifications.filter((n) => !n.leido);

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Notificaciones</h1>
            <p className="text-muted-foreground">
              {cargando
                ? "Cargando tus notificaciones..."
                : `Tienes ${unreadCount} ${
                    unreadCount === 1
                      ? "notificación nueva"
                      : "notificaciones nuevas"
                  }`}
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={markAllAsRead}
              disabled={!usuarioMetadata || unreadCount === 0 || cargando}
            >
              <Check className="mr-2 h-4 w-4" />
              Marcar todas como leídas
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={deleteAllRead}
              disabled={
                !usuarioMetadata || notifications.every((n) => !n.leido)
              }
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Eliminar leídas
            </Button>
          </div>
        </div>

        {error && (
          <Card>
            <CardContent className="py-3 text-sm text-destructive">
              {error}
            </CardContent>
          </Card>
        )}

        {!usuarioMetadata && !authLoading ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              Inicia sesión para ver tus notificaciones.
            </CardContent>
          </Card>
        ) : null}

        {usuarioMetadata ? (
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
                <TabsTrigger value="tracking">Tracking</TabsTrigger>
                <TabsTrigger value="info">Información</TabsTrigger>
                <TabsTrigger value="promo">Promociones</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="all" className="space-y-4">
              {cargando ? (
                <Card>
                  <CardContent className="py-12 text-center text-muted-foreground">
                    Cargando notificaciones...
                  </CardContent>
                </Card>
              ) : (
                renderNotifications(notifications)
              )}
            </TabsContent>

            <TabsContent value="unread" className="space-y-4">
              {cargando ? (
                <Card>
                  <CardContent className="py-12 text-center text-muted-foreground">
                    Cargando notificaciones...
                  </CardContent>
                </Card>
              ) : unreadNotifications.length === 0 ? (
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
                renderNotifications(unreadNotifications)
              )}
            </TabsContent>

            <TabsContent value="tracking" className="space-y-4">
              {renderNotifications(filteredByType.tracking)}
            </TabsContent>

            <TabsContent value="info" className="space-y-4">
              {renderNotifications(filteredByType.info)}
            </TabsContent>

            <TabsContent value="promo" className="space-y-4">
              {renderNotifications(filteredByType.promo)}
            </TabsContent>
          </Tabs>
        ) : null}
      </div>
    </DashboardLayout>
  );
}
