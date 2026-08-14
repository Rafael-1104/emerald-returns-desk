import { createFileRoute, Link } from "@tanstack/react-router";
import { CalendarDays, CalendarRange, Loader, CheckCircle2, ArrowRight } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { StatCard } from "@/components/ui-kit/StatCard";
import { Panel } from "@/components/ui-kit/PageSection";
import { DevolucoesTable } from "@/components/devolucoes/DevolucoesTable";
import { devolucoes, indicadores } from "@/lib/mock-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Visão geral | Sistema de Devoluções" },
      {
        name: "description",
        content: "Painel com indicadores e devoluções recentes de materiais.",
      },
      { property: "og:title", content: "Visão geral | Sistema de Devoluções" },
      {
        property: "og:description",
        content: "Painel com indicadores e devoluções recentes de materiais.",
      },
    ],
  }),
  component: VisaoGeral,
});

function VisaoGeral() {
  return (
    <AppLayout title="Visão geral" subtitle="Resumo das devoluções de materiais">
      <div className="mx-auto max-w-[1400px] space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Devoluções hoje" value={indicadores.hoje} hint="Registradas em 14/08/2026" icon={CalendarDays} />
          <StatCard label="Devoluções no mês" value={indicadores.mes} hint="Agosto de 2026" icon={CalendarRange} />
          <StatCard label="Em andamento" value={indicadores.andamento} hint="Aguardando conferência" icon={Loader} />
          <StatCard label="Finalizadas" value={indicadores.finalizadas} hint="Conferidas no mês" icon={CheckCircle2} />
        </div>

        <Panel
          title="Devoluções recentes"
          description="Últimos registros lançados no sistema"
          bodyClassName="p-0"
          action={
            <Link
              to="/devolucoes"
              className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs font-semibold text-foreground transition-colors hover:border-primary/40 hover:bg-primary-soft hover:text-primary-dark"
            >
              Ver todas <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          }
        >
          <DevolucoesTable data={devolucoes.slice(0, 5)} />
        </Panel>
      </div>
    </AppLayout>
  );
}
