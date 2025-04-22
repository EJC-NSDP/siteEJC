'use client'

import type { EncontreiroCadastroData } from '@/app/api/encontreiro/[id]/ficha-cadastro/get-encontreiro-cadastro'
import { CardLoading } from '@/components/CardLoading'
import { api } from '@/lib/axios'
import { getSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { useEffect, useState } from 'react'
import { FichaCadastroForm } from './FichaCadastroForm'

async function getEncontreiro(id: string) {
  const res = await api.get(`encontreiro/${id}/ficha-cadastro`)

  if (res.status !== 200) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error('Failed to fetch data')
  }

  const encontreiro = await res.data

  return encontreiro
}

export default function FichaCadastro() {
  const [encontreiroData, setEncontreiroData] = useState<
    EncontreiroCadastroData | undefined
  >(undefined)

  useEffect(() => {
    async function fetchSession() {
      const session = await getSession()

      if (!session) {
        redirect('/login')
      }

      const encontreiro: EncontreiroCadastroData = await getEncontreiro(
        session.user.id,
      )

      setEncontreiroData(encontreiro)
    }
    fetchSession()
  }, [])

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-4">
      <span className="text-4xl font-bold text-white">Ficha de Cadastro</span>
      {encontreiroData === undefined ? (
        <CardLoading />
      ) : (
        <FichaCadastroForm data={encontreiroData} />
      )}
    </div>
  )
}
