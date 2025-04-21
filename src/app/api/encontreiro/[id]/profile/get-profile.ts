import { getCurrentEncontro } from '@/app/api/encontro/atual/[ignorar]/get-current-encontro/get-current-encontro'
import { prisma } from '@/lib/prisma'
import type { Role } from '@prisma/client'

export interface encontreiroEmEquipe {
  nome: string
  avatarUrl: string | null
}

interface EquipeEncontroData {
  encontreiro: {
    pessoa: {
      nome: string
      avatarUrl: string | null
      apelido: string | null
    }
  }
}

export interface ProfileData {
  nome: string
  avatarUrl: string | undefined
  role: Role
  numeroEncontro: number | undefined
  corCirculo: string | undefined
  equipeEncontro: string
  equipeEncontroCoord: boolean
  pastaURL: string
  fichaCadastro: boolean
  coordenadores: encontreiroEmEquipe[]
  tropa: encontreiroEmEquipe[]
}
function pertenceARosa(equipe: string): boolean {
  const categorias = ['vigilia', 'recepcao', 'compras', 'externa', 'meditacao']
  return categorias.includes(equipe)
}

function pertenceASala(equipe: string): boolean {
  const categorias = [
    'apresentacao',
    'boa_vontade',
    'tio_aparente',
    'tio_circulo',
    'tio_secreto',
  ]
  return categorias.includes(equipe)
}

export async function getProfile(id: string) {
  const encontro = await getCurrentEncontro()

  const encontreiro = await prisma.pessoa.findUnique({
    select: {
      id: true,
      nome: true,
      sobrenome: true,
      avatarUrl: true,
      role: true,
      encontreiro: {
        select: {
          circulo: {
            select: {
              corCirculo: {
                select: {
                  cor: true,
                },
              },
            },
          },
          encontro: {
            select: {
              numeroEncontro: true,
            },
          },
        },
      },
    },
    where: {
      id,
    },
  })
  if (!encontreiro || !encontro) return null

  const equipeEncontro = await prisma.equipeEncontro.findUnique({
    select: {
      equipe: {
        select: {
          pastaUrl: true,
          equipeLabel: true,
        },
      },
      coordenou: true,
      fichaPreenchida: true,
      idEquipe: true,
    },
    where: {
      idPessoa_idEncontro: {
        idEncontro: encontro.id,
        idPessoa: encontreiro.id,
      },
    },
  })

  let fetchCoordenadores: EquipeEncontroData[] = []
  let fetchTropa: EquipeEncontroData[] = []

  if (equipeEncontro) {
    if (pertenceARosa(equipeEncontro.idEquipe)) {
      const rosa = await prisma.equipeEncontro.findMany({
        select: {
          idEquipe: true,
          encontreiro: {
            select: {
              pessoa: {
                select: {
                  nome: true,
                  apelido: true,
                  avatarUrl: true,
                },
              },
            },
          },
        },
        where: {
          idEncontro: encontro.id,
          OR: [
            { idEquipe: 'vigilia' },
            { idEquipe: 'recepcao' },
            { idEquipe: 'compras' },
            { idEquipe: 'externa' },
            { idEquipe: 'meditacao' },
          ],
          NOT: [{ idPessoa: encontreiro.id }],
        },
      })
      fetchCoordenadores = rosa.filter(
        (equipe) => equipe.idEquipe === equipeEncontro.idEquipe,
      )

      fetchTropa = rosa.filter(
        (equipe) => equipe.idEquipe !== equipeEncontro.idEquipe,
      )
    } else if (pertenceASala(equipeEncontro.idEquipe)) {
      fetchCoordenadores = await prisma.equipeEncontro.findMany({
        select: {
          encontreiro: {
            select: {
              pessoa: {
                select: {
                  nome: true,
                  apelido: true,
                  avatarUrl: true,
                },
              },
            },
          },
        },
        where: {
          idEncontro: encontro.id,
          idEquipe: 'apresentacao',
          NOT: [{ idPessoa: encontreiro.id }],
        },
      })

      fetchTropa = await prisma.equipeEncontro.findMany({
        select: {
          encontreiro: {
            select: {
              pessoa: {
                select: {
                  nome: true,
                  apelido: true,
                  avatarUrl: true,
                },
              },
            },
          },
        },
        where: {
          idEncontro: encontro.id,
          OR: [
            { idEquipe: 'boa_vontade' },
            { idEquipe: 'tio_aparente' },
            { idEquipe: 'tio_circulo' },
            { idEquipe: 'tio_secreto' },
          ],
          NOT: [{ idPessoa: encontreiro.id }],
        },
      })
    } else {
      fetchCoordenadores = await prisma.equipeEncontro.findMany({
        select: {
          encontreiro: {
            select: {
              pessoa: {
                select: {
                  nome: true,
                  apelido: true,
                  avatarUrl: true,
                },
              },
            },
          },
        },
        where: {
          coordenou: true,
          idEquipe: equipeEncontro.idEquipe,
          idEncontro: encontro.id,
          NOT: [{ idPessoa: encontreiro.id }],
        },
      })

      fetchTropa = await prisma.equipeEncontro.findMany({
        select: {
          encontreiro: {
            select: {
              pessoa: {
                select: {
                  nome: true,
                  apelido: true,
                  avatarUrl: true,
                },
              },
            },
          },
        },
        where: {
          coordenou: false,
          idEquipe: equipeEncontro.idEquipe,
          idEncontro: encontro.id,
          NOT: [{ idPessoa: encontreiro.id }],
        },
      })
    }
  }
  const coordenadores: encontreiroEmEquipe[] = fetchCoordenadores.map(
    (coordenador) => {
      return {
        nome: coordenador.encontreiro.pessoa.apelido
          ? coordenador.encontreiro.pessoa.apelido
          : coordenador.encontreiro.pessoa.nome,
        avatarUrl: coordenador.encontreiro.pessoa.avatarUrl,
      }
    },
  )
  const tropa: encontreiroEmEquipe[] = fetchTropa.map((tropa) => {
    return {
      nome: tropa.encontreiro.pessoa.apelido
        ? tropa.encontreiro.pessoa.apelido
        : tropa.encontreiro.pessoa.nome,
      avatarUrl: tropa.encontreiro.pessoa.avatarUrl,
    }
  })

  const equipeNome = equipeEncontro
    ? pertenceARosa(equipeEncontro.idEquipe)
      ? `${equipeEncontro.equipe.equipeLabel} (Rosa)`
      : pertenceASala(equipeEncontro.idEquipe)
        ? `${equipeEncontro.equipe.equipeLabel} (Sala)`
        : equipeEncontro.equipe.equipeLabel
    : 'Não alocado'

  const profile: ProfileData = {
    nome: `${encontreiro.nome} ${encontreiro.sobrenome}`,
    avatarUrl: encontreiro.avatarUrl || undefined,
    role: encontreiro.role,
    numeroEncontro: encontreiro.encontreiro?.encontro?.numeroEncontro,
    corCirculo: encontreiro.encontreiro?.circulo?.corCirculo.cor,
    equipeEncontro: equipeNome,
    equipeEncontroCoord: equipeEncontro ? equipeEncontro.coordenou : false,
    pastaURL:
      equipeEncontro &&
      equipeEncontro.coordenou &&
      equipeEncontro.equipe.pastaUrl
        ? equipeEncontro.equipe.pastaUrl
        : '',
    fichaCadastro: equipeEncontro ? equipeEncontro.fichaPreenchida : false,
    coordenadores,
    tropa,
  }
  return profile
}
