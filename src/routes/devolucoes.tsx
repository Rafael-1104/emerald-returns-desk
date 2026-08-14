import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Panel, Field } from "@/components/ui-kit/PageSection";
import { DevolucoesTable } from "@/components/devolucoes/DevolucoesTable";
import { StatusBadge } from "@/components/ui-kit/StatusBadge";
import {
  devolucoes,
  formatarData,
  statusLabels,
  usuarios,
  type Devolucao,
  type DevolucaoStatus,
} from "@/lib/mock-data";

export const Route = createFileRoute("/devolucoes")({
  head: () => ({
    meta: [
      { title: "Devoluções | Sistema de Devoluções" },
      { name: "description", content: "Histórico de devoluções com busca e filtros por data, usuário e status." },
      { property: "og:title", content: "Devoluções | Sistema de Devoluções" },
      { property: "og:description", content: "Histórico de devoluções com busca e filtros." },
    ],
  }),
  component: DevolucoesPage,
});

const controlClass =
  "w-full rounded-lg border border-input bg-card px-3 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-ring/25";

function DevolucoesPage() {
  const [busca, setBusca] = useState("");
  const [data, setData] = useState("");
  const [usuario, setUsuario] = useState("");
  const [status, setStatus] = useState("");
  const [selecionada, setSelecionada] = useState<Devolucao | null>(null);

  const filtradas = useMemo(
    () =>
      devolucoes.filter((d) => {
        const termo = busca.trim().toLowerCase();
        return (
          (!termo || d.requisicao.toLowerCase().includes(termo) || d.usuario.toLowerCase().includes(termo)) &&
          (!data || d.data === data) &&
          (!usuario || d.usuario === usuario) &&
          (!status || d.status === status)
        );
      }),
    [busca, data, usuario, status],
  );

  return (
    <AppLayout title="Devoluções" subtitle="Histórico completo de devoluções registradas">
      <div className="mx-auto max-w-[1400px] space-y-6">
        <Panel title="Filtros" description="Refine a consulta do histórico">
          <div className="grid gap-4 md:grid-cols-4">
            <Field label="Pesquisar">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  className={`${controlClass} pl-9`}
                  placeholder="Requisição ou usuário"
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                />
              </div>
            </Field>
            <Field label="Data">
              <input type="date" className={controlClass} value={data} onChange={(e) => setData(e.target.value)} />
            </Field>
            <Field label="Usuário">
              <select className={controlClass} value={usuario} onChange={(e) => setUsuario(e.target.value)}>
                <option value="">Todos</option>
                {usuarios.map((u) => (
                  <option key={u.id} value={u.nome}>
                    {u.nome}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Status">
              <select className={controlClass} value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="">Todos</option>
                {Object.entries(statusLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </Field>
          </div>
          <button
            type="button"
            onClick={() => {
              setBusca("");
              setData("");
              setUsuario("");
              setStatus("");
            }}
            className="mt-4 text-xs font-semibold text-muted-foreground transition-colors hover:text-primary-dark"
          >
            Limpar filtros
          </button>
        </Panel>

        <Panel title="Histórico" description={`${filtradas.length} registro(s)`} bodyClassName="p-0">
          <DevolucoesTable data={filtradas} onView={setSelecionada} />
        </Panel>
      </div>

      {selecionada && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 p-4">
          <div className="surface-card w-full max-w-2xl">
            <div className="flex items-start justify-between border-b border-border px-6 py-4">
              <div>
                <h2 className="text-sm font-semibold text-foreground">{selecionada.requisicao}</h2>
                <p className="text-xs text-muted-foreground">
                  {formatarData(selecionada.data)} • {selecionada.usuario}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <StatusBadge status={selecionada.status as DevolucaoStatus} />
                <button
                  type="button"
                  onClick={() => setSelecionada(null)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="max-h-[60vh] overflow-y-auto p-6">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                    <th className="py-2 font-semibold">Código</th>
                    <th className="py-2 font-semibold">Descrição</th>
                    <th className="py-2 font-semibold">Qtd.</th>
                    <th className="py-2 font-semibold">Lote</th>
                  </tr>
                </thead>
                <tbody>
                  {selecionada.itens.map((item, i) => (
                    <tr key={i} className="border-b border-border/70 last:border-0">
                      <td className="py-2.5 font-semibold text-foreground">{item.codigo}</td>
                      <td className="py-2.5 text-muted-foreground">{item.descricao}</td>
                      <td className="py-2.5 tabular-nums">{item.quantidade}</td>
                      <td className="py-2.5">{item.lote}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
