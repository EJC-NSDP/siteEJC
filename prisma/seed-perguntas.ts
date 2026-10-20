import 'dotenv/config'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@/generated'

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_PUBLIC_URL!,
})
const prisma = new PrismaClient({ adapter })

const perguntas = [
  {
    ordem: 1,
    chave: 'pre_encontro',
    texto: 'Como foi o trabalho de pré-encontro?',
    descricao: 'Discorra e faça aqui a avaliação da equipe.',
    tipo: 'TEXTO_LONGO' as const,
    categoria: 'SUA_EQUIPE' as const,
    removivel: true,
  },
  {
    ordem: 2,
    chave: 'no_encontrao',
    texto: 'Como foi o trabalho no Encontrão?',
    descricao: 'Discorra e faça aqui a avaliação da equipe.',
    tipo: 'TEXTO_LONGO' as const,
    categoria: 'SUA_EQUIPE' as const,
    removivel: true,
  },
  {
    ordem: 3,
    chave: 'candidatos',
    texto: 'Possíveis candidatos?',
    descricao:
      'Indique quem poderia receber a próxima pasta da equipe que você coordenou e o porquê. Também pode observar pessoas de outras equipes e dizer onde e porquê você acha que elas se encaixariam.',
    tipo: 'INDICACOES' as const,
    categoria: 'CANDIDATOS' as const,
    removivel: false,
  },
  {
    ordem: 4,
    chave: 'pontos_fortes',
    texto: 'Olhando para o todo e não só para a sua equipe, teve algum ponto forte da preparação ou do Encontrão em si que queria dividir com a gente?',
    descricao:
      'Pode ser algo novo ou não, mas que funcionou muito bem e que você acredite que a gente não deve abrir mão de jeito nenhum, ou ainda pode ser um elogio que queira deixar registrado aqui para alguém ou alguma equipe.',
    tipo: 'TEXTO_LONGO' as const,
    categoria: 'O_ENCONTRAO' as const,
    removivel: true,
  },
  {
    ordem: 5,
    chave: 'pontos_fracos',
    texto: 'E os pontos fracos? Tem algo que sugere melhorar?',
    descricao:
      'Diga se teve algo que não funcionou tão bem, que pode ter prejudicado de alguma forma a nossa preparação ou o Encontrão.',
    tipo: 'TEXTO_LONGO' as const,
    categoria: 'O_ENCONTRAO' as const,
    removivel: true,
  },
  {
    ordem: 6,
    chave: 'dicas_futuros',
    texto: 'Deixe aqui as suas dicas para os futuros coordenadores!',
    descricao: 'PDF ou DOCX',
    tipo: 'ARQUIVO' as const,
    categoria: 'PARA_O_FUTURO' as const,
    removivel: false,
  },
  {
    ordem: 7,
    chave: 'avalia_dirigentes',
    texto: 'E nós, Dirigentes? Como fomos?',
    descricao: 'Fique à vontade para nos avaliar aqui!',
    tipo: 'TEXTO_LONGO' as const,
    categoria: 'DIRIGENCIA' as const,
    removivel: true,
  },
]

async function main() {
  for (const p of perguntas) {
    await prisma.perguntaAvaliacao.upsert({
      where: { chave: p.chave },
      update: { categoria: p.categoria, ordem: p.ordem },
      create: p,
    })
  }
  console.log('✓ Perguntas de avaliação atualizadas com sucesso.')
}

main()
  .then(async () => { await prisma.$disconnect() })
  .catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1) })
