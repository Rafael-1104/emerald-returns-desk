import { defineTool, ToolError } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { buscarMaterial } from "@/lib/mock-data";

const itemSchema = z.object({
  codigo: z.string().trim().min(1).describe("Código do material."),
  volumes: z
    .array(z.number().int().nonnegative())
    .min(1)
    .describe("Quantidade de cada volume do item; o total é a soma."),
});

export default defineTool({
  name: "montar_csv_areco",
  title: "Montar CSV para o ARECO",
  description:
    "Gera o conteúdo do CSV de importação no ARECO (Codigo;Quantidade) somando os volumes de cada item.",
  inputSchema: {
    itens: z.array(itemSchema).min(1).describe("Itens da devolução com seus volumes."),
  },
  outputSchema: {
    csv: z.string(),
    linhas: z.array(
      z.object({ codigo: z.string(), quantidade: z.number(), descricao: z.string().nullable() }),
    ),
    quantidadeTotal: z.number(),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ itens }) => {
    const linhas = itens.map((item) => {
      const total = item.volumes.reduce((acc, q) => acc + q, 0);
      if (total <= 0) throw new ToolError(`O item "${item.codigo}" precisa ter quantidade total maior que zero.`);
      return { codigo: item.codigo, quantidade: total, descricao: buscarMaterial(item.codigo)?.descricao ?? null };
    });

    const csv = `${["Codigo;Quantidade", ...linhas.map((l) => `${l.codigo};${l.quantidade}`)].join("\r\n")}\r\n`;

    return {
      content: [{ type: "text", text: csv }],
      structuredContent: { csv, linhas, quantidadeTotal: linhas.reduce((a, l) => a + l.quantidade, 0) },
    };
  },
});
