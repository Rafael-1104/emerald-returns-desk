/**
 * Camada de domínio (mockada).
 * A estrutura espelha as tabelas futuras do backend:
 * usuarios -> devolucoes -> itens_devolucao -> volumes_item
 * e materiais (catálogo consultado pelo código).
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

/** materiais */
export const materiais: { codigo: string; descricao: string }[] = [
  { codigo: "123456", descricao: "Cabo flexível 2,5mm² preto - rolo 100m" },
  { codigo: "789012", descricao: "Disjuntor tripolar 63A curva C" },
  { codigo: "456789", descricao: "Luva de raspa de couro - par" },
  { codigo: "234567", descricao: "Parafuso sextavado M10 x 40mm" },
  { codigo: "345678", descricao: "Fita isolante 19mm x 20m" },
  { codigo: "567890", descricao: 'Eletroduto galvanizado 3/4" - barra 3m' },
  { codigo: "678901", descricao: "Capacete de segurança classe B branco" },
  { codigo: "890123", descricao: "Graxa industrial multiuso 1kg" },
];

export function buscarMaterial(codigo: string) {
  const alvo = codigo.trim().toUpperCase();
  return materiais.find((m) => m.codigo.toUpperCase() === alvo) ?? null;
}

/** usuarios */
export const usuarios = [
  { id: "1", nome: "João Silva", cargo: "Apontador", email: "joao.silva@empresa.com", ativo: true },
  { id: "2", nome: "Maria Souza", cargo: "Almoxarifado", email: "maria.souza@empresa.com", ativo: true },
  { id: "3", nome: "Carlos Pereira", cargo: "Apontador", email: "carlos.pereira@empresa.com", ativo: true },
  { id: "4", nome: "Ana Lima", cargo: "Supervisora", email: "ana.lima@empresa.com", ativo: false },
  { id: "5", nome: "Rafael Gomes", cargo: "Almoxarifado", email: "rafael.gomes@empresa.com", ativo: true },
];

export const usuarioAtual = { nome: "João Silva", cargo: "Apontador", iniciais: "JS" };

/* ------------------------------------------------------------------ */
/* Helpers de cálculo e formatação                                     */
/* ------------------------------------------------------------------ */

export const totalItem = (item: ItemDevolucao) =>
  item.volumes.reduce((acc, v) => acc + (Number.isFinite(v.quantidade) ? v.quantidade : 0), 0);

export const totalDevolucao = (d: Devolucao) => d.itens.reduce((acc, i) => acc + totalItem(i), 0);

export const descricaoMaterial = (codigo: string) => buscarMaterial(codigo)?.descricao ?? "";

export const formatarData = (iso: string) => {
  const base = iso.length === 10 ? `${iso}T12:00:00` : iso;
  return new Date(base).toLocaleDateString("pt-BR");
};

export const formatarDataHora = (iso: string | null) =>
  iso
    ? new Date(iso).toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" })
    : "—";

export const dataDaDevolucao = (d: Devolucao) => formatarData(d.criadoEm);

/* ------------------------------------------------------------------ */
/* Seeds de demonstração                                               */
/* ------------------------------------------------------------------ */

const vol = (numero: number, quantidade: number): VolumeItem => ({
  id: `v-${numero}-${quantidade}-${Math.random().toString(36).slice(2, 7)}`,
  numero,
  quantidade,
});

export const devolucoesSeed: Devolucao[] = [
  {
    id: "d1",
    identificador: "DEV-2026-00003",
    rm: null,
    status: "em_montagem",
    criadoPor: "João Silva",
    criadoEm: "2026-08-14T09:12:00.000Z",
    alteradoPor: "João Silva",
    alteradoEm: "2026-08-14T10:02:00.000Z",
    csvGeradoEm: null,
    csvDesatualizado: false,
    rmVinculadaEm: null,
    rmVinculadaPor: null,
    finalizadaEm: null,
    finalizadaPor: null,
    itens: [
      {
        id: "i1",
        materialCodigo: "123456",
        descricao: materiais[0]!.descricao,
        lote: "094691",
        volumes: [vol(1, 20), vol(2, 50), vol(3, 30)],
      },
    ],
  },
  {
    id: "d2",
    identificador: "DEV-2026-00002",
    rm: null,
    status: "csv_gerado",
    criadoPor: "Carlos Pereira",
    criadoEm: "2026-08-13T13:40:00.000Z",
    alteradoPor: "Carlos Pereira",
    alteradoEm: "2026-08-13T14:05:00.000Z",
    csvGeradoEm: "2026-08-13T14:10:00.000Z",
    csvDesatualizado: false,
    rmVinculadaEm: null,
    rmVinculadaPor: null,
    finalizadaEm: null,
    finalizadaPor: null,
    itens: [
      {
        id: "i2",
        materialCodigo: "789012",
        descricao: materiais[1]!.descricao,
        lote: "102345",
        volumes: [vol(1, 30), vol(2, 20)],
      },
      {
        id: "i3",
        materialCodigo: "456789",
        descricao: materiais[2]!.descricao,
        lote: "884120",
        volumes: [vol(1, 75)],
      },
    ],
  },
  {
    id: "d3",
    identificador: "DEV-2026-00001",
    rm: "109758",
    status: "finalizada",
    criadoPor: "Maria Souza",
    criadoEm: "2026-08-11T08:20:00.000Z",
    alteradoPor: "Maria Souza",
    alteradoEm: "2026-08-11T09:00:00.000Z",
    csvGeradoEm: "2026-08-11T09:05:00.000Z",
    csvDesatualizado: false,
    rmVinculadaEm: "2026-08-11T10:15:00.000Z",
    rmVinculadaPor: "Maria Souza",
    finalizadaEm: "2026-08-11T10:30:00.000Z",
    finalizadaPor: "Maria Souza",
    itens: [
      {
        id: "i4",
        materialCodigo: "345678",
        descricao: materiais[4]!.descricao,
        lote: "551200",
        volumes: [vol(1, 100), vol(2, 100)],
      },
      {
        id: "i5",
        materialCodigo: "123456",
        descricao: materiais[0]!.descricao,
        lote: "094692",
        volumes: [vol(1, 40)],
      },
    ],
  },
];
