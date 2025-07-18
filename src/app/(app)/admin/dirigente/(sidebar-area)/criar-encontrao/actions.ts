import { api } from '@/lib/axios'

export async function actionResetRoles() {
  return await api.patch('encontro/reset-roles')
}

export async function actionChangeEncontristas() {
  return await api.patch('encontro/change-encontristas')
}

export async function actionLimparCartas() {
  return await api.patch('encontro/limpar-cartas')
}

export async function actionLimparMontagem() {
  return await api.patch('encontro/limpar-montagem')
}
