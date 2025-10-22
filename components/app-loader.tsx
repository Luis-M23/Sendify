"use client";

import { useAuth } from "@/components/auth-provider"; 
import React from "react";

export function AppLoader({ children }: { children: React.ReactNode }) {
  const { cargando } = useAuth();
  
  if (cargando) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        <p className="text-muted-foreground mt-2">Cargando la aplicación...</p>
      </div>
    );
  }

  return <>{children}</>;
}