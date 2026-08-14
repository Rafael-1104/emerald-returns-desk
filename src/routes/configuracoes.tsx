import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/layout/AppLayout";
import { Panel, Field } from "@/components/ui-kit/PageSection";

export const Route = createFileRoute("/configuracoes")({
  head: () => ({
    meta: [
      { title: "Configurações | Sistema de Devoluções" },
      { name: "description", content: "Preferências gerais do sistema de controle de devoluções." },
      { property: "og:title", content: "Configurações | Sistema de Devoluções" },
      { property: "og:description", content: "Preferências gerais do sistema de controle de devoluções." },
    ],
  }),
  component: Configuracoes,
});

const controlClass =
  "w-full rounded-lg border border-input bg-card px-3 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-ring/25";

function Configuracoes() {
  return (
    <AppLayout title="Configurações" subtitle="Preferências gerais do sistema">
      <div className="mx-auto max-w-[900px] space-y-6">
        <Panel title="Identificação da empresa" description="Dados exibidos nos relatórios">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Nome da empresa">
              <input className={controlClass} defaultValue="Indústria Modelo Ltda." />
            </Field>
            <Field label="Unidade / Obra">
              <input className={controlClass} defaultValue="Unidade Central" />
            </Field>
            <Field label="Prefixo das requisições">
              <input className={controlClass} defaultValue="REQ-" />
            </Field>
            <Field label="Almoxarifado padrão">
              <select className={controlClass} defaultValue="central">
                <option value="central">Almoxarifado Central</option>
                <option value="obra">Almoxarifado de Obra</option>
              </select>
            </Field>
          </div>
        </Panel>

        <Panel title="Regras de devolução" description="Comportamento padrão dos lançamentos">
          <div className="space-y-4">
            {[
              { titulo: "Exigir lote em todos os itens", desc: "Bloqueia o lançamento sem informação de lote." },
              { titulo: "Conferência obrigatória", desc: "Devoluções ficam em andamento até conferência." },
              { titulo: "Notificar almoxarifado", desc: "Envia aviso ao finalizar uma devolução." },
            ].map((r) => (
              <label
                key={r.titulo}
                className="flex items-center justify-between gap-4 rounded-lg border border-border px-4 py-3"
              >
                <span>
                  <span className="block text-sm font-semibold text-foreground">{r.titulo}</span>
                  <span className="block text-xs text-muted-foreground">{r.desc}</span>
                </span>
                <input type="checkbox" defaultChecked className="h-4 w-4 accent-[var(--primary)]" />
              </label>
            ))}
          </div>
        </Panel>

        <div className="flex justify-end">
          <button
            type="button"
            className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-dark"
          >
            Salvar alterações
          </button>
        </div>
      </div>
    </AppLayout>
  );
}
