/**
 * Limpeza de convites de veículo duplicados no DA.
 *
 * Execução: npx tsx scripts/cleanup-convites-duplicados.ts
 *
 * O que faz:
 * 1. Detecta pares de convites reversos (CARONA↔MOTORISTA entre as mesmas pessoas) e
 *    auto-aprova o mais recente, recusando o anterior redundante.
 * 2. Para caronas com mais de um convite ativo no mesmo DA, mantém apenas o ACEITO
 *    (ou o mais recente PENDENTE) e recusa os demais.
 */

import 'dotenv/config'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../prisma/generated/client.ts'

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_PUBLIC_URL!,
})
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('=== Limpeza de convites de veículo duplicados ===\n')

  // ─── Passo 1: Resolver pares reversos ────────────────────────────────────────
  // Busca todos os convites não-recusados agrupados por (idDA, idMotorista, idConvidado)
  const todos = await prisma.conviteVeiculoDA.findMany({
    where: { status: { not: 'RECUSADO' } },
    orderBy: { createdAt: 'asc' },
  })

  // Agrupa por (idDA, idMotorista, idConvidado) — pode haver convite CARONA e MOTORISTA para o mesmo par
  type Key = string
  const grupos = new Map<Key, typeof todos>()

  for (const c of todos) {
    const key = `${c.idDA}|${c.idMotorista}|${c.idConvidado}`
    if (!grupos.has(key)) grupos.set(key, [])
    grupos.get(key)!.push(c)
  }

  let paresResolvidos = 0
  let caronasLimpas = 0

  for (const [, convites] of grupos) {
    if (convites.length < 2) continue

    const carona = convites.find((c) => c.iniciador === 'CARONA')
    const motorista = convites.find((c) => c.iniciador === 'MOTORISTA')

    if (carona && motorista) {
      // Par reverso: mantém o mais recente como ACEITO, recusa o outro
      const maisRecente =
        carona.createdAt > motorista.createdAt ? carona : motorista
      const obsoleto =
        maisRecente.id === carona.id ? motorista : carona

      const idCarroDA = maisRecente.idCarroDA ?? obsoleto.idCarroDA

      await prisma.conviteVeiculoDA.update({
        where: { id: maisRecente.id },
        data: { status: 'ACEITO', idCarroDA: idCarroDA ?? maisRecente.idCarroDA },
      })
      await prisma.conviteVeiculoDA.update({
        where: { id: obsoleto.id },
        data: { status: 'RECUSADO' },
      })

      // Vincula a InscricaoDA da carona ao carro, se existir
      if (idCarroDA) {
        await prisma.inscricaoDA.updateMany({
          where: {
            idPessoa: maisRecente.idConvidado,
            idDA: maisRecente.idDA,
            comoVai: 'CARONA',
            idCarroDA: null,
          },
          data: { idCarroDA },
        })
      }

      console.log(
        `[PAR REVERSO] Mantido: ${maisRecente.id} (${maisRecente.iniciador}) | Recusado: ${obsoleto.id} (${obsoleto.iniciador})`,
      )
      paresResolvidos++
    }
  }

  // ─── Passo 2: Caronas com múltiplos convites ativos ──────────────────────────
  // Para cada (idDA, idConvidado), deve existir no máximo 1 convite não-recusado
  const ativos = await prisma.conviteVeiculoDA.findMany({
    where: { status: { not: 'RECUSADO' } },
    orderBy: { createdAt: 'desc' },
  })

  const porCarona = new Map<string, typeof ativos>()
  for (const c of ativos) {
    const key = `${c.idDA}|${c.idConvidado}`
    if (!porCarona.has(key)) porCarona.set(key, [])
    porCarona.get(key)!.push(c)
  }

  for (const [key, convites] of porCarona) {
    if (convites.length < 2) continue

    // Prioridade: ACEITO > PENDENTE; dentro do mesmo status, o mais recente
    const aceitos = convites.filter((c) => c.status === 'ACEITO')
    const manter = aceitos.length > 0 ? aceitos[0] : convites[0]
    const recusar = convites.filter((c) => c.id !== manter.id)

    for (const c of recusar) {
      await prisma.conviteVeiculoDA.update({
        where: { id: c.id },
        data: { status: 'RECUSADO' },
      })
      console.log(
        `[DUPLICATA] Carona ${key} — Recusado convite extra: ${c.id} (${c.status}, ${c.iniciador})`,
      )
      caronasLimpas++
    }
  }

  console.log(`\n✅ Pares reversos resolvidos: ${paresResolvidos}`)
  console.log(`✅ Convites duplicados recusados: ${caronasLimpas}`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
