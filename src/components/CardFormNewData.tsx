import { useRouter } from 'next/navigation'
import { ReactNode } from 'react'
import { useWizard } from 'react-use-wizard'

import { MultiStepGeneral } from '@/components/MultiStepGeneral'
import { Button } from '@/components/ui/button'
import { CardContent, CardFooter } from '@/components/ui/card'

interface CardParticipeProps {
  children: ReactNode
  title: string
  isSubmitting: boolean
  urlBack: string
}

export function CardFormNewData({
  children,
  title,
  isSubmitting,
  urlBack,
}: CardParticipeProps) {
  const { previousStep, activeStep, stepCount } = useWizard()
  const router = useRouter()

  const backToTable = () => {
    router.replace(urlBack)
  }

  return (
    <>
      <CardContent className="w-full px-3 py-0">
        <div className="flex items-center justify-between gap-3">
          <span className="text-2xl font-bold lg:text-nowrap">{title}</span>
          <MultiStepGeneral size={stepCount} currentStep={activeStep} />
        </div>
        <div className="flex flex-col gap-10 px-0 py-10 text-lg lg:gap-14 lg:py-14">
          {children}
        </div>
      </CardContent>
      <CardFooter className="w-full px-3 py-0">
        <div className="flex w-full justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={activeStep === 0 ? backToTable : previousStep}
          >
            Voltar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            Avançar
          </Button>
        </div>
      </CardFooter>
    </>
  )
}
