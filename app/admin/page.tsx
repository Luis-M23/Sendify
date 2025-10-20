"use client";

import Link from "next/link";
import { DashboardLayout } from "@/components/dashboard-layout";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { ChevronRight } from "lucide-react";
import { adminNavigation } from "@/lib/navigation";

export default function AdminPage() {
  const adminSections = adminNavigation.filter((item) => item.href !== "/admin");

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Panel Administrativo</h1>
          <p className="text-muted-foreground">
            Accede rápidamente a las herramientas de administración
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {adminSections.map((section) => {
            const Icon = section.icon;
            return (
              <Link key={section.href} href={section.href} className="group block">
                <Card className="transition border-border group-hover:border-primary">
                  <CardContent className="flex items-center gap-4 p-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary/20">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground group-hover:text-primary">
                        {section.name}
                      </p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}
