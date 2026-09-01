/**
 * Camada de domínio (tipos e helpers de cálculo/formatação).
 * NÃO contém dados: a única fonte oficial é o Supabase existente
 * (usuarios -> devolucoes -> itens_devolucao -> volumes_item e materiais).
 */

export type DevolucaoStatus = "em_montagem" | "csv_gerado" | "rm_vinculada" | "finalizada";

export const statusLabels: Record<DevolucaoStatus, string> = {
  em_montagem: "Em montagem",
  csv_gerado: "CSV gerado",
  rm_vinculada: "RM vinculada",
  finalizada: "Finalizada",
};

/** volumes_item */
export interface VolumeItem {
  id: string;
  numero: number;
  quantidade: number;
}

/** itens_devolucao */
export interface ItemDevolucao {
  id: string;
  materialCodigo: string;
  descricao: string;
  lote: string;
  volumes: VolumeItem[];
}

/** devolucoes */
export interface Devolucao {
  id: string;
  identificador: string;
  rm: string | null;
  status: DevolucaoStatus;
  itens: ItemDevolucao[];
  criadoPor: string;
  criadoEm: string;
  alteradoPor: string | null;
  alteradoEm: string | null;
  csvGeradoEm: string | null;
  csvDesatualizado: boolean;
  rmVinculadaEm: string | null;
  rmVinculadaPor: string | null;
  finalizadaEm: string | null;
  finalizadaPor: string | null;
}

/* ------------------------------------------------------------------ */
/* Helpers de cálculo e formatação                                     */
/* ------------------------------------------------------------------ */

export const totalItem = (item: ItemDevolucao) =>
  item.volumes.reduce((acc, v) => acc + (Number.isFinite(v.quantidade) ? v.quantidade : 0), 0);

export const totalDevolucao = (d: Devolucao) => d.itens.reduce((acc, i) => acc + totalItem(i), 0);

export const formatarData = (iso: string) => {
  const base = iso.length === 10 ? `${iso}T12:00:00` : iso;
  return new Date(base).toLocaleDateString("pt-BR");
};

export const formatarDataHora = (iso: string | null) =>
  iso
    ? new Date(iso).toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" })
    : "—";

export const dataDaDevolucao = (d: Devolucao) => formatarData(d.criadoEm);
