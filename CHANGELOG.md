# Changelog

## v5.13.0 — 2026-10-26

### Avaliação

- Botão "Enviar" passa a ocupar toda a largura do card no formulário de avaliação

### Dia da Amizade (DA)

**Formulário de inscrição — `/admin/da`**
- Responsividade corrigida por completo: campos de dados pessoais (step 2) e campos do carro (step 3) empilham em coluna no mobile e ficam lado a lado em telas ≥ 640px
- Padding interno do card do step 3 unificado: `CardContent` com `p-0`, eliminando o duplo padding do shadcn que variava visualmente conforme a opção selecionada
- Botões "Sim, é esse" e "Não, usar outro" empilhados verticalmente no mobile, sem overflow do card
- Hierarquia visual dos botões: "Sim, é esse" = `tertiary`, "Não, usar outro" = `secondary`
- Sorvete não abre campo de observação (item com nome contendo "sorvete" é excluído da lógica de `SOBREMESA`)

**Navegação BPs**
- Menu do sidebar: "Dia da Amizade" movido para o topo; "Pastorais" movido para baixo
- Botão "Bom Pastor" no perfil aponta diretamente para `/admin/bp/da` (gestão do DA)

**Painel de inscritos — `/admin/bp/da/inscritos`**
- Filtros (busca, selects, botões) exibidos na mesma linha em `lg` com `flex-nowrap` e `SearchInput` em `flex-1`

**Painel de itens — `/admin/bp/da/itens`**
- Mesma correção de filtros na mesma linha em `lg`
- Padding inferior adicionado em "Nenhuma inscrição registrada ainda." dentro do card de informações

**Gestão de transporte — `/admin/bp/da/transporte`**
- Label "Sem transporte" exibido em desktop e "Sem" em mobile com `text-nowrap`
- Padding aumentado entre os cards de estatísticas e o botão "Ônibus/van" no mobile

---

## v5.12.0 — 2026-10-25

### Dia da Amizade (DA)

**Formulário de inscrição — `/admin/da`**
- Formulário expandido para 4 etapas: mensagem inicial → confirmar dados pessoais → como vai → o que vai levar
- Nova etapa de confirmação de dados: nome, sobrenome, celular e "Como gosta de ser chamado?" (apelido), com salvamento antes de avançar
- Botão de voltar (chevron) em todas as etapas com destino anterior
- Admins podem acessar e preencher o formulário mesmo com o DA fechado (layout e API)

**Painel de itens — `/admin/bp/da/itens`**
- Card "Informações" colapsável no topo com ícone `BarChart4`
- Barra horizontal empilhada com proporção por categoria (Carne, Sobremesa, Acompanhamento, Vegetariana)
- Cards por categoria exibindo contagem absoluta e percentual do total
- Dados calculados a partir dos itens marcados como presentes no DA atual

**Gestão de transporte — `/admin/bp/da/transporte`**
- UI otimista na criação de ônibus: dialog fecha imediatamente, item aparece na lista com ID temporário e sincroniza com o servidor ao concluir; restaura estado em caso de erro
- UI otimista na exclusão de ônibus: card removido imediatamente com passageiros movidos para sem-veículo; restaura estado em caso de erro

**APIs novas/alteradas — `/api/da/`**
- `PATCH /da/pessoa` — novo endpoint para atualizar nome, sobrenome, celular e apelido do usuário logado
- `GET /da` — passa a incluir `pessoa: { nome, sobrenome, celular, apelido }` no retorno
- `POST /da/inscricao` — admins podem inscrever mesmo com `aberto = false`

---

## v5.11.1 — 2026-10-23

### Correções

- `divulgarMontagem`: corrige valor da equipe Boa Vontade de `'bv'` para `'boa_vontade'`; role `BV` agora é atribuído corretamente ao divulgar a montagem

---

## v5.11.0 — 2026-10-23

### Dia da Amizade (DA)

**Formulário de inscrição — `/admin/da`**
- Formulário em 3 etapas: mensagem inicial → como vai → o que vai levar
- Opções de transporte: Dirigindo (cria `CarroDA` com modelo/placa/vagas), De carona, De ônibus/van
- Carro pré-preenchido a partir do cadastro do encontrão anterior
- Alocação automática em ônibus disponível ao selecionar "De ônibus/van"
- Campo de descrição para itens da categoria Sobremesa ("Qual sobremesa você vai levar?"), obrigatório quando selecionado
- Card de confirmação redesenhado: mini-cards de item (com descrição da sobremesa) e transporte com ícones; mensagem "Te esperamos no DA dia XX!"

**Painel de inscritos — `/admin/bp/da/inscritos`**
- Tabela paginada (25/página) com filtros por nome, item e BP responsável na mesma linha
- Coluna "O que vai levar" exibe "Pudim (Sobremesa)" quando há descrição de sobremesa
- Edição de item por inscrição; remoção de inscrição com limpeza do `CarroDA` se motorista
- Select inline de BP responsável com avatar

**Painel de itens — `/admin/bp/da/itens`**
- Contagem de inscrições por item: exibe `X/Y` (quantidade usada / vagas) ou `X/∞` para itens ilimitados
- Modo de edição exibe `X/[input]` mostrando o ocupado ao lado do campo editável

**Gestão de transporte — `/admin/bp/da/transporte`**
- Drag & drop de pessoas entre carros, ônibus e sem-veículo (`@dnd-kit`)
- Cards de carro: motorista exibido em seção dedicada (não arrastável); vagas contam apenas passageiros
- Edição inline de nome e vagas do ônibus/van
- Botão para converter carona (sem veículo) em motorista, pré-preenchendo dados do carro anterior
- Ao deletar carro, motorista e passageiros viram caronas em sem-veículo automaticamente
- Cards mostram número do EJC (cinza, menor) e nome do BP responsável com ícone `UserCheck`

**APIs novas — `/api/da/`**
- `POST /inscricao` — inscrição com alocação automática em ônibus
- `PATCH /inscricoes/[idPessoa]` — atualização parcial (item, transporte, BP, sobremesa)
- `DELETE /inscricoes/[idPessoa]` — remoção com limpeza do carro se motorista
- `GET|POST /carros` — criação e listagem de carros do DA
- `PATCH|DELETE /carros/[id]` — edição e exclusão de carro (exclusão limpa ocupantes)
- `GET|POST /onibus` — criação e listagem de ônibus
- `PATCH /onibus/[id]` — edição de nome e vagas
- `GET /transporte` — snapshot de carros, ônibus e sem-veículo para o painel
- `GET /itens` — itens com contagem de inscrições
- `GET /bps` — BPs disponíveis para atribuição
- `GET /carro-anterior` — dados do carro cadastrado no encontrão anterior

**Schema — `InscricaoDA`**
- Adicionado campo `descricao_item` (opcional) para descrição de sobremesas

---

### Avaliações — melhorias

**Toggle de abertura — `/admin/dirigente/avaliacao`**
- Botão "Avaliações abertas?" (Switch) controla `isReceivingAvaliacoes` no `Encontro`
- Formulário do coordenador bloqueado com mensagem clara quando avaliações estão fechadas

**Busca e contagem**
- Campo de busca por nome do encontreiro com filtro aplicado em `AvaliacaoList`
- Contagem de respostas recebidas exibida acima da lista

**Página convertida para client component** com `useQuery` + `useMutation` (was server component)

**Schema — `Encontro`**
- Adicionado campo `is_receiving_avaliacoes` (boolean, default false)

---

### Refatorações

- `da/layout.tsx`: extraído para `getDAAberto()` em `src/app/api/da/get-da-aberto.ts`; nenhuma página chama Prisma diretamente
- `Pagination`: corrige exibição "1-25 de 0" quando não há resultados (`firstOnPage = lastOnPage = 0`)

---

## v5.10.0 — 2026-10-20

### Sistema de Avaliação Pós-Encontrão

**Formulário de avaliação — `/admin/coordenador/avaliacao`**
- Formulário por categorias (Sua Equipe, Candidatos, O Encontrão, Para o Futuro, Dirigência, Outros)
- Suporte a perguntas de texto longo, indicações de candidatos e upload de arquivo PDF/DOCX via Cloudinary
- Reedição da avaliação após o primeiro envio
- Liberação automática 3 dias após o início do encontro; exibe data de liberação enquanto indisponível

**Painel de avaliações — `/admin/dirigente/avaliacao`**
- Listagem de todas as avaliações recebidas com expansão por card
- Badge de equipe do autor e apelido
- Hover na foto dos indicados exibe imagem ampliada via `HoverCard`
- Exclusão de avaliação com remoção automática do arquivo no Cloudinary

**Gerenciamento de perguntas — `/admin/dirigente/avaliacao/perguntas`**
- Edição de texto, descrição e categoria; toggle ativa/inativa com `Switch`
- Perguntas com funcionalidade fixa bloqueiam edição de categoria e desativação
- Criação de novas perguntas de texto longo em `/perguntas/nova`

**Histórico de avaliações — `/admin/dirigente/historico/avaliacoes`**
- Listagem de avaliações de encontros anteriores com seletor de encontro (`EncontroSelector`)
- Seletor exibe número do encontro e total de respostas; persiste seleção via `?encontroId=` na URL
- Reutiliza `AvaliacaoList` e `getAvaliacoesByEncontro`

**Sidebar — reorganização**
- "Avaliações" movido para dentro do grupo "Gerenciar Encontro", logo acima de "Fechar Encontro"
- "Avaliações" adicionado ao grupo "Histórico" apontando para a nova página de histórico
- Ícone das avaliações alterado para `Star` (mesmo que na página de perfil)

**Outras melhorias**
- Botão "Avaliação" na página de perfil visível para `COORDENADOR`, `ADMIN` e `DIRIGENTE` apenas quando a avaliação está aberta
- `isAvaliacaoDisponivel()` em `src/utils/avaliacao.ts` centraliza a regra de liberação
- Nenhuma `page.tsx` chama o Prisma diretamente — toda lógica de banco extraída para funções dedicadas em `src/app/api/`
- `overflow-y: scroll` no `html` elimina layout shift ao expandir cards com scrollbar
- Botões de ação padronizados com `Card` + `CardFooter` + `Button className="h-10 w-40"`
- Card "Tirar acessos do último Encontro" em fechar-encontro exibe aviso em destaque alertando que o formulário de avaliação ficará inacessível após essa ação

---

### v5.9.3 — Exibição de cidade e estado para encontristas fora do Rio
> Outubro 2026

**Alocação de carros — bairro substituído por cidade (UF) fora do Rio**
- `getConfirmadosCard`: encontristas com cidade diferente de "Rio de Janeiro" exibem `Cidade (UF)` no campo bairro (ex: "Niterói (RJ)") em vez do nome do bairro, que não tem contexto sem a cidade

---

### v5.9.2 — Zona "Fora do Rio" por cidade
> Outubro 2026

**Alocação de carros — detecção por cidade**
- `getConfirmadosCard`: encontristas com cidade diferente de "Rio de Janeiro" recebem `zona = 'fora do rio'` diretamente, sem consultar o banco de bairros — evitava que bairros homônimos de outras cidades fossem alocados na zona errada

---

### v5.9.1 — Atribuição automática da role RECEPCAO
> Outubro 2026

**Role `RECEPCAO` — atribuição e remoção automáticas**
- `divulgarMontagem`: membros da equipe `recepcao` recebem automaticamente a role `RECEPCAO` ao divulgar a montagem (coordenadores também recebem `COORDENADOR`)
- `resetRoles`: role `RECEPCAO` incluída na lista de roles resetáveis — removida automaticamente ao iniciar novo encontrão
- Toast de confirmação da divulgação agora exibe o count de pessoas com role Recepção

---

### v5.9.0 — Nova área Recepção e zona "Fora do Rio" na alocação de carros
> Outubro 2026

**Zona "Fora do Rio" — `/admin/externa/alocacao-carros`**
- Encontristas com `zona === null` (bairro não mapeado no banco) ou `zona === 'nenhuma'` agora aparecem em um funil "Fora do Rio" no card "Encontristas sem Carro", em vez de ficarem invisíveis na lista

**Nova role `RECEPCAO` e área `/admin/recepcao`**
- Adicionada role `RECEPCAO` ao enum `Role` do Prisma e ao `roleHierarchy` de permissões
- Nova área protegida em `/admin/recepcao` com sidebar próprio (padrão idêntico ao Apresentação)
- Botão de acesso "Recepção" adicionado na página de perfil para quem tiver a role

**Palestrantes — responsabilidade migrada para Recepção**
- `/admin/recepcao/palestrantes`: formulário completo de adicionar, editar, reordenar e remover palestrantes
- `/admin/secretaria/palestrantes`: convertido para leitura; exibe tabela com ordem, nome da palestra e palestrante; texto indica que alterações são feitas pela recepção

**Lista de encontristas — `/admin/recepcao/encontristas`**
- Tabela paginada (25/página) seguindo o padrão da secretaria: filtros por nome e círculo, ordenação por nome e cor
- Colunas: Nome completo, Círculo, Família Confirmada (badge Sim/Não), Contato 1 (nome + tel), Contato 2 (nome + tel), Tios de Externa (formato "Fulano e Ciclano" usando apelido quando disponível — padrão das cartas)
- Botão "Exportar lista" gera `.xlsx` com as mesmas colunas menos os telefones dos contatos, acrescido de coluna `✓` para marcação manual

---

### v5.8.10 — Fix: círculos da apresentação não pré-populavam tios salvos
> Outubro 2026

**Fix: `/admin/apresentacao/circulos`**
- `getCirculos`: adicionado `id` ao select do Prisma para `tioAparente` e `tioSecreto`, e campo `id` incluído na interface `TioCirculoType` — o ID da Pessoa não estava sendo retornado pela API
- `buildLists` (`sort-circulos.tsx`): corrigido inicialização de `tioAparente` e `tioSecreto` que sempre usava `''`; agora usa `c.tioAparente?.id` e `c.tioSecreto?.id`, pré-populando os selects corretamente ao carregar a página

**Skeleton de carregamento — `/admin/apresentacao/circulos`**
- Adicionado skeleton na `page.tsx` enquanto os dados do encontro e dos círculos carregam
- Adicionado skeleton nos cards dentro de `sort-circulos.tsx` enquanto a lista de tios carrega — exibido apenas quando já há tios configurados, evitando flash de selects vazios

---

### v5.8.9 — Fix: encontristas não vinculados ao encontro ao criar novo encontrão
> Setembro 2026

- Corrigido bug em `create-encontro.ts` onde o `Array.map` com callbacks `async` não era aguardado (`Promise.all` faltando), fazendo o `return newEncontro` executar antes dos updates de `idEncontro` terminarem — resultado: alguns encontristas ficavam com `encontreiro.idEncontro` apontando para o encontro anterior e desapareciam da montagem de círculos

---

### v5.8.8 — Fixes de datas e lógica de círculos da apresentação
> Setembro 2026

**Fixes de datas (timezone)**
- `/participe`: server component agora busca o encontro via Prisma direto (sem HTTP call para a própria API), eliminando falha com Turbopack; data do encontro é passada como string `YYYY-MM-DD` evitando conversão de timezone incorreta
- `EncontroCard` no perfil: corrigido exibição da data do encontro que mostrava o dia anterior em fusos UTC-3 por interpretar UTC midnight como hora local
- `getMonthBR`: atualizado para aceitar `Date | string`

**Lógica de círculos — `/apresentacao/circulos`**
- `editEncontro`: ao salvar `numeroCirculos`, o campo `ordemCirculos` é inicializado automaticamente com os N primeiros círculos em ordem padrão (ex: 4 → `1234`)
- `getCirculos`: quando ainda não há registros de círculo no banco, gera uma lista virtual a partir de `ordemCirculos` para que o apresentador já veja o estado inicial
- `atualizarCirculos`: lógica completa de criação e deleção — círculos ativos são criados no banco se não existirem; círculos movidos para "Fora do encontro" são deletados com cascade (encontreiros são desvinculados do círculo, tios aparente/secreto são removidos)

**Outros**
- Removida função `deletePastoral` não utilizada em `pastorais-secre-table-row.tsx`

---

### v5.8.7 — Filtro "Com Responsável" e unificação do package manager
> Setembro 2026

- Adicionado filtro **"Com Responsável"** no dropdown de responsáveis da tabela de encontristas da externa — lista todos os encontristas que já foram alocados para algum membro da equipe
- Padronizado o package manager para **pnpm@10.30.2**: adicionado campo `packageManager` no `package.json` (Corepack bloqueia `npm install` acidental)
- `overrides` movido do nível raiz do `package.json` para dentro do bloco `pnpm.overrides`
- `.gitignore` limpo: removidos vestígios de yarn (`.yarn/`, `yarn-debug.log*`, `yarn-error.log*`), adicionado `package-lock.json`

---

### v5.8.6 — Info encontreiro: card "Nunca foi"
> Julho 2026

- Adicionado terceiro card "Nunca foi" na página `/info-encontreiro/[slug]`, ao lado de "Últimas equipes"
- Lista todas as equipes de encontro em que a pessoa nunca participou, em ordem alfabética
- Equipes não pertencentes ao encontro (Não irá participar, Tios de Externa, Palestrantes, Pastorais, Bons Pastores, Dirigente) são excluídas da listagem
- Tio de Círculo, Tio Secreto e Tio Aparente são tratados como grupo: se a pessoa foi qualquer um dos três, a opção não aparece; se nunca foi nenhum, exibe apenas "Tio de Círculo"
- Layout ajustado para três cards: o primeiro (Informações gerais + Lista de preferência) ocupa `w-1/2`, os outros dois `w-1/4` cada

---

### v5.8.5 — Info encontreiro: data da ficha atualizada
> Julho 2026

- Campo "Ficha atualizada" adicionado ao card `/info-encontreiro/[slug]`, seguindo o mesmo padrão visual dos demais campos de informações gerais
- Exibe a data formatada em pt-BR quando disponível, ou `-` quando ainda não há registro

---

### v5.8.4 — Montagem: data do último preenchimento da ficha
> Julho 2026

- Adicionado campo `fichaAtualizadaEm` ao model `Encontreiro` (migration aplicada)
- Gravado automaticamente a cada vez que a ficha de cadastro é salva
- Na tabela de montagem, exibe a data em formato pequeno abaixo da disponibilidade, indicando quando a pessoa preencheu suas preferências e disponibilidade pela última vez

---

### v5.8.3 — Montagem: upload de foto na tabela
> Julho 2026

- Ao passar o mouse sobre a foto na tabela de montagem, aparece um ícone de câmera e a imagem abre o widget de upload do Cloudinary
- Ao concluir o upload, a foto é atualizada imediatamente na linha e persistida via `updateProfile`
- Adicionado `data-gramm="false"` na tabela para evitar interferência de extensões de escrita (Grammarly etc.) que causavam sublinhados e cores indevidas em células

---

### v5.8.2 — Montagem: contagem de encontristas por equipe
> Julho 2026

- Cards de equipe na página de montagem exibem agora a contagem de encontristas: pessoas da equipe cujo `idEncontro` corresponde ao encontro anterior (penúltimo encontrão cadastrado)

---

### v5.8.1 — Fix: paginação e bolinha de círculo
> Julho 2026

- Corrigido bug de paginação na listagem de encontreiros: `getTotal` usava `statusFilter = {}` quando `encontreiroStatus` era `null` (padrão "Ativo"), contando inativos e inflando o total — lógica alinhada com `getEncontreiros` para defaultar a `ATIVO + CONVIDADO_ESPECIAL`
- Corrigido `shrink-0` faltante na bolinha de cor do círculo na tabela, que a achatava quando o nome do círculo quebrava em múltiplas linhas

---

### v5.8.0 — Criar/Editar Encontrão
> Julho 2026

- Página `/admin/dirigente/gerenciar-encontro/criar-encontro` reformulada com formulário completo para abrir ou editar o encontrão atual
- Modo determinado automaticamente pelo campo `numeroCirculos`: igual a 0 exibe "Abrir Novo Encontrão", maior que 0 exibe "Editar Encontrão"
- Número do Encontrão preenchido e desabilitado automaticamente a partir do encontrão atual (imutável pelo formulário)
- Seleção de local com dropdown pré-selecionando o local já vinculado ao encontrão
- Modal "Novo Local" ao lado do título da seção: cadastra um novo local com busca automática de endereço via CEP (BrasilAPI), exibindo campos desabilitados de confirmação (Rua, Bairro, Cidade, Estado) antes de salvar
- Ao criar um novo local, ele entra automaticamente na lista e é selecionado
- Corrigido bug em `edit-encontro.ts` que usava `prisma.encontro.create` ao invés de `prisma.encontro.update`
- `CardForm` recebe prop opcional `action` para renderizar um elemento ao lado do título da seção
- Sidebar: "Criar Encontro" renomeado para "Criar/Editar Encontro"
- Todos os fetches migrados para `axios` (`api`) seguindo o padrão do projeto
- Componentes do design system aplicados: `CardForm`, `TextInput`, `Input`, `SelectGroupInput`, `DisabledInput`, `Button`, `FormProvider` com `zodResolver`

---

### v5.7.0 — Export de ficha do carro
> Maio 2026

- Export em `.docx` da ficha de cada carro com uma página por encontrista, contendo identificação, contatos de emergência, indicação e informações adicionais
- Geração client-side via `docx` + `file-saver`, acionada no clique do botão de download no card do carro
- Fetch dos dados no clique via Server Action, evitando carregar dados desnecessariamente
- Separação de tipos e helpers em `carro-helpers.ts` para isolar imports de servidor do bundle do cliente

---

### v5.6.4 — Correção no quadrante
> Maio 2026

- Minor fix na página das pastorais e dos tios secretos no quadrante.

---

### v5.6.3 — Remove ações on secretaria/pastorais
> Maio 2026

- A habilidade de remover uma pessoa de uma pastoral foi removida da aba da secretaria. Caso a equipe precise dessa alteração ela deve pedir a correção por um BP.

---

### v5.6.2 — Minor Fix Encontristas
> Abril 2026

- Minor fix na criação de um novo Encontro. Agora quando um encontro é criado os encontristas são atualizados para o novo encontro.

---

### v5.6.1 — Minor Fix
> Abril 2026

- Minor fix no Link da página editar bps

---

### v5.6.0 — Nova função editar BPs
> Abril 2026

- Página de edição dos Bons Pastores (BPs) do ano corrente
- Formulário em grid com múltiplas linhas (idPessoa), com adição e remoção dinâmica de linhas
- Rota `GET /lideranca/[ano]/bps` para buscar BPs por ano
- Rota `PUT /lideranca/[ano]/bps` para atualizar registros existentes, removendo a role `BP` de quem saiu e adicionando a quem entrou

---

### v5.5.0 — Nova função editar dirigentes
> Abril 2026

- Página de edição dos dirigentes do ano corrente ou criação para o ano seguinte
- Formulário em grid com múltiplas linhas (idPessoa + idDom + idPasta), com adição e remoção dinâmica de linhas
- Switch para alternar entre editar dirigentes do ano atual (pré-populado com dados existentes) ou criar para o próximo ano (limpo, 5 linhas)
- Ano do próximo ciclo calculado dinamicamente a partir do `ano` dos dirigentes atuais + 1, sem rota extra
- Rota `GET /lideranca/[ano]/dirigentes` para buscar dirigentes por ano
- Rota `PUT /lideranca/[ano]/dirigentes` para atualizar `idDom` e `idPasta` de cada dirigente, removendo a role `DIRIGENTE` de quem saiu e adicionando a quem entrou — registros anteriores preservados na tabela
- Rota `POST /lideranca/[ano]/dirigentes` para criação de novo ciclo: calcula o próximo ano pelo maior `ano` na tabela com `idFuncao: 'dirigente'`, remove a role `DIRIGENTE` de todos e atribui aos novos

---

### v5.4.5 — Fix: double submit na inscrição de encontrista
> Abril 2026

- O React StrictMode em desenvolvimento remonta componentes propositalmente, fazendo o `useEffect` do `FinalForm` disparar `createNewEncontrista` duas vezes
- A segunda chamada chegava ao `api.post` antes da primeira terminar, causando erro `P2002` de unique constraint no campo `email`
- Corrigido com `useRef` (`isSending`) no contexto `CreateEncontristaContext` para bloquear chamadas concorrentes de forma síncrona
- O `clearForm` também reseta o `isSending` para permitir nova inscrição na mesma sessão

---

### v5.4.4 — Roles: migração de campo único para array
> Abril 2026

- Migração do campo `role` (enum único) para `roles` (array de enums) na tabela `pessoas`
- Mapeamento de roles legadas para arrays com hierarquia definida (ex: `EXTERNA` → `[ENCONTREIRO, COORDENADOR, EXTERNA]`)
- Adição da role `BP` (Bom Pastor), compatível com múltiplas roles simultâneas via tabela `lideranca`
- Atualização do NextAuth para carregar e expor `roles[]` na sessão
- Helper `hasRole` para verificação de permissões no RBAC
- Funções de reset e ajuste de roles refatoradas para operar sobre arrays, preservando roles não ajustáveis (`ADMIN`, `DIRIGENTE`, `BP`, `ENCONTREIRO`, `ENCONTRISTA`, `TIOEXTERNA`)
- Queries Prisma migradas de `role` para `roles` com operadores `has`, `hasSome` e `hasEvery`
- Comparações de role em componentes client migradas para `roles.includes()`
- Fluxo de `changeEncontristas` atualizado para remover `ENCONTRISTA` e adicionar `ENCONTREIRO` ao promover um encontrista

---

### v5.4.3 — Fix: instância axios no servidor
> Abril 2026

- A instância do axios estava configurada com `baseURL` relativa (`/api/`), o que causava `ERR_INVALID_URL` em Server Components. Corrigido para usar URL absoluta via `NEXTAUTH_URL` no servidor.

### v5.4.2 — Montagem: fix
> Abril 2026

- Existia um bug que resetava a role de apresentação quando uma nova montagem era divulgada. O caso foi corrigido.

---

### v5.4.1 — Área da apresentação: fix
> Abril 2026

- A página quebrava quando o usuário arrastava o card círculo para a área de fora do encontro e voltava sem soltar o elemento.

---

### v5.4.0 — Área da apresentação: ordenação de círculos e temas
> Abril 2026

- Página de ordenação dos círculos com drag and drop entre duas listas: "Neste Encontro" e "Fora deste Encontro"
- Arrastar um círculo para fora do encontro limpa automaticamente os campos de tio aparente e secreto
- Seleção de tio aparente e secreto por círculo via select com os encontreiros do encontro atual
- Campos de tio desabilitados visualmente para círculos fora do encontro
- Persistência da ordem dos círculos via campo `ordemCirculos` no encontro atual
- Persistência dos tios via campos `idTioAparente` e `idTioSecreto` na tabela de círculos
- Página de temas com formulário para edição do tema fantasia e espiritual do encontro atual
- Sidebar própria para a área de apresentação com rota isolada `/admin/apresentacao`
- Nova role `APRESENTACAO` com acesso às páginas da área

---

### v5.3.1 — Minor bug fixes
> Março 2026

- Algumas funções estavam chamando incorretamente currentEncontro, este caso foi corrigido.

---

### v5.3.0 — Área da apresentação
> Março 2026

- Foi criada a nova funcionalidade na área da apresentação onde os apresentadores consegue ordenar os círculos e selecionar quem são os tios deles.
- Também foi corrigido a função getCurrentEncontro

---

### v5.2.0 — Área da apresentação
> Março 2026

- Foi criada a nova área da apresentação com a funcionalidade de edição do tema do encontro atual.
- Uma nova role foi criada também para os apresentadores.

---

### v5.1.3 — Correção páginas equipes
> Março 2026

- A página das equipes foram corrigidas para funcionar independente de ter uma equipe ativa.

---

### v5.1.2 — Correção na ficha de cadastro
> Março 2026

- Agora a ficha de cadastro entende que o Encontrão está fechado e não aparece como "Não participará" mas sim "Venha descobrir com a gente!"
- Além disso a ficha de cadastro passado é importada.

---

### v5.1.1 — Correção visual
> Fevereiro 2026

- A tela inicial da inscrição dos encontristas estava apresentando uma data aleatória, foi corrigido para apenas mostrar a data em um encontrão ativo.
- Remove o card do Encontro da tela de perfil

---

### v5.1.0 — Fechar encontro e reestruturação da dirigência
> Fevereiro 2026

- Funcionalidade de fechar o encontro atual no módulo do dirigente
- Botão de fechar encontro com três estados: sem encontro aberto, ações pendentes e pronto para fechar
- Estado local atualizado após fechar o encontro com sucesso
- Reestruturação de rotas e agrupamento de funções na área da dirigência

---

### v5.0.2 — Melhorias visuais
> Fevereiro 2026

- Página de aniversariantes reformulada: cards com avatar, idade e número do EJC
- API de aniversariantes expandida com `apelido`, `idade`, `numeroEncontro` e `avatarUrl`
- Página de equipes reformulada: grade de cards coloridos com total e indicador de coordenação
- Correção de contraste nos cards de equipe (Teatro tudo branco, Mini tudo preto)

---

### v5.0.1 — Correções pós-migração
> Fevereiro 2026

**Tailwind v4**
- Correção das cores customizadas via `@theme` no `globals.css`
- Remoção do `enableSystem` no `ThemeProvider` (site fixado em light mode)
- Adição de `cursor: pointer` global em botões
- Correção do `border-color` padrão que ficou escuro após migração

**Next.js / Configuração**
- Migração de `next.config.ts` para `next.config.mjs` por compatibilidade com ESM
- Migração de `eslint.config.js` para `eslint.config.mjs`
- Correção do `remotePatterns` do Cloudinary que não estava sendo lido com `"type": "module"`

**Correções visuais**
- Card do mapa na home alinhado com os triggers acima
- Imagem dos cards de eventos padronizada com altura fixa e `object-cover`

---

### v5.0.0 — Grandes migrações de infraestrutura
> Breaking changes em múltiplas dependências críticas

**Prisma v6 → v7**
- Migração para arquitetura ESM-only
- Adição de adapter obrigatório (`@prisma/adapter-pg` + `pg`)
- Output do client gerado movido para `prisma/generated/`
- Arquivo `prisma.config.ts` criado (obrigatório no v7)
- Script de seed migrado de `ts-node` para `tsx`

**npm → pnpm**
- Migração do package manager para pnpm
- Adição de `.npmrc` com `shamefully-hoist=true`
- Remoção do `package-lock.json`

**ESLint v8 → v9**
- Migração para flat config (`eslint.config.js`)
- Substituição do `@rocketseat/eslint-config` (abandonado) por configuração própria equivalente
- Remoção do `eslint-plugin-tailwindcss` (incompatível com Tailwind v4)

**Tailwind v3 → v4**
- Resolução do conflito entre v3 e v4 instalados simultaneamente
- Migração do `postcss.config.js` para `@tailwindcss/postcss`

**Correções arquiteturais**
- Separação correta de imports server/client — funções que acessam o Prisma removidas de componentes client-side
- Criação de `src/@types/enums.ts` com enums independentes do runtime do Prisma para uso no browser

**Atualizações de pacotes**
- React `19.1.0` → `19.2.4`
- `@tanstack/react-query` → `^5.90.21`
- `cloudinary` → `^2.9.0`
- `next-auth` → `^4.24.13`

---

### v4.0.0 — Montagem e funcionalidades do Dirigente
> Julho–Outubro 2025

- Sistema de montagem completo: divisão de encontreiros por equipe para o encontrão
- Ações do dirigente: adicionar dirigentes ao encontro, divulgar montagem
- Suporte a convidados especiais na listagem de encontreiros
- Ordenação e lista de preferências na montagem
- Inativos removidos da montagem
- Exports de encontreiros (lista geral e lista de vigília)
- Aniversariantes da semana (com ajuste para domingo)
- Pasta virtual atualizada
- Responsividade geral
- Correções em rotas e quadrante

---

### v3.0.0 — Secretaria e Quadrante
> Maio 2025

- Módulo da Secretaria: edição de encontristas, controle de equipes, palestrantes e pastorais
- Quadrante completo: controle de funções por encontrão, upload de imagem, QR Code, bloqueio de edição
- Tios externa visíveis pela secretaria
- Ficha de cadastro do encontreiro
- Export de restrições alimentares
- Tooltip responsivo no mobile
- Upload de foto de perfil via Cloudinary (sem crop)
- Correções em paginação e duplicidade em endereço

---

### v2.0.0 — Módulo da Externa e Carros
> Abril–Maio 2025

- Cadastro e edição de carros (motorista + carona)
- Criação e edição de encontreiros pelo dirigente
- Ficha de cadastro vinculada ao perfil
- Círculos: edição e atualização
- Encontrista como último encontro
- Correções em formulários de carro, apelido, telefone e disponibilidade
- Migração para Next.js 15
- Base de roles por perfil de admin

---

### v1.0.0 — Base do sistema
> Início do projeto

- Estrutura inicial com Next.js, Prisma e NextAuth
- Cadastro público de encontristas
- Perfil de encontreiro
- Listagens base (encontreiros, encontristas, carros, círculos)
- Autenticação e controle de acesso por role
