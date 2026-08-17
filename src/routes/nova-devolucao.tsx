import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  FileSpreadsheet,
  FileText,
  Hash,
  Plus,
  Search,
  Sparkles,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { AppLayout } from "@/components/layout/AppLayout";
import { Panel, Field } from "@/components/ui-kit/PageSection";
import { StatusBadge } from "@/components/ui-kit/StatusBadge";
import { ItensDevolucaoTable } from "@/components/devolucoes/ItensDevolucaoTable";
import { VolumesEditor, somaVolumes, type VolumeRascunho } from "@/components/devolucoes/VolumesEditor";
import { baixarCsv, montarCsvAreco } from "@/lib/csv";
import {
  buscarMaterial,
  formatarDataHora,
  totalDevolucao,
  type ItemDevolucao,
} from "@/lib/mock-data";
import {
  adicionarItem,
  atualizarItem,
  criarDevolucao,
  podeEditar,
  registrarCsvGerado,
  removerItem,
  useDevolucao,
  useDevolucoes,
  vincularRm,
} from "@/lib/devolucoes-store";

export const Route = createFileRoute("/nova-devolucao")({
  validateSearch: (search: Record<string, unknown>) => ({
    id: typeof search.id === "string" ? search.id : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Nova devolução | Sistema de Devoluções" },
      {
        name: "description",
        content: "Monte a devolução por volumes, gere o CSV para o ARECO e vincule o número da RM.",
      },
      { property: "og:title", content: "Nova devolução | Sistema de Devoluções" },
      {
        property: "og:description",
        content: "Monte a devolução por volumes, gere o CSV para o ARECO e vincule o número da RM.",
      },
    ],
  }),
  component: NovaDevolucao,
});

const inputClass =
  "w-full rounded-lg border border-input bg-card px-3 py-2 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-ring/25";

const btnPrimary =
  "inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-soft transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-50";
const btnGhost =
  "inline-flex items-center justify-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:border-primary/40 hover:bg-primary-soft hover:text-primary-dark disabled:cursor-not-allowed disabled:opacity-50";

function NovaDevolucao() {
  const { id } = Route.useSearch();
  const navigate = Route.useNavigate();
  const devolucoes = useDevolucoes();
  const devolucao = useDevolucao(id);

  const emAberto = devolucoes.filter((d) => d.status !== "finalizada");

  async function iniciar() {
    const nova = await criarDevolucao();
    toast.success(`Devolução ${nova.identificador} iniciada`);
    void navigate({ to: "/nova-devolucao", search: { id: nova.id } });
  }

  if (!devolucao) {
    return (
      <AppLayout title="Nova devolução" subtitle="Inicie uma devolução para gerar o identificador interno">
        <div className="mx-auto max-w-[1400px] space-y-6">
          <Panel title="Iniciar devolução" description="O identificador interno só é criado após esta ação">
            <div className="flex flex-col items-start gap-4">
              <p className="max-w-2xl text-sm text-muted-foreground">
                Ao iniciar, o sistema cria um identificador interno no padrão <strong>DEV-AAAA-NNNNN</strong>. Em
                seguida você adiciona os materiais e volumes, gera o CSV para o ARECO e, depois, vincula o número da
                RM devolvido pelo sistema.
              </p>
              <button type="button" className={btnPrimary} onClick={() => void iniciar()}>
                <Sparkles className="h-4 w-4" /> Iniciar nova devolução
              </button>
            </div>
          </Panel>

          {emAberto.length > 0 && (
            <Panel title="Devoluções em aberto" description="Retome uma devolução que ainda não foi finalizada">
              <ul className="divide-y divide-border">
                {emAberto.map((d) => (
                  <li key={d.id} className="flex flex-wrap items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-foreground">{d.identificador}</span>
                      <StatusBadge status={d.status} />
                      <span className="text-xs text-muted-foreground">
                        {d.itens.length} item(ns) · {totalDevolucao(d)} un.
                      </span>
                    </div>
                    <Link
                      to="/nova-devolucao"
                      search={{ id: d.id }}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary-dark hover:underline"
                    >
                      Retomar <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </li>
                ))}
              </ul>
            </Panel>
          )}
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout title={devolucao.identificador} subtitle="Montagem da devolução, exportação para o ARECO e vínculo da RM">
      <EditorDevolucao key={devolucao.id} devolucaoId={devolucao.id} />
    </AppLayout>
  );
}

function EditorDevolucao({ devolucaoId }: { devolucaoId: string }) {
  const devolucao = useDevolucao(devolucaoId);
  const navigate = Route.useNavigate();

  const [codigo, setCodigo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [lote, setLote] = useState("");
  const [volumes, setVolumes] = useState<VolumeRascunho[]>([{ numero: 1, quantidade: "" }]);
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [erros, setErros] = useState<{ codigo?: string; lote?: string; volumes?: string }>({});
  const [rmInput, setRmInput] = useState("");

  useEffect(() => {
    const material = buscarMaterial(codigo);
    setDescricao(material?.descricao ?? "");
  }, [codigo]);

  const editavel = devolucao ? podeEditar(devolucao) : false;
  const total = useMemo(() => (devolucao ? totalDevolucao(devolucao) : 0), [devolucao]);

  if (!devolucao) return null;

  function limpar() {
    setCodigo("");
    setLote("");
    setVolumes([{ numero: 1, quantidade: "" }]);
    setEditandoId(null);
    setErros({});
  }

  function carregarItem(item: ItemDevolucao) {
    setEditandoId(item.id);
    setCodigo(item.materialCodigo);
    setLote(item.lote);
    setVolumes(item.volumes.map((v) => ({ numero: v.numero, quantidade: String(v.quantidade) })));
    setErros({});
  }

  async function salvarItem() {
    const proximosErros: typeof erros = {};
    if (!codigo.trim()) proximosErros.codigo = "Informe o código do material.";
    else if (!buscarMaterial(codigo)) proximosErros.codigo = "Código não encontrado no catálogo.";
    if (!lote.trim()) proximosErros.lote = "Informe o lote.";
    if (somaVolumes(volumes) <= 0) proximosErros.volumes = "Informe ao menos um volume com quantidade maior que zero.";
    setErros(proximosErros);
    if (Object.keys(proximosErros).length > 0) return;

    const dados = {
      materialCodigo: codigo.trim(),
      lote: lote.trim(),
      volumes: volumes
        .map((v) => ({ numero: v.numero, quantidade: Number(v.quantidade) }))
        .filter((v) => Number.isFinite(v.quantidade) && v.quantidade > 0),
    };

    if (editandoId) {
      await atualizarItem(devolucaoId, editandoId, dados);
      toast.success("Item atualizado");
    } else {
      await adicionarItem(devolucaoId, dados);
      toast.success("Item adicionado");
    }
    limpar();
  }

  async function gerarCsv() {
    if (devolucao!.itens.length === 0) {
      toast.error("Adicione ao menos um item antes de gerar o CSV.");
      return;
    }
    baixarCsv(`${devolucao!.identificador}.csv`, montarCsvAreco(devolucao!));
    await registrarCsvGerado(devolucaoId);
    toast.success("CSV gerado para importação no ARECO");
  }

  async function salvarRm() {
    const valor = rmInput.trim();
    if (!valor) {
      toast.error("Informe o número da RM gerado pelo ARECO.");
      return;
    }
    await vincularRm(devolucaoId, valor);
    setRmInput("");
    toast.success(`RM ${valor} vinculada à devolução`);
  }

  return (
    <div className="mx-auto max-w-[1400px] space-y-6">
      {/* Cabeçalho da devolução */}
      <Panel bodyClassName="p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-lg font-bold text-foreground">{devolucao.identificador}</span>
              <StatusBadge status={devolucao.status} />
              {devolucao.csvDesatualizado && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-warning/40 bg-warning/15 px-2.5 py-1 text-[11px] font-semibold text-warning-foreground">
                  <AlertTriangle className="h-3.5 w-3.5" /> CSV desatualizado
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Criada por {devolucao.criadoPor} em {formatarDataHora(devolucao.criadoEm)}
              {devolucao.alteradoEm && ` · última alteração em ${formatarDataHora(devolucao.alteradoEm)}`}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-6 text-sm">
            <div>
              <p className="text-[11px] uppercase tracking-wide text-muted-foreground">RM</p>
              <p className="font-semibold text-foreground">{devolucao.rm ?? "Pendente"}</p>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Itens</p>
              <p className="font-semibold tabular-nums text-foreground">{devolucao.itens.length}</p>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Qtd. total</p>
              <p className="font-semibold tabular-nums text-foreground">{total}</p>
            </div>
          </div>
        </div>
      </Panel>

      {!editavel && (
        <div className="flex items-center gap-2 rounded-xl border border-primary/30 bg-primary-soft px-4 py-3 text-sm text-primary-dark">
          <CheckCircle2 className="h-4 w-4" /> Devolução finalizada — os dados estão bloqueados para edição.
        </div>
      )}

      {editavel && (
        <Panel
          title={editandoId ? "Editar item" : "Adicionar item"}
          description="A descrição é preenchida automaticamente a partir do código do material"
        >
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-4">
              <Field label="Código do material" error={erros.codigo}>
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    className={`${inputClass} pl-9`}
                    placeholder="Ex.: 123456"
                    value={codigo}
                    onChange={(e) => setCodigo(e.target.value)}
                  />
                </div>
              </Field>
              <Field label="Descrição" hint="Preenchida automaticamente">
                <input className={`${inputClass} bg-muted/60`} value={descricao} readOnly placeholder="—" />
              </Field>
              <Field label="Lote" error={erros.lote} hint="Alterar apenas o lote não invalida o CSV já gerado">
                <input
                  className={inputClass}
                  placeholder="Ex.: 094691"
                  value={lote}
                  onChange={(e) => setLote(e.target.value)}
                />
              </Field>
            </div>

            <div className="rounded-xl border border-border bg-muted/30 p-4">
              <VolumesEditor volumes={volumes} onChange={setVolumes} erro={erros.volumes} />
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3 border-t border-border pt-5">
            <button type="button" className={btnPrimary} onClick={() => void salvarItem()}>
              <Plus className="h-4 w-4" /> {editandoId ? "Salvar alterações" : "Adicionar item"}
            </button>
            {editandoId && (
              <button type="button" className={btnGhost} onClick={limpar}>
                <X className="h-4 w-4" /> Cancelar edição
              </button>
            )}
          </div>
        </Panel>
      )}

      <Panel title="Itens da devolução" description="Quantidade total calculada pela soma dos volumes" bodyClassName="p-0">
        <ItensDevolucaoTable
          itens={devolucao.itens}
          readOnly={!editavel}
          onEdit={carregarItem}
          onRemove={(item) => {
            void removerItem(devolucaoId, item.id);
            if (editandoId === item.id) limpar();
            toast.success("Item removido");
          }}
        />
      </Panel>

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Exportação para o ARECO" description="Arquivo CSV com Código e Quantidade total">
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              O CSV contém apenas <strong>Codigo;Quantidade</strong>. Lote e volumes permanecem somente no sistema.
            </p>
            <div className="rounded-lg border border-border bg-muted/40 px-4 py-3 text-xs text-muted-foreground">
              Último CSV: <strong className="text-foreground">{formatarDataHora(devolucao.csvGeradoEm)}</strong>
              {devolucao.csvDesatualizado && (
                <span className="ml-2 font-semibold text-warning-foreground">· dados alterados desde a geração</span>
              )}
            </div>
            <button type="button" className={btnPrimary} onClick={() => void gerarCsv()} disabled={!editavel}>
              <FileSpreadsheet className="h-4 w-4" />
              {devolucao.csvGeradoEm ? "Gerar CSV novamente" : "Gerar CSV para o ARECO"}
            </button>
          </div>
        </Panel>

        <Panel title="Número da RM" description="Informe a RM gerada pelo ARECO após a importação do CSV">
          <div className="space-y-4">
            {devolucao.rm ? (
              <div className="rounded-lg border border-primary/30 bg-primary-soft px-4 py-3">
                <p className="text-xs uppercase tracking-wide text-primary-dark">RM vinculada</p>
                <p className="text-lg font-bold text-primary-dark">{devolucao.rm}</p>
                <p className="text-xs text-primary-dark/80">
                  {devolucao.rmVinculadaPor} · {formatarDataHora(devolucao.rmVinculadaEm)}
                </p>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                O relatório final só fica disponível depois que a RM for vinculada.
              </p>
            )}

            {editavel && (
              <div className="flex flex-wrap items-end gap-3">
                <Field label={devolucao.rm ? "Corrigir RM" : "Número da RM"} className="min-w-[200px] flex-1">
                  <input
                    className={inputClass}
                    placeholder="Ex.: 109758"
                    value={rmInput}
                    onChange={(e) => setRmInput(e.target.value)}
                  />
                </Field>
                <button type="button" className={btnGhost} onClick={() => void salvarRm()}>
                  <Hash className="h-4 w-4" /> Vincular RM
                </button>
              </div>
            )}

            <button
              type="button"
              className={btnPrimary}
              disabled={!devolucao.rm}
              onClick={() => void navigate({ to: "/relatorios", search: { id: devolucao.id } })}
            >
              <FileText className="h-4 w-4" /> Ir para o relatório final
            </button>
          </div>
        </Panel>
      </div>
    </div>
  );
}
