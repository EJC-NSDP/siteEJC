interface QuadranteOnePageProps {
  children: React.ReactNode
}

export function QuadranteOnePage({ children }: QuadranteOnePageProps) {
  return (
    <div className="flex h-sheet w-sheet flex-col gap-8 bg-white p-8">
      {children}
    </div>
  )
}
