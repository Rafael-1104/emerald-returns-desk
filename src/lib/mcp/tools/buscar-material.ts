import { defineTool, ToolError } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { buscarMaterial } from "@/lib/mock-data";

export default defineTool({
  name: "buscar_material",
  title: "Buscar material por código",
  description: "Retorna a descrição do material a partir do código, como na tela de Nova devolução.",
  inputSchema: { codigo: z.string().trim().min(1).describe("Código do material, ex.: 123456.") },
  outputSchema: { material: z.object({ codigo: z.string(), descricao: z.string() }) },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ codigo }) => {
    const material = buscarMaterial(codigo);
    if (!material) throw new ToolError(`Material não encontrado para o código "${codigo}".`);

    return {
      content: [{ type: "text", text: `${material.codigo} — ${material.descricao}` }],
      structuredContent: { material },
    };
  },
});
