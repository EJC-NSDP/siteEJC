const DIAS_APOS_INICIO = 3

export function isAvaliacaoDisponivel(dataInicio: Date | string): boolean {
  const liberadoEm = new Date(dataInicio)
  liberadoEm.setDate(liberadoEm.getDate() + DIAS_APOS_INICIO)
  return new Date() >= liberadoEm
}
