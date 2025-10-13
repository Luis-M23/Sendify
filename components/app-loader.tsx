"use client";

import { useAuth } from "@/hooks/use-auth";
import React from "react";

export function AppLoader({ children }: { children: React.ReactNode }) {
  const { loading } = useAuth();
  
  const LoadingSpinner = (
    <div className="text-center py-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
      <p className="text-muted-foreground mt-2">Cargando la aplicación...</p>
    </div>
  );

  if (loading) {
    return LoadingSpinner;
  }

  return <>{children}</>;
}