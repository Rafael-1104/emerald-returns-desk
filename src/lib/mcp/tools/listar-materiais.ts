import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { materiais } from "@/lib/mock-data";

export default defineTool({
  name: "listar_materiais",
  title: "Listar materiais",
  description:
    "Lista o catálogo de materiais do Sistema de Devoluções, com filtro opcional por texto (código ou descrição).",
  inputSchema: {
    busca: z.string().trim().optional().describe("Texto para filtrar por código ou descrição."),
  },
  outputSchema: {
    total: z.number(),
    materiais: z.array(z.object({ codigo: z.string(), descricao: z.string() })),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ busca }) => {
    const termo = busca?.toLowerCase() ?? "";
    const itens = termo
      ? materiais.filter(
          (m) => m.codigo.toLowerCase().includes(termo) || m.descricao.toLowerCase().includes(termo),
        )
      : materiais;

    return {
      content: [{ type: "text", text: JSON.stringify(itens, null, 2) }],
      structuredContent: { total: itens.length, materiais: itens },
    };
  },
});
