"use client";
import { DashboardLayout } from "@/components/dashboard-layout";

import { useAuth } from "@/components/auth-provider";

export default function DashboardPage() {
  const { usuarioMetadata } = useAuth();

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">
            Bienvenido {usuarioMetadata?.nombre_completo}
          </h1>
          <p className="text-muted-foreground">
            Gestiona tus envíos internacionales desde un solo lugar
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
