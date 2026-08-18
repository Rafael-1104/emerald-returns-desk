import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { statusLabels, type DevolucaoStatus } from "@/lib/mock-data";

const etapas = [
  {
    status: "em_montagem" as const,
    descricao:
      "A devolução recebe um identificador interno (DEV-AAAA-NNNNN) ao clicar em 'Iniciar nova devolução'. Itens são cadastrados com código, lote e volumes; a quantidade total é a soma dos volumes.",
  },
  {
    status: "csv_gerado" as const,
    descricao:
      "O CSV Codigo;Quantidade é gerado para importação no ARECO. Alterações de código, volumes ou quantidades marcam o CSV como desatualizado (alterar apenas o lote não invalida).",
  },
  {
    status: "rm_vinculada" as const,
    descricao: "Após a importação no ARECO, o número da RM gerada é vinculado à devolução.",
  },
  {
    status: "finalizada" as const,
    descricao:
      "Com a RM vinculada, o relatório final pode ser gerado; a devolução só é finalizada com a confirmação explícita após a prévia.",
  },
];

export default defineTool({
  name: "explicar_fluxo_devolucao",
  title: "Explicar o fluxo de devolução",
  description:
    "Descreve as etapas e os status do processo de devolução de materiais (montagem, CSV do ARECO, RM e finalização).",
  inputSchema: {
    status: z
      .enum(["em_montagem", "csv_gerado", "rm_vinculada", "finalizada"])
      .optional()
      .describe("Status específico a explicar; se omitido, retorna o fluxo completo."),
  },
  outputSchema: {
    etapas: z.array(z.object({ status: z.string(), rotulo: z.string(), descricao: z.string() })),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ status }) => {
    const selecionadas = status ? etapas.filter((e) => e.status === status) : etapas;
    const detalhado = selecionadas.map((e) => ({
      status: e.status,
      rotulo: statusLabels[e.status as DevolucaoStatus],
      descricao: e.descricao,
    }));

    return {
      content: [
        { type: "text", text: detalhado.map((e) => `${e.rotulo}: ${e.descricao}`).join("\n\n") },
      ],
      structuredContent: { etapas: detalhado },
    };
  },
});
