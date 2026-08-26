# Green Returns Hub

Crie um sistema web desktop chamado "Sistema de Devoluções", destinado ao controle interno de devolução de materiais.

IMPORTANTE:

Neste primeiro momento quero apenas a interface e a estrutura visual do sistema.

Não implemente banco de dados, autenticação real, API ou integração com sistemas externos ainda.

Utilize dados mockados apenas para demonstrar a interface.

TECNOLOGIAS:

- React

- TypeScript

- Tailwind CSS

- Componentes reutilizáveis

- Lucide Icons

IDENTIDADE VISUAL:

Utilize como cores principais:

#32BF78

#6FF366

#96CFBD

#4FD088

#5BD686

Também utilize:

#FFFFFF para branco

#000000 para preto

A interface deve ter aparência profissional, moderna, limpa e adequada para um sistema empresarial utilizado em computadores desktop.

LAYOUT:

Criar um layout principal composto por:

1. SIDEBAR FIXA À ESQUERDA

2. HEADER FIXO NO TOPO

3. MAIN CONTENTÁREA

A sidebar deve permanecer fixa enquanto o conteúdo principal muda.

O header também deve permanecer fixo.

Somente o conteúdo dentro do MAIN deve mudar conforme a opção selecionada na sidebar.

SIDEBAR:

Criar uma sidebar com aproximadamente 260px de largura.

No topo da sidebar haverá uma área para o logo do sistema.

Utilizar um espaço reservado para uma imagem de logo.

Abaixo da logo mostrar:

"SISTEMA DE DEVOLUÇÕES"

"Controle de materiais"

Organizar os menus em categorias:

NAVEGAÇÃO

- Visão geral

OPERAÇÕES

- Nova devolução

- Devoluções

DOCUMENTOS

- Relatórios

ADMINISTRAÇÃO

- Usuários

- Configurações

No final da sidebar:

- Sair

Utilizar ícones da biblioteca Lucide para todos os itens.

O item selecionado deve possuir destaque visual utilizando a cor #32BF78 ou uma variação da paleta.

Criar estados de hover elegantes.

HEADER:

Criar um header fixo no topo.

No lado esquerdo pode existir o título da página atual.

No lado direito mostrar:

- Avatar do usuário

- Nome do usuário

- Perfil/cargo

- Botão de sair

Exemplo:

"João Silva"

"Apontador"

MAIN:

O conteúdo deve possuir bastante espaço, cards com bordas arredondadas, sombras sutis e uma hierarquia visual clara.

PÁGINA "VISÃO GERAL":

Criar um dashboard inicial com cards:

- Devoluções hoje

- Devoluções no mês

- Devoluções em andamento

- Devoluções finalizadas

Adicionar uma tabela de devoluções recentes contendo:

- Requisição

- Data

- Usuário

- Quantidade de itens

- Status

- Ações

Utilizar dados fictícios.

PÁGINA "NOVA DEVOLUÇÃO":

Criar formulário para cadastrar uma nova devolução.

Campos:

Número da requisição

Código do material

Descrição do material

Quantidade

Lote

O usuário deverá informar o código do material e a descrição será exibida automaticamente.

Como ainda não haverá banco de dados, utilizar dados mockados para simular essa busca.

Criar botão:

"+ Adicionar item"

Abaixo criar uma tabela com os itens adicionados:

Código

Descrição

Quantidade

Lote

Ações

Cada item deve possuir uma ação para remover o item.

Adicionar validações básicas.

Criar botão:

"Finalizar devolução"

Também criar botão:

"Cancelar"

PÁGINA "DEVOLUÇÕES":

Criar uma tabela de histórico contendo:

Número da requisição

Data

Usuário

Quantidade de itens

Status

Ações

Adicionar campo de pesquisa.

Adicionar filtros por:

- Data

- Usuário

- Status

Criar ação para visualizar uma devolução.

PÁGINA "RELATÓRIOS":

Criar uma interface para consultar e gerar relatórios das devoluções.

O relatório deverá futuramente possuir:

Número da requisição no topo.

Tabela contendo:

Código

Descrição

Quantidade

Lote

No final:

Assinatura Apontador

Assinatura Almoxarifado

Neste primeiro momento apenas criar a interface e uma visualização de exemplo.

RESPONSIVIDADE:

O sistema será utilizado principalmente em computadores desktop.

Priorizar a experiência desktop.

Ainda assim, criar uma estrutura minimamente adaptável para telas menores.

DESIGN:

Não criar uma interface excessivamente colorida.

Utilizar branco como fundo principal das áreas de conteúdo.

Utilizar a paleta verde como identidade visual e para ações importantes.

Utilizar preto e tons de cinza para textos.

Utilizar bordas discretas.

Utilizar sombras suaves.

Utilizar espaçamento consistente.

Utilizar tipografia moderna e legível.

Evitar excesso de elementos.

O resultado deve parecer um sistema empresarial real, não uma landing page.

ARQUITETURA:

Organizar o projeto utilizando componentes reutilizáveis.

Separar:

- Layout

- Sidebar

- Header

- Dashboard

- Formulário de devolução

- Tabela de devoluções

- Relatórios

- Componentes de UI

Não criar código desnecessariamente complexo.

Preparar a estrutura para posteriormente conectar o sistema ao Supabase.

Não implementar a integração com Supabase ainda.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/4d35d467-6eec-4ab5-b981-45774ef51683).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
