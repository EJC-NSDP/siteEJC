# Site EJC NSDP

Sistema web do **Encontro de Jovens com Cristo** da Paróquia Nossa Senhora da Divina Providência — Jardim Botânico, Rio de Janeiro.

🌐 **Produção:** [ejcnsdp.com.br](https://www.ejcnsdp.com.br)

---

## Equipe

| Papel | Nome |
|---|---|
| Desenvolvimento | João Paulo Pugialli da Silva Souza |
| UX/UI Design | Antônio Pedro Alves |
| UX/UI Design | Amanda Porto Padilha |
| UX/UI Design | Isabella Xavier |

---

## Sobre o projeto

O site serve dois propósitos principais:

- **Público:** Apresentação do movimento e inscrição de novos encontristas.
- **Administrativo:** Gestão interna completa do movimento — cadastros, montagem de equipes, controle de encontrões e muito mais.

---

## Perfis de usuário e funcionalidades

### 🙋 Encontrista
Pessoa que deseja participar do movimento.
- Inscrição online no site

### ✝️ Encontreiro
Todo encontreiro já foi um encontrista. Acesso autenticado ao sistema.
- Atualização do próprio perfil
- Visualização das informações do próximo encontrão

### 🚗 Externa
Equipe responsável pela logística do Encontrão (2x por ano).
- Visualização e atualização de status dos encontristas inscritos
- Divisão de encontristas em círculos
- Cadastro de tios de externa (motoristas)
- Alocação de encontristas nos carros
- Controle de pagamento da taxa de inscrição
- Gerenciamento do sistema de cartas virtuais (abrir/fechar)

### 📋 Secretaria
Equipe administrativa do Encontrão.
- Montagem do quadrante — controle de quem trabalhou em cada função em cada encontrão

### 📁 Coordenador
Coordenadores de equipe do Encontrão.
- Visualização da própria tropa
- Acesso à pasta virtual com informações do trabalho

### 🎯 Dirigente
Grupo de coordenadores do movimento durante um ano inteiro.
- Visualização, edição e criação de encontreiros no banco de dados
- Edição de informações de círculos
- Montagem: divisão de quem trabalhará em cada equipe no encontrão
- Criação de novo encontrão (com reset de acessos)
- Fechar encontro atual (após executar todas as ações preparatórias)
- Visualização das pastas de cada equipe
- Visualização dos aniversariantes da semana

### 🎤 Apresentação
Equipe responsável pela apresentação do Encontrão.
- Ordenação dos círculos
- Definição dos tios aparente e secreto de cada círculo
- Edição do tema fantasia e espiritual do encontro atual

---

## Stack

| Camada | Tecnologia |
|---|---|
| Framework | Next.js 15 (App Router) |
| Linguagem | TypeScript |
| Estilização | Tailwind CSS v4 |
| Componentes | shadcn/ui + Radix UI |
| ORM | Prisma v7 |
| Banco de dados | PostgreSQL (Neon) |
| Autenticação | NextAuth.js v4 |
| Upload de imagens | Cloudinary |
| Package manager | pnpm |
| Deploy | Vercel |

---

## Requisitos

- Node.js 18+
- pnpm

---

## Variáveis de ambiente

Crie um arquivo `.env` na raiz com as seguintes variáveis:

```env
# Banco de dados (Neon PostgreSQL)
DATABASE_PUBLIC_URL=

# NextAuth
NEXTAUTH_URL=
NEXTAUTH_SECRET=

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
NEXT_PUBLIC_CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

---

## Instalação e uso

```bash
# Instalar dependências
pnpm install

# Gerar cliente Prisma
pnpm dlx prisma generate

# Rodar em desenvolvimento
pnpm dev

# Build de produção
pnpm build

# Seed do banco de dados
pnpm seed

# Abrir Prisma Studio
pnpm studio

# Lint
pnpm lint
```

---

## Versionamento

Este projeto segue o padrão **Semantic Versioning (semver)**: `MAJOR.MINOR.PATCH`

- **MAJOR** — mudanças que quebram compatibilidade (breaking changes, grandes migrações)
- **MINOR** — novas funcionalidades sem quebrar o que existe
- **PATCH** — correções de bugs e ajustes menores

O histórico completo de versões está em [CHANGELOG.md](./CHANGELOG.md).