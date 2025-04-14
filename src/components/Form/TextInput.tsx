import {
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form'

export interface TextInputProps {
  label?: string
  description?: string
  children: React.ReactNode
}

export function TextInput({ label, description, children }: TextInputProps) {
  return (
    <FormItem>
      <label className="flex flex-col gap-2">
        <div className="flex flex-col">
          {label && <FormLabel className="font-medium">{label}</FormLabel>}
          {description && (
            <FormDescription className="mt-1 text-xs text-zinc-500">
              {description}
            </FormDescription>
          )}
        </div>
        <FormControl>{children}</FormControl>
      </label>
      <FormMessage />
    </FormItem>
  )
}
