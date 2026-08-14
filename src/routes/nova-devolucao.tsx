import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Plus, Trash2, Check, X, Search } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Panel, Field } from "@/components/ui-kit/PageSection";
import { buscarMaterial, type DevolucaoItem } from "@/lib/mock-data";

export const Route = createFileRoute("/nova-devolucao")({
  head: () => ({
    meta: [
      { title: "Nova devolução | Sistema de Devoluções" },
      { name: "description", content: "Cadastre uma nova devolução de materiais e seus itens." },
      { property: "og:title", content: "Nova devolução | Sistema de Devoluções" },
      { property: "og:description", content: "Cadastre uma nova devolução de materiais e seus itens." },
    ],
  }),
  component: NovaDevolucao,
});

const inputClass =
  "w-full rounded-lg border border-input bg-card px-3 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-ring/25";

function NovaDevolucao() {
  const [requisicao, setRequisicao] = useState("");
  const [codigo, setCodigo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [lote, setLote] = useState("");
  const [itens, setItens] = useState<DevolucaoItem[]>([]);
  const [erros, setErros] = useState<Record<string, string>>({});
  const [aviso, setAviso] = useState<string | null>(null);

  function onCodigoChange(valor: string) {
    setCodigo(valor);
    const material = buscarMaterial(valor);
    setDescricao(material ? material.descricao : "");
  }

  function adicionarItem(e: FormEvent) {
    e.preventDefault();
    const novos: Record<string, string> = {};
    if (!requisicao.trim()) novos.requisicao = "Informe o número da requisição.";
    if (!codigo.trim()) novos.codigo = "Informe o código do material.";
    else if (!buscarMaterial(codigo)) novos.codigo = "Material não encontrado no catálogo.";
    const qtd = Number(quantidade);
    if (!quantidade.trim() || Number.isNaN(qtd) || qtd <= 0)
      novos.quantidade = "Quantidade deve ser maior que zero.";
    if (!lote.trim()) novos.lote = "Informe o lote.";

    setErros(novos);
    if (Object.keys(novos).length > 0) return;

    setItens((prev) => [...prev, { codigo: codigo.trim().toUpperCase(), descricao, quantidade: qtd, lote: lote.trim() }]);
    setCodigo("");
    setDescricao("");
    setQuantidade("");
    setLote("");
    setAviso(null);
  }

  function remover(index: number) {
    setItens((prev) => prev.filter((_, i) => i !== index));
  }

  function finalizar() {
    if (!requisicao.trim()) return setAviso("Informe o número da requisição.");
    if (itens.length === 0) return setAviso("Adicione ao menos um item à devolução.");
    setAviso(`Devolução ${requisicao} registrada com ${itens.length} item(ns). (demonstração)`);
    setItens([]);
    setRequisicao("");
  }

  function cancelar() {
    setRequisicao("");
    setCodigo("");
    setDescricao("");
    setQuantidade("");
    setLote("");
    setItens([]);
    setErros({});
    setAviso(null);
  }

  return (
    <AppLayout title="Nova devolução" subtitle="Registro de devolução de materiais ao almoxarifado">
      <div className="mx-auto max-w-[1200px] space-y-6">
        <Panel title="Dados da devolução" description="Informe a requisição e os itens devolvidos">
          <form onSubmit={adicionarItem} className="space-y-5">
            <div className="grid gap-4 md:grid-cols-3">
              <Field label="Número da requisição" error={erros.requisicao}>
                <input
                  className={inputClass}
                  placeholder="REQ-2026-0000"
                  value={requisicao}
                  onChange={(e) => setRequisicao(e.target.value)}
                />
              </Field>
            </div>

            <div className="rounded-xl border border-border bg-muted/40 p-5">
              <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Item do material
              </p>
              <div className="grid gap-4 md:grid-cols-12">
                <Field
                  label="Código do material"
                  className="md:col-span-3"
                  error={erros.codigo}
                  hint="Ex.: MAT-1001"
                >
                  <div className="relative">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      className={`${inputClass} pl-9`}
                      placeholder="MAT-0000"
                      value={codigo}
                      onChange={(e) => onCodigoChange(e.target.value)}
                    />
                  </div>
                </Field>
                <Field label="Descrição do material" className="md:col-span-5">
                  <input
                    readOnly
                    className={`${inputClass} bg-muted text-muted-foreground`}
                    placeholder="Preenchido automaticamente"
                    value={descricao}
                  />
                </Field>
                <Field label="Quantidade" className="md:col-span-2" error={erros.quantidade}>
                  <input
                    type="number"
                    min={1}
                    className={inputClass}
                    placeholder="0"
                    value={quantidade}
                    onChange={(e) => setQuantidade(e.target.value)}
                  />
                </Field>
                <Field label="Lote" className="md:col-span-2" error={erros.lote}>
                  <input
                    className={inputClass}
                    placeholder="L-0000"
                    value={lote}
                    onChange={(e) => setLote(e.target.value)}
                  />
                </Field>
              </div>

              <button
                type="submit"
                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-dark"
              >
                <Plus className="h-4 w-4" /> Adicionar item
              </button>
            </div>
          </form>
        </Panel>

        <Panel title="Itens adicionados" description={`${itens.length} item(ns) nesta devolução`} bodyClassName="p-0">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="px-6 py-3 font-semibold">Código</th>
                  <th className="px-6 py-3 font-semibold">Descrição</th>
                  <th className="px-6 py-3 font-semibold">Quantidade</th>
                  <th className="px-6 py-3 font-semibold">Lote</th>
                  <th className="px-6 py-3 text-right font-semibold">Ações</th>
                </tr>
              </thead>
              <tbody>
                {itens.map((item, i) => (
                  <tr key={`${item.codigo}-${i}`} className="border-b border-border/70 last:border-0 hover:bg-muted/50">
                    <td className="px-6 py-3.5 font-semibold text-foreground">{item.codigo}</td>
                    <td className="px-6 py-3.5 text-muted-foreground">{item.descricao}</td>
                    <td className="px-6 py-3.5 tabular-nums text-foreground">{item.quantidade}</td>
                    <td className="px-6 py-3.5 text-foreground">{item.lote}</td>
                    <td className="px-6 py-3.5">
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={() => remover(i)}
                          title="Remover item"
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-destructive/40 hover:bg-destructive/10 hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {itens.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-sm text-muted-foreground">
                      Nenhum item adicionado até o momento.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Panel>

        {aviso && (
          <div className="rounded-xl border border-primary/30 bg-primary-soft px-4 py-3 text-sm font-medium text-primary-dark">
            {aviso}
          </div>
        )}

        <div className="flex flex-wrap justify-end gap-3">
          <button
            type="button"
            onClick={cancelar}
            className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
          >
            <X className="h-4 w-4" /> Cancelar
          </button>
          <button
            type="button"
            onClick={finalizar}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-soft transition-colors hover:bg-primary-dark"
          >
            <Check className="h-4 w-4" /> Finalizar devolução
          </button>
        </div>
      </div>
    </AppLayout>
  );
}
