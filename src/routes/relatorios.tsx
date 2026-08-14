import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Printer, FileDown } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Panel, Field } from "@/components/ui-kit/PageSection";
import { devolucoes, formatarData, statusLabels } from "@/lib/mock-data";

export const Route = createFileRoute("/relatorios")({
  head: () => ({
    meta: [
      { title: "Relatórios | Sistema de Devoluções" },
      { name: "description", content: "Consulte e gere relatórios de devoluções de materiais." },
      { property: "og:title", content: "Relatórios | Sistema de Devoluções" },
      { property: "og:description", content: "Consulte e gere relatórios de devoluções de materiais." },
    ],
  }),
  component: Relatorios,
});

const controlClass =
  "w-full rounded-lg border border-input bg-card px-3 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-ring/25";

function Relatorios() {
  const [id, setId] = useState(devolucoes[0]!.id);
  const devolucao = devolucoes.find((d) => d.id === id) ?? devolucoes[0]!;

  return (
    <AppLayout title="Relatórios" subtitle="Consulta e emissão de relatórios de devolução">
      <div className="mx-auto max-w-[1200px] space-y-6">
        <Panel title="Parâmetros do relatório" description="Selecione a devolução para visualizar">
          <div className="grid gap-4 md:grid-cols-4">
            <Field label="Requisição" className="md:col-span-2">
              <select className={controlClass} value={id} onChange={(e) => setId(e.target.value)}>
                {devolucoes.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.requisicao} — {formatarData(d.data)}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Período (opcional)">
              <input type="date" className={controlClass} />
            </Field>
            <div className="flex items-end gap-2">
              <button
                type="button"
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-dark"
              >
                <FileDown className="h-4 w-4" /> Gerar
              </button>
              <button
                type="button"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
              >
                <Printer className="h-4 w-4" /> Imprimir
              </button>
            </div>
          </div>
        </Panel>

        <Panel title="Pré-visualização" description="Exemplo do documento que será emitido">
          <div className="mx-auto max-w-3xl rounded-lg border border-border bg-card p-10">
            <div className="border-b border-border pb-5 text-center">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Relatório de devolução de materiais
              </p>
              <h3 className="mt-2 text-xl font-bold text-foreground">{devolucao.requisicao}</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Data: {formatarData(devolucao.data)} • Responsável: {devolucao.usuario} • Status:{" "}
                {statusLabels[devolucao.status]}
              </p>
            </div>

            <table className="mt-6 w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="py-2 font-semibold">Código</th>
                  <th className="py-2 font-semibold">Descrição</th>
                  <th className="py-2 font-semibold">Quantidade</th>
                  <th className="py-2 font-semibold">Lote</th>
                </tr>
              </thead>
              <tbody>
                {devolucao.itens.map((item, i) => (
                  <tr key={i} className="border-b border-border/70 last:border-0">
                    <td className="py-2.5 font-semibold text-foreground">{item.codigo}</td>
                    <td className="py-2.5 text-muted-foreground">{item.descricao}</td>
                    <td className="py-2.5 tabular-nums">{item.quantidade}</td>
                    <td className="py-2.5">{item.lote}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="mt-20 grid grid-cols-2 gap-10 text-center text-xs text-muted-foreground">
              <div>
                <div className="border-t border-foreground/40 pt-2">Assinatura Apontador</div>
              </div>
              <div>
                <div className="border-t border-foreground/40 pt-2">Assinatura Almoxarifado</div>
              </div>
            </div>
          </div>
        </Panel>
      </div>
    </AppLayout>
  );
}
