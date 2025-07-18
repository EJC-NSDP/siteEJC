import { redirect } from 'next/navigation'

export default function Maintenance() {
  redirect('/')
  return (
    <div className="flex h-screen w-full items-center justify-center bg-primary">
      <h1 className="text-3xl text-white">
        Estamos temporariamente fora do ar. Retornaremos as atividades em breve.
      </h1>
    </div>
  )
}
