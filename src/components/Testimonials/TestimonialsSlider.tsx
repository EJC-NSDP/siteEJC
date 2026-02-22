'use client'

import { CircleChevronLeft, CircleChevronRight } from 'lucide-react'
import React, { useEffect, useState } from 'react'

import { Button } from '../ui/button'

import { cn } from '@/lib/utils'

interface TestimonialsSliderProps {
  content: React.ReactNode[]
  autoSlide?: boolean
  autoSlideInterval?: number
}

export function TestimonialsSlider({
  content,
  autoSlide,
  autoSlideInterval,
}: TestimonialsSliderProps) {
  const [index, setIndex] = useState(0)

  const prevFunc = () => setIndex(index - 1)
  const nextFunc = () => setIndex(index + 1)

  useEffect(() => {
    const lastIndex = content.length - 1
    if (index < 0) {
      setIndex(lastIndex)
    }
    if (index > lastIndex) {
      setIndex(0)
    }
  }, [index, content.length])

  useEffect(() => {
    if (autoSlide) {
      const slider = setInterval(() => {
        setIndex(index + 1)
      }, autoSlideInterval)
      return () => {
        clearInterval(slider)
      }
    }
  }, [index, autoSlideInterval, autoSlide])

  return (
    <section>
      <div className="max-w-carousel relative flex w-80 overflow-hidden pt-8 text-center lg:w-full lg:pt-16">
        {content.map((testimonial, indexTestimonial) => {
          //   Outbound Slide
          let positionCSS = 'opacity-50 order-last scale-75 hidden lg:flex'

          //   Next Slide
          if (indexTestimonial === index + 1) {
            positionCSS = 'opacity-50 order-3 scale-75 hidden lg:flex'
          }

          //   Active Slide
          if (indexTestimonial === index) {
            positionCSS =
              'opacity-100 order-2 scale-100 delay-75 transition-transform'
          }

          // Last Slide
          if (
            indexTestimonial === index - 1 ||
            (index === 0 && indexTestimonial === content.length - 1)
          ) {
            positionCSS = 'opacity-50 order-1 scale-75 hidden lg:flex'
          }
          return (
            <article className={cn('', positionCSS)} key={indexTestimonial}>
              {testimonial}
            </article>
          )
        })}
        <Button
          variant="ghost"
          className="absolute top-11/20 left-0 z-30 cursor-pointer rounded-full lg:left-1/3"
          onClick={prevFunc}
        >
          <CircleChevronLeft className="text-secondary h-12 w-12" />
        </Button>
        <Button
          variant="ghost"
          className="absolute top-11/20 right-0 z-30 cursor-pointer rounded-full lg:right-1/3"
          onClick={nextFunc}
        >
          <CircleChevronRight className="text-secondary h-12 w-12" />
        </Button>
      </div>
    </section>
  )
}
