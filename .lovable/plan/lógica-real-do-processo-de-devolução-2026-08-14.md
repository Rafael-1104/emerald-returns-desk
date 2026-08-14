# Lógica real do processo de devolução

Mantém o layout, cores, sidebar e header atuais. Todas as mudanças são de dados, telas de fluxo e componentes internos.

## Modelo de dados (mockado, pronto para Cloud)

Reescrever `src/lib/mock-data.ts` como camada de domínio espelhando as tabelas futuras (`usuarios`, `materiais`, `devolucoes`, `itens_devolucao`, `volumes_item`):

- `Devolucao`: `id`, `identificador` (DEV-2026-00001), `rm` (null até vincular), `status`, `itens[]`, e trilha de rastreabilidade (criado por/em, alterado por/em, CSV gerado em, RM vinculada por/em, finalizada por/em).
- `ItemDevolucao`: `materialCodigo`, `descricao` (derivada do catálogo), `lote`, `volumes[]`, `quantidadeTotal` calculada.
- `VolumeItem`: `numero`, `quantidade`.
- Status: `em_montagem`, `csv_gerado`, `rm_vinculada`, `finalizada`.

Acesso via um "repositório" (`src/lib/devolucoes-store.ts`) com funções assíncronas (criar, listar, obter, adicionar/editar/remover item, marcar CSV gerado, vincular RM, finalizar). Estado em memória + persistência em `localStorage`, para que a troca por Cloud seja apenas a implementação interna dessas funções.

## Nova devolução

- A tela não cria nada sozinha: a devolução só é criada quando o usuário clica explicitamente em "Iniciar nova devolução", e só então o identificador interno (DEV-AAAA-NNNNN) é gerado. Devoluções "em montagem" podem ser retomadas pelo histórico. Sem campo de RM aqui.
- Formulário do item: código (busca no catálogo, descrição somente leitura, erro se não existir), lote, e lista dinâmica de volumes (adicionar, remover, editar quantidade). Total calculado automaticamente e exibido, nunca digitado.
- Mesmo código pode repetir com lotes diferentes; nada é agrupado.
- Lista de itens: Código, Descrição, Lote, Volumes (V1: 20, V2: 50...), Total, Ações (Editar / Remover com confirmação).
- Botão "Gerar CSV para ARECO": baixa `Codigo;Quantidade` com o total por item, muda status para "CSV gerado" e registra a data. Não finaliza a devolução.
- CSV desatualizado: apenas alterações que afetam o conteúdo do arquivo (código do material, adição/remoção de volume, alteração de quantidade de volume, remoção/adição de item) invalidam o CSV. Alteração somente de lote não invalida. Quando invalidado, banner "Os dados da devolução foram alterados após a geração do CSV. Gere um novo CSV...". Ao gerar novo CSV, o estado de desatualizado é removido e a nova data de geração é registrada.
- Área "Número da Requisição de Materiais" (visível após CSV gerado): input + botão "Vincular RM", que grava a RM permanentemente e passa o status para "RM vinculada".
- Com RM vinculada: botão "Gerar relatório final" abre a prévia do relatório — não finaliza. A devolução continua editável até o usuário conferir e clicar em "Finalizar devolução", que então grava status "finalizada", data e usuário.

## Devoluções (histórico)

Colunas: Identificador interno, RM (número ou badge "RM pendente"), Data, Usuário, Qtd. de itens, Quantidade total, Status, Ações (abrir/editar, gerar CSV, relatório quando disponível). Filtros existentes adaptados aos novos status. `StatusBadge` recebe os quatro novos estados usando os tokens de cor já existentes.

## Relatórios

Pré-visualização impressa apenas de devoluções com RM: cabeçalho "REQUISIÇÃO DE MATERIAIS: 109758", data, usuário, tabela Código | Descrição | Quantidade | Lote, e as duas assinaturas. Botão Imprimir usa `window.print()` com estilos de impressão. Devoluções sem RM não ficam disponíveis para relatório final.

## Detalhes técnicos

- Utilitários em `src/lib/csv.ts` (montagem e download do CSV) e `src/lib/devolucoes-store.ts`.
- Componentes novos: `VolumesEditor`, `ItensDevolucaoTable`, diálogo de confirmação de remoção (usa `alert-dialog` já presente), banner de CSV desatualizado.
- `DevolucoesTable` e `StatusBadge` atualizados apenas em conteúdo/colunas, mantendo as classes atuais.
- Usuário atual continua mockado (`usuarioAtual`) e é gravado nos campos de rastreabilidade.
- Nenhuma integração com backend nesta etapa.
