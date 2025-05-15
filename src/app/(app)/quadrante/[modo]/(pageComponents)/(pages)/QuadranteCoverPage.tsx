import Image from 'next/image'

interface QuadranteCoverPageProps {
  imageUrl: string
  alt: string
}

export function QuadranteCoverPage({ imageUrl, alt }: QuadranteCoverPageProps) {
  return (
    <div className="page-break relative flex h-sheet w-sheet flex-wrap items-start justify-center bg-white px-2 py-4 print:mx-auto">
      <Image
        src={imageUrl}
        width={1748}
        height={2480}
        alt={alt}
        className="h-full w-full"
      />
    </div>
  )
}
