import { redirect } from 'next/navigation'

export default function Maintenance() {
  redirect('/')
  return (
    <div className="bg-primary flex h-screen w-full items-center justify-center">
      <h1 className="text-3xl text-white">
        Estamos temporariamente fora do ar. Retornaremos as atividades em breve.
      </h1>
    </div>
  )
}
