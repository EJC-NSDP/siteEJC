import { getCurrentEncontro } from '../get-current-encontro/get-current-encontro'

export async function isEncontroOpen(): Promise<boolean> {
  const currentEncontro = await getCurrentEncontro()

  return currentEncontro ? currentEncontro.numeroCirculos !== 0 : false
}
