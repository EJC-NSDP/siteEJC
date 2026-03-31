import { getCurrentEncontro } from '../get-current-encontro/get-current-encontro'

export interface TemasEncontroData {
  temaFantasia: string | null
  temaEspiritual: string | null
}

export async function getTemas(): Promise<TemasEncontroData | null> {
  const currentEncontro = await getCurrentEncontro()
  if (!currentEncontro) {
    return null
  }

  return {
    temaFantasia: currentEncontro.temaFantasia,
    temaEspiritual: currentEncontro.temaEspiritual,
  }
}
