"use client";

import React, {
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/theme-toggle";
import { Calculator, MapPin, Package, Boxes, TrendingUp } from "lucide-react";
import { useAuth } from "@/components/auth-provider";
import { AuthService } from "@/lib/supabase/services/authService";
import { PaqueteService } from "@/lib/supabase/services/paqueteService";
import { CasilleroService } from "@/lib/supabase/services/casilleroService";
import { DireccionService } from "@/lib/supabase/services/direccionService";
import { toast } from "react-toastify";

type MetricCard = {
  label: string;
  value: number;
  icon: LucideIcon;
  gradient: string;
};

export default function HomePage() {
  const router = useRouter();
  const { isAutenticado } = useAuth();

  const [trackingCode, setTrackingCode] = useState("");
  const [metrics, setMetrics] = useState({
    paquetes: 0,
    casilleros: 0,
    direcciones: 0,
  });
  const [isLoadingMetrics, setIsLoadingMetrics] = useState(true);

  const numberFormatter = useMemo(() => new Intl.NumberFormat("es-SV"), []);

  const metricCards = useMemo<MetricCard[]>(
    () => [
      {
        label: "Paquetes procesados",
        value: metrics.paquetes,
        icon: Package,
        gradient: "from-primary/25 via-primary/10 to-transparent",
      },
      {
        label: "Casilleros operativos",
        value: metrics.casilleros,
        icon: Boxes,
        gradient: "from-chart-2/25 via-chart-2/10 to-transparent",
      },
      {
        label: "Puntos de retiro",
        value: metrics.direcciones,
        icon: MapPin,
        gradient: "from-chart-4/25 via-chart-4/10 to-transparent",
      },
    ],
    [metrics]
  );

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const [paquetes, casilleros, direcciones] = await Promise.all([
          PaqueteService.getTotalCount(),
          CasilleroService.countActivos(),
          DireccionService.countActivas(),
        ]);

        setMetrics({
          paquetes,
          casilleros,
          direcciones,
        });
      } catch (error) {
        console.error("Error al cargar métricas", error);
      } finally {
        setIsLoadingMetrics(false);
      }
    };

    fetchMetrics();
  }, []);

  const handleLogout = useCallback(async () => {
    try {
      await AuthService.logout();
      toast.success("Sesión cerrada correctamente");
      router.push("/");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Ocurrió un error al cerrar sesión"
      );
    }
  }, [router]);

  const handleTrackingSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const trimmed = trackingCode.trim();

      if (!trimmed) {
        toast.error("Ingresa el código de tu paquete");
        return;
      }

      router.push(`/factura/${encodeURIComponent(trimmed)}`);
      setTrackingCode("");
    },
    [router, trackingCode]
  );

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader isAutenticado={isAutenticado} onLogout={handleLogout} />
      <main className="flex-1">
        <HeroSection
          metrics={metricCards}
          isLoading={isLoadingMetrics}
          numberFormatter={numberFormatter}
          trackingCode={trackingCode}
          onTrackingCodeChange={setTrackingCode}
          onTrackingSubmit={handleTrackingSubmit}
        />
        <QuickActionsSection />
        <NetworkSection
          metrics={metricCards}
          isLoading={isLoadingMetrics}
          formatter={numberFormatter}
        />
      </main>
      <SiteFooter />
    </div>
  );
}

type SiteHeaderProps = {
  isAutenticado: boolean;
  onLogout: () => Promise<void>;
};

function SiteHeader({ isAutenticado, onLogout }: SiteHeaderProps) {
  return (
    <header className="border-b border-border bg-card">
      <div className="container mx-auto flex items-center justify-between px-4 py-4">
        <div className="flex items-center gap-2">
          <Package className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold">ShipGlobal</h1>
        </div>
        <nav className="flex items-center gap-4">
          <ThemeToggle />
          {isAutenticado ? (
            <Button variant="secondary" onClick={onLogout}>
              Cerrar sesión
            </Button>
          ) : (
            <>
              <Button asChild variant="ghost">
                <Link href="/login">Iniciar Sesión</Link>
              </Button>
              <Button asChild>
                <Link href="/registro">Registrarse</Link>
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

type HeroSectionProps = {
  metrics: MetricCard[];
  isLoading: boolean;
  numberFormatter: Intl.NumberFormat;
  trackingCode: string;
  onTrackingCodeChange: (code: string) => void;
  onTrackingSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

function HeroSection({
  metrics,
  isLoading,
  numberFormatter,
  trackingCode,
  onTrackingCodeChange,
  onTrackingSubmit,
}: HeroSectionProps) {
  const heroCopy = isLoading
    ? "Conecta tus compras con una red de transporte segura, flexible y siempre visible."
    : `Hemos procesado ${numberFormatter.format(
        metrics[0].value
      )} paquetes, operamos con ${numberFormatter.format(
        metrics[1].value
      )} casilleros activos y ${numberFormatter.format(
        metrics[2].value
      )} puntos de retiro listos para ti.`;

  return (
    <section className="relative overflow-hidden border-b border-border">
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/15 via-background to-background" />
      <div className="container mx-auto grid gap-10 px-4 py-16 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:items-center">
        <div className="space-y-6 text-left">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1 text-sm font-medium text-primary">
            Logística inteligente para tus compras globales
          </span>
          <h2 className="text-4xl font-bold leading-tight sm:text-5xl">
            Transparencia total para cada envío internacional
          </h2>
          <p className="text-lg text-muted-foreground">{heroCopy}</p>
          <ul className="space-y-3 text-muted-foreground">
            <li className="flex items-start gap-3">
              <span className="mt-1 h-2 w-2 rounded-full bg-primary" />
              Cotizaciones instantáneas con impuestos y recompensas incluidos.
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 h-2 w-2 rounded-full bg-primary" />
              Seguimiento granular en cada etapa del trayecto.
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 h-2 w-2 rounded-full bg-primary" />
              Red global de casilleros y puntos de retiro verificados.
            </li>
          </ul>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="h-14 gap-3 rounded-2xl bg-gradient-to-r from-primary via-primary/90 to-primary/70 px-8 text-base shadow-xl transition-transform hover:-translate-y-0.5"
            >
              <Link href="/calculadora">
                <Calculator className="h-5 w-5" />
                Cotizar envío ahora
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-14 gap-3 rounded-2xl border-primary/40 px-8 text-base shadow-sm hover:border-primary/60"
            >
              <Link href="/dashboard">
                <TrendingUp className="h-5 w-5" />
                Visitar panel operativo
              </Link>
            </Button>
          </div>
        </div>

        <aside className="flex flex-col gap-6">
          <form
            onSubmit={onTrackingSubmit}
            className="rounded-3xl border border-primary/30 bg-card/80 p-6 shadow-xl backdrop-blur"
          >
            <h3 className="text-left text-lg font-semibold text-primary">
              Rastrear tu paquete
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Ingresa el código para conocer el estado detallado de tu envío.
            </p>
            <div className="mt-4 space-y-3">
              <Input
                value={trackingCode}
                onChange={(event) => onTrackingCodeChange(event.target.value)}
                placeholder="Ejemplo: SG-123456"
                type="text"
                autoComplete="off"
                className="h-14 rounded-2xl border border-border px-5 text-base shadow-inner focus-visible:border-primary focus-visible:ring-primary/40"
              />
              <Button
                type="submit"
                size="lg"
                className="h-12 rounded-2xl bg-primary/90 px-6 text-base shadow-lg hover:bg-primary"
              >
                Consultar estado
              </Button>
            </div>
          </form>

          <StatsHighlight
            metricCards={metrics}
            isLoading={isLoading}
            numberFormatter={numberFormatter}
          />
        </aside>
      </div>
    </section>
  );
}

type StatsHighlightProps = {
  metricCards: MetricCard[];
  isLoading: boolean;
  numberFormatter: Intl.NumberFormat;
};

function StatsHighlight({
  metricCards,
  isLoading,
  numberFormatter,
}: StatsHighlightProps) {
  return (
    <div className="grid w-full max-w-4xl grid-cols-1 gap-4 sm:grid-cols-3">
      {metricCards.map(({ label, value, icon: Icon, gradient }) => (
        <div
          key={label}
          className={`rounded-3xl border border-white/10 bg-gradient-to-br ${gradient} px-6 py-7 text-left shadow-lg backdrop-blur-lg transition-transform duration-300 hover:-translate-y-1`}
        >
          <div className="mb-4 flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-background/70 shadow-inner">
              <Icon className="h-6 w-6 text-primary" />
            </span>
            <p className="text-sm font-medium text-muted-foreground">{label}</p>
          </div>
          <span className="text-4xl font-semibold text-foreground">
            {isLoading ? "..." : numberFormatter.format(value)}
          </span>
        </div>
      ))}
    </div>
  );
}

function QuickActionsSection() {
  const actions = [
    {
      title: "Cotizar un envío",
      description:
        "Obtén tarifas inmediatas con factores volumétricos y descuentos aplicados.",
      href: "/calculadora",
      icon: Calculator,
    },
    {
      title: "Monitorear mis paquetes",
      description:
        "Accede a la bitácora de movimientos y confirma entregas desde un solo panel.",
      href: "/dashboard",
      icon: Package,
    },
    {
      title: "Descubrir beneficios",
      description:
        "Revisa promociones activas, recompensas y upgrades de membresía.",
      href: "/promociones",
      icon: TrendingUp,
    },
  ];

  return (
    <section className="border-b border-border bg-card/40">
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8 flex flex-col gap-2 text-left">
          <h3 className="text-3xl font-bold">Acciones rápidas</h3>
          <p className="max-w-2xl text-muted-foreground">
            Todo lo que necesitas para gestionar importaciones en segundos.
            Empieza por la tarea que tengas en mente.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {actions.map(({ title, description, href, icon: Icon }) => (
            <Link
              key={title}
              href={href}
              className="group relative overflow-hidden rounded-3xl border border-border bg-background p-6 shadow-md transition-transform hover:-translate-y-1"
            >
              <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
              <div className="flex items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Icon className="h-6 w-6" />
                </span>
                <h4 className="text-xl font-semibold">{title}</h4>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">
                {description}
              </p>
              <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-primary">
                Ir ahora
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                >
                  <path d="M7 17 17 7" />
                  <path d="m7 7 10 0 0 10" />
                </svg>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

type NetworkSectionProps = {
  metrics: MetricCard[];
  isLoading: boolean;
  formatter: Intl.NumberFormat;
};

function NetworkSection({
  metrics,
  isLoading,
  formatter,
}: NetworkSectionProps) {
  const highlights = [
    {
      title: "Casilleros estratégicos",
      text: "Ubicados cerca de los principales hubs logísticos para acelerar consolidaciones y reenvíos.",
    },
    {
      title: "Rastreo minuto a minuto",
      text: "Cada movimiento se sincroniza con tu panel para brindar transparencia en aduanas y última milla.",
    },
    {
      title: "Promociones dinámicas",
      text: "Descuentos basados en tu historial de envíos y campañas activas del mes.",
    },
  ];

  return (
    <section className="container mx-auto px-4 py-16">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <div className="space-y-6">
          <h3 className="text-3xl font-bold">Nuestra red, tu ventaja</h3>
          <p className="max-w-2xl text-muted-foreground">
            Estamos creciendo contigo. Ya consolidamos{" "}
            <strong>
              {isLoading ? "..." : formatter.format(metrics[0].value)}
            </strong>{" "}
            envíos, operamos{" "}
            <strong>
              {isLoading ? "..." : formatter.format(metrics[1].value)}
            </strong>{" "}
            casilleros activos y mantenemos{" "}
            <strong>
              {isLoading ? "..." : formatter.format(metrics[2].value)}
            </strong>{" "}
            puntos de retiro confiables listos para tus clientes.
          </p>
          <dl className="grid gap-4 sm:grid-cols-3">
            {metrics.map(({ label, value }) => (
              <div
                key={label}
                className="rounded-2xl bg-muted/40 p-4 text-left"
              >
                <dt className="text-xs uppercase text-muted-foreground">
                  {label}
                </dt>
                <dd className="text-2xl font-semibold">
                  {isLoading ? "..." : formatter.format(value)}
                </dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="grid gap-6 rounded-3xl border border-border bg-card/60 p-8 shadow-inner backdrop-blur">
          {highlights.map(({ title, text }) => (
            <article key={title} className="space-y-2 text-left">
              <h4 className="text-lg font-semibold text-primary">{title}</h4>
              <p className="text-sm text-muted-foreground">{text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-border">
      <div className="container mx-auto px-4 py-8 text-center text-muted-foreground">
        <p>
          &copy; 2025 ShipGlobal. Sistema de Gestión de Envíos Internacionales.
        </p>
      </div>
    </footer>
  );
}
