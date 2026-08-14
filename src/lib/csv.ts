import { totalItem, type Devolucao } from "@/lib/mock-data";

/** CSV para importação no ARECO: apenas Codigo;Quantidade (quantidade total). */
export function montarCsvAreco(devolucao: Devolucao) {
  const linhas = ["Codigo;Quantidade", ...devolucao.itens.map((i) => `${i.materialCodigo};${totalItem(i)}`)];
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
