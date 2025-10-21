"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { createClient, User } from "@supabase/supabase-js";
import { RolesSistema } from "@/lib/enum";
import { Recompensa } from "@/lib/validation/recompensa";
import { RecompensaService } from "@/lib/supabase/services/recompensaService";
import { UsuarioMetadataService } from "@/lib/supabase/services/usuarioMetadataService";
import { UsuarioMetadata } from "@/lib/validation/usuarioMetadata";
import { NotificacionService } from "@/lib/supabase/services/notificacionService";

type AuthContextState = {
  user: User | null;
  rol: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  recompensa: Recompensa | null;
  usuarioMetadata: UsuarioMetadata | null;
  hasUnread: boolean;
  setHasUnread: (value: boolean) => void;
};

const AuthContext = createContext<AuthContextState | undefined>(undefined);

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [rol, setRol] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [recompensa, setRecompensa] = useState<Recompensa | null>(null);
  const [hasUnread, setHasUnread] = useState<boolean>(false);

  const [usuarioMetadata, setUsuarioMetadata] =
    useState<UsuarioMetadata | null>(null);

  async function checkUsuarioMetadata() {
    const id = user?.id ?? null;

    if (id) {
      try {
        const usuario = await UsuarioMetadataService.firstOrCreate(
          id,
          user?.user_metadata?.nombre
        );
        setUsuarioMetadata(usuario);

        const recompensa = await RecompensaService.getNivel(
          usuario.compras_realizadas
        );
        setRecompensa(recompensa);

        const hasUnread = await NotificacionService.hasUnread(id);
        setHasUnread(hasUnread);
      } catch (error) {
        console.error(error);
      }
    }
  }

  useEffect(() => {
    checkUsuarioMetadata();
  }, [user]);

  const setAuthState = (currentUser: User | null) => {
    setIsAuthenticated(!!currentUser);

    if (currentUser) {
      setUser(currentUser);
      setRol(currentUser?.app_metadata?.rol ?? RolesSistema.CLIENTE);
    } else {
      setUser(null);
      setRol(null);
    }
  };

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === "SIGNED_IN" && session) {
          const currentUser = session?.user ?? null;
          setAuthState(currentUser);
        }

        if (event === "SIGNED_OUT") {
          setAuthState(null);
        }

        setLoading(false);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const value: AuthContextState = {
    user,
    rol,
    isAuthenticated,
    loading,
    recompensa,
    usuarioMetadata,
    hasUnread,
    setHasUnread,
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
