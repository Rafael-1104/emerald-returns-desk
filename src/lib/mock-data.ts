export type DevolucaoStatus = "em_andamento" | "finalizada" | "pendente" | "cancelada";

export interface DevolucaoItem {
  codigo: string;
  descricao: string;
  quantidade: number;
  lote: string;
}

export interface Devolucao {
  id: string;
  requisicao: string;
  data: string;
  usuario: string;
  itens: DevolucaoItem[];
  status: DevolucaoStatus;
}

export const statusLabels: Record<DevolucaoStatus, string> = {
  em_andamento: "Em andamento",
  finalizada: "Finalizada",
  pendente: "Pendente",
  cancelada: "Cancelada",
};

/** Catálogo mockado de materiais (futuramente virá do banco). */
export const materiais: { codigo: string; descricao: string }[] = [
  { codigo: "MAT-1001", descricao: "Cabo flexível 2,5mm² preto - rolo 100m" },
  { codigo: "MAT-1002", descricao: "Disjuntor tripolar 63A curva C" },
  { codigo: "MAT-1003", descricao: "Luva de raspa de couro - par" },
  { codigo: "MAT-1004", descricao: "Parafuso sextavado M10 x 40mm" },
  { codigo: "MAT-1005", descricao: "Fita isolante 19mm x 20m" },
  { codigo: "MAT-1006", descricao: "Eletroduto galvanizado 3/4\" - barra 3m" },
  { codigo: "MAT-1007", descricao: "Capacete de segurança classe B branco" },
  { codigo: "MAT-1008", descricao: "Graxa industrial multiuso 1kg" },
];

export function buscarMaterial(codigo: string) {
  const alvo = codigo.trim().toUpperCase();
  return materiais.find((m) => m.codigo.toUpperCase() === alvo) ?? null;
}

export const usuarios = [
  { id: "1", nome: "João Silva", cargo: "Apontador", email: "joao.silva@empresa.com", ativo: true },
  { id: "2", nome: "Maria Souza", cargo: "Almoxarifado", email: "maria.souza@empresa.com", ativo: true },
  { id: "3", nome: "Carlos Pereira", cargo: "Apontador", email: "carlos.pereira@empresa.com", ativo: true },
  { id: "4", nome: "Ana Lima", cargo: "Supervisora", email: "ana.lima@empresa.com", ativo: false },
  { id: "5", nome: "Rafael Gomes", cargo: "Almoxarifado", email: "rafael.gomes@empresa.com", ativo: true },
];

export const usuarioAtual = { nome: "João Silva", cargo: "Apontador", iniciais: "JS" };

export const devolucoes: Devolucao[] = [
  {
    id: "d1",
    requisicao: "REQ-2026-0148",
    data: "2026-08-14",
    usuario: "João Silva",
    status: "em_andamento",
    itens: [
      { codigo: "MAT-1001", descricao: materiais[0]!.descricao, quantidade: 2, lote: "L-4471" },
      { codigo: "MAT-1005", descricao: materiais[4]!.descricao, quantidade: 12, lote: "L-2210" },
    ],
  },
  {
    id: "d2",
    requisicao: "REQ-2026-0147",
    data: "2026-08-14",
    usuario: "Carlos Pereira",
    status: "finalizada",
    itens: [{ codigo: "MAT-1003", descricao: materiais[2]!.descricao, quantidade: 8, lote: "L-9932" }],
  },
  {
    id: "d3",
    requisicao: "REQ-2026-0146",
    data: "2026-08-13",
    usuario: "Maria Souza",
    status: "finalizada",
    itens: [
      { codigo: "MAT-1002", descricao: materiais[1]!.descricao, quantidade: 3, lote: "L-1180" },
      { codigo: "MAT-1004", descricao: materiais[3]!.descricao, quantidade: 60, lote: "L-7734" },
      { codigo: "MAT-1006", descricao: materiais[5]!.descricao, quantidade: 5, lote: "L-3320" },
    ],
  },
  {
    id: "d4",
    requisicao: "REQ-2026-0145",
    data: "2026-08-12",
    usuario: "Rafael Gomes",
    status: "pendente",
    itens: [{ codigo: "MAT-1007", descricao: materiais[6]!.descricao, quantidade: 4, lote: "L-5512" }],
  },
  {
    id: "d5",
    requisicao: "REQ-2026-0144",
    data: "2026-08-11",
    usuario: "João Silva",
    status: "cancelada",
    itens: [{ codigo: "MAT-1008", descricao: materiais[7]!.descricao, quantidade: 1, lote: "L-6091" }],
  },
  {
    id: "d6",
    requisicao: "REQ-2026-0143",
    data: "2026-08-10",
    usuario: "Ana Lima",
    status: "finalizada",
    itens: [
      { codigo: "MAT-1005", descricao: materiais[4]!.descricao, quantidade: 20, lote: "L-2211" },
      { codigo: "MAT-1001", descricao: materiais[0]!.descricao, quantidade: 1, lote: "L-4472" },
    ],
  },
];

export const totalItens = (d: Devolucao) => d.itens.reduce((acc, i) => acc + i.quantidade, 0);

export const formatarData = (iso: string) =>
  new Date(`${iso}T12:00:00`).toLocaleDateString("pt-BR");

export const indicadores = {
  hoje: 2,
  mes: 18,
  andamento: 4,
  finalizadas: 12,
};
