import { useEffect, useSyncExternalStore } from "react";
import {
  descricaoMaterial,
  devolucoesSeed,
  usuarioAtual,
  type Devolucao,
  type ItemDevolucao,
  type VolumeItem,
} from "@/lib/mock-data";

/**
 * Repositório de devoluções (mock).
 * Toda a leitura/escrita passa por aqui — para migrar ao backend basta trocar
 * o corpo destas funções por chamadas ao banco, mantendo as assinaturas.
 */

const STORAGE_KEY = "sistema-devolucoes:v1";

let state: Devolucao[] = devolucoesSeed;
let carregado = false;
const listeners = new Set<() => void>();

function emit() {
  for (const l of listeners) l();
}

function persistir() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* ignora falha de storage */
  }
}

function setState(next: Devolucao[]) {
  state = next;
  persistir();
  emit();
}

export function carregar() {
  if (carregado || typeof window === "undefined") return;
  carregado = true;
  try {
    const bruto = window.localStorage.getItem(STORAGE_KEY);
    if (bruto) {
      const dados = JSON.parse(bruto) as Devolucao[];
      if (Array.isArray(dados)) {
        state = dados;
        emit();
        return;
      }
    }
  } catch {
    /* ignora dados inválidos */
  }
  persistir();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

const getSnapshot = () => state;
const getServerSnapshot = () => devolucoesSeed;

/** Hook de leitura reativa da lista completa. */
export function useDevolucoes() {
  useEffect(() => {
    carregar();
  }, []);
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function useDevolucao(id: string | undefined) {
  const lista = useDevolucoes();
  return lista.find((d) => d.id === id) ?? null;
}

/* ------------------------------------------------------------------ */
/* Helpers internos                                                    */
/* ------------------------------------------------------------------ */

const uid = () => Math.random().toString(36).slice(2, 10);
const agora = () => new Date().toISOString();

function proximoIdentificador(lista: Devolucao[]) {
  const ano = new Date().getFullYear();
  const numeros = lista
    .map((d) => Number(d.identificador.split("-")[2] ?? 0))
    .filter((n) => Number.isFinite(n));
  const proximo = (numeros.length ? Math.max(...numeros) : 0) + 1;
  return `DEV-${ano}-${String(proximo).padStart(5, "0")}`;
}

/** Atualiza uma devolução registrando rastreabilidade. `invalidaCsv` marca o CSV como desatualizado. */
function atualizar(id: string, invalidaCsv: boolean, fn: (d: Devolucao) => Devolucao) {
  setState(
    state.map((d) => {
      if (d.id !== id) return d;
      const atualizado = fn(d);
      return {
        ...atualizado,
        alteradoPor: usuarioAtual.nome,
        alteradoEm: agora(),
        csvDesatualizado: invalidaCsv && atualizado.csvGeradoEm ? true : atualizado.csvDesatualizado,
      };
    }),
  );
}

export const podeEditar = (d: Devolucao) => d.status !== "finalizada";

/* ------------------------------------------------------------------ */
/* API do repositório                                                  */
/* ------------------------------------------------------------------ */

export async function listarDevolucoes() {
  carregar();
  return state;
}

export async function criarDevolucao(): Promise<Devolucao> {
  carregar();
  const nova: Devolucao = {
    id: uid(),
    identificador: proximoIdentificador(state),
    rm: null,
    status: "em_montagem",
    itens: [],
    criadoPor: usuarioAtual.nome,
    criadoEm: agora(),
    alteradoPor: null,
    alteradoEm: null,
    csvGeradoEm: null,
    csvDesatualizado: false,
    rmVinculadaEm: null,
    rmVinculadaPor: null,
    finalizadaEm: null,
    finalizadaPor: null,
  };
  setState([nova, ...state]);
  return nova;
}

export async function adicionarItem(
  devolucaoId: string,
  dados: { materialCodigo: string; lote: string; volumes: { numero: number; quantidade: number }[] },
) {
  const item: ItemDevolucao = {
    id: uid(),
    materialCodigo: dados.materialCodigo,
    descricao: descricaoMaterial(dados.materialCodigo),
    lote: dados.lote,
    volumes: dados.volumes.map<VolumeItem>((v) => ({ id: uid(), numero: v.numero, quantidade: v.quantidade })),
  };
  // Adição de item altera o conteúdo do CSV.
  atualizar(devolucaoId, true, (d) => ({ ...d, itens: [...d.itens, item] }));
}

export async function atualizarItem(
  devolucaoId: string,
  itemId: string,
  dados: { materialCodigo: string; lote: string; volumes: { numero: number; quantidade: number }[] },
) {
  const anterior = state.find((d) => d.id === devolucaoId)?.itens.find((i) => i.id === itemId);
  const mudouCodigo = anterior ? anterior.materialCodigo !== dados.materialCodigo : true;
  const mudouVolumes = anterior
    ? anterior.volumes.length !== dados.volumes.length ||
      anterior.volumes.some((v, i) => v.quantidade !== dados.volumes[i]?.quantidade)
    : true;
  // Alteração somente de lote NÃO invalida o CSV (lote não é enviado ao ARECO).
  atualizar(devolucaoId, mudouCodigo || mudouVolumes, (d) => ({
    ...d,
    itens: d.itens.map((i) =>
      i.id === itemId
        ? {
            ...i,
            materialCodigo: dados.materialCodigo,
            descricao: descricaoMaterial(dados.materialCodigo),
            lote: dados.lote,
            volumes: dados.volumes.map<VolumeItem>((v) => ({ id: uid(), numero: v.numero, quantidade: v.quantidade })),
          }
        : i,
    ),
  }));
}

export async function removerItem(devolucaoId: string, itemId: string) {
  atualizar(devolucaoId, true, (d) => ({ ...d, itens: d.itens.filter((i) => i.id !== itemId) }));
}

export async function registrarCsvGerado(devolucaoId: string) {
  atualizar(devolucaoId, false, (d) => ({
    ...d,
    csvGeradoEm: agora(),
    csvDesatualizado: false,
    status: d.status === "em_montagem" ? "csv_gerado" : d.status,
  }));
}

export async function vincularRm(devolucaoId: string, rm: string) {
  atualizar(devolucaoId, false, (d) => ({
    ...d,
    rm,
    status: d.status === "finalizada" ? d.status : "rm_vinculada",
    rmVinculadaEm: agora(),
    rmVinculadaPor: usuarioAtual.nome,
  }));
}

export async function finalizarDevolucao(devolucaoId: string) {
  atualizar(devolucaoId, false, (d) => ({
    ...d,
    status: "finalizada",
    finalizadaEm: agora(),
    finalizadaPor: usuarioAtual.nome,
  }));
}

export async function removerDevolucao(devolucaoId: string) {
  setState(state.filter((d) => d.id !== devolucaoId));
}
