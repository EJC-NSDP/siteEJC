# Site EJC NSDP

Sistema web do **Encontro de Jovens com Cristo** da Paróquia Nossa Senhora da Divina Providência — Jardim Botânico, Rio de Janeiro.

🌐 **Produção:** [ejcnsdp.com.br](https://www.ejcnsdp.com.br)
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
- Gerenciamento do sistema de cartas virtuais

### 📋 Secretaria
Equipe administrativa do Encontrão (2x por ano).
- Montagem do quadrante — controle de quem trabalhou em cada função em cada encontrão

### 📁 Coordenador
Coordenadores de equipe do Encontrão (2x por ano).
- Visualização da própria tropa
- Acesso à pasta virtual com informações do trabalho

### 🎯 Dirigente
Grupo de coordenadores do movimento durante um ano inteiro.
- Visualização, edição e criação de encontreiros no banco de dados
- Edição de informações de círculos
- Montagem: divisão de quem trabalhará em cada equipe no encontrão
- Criação de novo encontrão (com reset de acessos)
- Visualização das pastas de cada equipe
- Visualização dos aniversariantes da semana

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
# Banco de dados (Railway PostgreSQL)
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

---

## Changelog

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