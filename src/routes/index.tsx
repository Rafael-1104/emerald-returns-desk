import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import { ClipboardList, FileSpreadsheet, Hash, CheckCircle2, ArrowRight } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { StatCard } from "@/components/ui-kit/StatCard";
import { Panel } from "@/components/ui-kit/PageSection";
import { DevolucoesTable } from "@/components/devolucoes/DevolucoesTable";
import { useDevolucoes } from "@/lib/devolucoes-store";
import type { Devolucao } from "@/lib/mock-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Visão geral | Sistema de Devoluções" },
      {
        name: "description",
        content: "Painel com indicadores do fluxo de devolução de materiais e integração com o ARECO.",
      },
      { property: "og:title", content: "Visão geral | Sistema de Devoluções" },
      {
        property: "og:description",
        content: "Painel com indicadores do fluxo de devolução de materiais e integração com o ARECO.",
      },
    ],
  }),
  component: VisaoGeral,
});

function VisaoGeral() {
  const devolucoes = useDevolucoes();
  const navigate = Route.useNavigate();

  const indicadores = useMemo(() => {
    const conta = (s: Devolucao["status"]) => devolucoes.filter((d) => d.status === s).length;
    return {
      montagem: conta("em_montagem"),
      csv: conta("csv_gerado"),
      rm: conta("rm_vinculada"),
      finalizadas: conta("finalizada"),
    };
  }, [devolucoes]);

  return (
    <AppLayout title="Visão geral" subtitle="Resumo do fluxo de devoluções de materiais">
      <div className="mx-auto max-w-[1400px] space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Em montagem" value={indicadores.montagem} hint="Itens sendo adicionados" icon={ClipboardList} />
          <StatCard label="CSV gerado" value={indicadores.csv} hint="Aguardando RM do ARECO" icon={FileSpreadsheet} />
          <StatCard label="RM vinculada" value={indicadores.rm} hint="Prontas para o relatório" icon={Hash} />
          <StatCard label="Finalizadas" value={indicadores.finalizadas} hint="Relatório conferido" icon={CheckCircle2} />
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
          <DevolucoesTable
            data={devolucoes.slice(0, 5)}
            onView={(d) => void navigate({ to: "/nova-devolucao", search: { id: d.id } })}
            onReport={(d) => void navigate({ to: "/relatorios", search: { id: d.id } })}
          />
        </Panel>
      </div>
    </AppLayout>
  );
}
