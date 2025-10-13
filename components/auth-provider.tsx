"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { createClient, User } from "@supabase/supabase-js";

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
      setRol(currentUser?.app_metadata?.rol ?? "cliente");
    } else {
      setUser(null);
      setRol(null);
    }
  };

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setLoading(true);

        console.log(event, session);

        const currentUser = session?.user ?? null;

        if (["SIGNED_IN"].includes(event) && currentUser) {
          setAuthState(currentUser);
        }
        if (["SIGNED_OUT"].includes(event)) {
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
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined)
    throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
