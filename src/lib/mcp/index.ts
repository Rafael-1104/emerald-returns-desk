import { defineMcp } from "@lovable.dev/mcp-js";
import listarMateriaisTool from "./tools/listar-materiais";
import buscarMaterialTool from "./tools/buscar-material";
import montarCsvArecoTool from "./tools/montar-csv-areco";
import explicarFluxoTool from "./tools/explicar-fluxo";

export default defineMcp({
  name: "sistema-de-devolucoes",
  title: "Sistema de Devoluções",
  version: "0.1.0",
  instructions:
    "Ferramentas do Sistema de Devoluções (controle interno de devolução de materiais). Consulte o catálogo de materiais, monte o CSV de importação do ARECO (Codigo;Quantidade) e consulte as etapas do fluxo de devolução. As devoluções em si ficam apenas no navegador de cada usuário e não são acessíveis por estas ferramentas.",
  tools: [listarMateriaisTool, buscarMaterialTool, montarCsvArecoTool, explicarFluxoTool],
});
