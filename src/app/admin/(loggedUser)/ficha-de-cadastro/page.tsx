'use client'

import type { EncontreiroCadastroData } from '@/app/api/encontreiro/[id]/ficha-cadastro/get-encontreiro-cadastro'
import { api } from '@/lib/axios'
import { getSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { useEffect, useState } from 'react'
import { FichaCadastroForm } from './FichaCadastroForm'
import { InitialCard } from './pageComponents/InitialCard'

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

  const [next, setNext] = useState<boolean>(false)

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
      {!next ? (
        <div className="w-11/12 px-0 lg:w-card lg:px-8">
          <InitialCard loaded={!!encontreiroData} updateNext={setNext} />
        </div>
      ) : (
        <FichaCadastroForm data={encontreiroData!} />
      )}
    </div>
  )
}
