import dayjs from 'dayjs'
import { Check, X } from 'lucide-react'
import { useContext, useEffect } from 'react'
import { useWizard } from 'react-use-wizard'

import { Button } from '@/components/ui/button'
import {
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { CreateEncontristaContext } from '@/context/CreateEncontristaContext'

import 'dayjs/locale/pt-br'
dayjs.locale('pt-br')

interface FinalFormProps {
  dataEncontro: Date | null
}
function SuccessCreation({ dataEncontro }: FinalFormProps) {
  const friday = dayjs(dataEncontro)
  const saturday = dayjs(dataEncontro).add(1, 'day')
  const sunday = dayjs(dataEncontro).add(2, 'day')
  const year = friday.format('YYYY')

  const sameMonth =
    friday.month() === saturday.month() && saturday.month() === sunday.month()

  let formattedDates: string

  if (sameMonth) {
    // Ex: "10, 11 e 12 de Outubro de 2025"
    const monthName =
      friday.format('MMMM').charAt(0).toUpperCase() +
      friday.format('MMMM').slice(1)

    formattedDates = `${friday.format('D')}, ${saturday.format('D')} e ${sunday.format('D')} de ${monthName} de ${year}`
  } else {
    // Ex: "10/10, 11/10 e 12/11 de 2025"
    formattedDates = `${friday.format('DD/MM')}, ${saturday.format('DD/MM')} e ${sunday.format('DD/MM')} de ${year}`
  }

  return (
    <>
      <CardHeader className="flex w-full flex-col items-center gap-6 py-0">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-violet-600 text-zinc-50">
          <Check className="h-9 w-9 p-1" />
        </div>
        <CardTitle className="text-2xl font-bold text-zinc-700">
          Inscrição concluída!
        </CardTitle>
      </CardHeader>
      <CardContent className="flex w-full flex-col gap-3 px-3 text-lg">
        {dataEncontro ? (
          <>
            <p>
              Agora é só esperar a ligação de nossa equipe para confirmar sua
              participação nos dias:
            </p>
            <p className="text-2xl font-bold text-violet-600 dark:text-violet-400">
              {formattedDates}
            </p>
            <p>Nos vemos lá!</p>
          </>
        ) : (
          <p>
            Agora é só esperar a ligação de nossa equipe para confirmar sua
            participação e a data do encontro.
          </p>
        )}
      </CardContent>
    </>
  )
}

function FailCreation() {
  return (
    <>
      <CardHeader className="flex w-full flex-col items-center gap-6 py-0">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-600 text-zinc-50">
          <X className="h-9 w-9 p-1" />
        </div>
        <CardTitle className="text-2xl font-bold text-zinc-700">
          Houve um erro ao criar sua inscrição!
        </CardTitle>
      </CardHeader>
      <CardContent className="flex w-full flex-col gap-3 px-3 text-lg">
        <p>
          Pedimos perdão mas tivemos um erro ao cadastrar sua inscrição. Pedimos
          que comunique quem te convidou para o encontro ou tente novamente mais
          tarde.
        </p>
      </CardContent>
    </>
  )
}

function SendingCreation() {
  return (
    <>
      <CardHeader className="flex w-full flex-col items-center gap-6 py-0">
        <Skeleton className="h-16 w-16 rounded-full" />
        <Skeleton className="h-8 w-[470px]" />
      </CardHeader>
      <CardContent className="flex w-full flex-col gap-3 px-3 py-2 text-lg">
        <Skeleton className="h-20 w-[520px]" />
      </CardContent>
    </>
  )
}

export function FinalForm({ dataEncontro }: FinalFormProps) {
  const { clearForm, userCreated, createNewEncontrista } = useContext(
    CreateEncontristaContext,
  )
  const { goToStep } = useWizard()

  function resetForm() {
    clearForm()
    goToStep(1)
  }

  useEffect(() => {
    createNewEncontrista()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="text-center">
      {userCreated === 'created' && (
        <SuccessCreation dataEncontro={dataEncontro} />
      )}
      {userCreated === 'error' && <FailCreation />}
      {userCreated === 'not sent' && <SendingCreation />}
      <CardFooter className="w-full px-3 py-0">
        <Button
          className="w-full"
          disabled={userCreated === 'not sent'}
          onClick={resetForm}
        >
          Voltar ao site
        </Button>
      </CardFooter>
    </div>
  )
}
