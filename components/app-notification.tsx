"use client";

import { useAuth } from "@/components/auth-provider";
import React, { useEffect } from "react";
import {
  Realtime,
  SupabaseRealtimePayload,
} from "@/lib/supabase/services/realtimeService";
import { Notificacion } from "@/lib/validation/notificacion";

export function AppNotification({ children }: { children: React.ReactNode }) {
  const { usuarioMetadata, setNotificacionesActivas } = useAuth();

  useEffect(() => {
    if (!usuarioMetadata) return;

    const channel = Realtime.subscribe(
      "notificaciones",
      `id_usuario=eq.${usuarioMetadata.id_usuario}`,
      (payload: SupabaseRealtimePayload<Notificacion>) => {
        if (
          payload.eventType === "INSERT" &&
          payload.new?.id_usuario === usuarioMetadata.id_usuario
        ) {
          setNotificacionesActivas(true);
          const audio = new Audio("/sounds/beepy.mp3");
          audio
            .play()
            .then(() => {
              setTimeout(() => {
                audio.pause();
                audio.currentTime = 0;
              }, 6000); 
            })
            .catch((err) => console.error("Error al reproducir sonido:", err));
        }
      }
    );

    return () => {
      if (channel) Realtime.unsubscribe(channel);
    };
  }, [usuarioMetadata, setNotificacionesActivas]);

  return <>{children}</>;
}
