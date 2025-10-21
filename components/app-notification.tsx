"use client";

import { useAuth } from "@/components/auth-provider";
import React, { useEffect } from "react";
import {
  Realtime,
  SupabaseRealtimePayload,
} from "@/lib/supabase/services/realtimeService";
import { Notificacion } from "@/lib/validation/notificacion";

export function AppNotification({ children }: { children: React.ReactNode }) {
  const { user, setHasUnread } = useAuth();

  useEffect(() => {
    if (!user) return;

    const channel = Realtime.subscribe(
      "notificaciones",
      `id_usuario=eq.${user.id}`,
      (payload: SupabaseRealtimePayload<Notificacion>) => {
        if (
          payload.eventType === "INSERT" &&
          payload.new?.id_usuario === user.id
        ) {
          setHasUnread(true);
          const audio = new Audio("/sounds/beep.mp3");
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
  }, [user, setHasUnread]);

  return <>{children}</>;
}
