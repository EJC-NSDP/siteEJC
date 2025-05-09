import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { CircleHelp } from 'lucide-react'
import { useEffect, useState } from 'react'
import {
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../ui/form'
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from '../../ui/select'

export type SelectGroupInputProps = React.ComponentPropsWithoutRef<
  typeof FormItem
> & {
  label?: string
  value: string | undefined
  description?: string
  placeholder?: string
  tip?: React.ReactNode
  children: React.ReactNode
  disabled?: boolean
  onChange: () => void
}

export function SelectGroupInput({
  label,
  value,
  description,
  placeholder = '',
  tip,
  children,
  disabled = false,
  onChange,
  ...props
}: SelectGroupInputProps) {
  const [open, setOpen] = useState(false)
  const [isTouch, setIsTouch] = useState(false)

  useEffect(() => {
    setIsTouch(window.matchMedia('(pointer: coarse)').matches)
  }, [])

  const handleClick = () => setOpen((prev) => !prev)
  const handleMouseEnter = () => !isTouch && setOpen(true)
  const handleMouseLeave = () => !isTouch && setOpen(false)

  return (
    <FormItem {...props}>
      <label className="flex flex-col gap-2">
        <Tooltip open={open} onOpenChange={setOpen} delayDuration={0}>
          <div className="flex items-center gap-2">
            {label && <FormLabel>{label}</FormLabel>}{' '}
            {tip && (
              <>
                <TooltipTrigger
                  type="button"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                  onClick={handleClick}
                >
                  <CircleHelp className="size-4 cursor-pointer" />
                </TooltipTrigger>
                <TooltipContent className="w-80 lg:w-100">{tip}</TooltipContent>
              </>
            )}
          </div>
        </Tooltip>
        <Select disabled={disabled} onValueChange={onChange} value={value}>
          <FormControl>
            <SelectTrigger className="houtline-none">
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
          </FormControl>
          <SelectContent>{children}</SelectContent>
        </Select>
        {description && <FormDescription>{description}</FormDescription>}
      </label>
      <FormMessage />
    </FormItem>
  )
}
