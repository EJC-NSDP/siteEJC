import { Button } from '@/components/ui/button'

export interface ButaoAcaoProps {
  state: boolean
  content: string
  altContent: string
  handleAction: () => void
}

export function BotaoAcao({
  state,
  content,
  altContent,
  handleAction,
}: ButaoAcaoProps) {
  return (
    <Button
      disabled={state}
      className="disabled:cursor-not-allowed disabled:bg-zinc-300"
      onClick={handleAction}
    >
      {state ? altContent : content}
    </Button>
  )
}
