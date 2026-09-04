import { totalItem, type Devolucao } from "@/lib/mock-data";

/**
 * CSV para importação no ARECO: apenas Codigo;Quantidade.
 * Itens com o mesmo código são consolidados (somatório das quantidades totais)
 * SOMENTE aqui — a lista da devolução mantém os registros separados por lote.
 */
export function montarCsvAreco(devolucao: Devolucao) {
  const consolidado = new Map<string, number>();
  for (const item of devolucao.itens) {
    const codigo = item.materialCodigo;
    consolidado.set(codigo, (consolidado.get(codigo) ?? 0) + totalItem(item));
  }
  const linhas = ["Codigo;Quantidade", ...[...consolidado].map(([codigo, qtd]) => `${codigo};${qtd}`)];
  return `${linhas.join("\r\n")}\r\n`;
}

export function baixarCsv(nomeArquivo: string, conteudo: string) {
  if (typeof window === "undefined") return;
  const blob = new Blob([`\uFEFF${conteudo}`], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = nomeArquivo;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
