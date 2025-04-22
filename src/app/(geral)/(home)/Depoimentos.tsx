import { TestimonialsSlider } from '@/components/Testimonials/TestimonialsSlider'
import type { ReactNode } from 'react'
import { DepoimentoItem } from './(pageComponents)/DepoimentoItem'

// const depoimentosContent: ReactNode[] = [
//   <DepoimentoItem
//     key={0}
//     text="O EJC me trouxe amigos que vou levar para a vida inteira, além de experiências incríveis também! Sou muito grata ao movimento <3"
//     sourcePicture="https://res.cloudinary.com/ejc-nsdp/image/upload/v1713900085/people/225_iytfia.jpg"
//     name="Andressa Correa"
//     encontro="62"
//     since="2017"
//   />,
//   <DepoimentoItem
//     key={1}
//     text="O EJC mudou minha vida porque eu conheci o Globar, e agora eu como pastel de nutella diariamente."
//     sourcePicture=""
//     name="Antônio Alves"
//     encontro="55"
//     since="2014"
//   />,
//   <DepoimentoItem
//     key={2}
//     text="O EJC mudou minha vida porque eu conheci o Antônio que me apresentou o Globar, e agora eu como pastel de nutella diariamente."
//     sourcePicture="https://res.cloudinary.com/ejc-nsdp/image/upload/people/53_bvinkk.jpg"
//     name="João Paulo Pugialli"
//     encontro="56"
//     since="2014"
//   />,
//   <DepoimentoItem
//     key={3}
//     text="O EJC mudou minha vida porque eu me apaixonei pelo João Paulo que me apresentou o Globar, e agora eu como pastel de nutella diariamente."
//     sourcePicture=""
//     name="Amanda Padilha"
//     encontro="56"
//     since="2014"
//   />,
// ]

const depoimentosContent: ReactNode[] = [
  <DepoimentoItem
    key={0}
    text="O EJC me trouxe amigos que vou levar para a vida inteira, além de experiências incríveis também! Sou muito grata ao movimento <3"
    sourcePicture="https://res.cloudinary.com/ejc-nsdp/image/upload/v1713900085/people/andressafotos1988-62.jpg"
    name="Andressa Correa"
    encontro="62"
    since="2017"
  />,
  <DepoimentoItem
    key={1}
    text="O EJC mudou minha vida porque conheci pessoas incríveis que me aproximam de Deus e com quem posso dividir a vida fora da igreja também!"
    sourcePicture="https://res.cloudinary.com/ejc-nsdp/image/upload/v1717706265/people/luvidalmb-64.jpg"
    name="Luana Vidal"
    encontro="62"
    since="2016"
  />,
  <DepoimentoItem
    key={2}
    text="Ele foi o meu sorriso o meu amor e a minha vida!"
    sourcePicture="https://res.cloudinary.com/ejc-nsdp/image/upload/v1717705923/people/anamargaret22222-2.jpg"
    name="Ana Margaret Pereira"
    encontro="2"
    since="1987"
  />,
  <DepoimentoItem
    key={3}
    text="O EJC mudou a minha vida, pois trouxe a minha fé de volta e me deu uma linda família! Esse movimento salva vidas."
    sourcePicture="https://res.cloudinary.com/ejc-nsdp/image/upload/v1713900074/people/lucas-zirretta-66.jpg"
    name="Lucas Zirretta"
    encontro="66"
    since="2019"
  />,
  <DepoimentoItem
    key={4}
    text="O EJC fez mudar a minha perspectiva de vida! Fora que pude conhecer pessoas maravilhosas das quais, hoje em dia, não consigo viver sem!"
    sourcePicture="https://res.cloudinary.com/ejc-nsdp/image/upload/v1717705874/people/paivabarbara1-62.jpg"
    name="Bárbara Paiva"
    encontro="62"
    since="2017"
  />,
  <DepoimentoItem
    key={5}
    text="O Ejc, não é um simples movimento de jovens com Cristo, é na verdade um encontro com você mesmo, com Deus, com a vida, fiz amizades que espero levar pra vida! Sou completamente apaixonada."
    sourcePicture="https://res.cloudinary.com/ejc-nsdp/image/upload/v1713900075/people/estherbrollo020-66.jpg"
    name="Esther Brollo"
    encontro="66"
    since="2019"
  />,
  <DepoimentoItem
    key={6}
    text="O EJC é o lugar onde encontrei amizades pra vida. Onde pude me aprofundar na relação com Deus e na vida em comunidade!"
    sourcePicture="https://res.cloudinary.com/ejc-nsdp/image/upload/v1713900091/people/pedroprallon-54.jpg"
    name="Pedro Prallon"
    encontro="54"
    since="2013"
  />,
]

export function Depoimentos() {
  return (
    <section className="flex flex-col items-center px-10 py-16 lg:px-20 lg:py-32">
      <h2 className="w-9/10 text-center text-lg font-bold text-white lg:w-2/5 lg:text-4xl">
        Um movimento que muda vidas há mais de{' '}
        <span className="text-secondary">30 anos</span>
      </h2>
      <TestimonialsSlider
        content={depoimentosContent}
        autoSlide
        autoSlideInterval={10000}
      />
    </section>
  )
}
