import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { CircleHelp } from 'lucide-react'
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
  return (
    <FormItem {...props}>
      <label className="flex flex-col gap-2">
        <Tooltip>
          <div className="flex items-center gap-2">
            {label && <FormLabel>{label}</FormLabel>}{' '}
            {tip && (
              <>
                <TooltipTrigger type="button">
                  <CircleHelp className="size-4 cursor-auto" />
                </TooltipTrigger>
                <TooltipContent className="w-100">{tip}</TooltipContent>
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
