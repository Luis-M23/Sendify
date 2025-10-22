"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";

import { RolesSistema } from "@/lib/enum";
import { Recompensa } from "@/lib/validation/recompensa";
import { RecompensaService } from "@/lib/supabase/services/recompensaService";
import { UsuarioMetadataService } from "@/lib/supabase/services/usuarioMetadataService";
import { UsuarioMetadata } from "@/lib/validation/usuarioMetadata";
import { NotificacionService } from "@/lib/supabase/services/notificacionService";
import { createClient } from "@/lib/supabase/client";

type AuthContextState = {
  usuarioMetadata: UsuarioMetadata | null;
  rol: RolesSistema;
  recompensa: Recompensa | null;
  notificacionesActivas: boolean;
  cargando: boolean;
  isAutenticado: boolean;
  setNotificacionesActivas: (value: boolean) => void;
};

const AuthContext = createContext<AuthContextState | undefined>(undefined);

const supabase = createClient();

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [rol, setRol] = useState<RolesSistema>(RolesSistema.CLIENTE);
  const [cargando, setCargando] = useState(true);
  const [isAutenticado, setIsAutenticado] = useState(false);
  const [recompensa, setRecompensa] = useState<Recompensa | null>(null);
  const [notificacionesActivas, setNotificacionesActivas] =
    useState<boolean>(false);
  const [usuarioMetadata, setUsuarioMetadata] =
    useState<UsuarioMetadata | null>(null);

  async function fetchUsuarioMetadata(id: string) {
    if (id) {
      try {
        const usuario = await UsuarioMetadataService.getById(id);

        setIsAutenticado(!!usuario);
        setUsuarioMetadata(usuario);

        const recompensa = await RecompensaService.getNivel(
          usuario?.compras_realizadas || 0
        );
        setRecompensa(recompensa);

        const hasUnread = await NotificacionService.hasUnread(id);
        setNotificacionesActivas(hasUnread);

        setRol(usuario?.rol ?? RolesSistema.CLIENTE);
      } catch (error) {
        console.error(error);
      }
    }

    setCargando(false);
  }

  async function setAuthState(id: string | null) {
    if (id) {
      fetchUsuarioMetadata(id);
    } else {
      setUsuarioMetadata(null);
      setRol(RolesSistema.CLIENTE);
    }
  }

  async function retrieveSession() {
    const { data, error } = await supabase.auth.getUser();
    const user: User | null = data?.user || null;
    setAuthState(user?.id || null);
  }

  useEffect(() => {
    retrieveSession();
    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === "SIGNED_IN" && session) {
          const id = session?.user?.id ?? null;
          setAuthState(id);
        }

        if (event === "SIGNED_OUT") {
          setAuthState(null);
        }
      }
    );

    setCargando(false);

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const value: AuthContextState = {
    usuarioMetadata,
    rol,
    cargando,
    recompensa,
    notificacionesActivas,
    isAutenticado,
    setNotificacionesActivas,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
