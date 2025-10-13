"use client";

import { useState, useEffect } from "react";
import { createClient, User } from "@supabase/supabase-js";

type AuthState = {
  user: User | null;
  rol: string | null;
  isAuthenticated: boolean;
  loading: boolean;
};

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
);

export function useAuth(): AuthState {
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
    const init = async () => {
      const {
        data: { user: initialUser },
      } = await supabase.auth.getUser();
      setAuthState(initialUser);
      setLoading(false);
    };

    init();

    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      setLoading(true);

      const currentUser = session?.user ?? null;

      if (["SIGNED_IN"].includes(event) && currentUser) {
        setAuthState(currentUser);
      }
      if (["SIGNED_OUT"].includes(event)) {
        setAuthState(null);
      }

      setLoading(false);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return { user, rol, isAuthenticated, loading };
}
