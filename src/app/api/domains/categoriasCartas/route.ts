import { NextResponse } from 'next/server'
import { getCategoriasCartas } from './get-categorias'

export async function GET() {
  const categoriasCartas = await getCategoriasCartas()

  return NextResponse.json(categoriasCartas)
}
