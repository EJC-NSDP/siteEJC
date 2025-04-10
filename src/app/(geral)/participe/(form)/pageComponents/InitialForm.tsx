import { Button } from '@/components/ui/button'
import {
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { CreateEncontristaContext } from '@/context/CreateEncontristaContext'
import dayjs from 'dayjs'
import { useContext } from 'react'
import { useWizard } from 'react-use-wizard'

interface CardWithEncontroProps {
  date: Date
}

function CardWithEncontro({ date }: CardWithEncontroProps) {
  const friday = dayjs(date).format('DD/MM')
  const saturday = dayjs(date).add(1, 'day').format('DD/MM')
  const sunday = dayjs(date).add(2, 'day').format('DD/MM')
  const year = dayjs(date).format('YYYY')

  return (
    <>
      <p>
        Que bom te ver por aqui!
        <br />
        Nosso próximo encontrão acontecerá nos dias:
      </p>
      <p className="text-2xl font-bold text-violet-600 dark:text-violet-400">
        {`${friday}, ${saturday} e ${sunday} de ${year}`}
      </p>
      <p>
        Para realizar sua inscrição, vamos fazer algumas perguntas para te
        conhecer melhor e preparar um fim de semana inesquecível para você.
      </p>
    </>
  )
}

function CardWithoutEncontro() {
  return (
    <>
      <p>
        Que bom que chegou até aqui!
        <br />
        Nosso próximo encontrão ainda não tem data marcada.Mas não desanime,
        você já pode se inscrever.
      </p>
      <p>
        Para isso, vamos fazer algumas perguntas para te conhecer melhor e
        preparar um fim de semana inesquecível para você.
      </p>

      <p>Vamos começar?</p>
    </>
  )
}

interface InitialFormProps {
  dataEncontro: Date | null
}

export function InitialForm({ dataEncontro }: InitialFormProps) {
  const { nextStep, handleStep, activeStep } = useWizard()

  const { updateData } = useContext(CreateEncontristaContext)

  function handleForward() {
    const emptyData = undefined
    handleStep(() => {
      updateData({ data: emptyData, step: activeStep })
    })
    nextStep()
  }

  return (
    <div className="text-center">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Olá!</CardTitle>
      </CardHeader>
      <CardContent className="flex w-full flex-col gap-3 px-3 text-lg">
        {dataEncontro !== null ? (
          <CardWithEncontro date={dataEncontro} />
        ) : (
          <CardWithoutEncontro />
        )}
      </CardContent>
      <CardFooter className="w-full px-3 py-0">
        <Button className="w-full" onClick={handleForward}>
          Vamos!
        </Button>
      </CardFooter>
    </div>
  )
}
