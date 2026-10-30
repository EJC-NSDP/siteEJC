import * as XLSX from 'xlsx'

import { prisma } from '@/lib/prisma'

function nomePessoa(p: { nome: string; sobrenome: string; apelido: string | null }) {
  return p.apelido ?? `${p.nome} ${p.sobrenome}`
}

export async function generateCSV(idDA: string) {
  const carros = await prisma.carroDA.findMany({
    where: { idDA },
    include: {
      motorista: {
        select: {
          nome: true,
          sobrenome: true,
          apelido: true,
          encontreiro: {
            select: { encontro: { select: { numeroEncontro: true } } },
          },
        },
      },
      passageiros: {
        include: {
          pessoa: {
            select: {
              nome: true,
              sobrenome: true,
              apelido: true,
              encontreiro: {
                select: { encontro: { select: { numeroEncontro: true } } },
              },
            },
          },
          responsavelBP: { select: { nome: true, sobrenome: true, apelido: true } },
        },
        where: { comoVai: 'CARONA' },
        orderBy: { pessoa: { nome: 'asc' } },
      },
      convites: {
        where: { status: 'PENDENTE' },
        include: {
          convidado: {
            select: {
              nome: true,
              sobrenome: true,
              apelido: true,
              encontreiro: {
                select: { encontro: { select: { numeroEncontro: true } } },
              },
            },
          },
        },
      },
    },
    orderBy: { createdAt: 'asc' },
  })

  const rows = carros.flatMap((c) => {
    const motoristaNome = nomePessoa(c.motorista)
    const modelo = c.modelo ?? ''
    const placa = c.placa ?? ''
    const vagas = c.vagas

    const confirmed = c.passageiros.map((p) => ({
      Motorista: motoristaNome,
      Modelo: modelo,
      Placa: placa,
      Vagas: vagas,
      Passageiro: nomePessoa(p.pessoa),
      Encontro: p.pessoa.encontreiro?.encontro?.numeroEncontro ?? '',
      Status: 'Confirmado',
      'BP responsável': p.responsavelBP ? nomePessoa(p.responsavelBP) : '',
    }))

    const pendentes = c.convites.map((cv) => ({
      Motorista: motoristaNome,
      Modelo: modelo,
      Placa: placa,
      Vagas: vagas,
      Passageiro: nomePessoa(cv.convidado),
      Encontro: cv.convidado.encontreiro?.encontro?.numeroEncontro ?? '',
      Status: 'Pendente',
      'BP responsável': '',
    }))

    if (confirmed.length === 0 && pendentes.length === 0) {
      return [
        {
          Motorista: motoristaNome,
          Modelo: modelo,
          Placa: placa,
          Vagas: vagas,
          Passageiro: '',
          Encontro: '',
          Status: '',
          'BP responsável': '',
        },
      ]
    }

    return [...confirmed, ...pendentes]
  })

  const worksheet = XLSX.utils.json_to_sheet(rows)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Carros')
  return XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' })
}
