"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { createClient, User } from "@supabase/supabase-js";
import { RolesSistema } from "@/lib/enum";

type AuthContextState = {
  user: User | null;
  rol: string | null;
  isAuthenticated: boolean;
  loading: boolean;
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
        console.log({ event, session });
        
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

  const value: AuthContextState = { user, rol, isAuthenticated, loading };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
