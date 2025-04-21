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
  children: React.ReactNode
  disabled?: boolean
  onChange: () => void
}

export function SelectGroupInput({
  label,
  value,
  description,
  placeholder = '',
  children,
  disabled = false,
  onChange,
  ...props
}: SelectGroupInputProps) {
  return (
    <FormItem {...props}>
      <label className="flex flex-col gap-2">
        {label && <FormLabel>{label}</FormLabel>}
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
