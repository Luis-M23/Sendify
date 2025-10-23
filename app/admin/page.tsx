"use client";

import React, { useEffect, useState } from "react";
import { Bar, Pie, Line } from "react-chartjs-2";
import { DashboardLayout } from "@/components/dashboard-layout";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { createClient } from "@/lib/supabase/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface ConteoCasillero {
  id_casillero: number;
  codigo_casillero: string;
  activos: number;
  inactivos: number;
}

export default function AdminPage() {
  const [conteoCasillero, setConteoCasillero] = useState<ConteoCasillero[]>([]);
  const [totales, setTotales] = useState<{ activos: number; inactivos: number } | null>(null);
  const [paquetesMes, setPaquetesMes] = useState<{ mes: string; cantidad: number }[]>([]);
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    async function fetchData() {
      const [
        { data: conteoData, error: conteoError },
        { data: totalesData, error: totalesError },
        { data: paquetesMesData, error: paquetesMesError },
      ] = await Promise.all([
        supabase.from("conteo_paquetes_por_casillero").select("*"),
        supabase.from("total_paquetes_activos_inactivos").select("*").single(),
        supabase.from("paquetes_por_mes").select("*").order("mes", { ascending: true }),
      ]);

      if (conteoError) console.error("Error conteo:", conteoError);
      if (totalesError) console.error("Error totales:", totalesError);
      if (paquetesMesError) console.error("Error paquetes por mes:", paquetesMesError);

      setConteoCasillero(conteoData || []);
      setTotales(totalesData || null);
      setPaquetesMes(paquetesMesData || []);
      setLoading(false);
    }

    fetchData();

    const interval = setInterval(() => {
      fetchData();
    }, 5000);

    return () => clearInterval(interval);
  }, []);


  if (loading) return <p>Cargando datos...</p>;

  const barData = {
    labels: conteoCasillero.map((item) => item.codigo_casillero),
    datasets: [
      {
        label: "Pendiente de Entrega",
        data: conteoCasillero.map((item) => item.activos),
        backgroundColor: "rgba(79, 87, 93, 0.7)",
      },
      {
        label: "Entregados",
        data: conteoCasillero.map((item) => item.inactivos),
        backgroundColor: "rgba(7, 75, 154, 0.7)",
      },
    ],
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" as const },
      title: {
        display: true,
        text: "Conteo de Paquetes por Casillero",
      },
    },
  };

  const pieData = {
    labels: ["Pendiente de Entrega", "Entregados"],
    datasets: [
      {
        label: "Paquetes",
        data: totales ? [totales.activos, totales.inactivos] : [],
        backgroundColor: [
          "rgba(54, 162, 235, 0.7)",
          "rgba(255, 99, 132, 0.7)",
        ],
      },
    ],
  };

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: { position: "bottom" as const },
      title: {
        display: true,
        text: "Total Paquetes Activos vs Inactivos",
      },
    },
  };

  const lineData = {
    labels: paquetesMes.map((item) =>
      new Date(item.mes).toLocaleDateString("es-ES", {
        year: "numeric",
        month: "short",
      })
    ),
    datasets: [
      {
        label: "Paquetes por mes",
        data: paquetesMes.map((item) => item.cantidad),
        fill: false,
        borderColor: "rgba(75,192,192,1)",
        tension: 0.3,
      },
    ],
  };

  const lineOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" as const },
      title: {
        display: true,
        text: "Envíos Solicitados por Mes",
      },
    },
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Dashboard de Estadísticas</CardTitle>
                <CardDescription>
                  Visualiza los datos clave y métricas importantes sobre paquetes, casilleros y promociones.
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-6 pb-6">
            <Card>
              <CardContent>
                <div style={{ height: 400 }}>
                  <Bar data={barData} options={barOptions} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <div style={{ height: 400 }}>
                  <Line data={lineData} options={lineOptions} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <div style={{ height: 400 }}>
                  <Pie data={pieData} options={{ ...pieOptions, maintainAspectRatio: false }} />
                </div>
              </CardContent>
            </Card>

          </div>
        </Card>
      </div>
    </DashboardLayout>

  );
}
