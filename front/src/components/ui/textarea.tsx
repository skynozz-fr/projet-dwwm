import { useId } from "react"

import { Label } from "@/components/ui/label"
import { TextareaBase } from "@/components/ui/textarea-base"

type TextareaProps = {
  label: string
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  rows?: number
  className?: string
  required?: boolean
}

export const Textarea = ({ 
  label, 
  value, 
  onChange, 
  placeholder = "Tapez votre texte ici...", 
  rows = 3,
  className = "",
  required = false
}: TextareaProps) => {
  const id = useId()
  
  return (
    <div className={`*:not-first:mt-2 ${className}`}>
      <Label htmlFor={id}>
        {label} {required && <span className="text-error">*</span>}
      </Label>
      <TextareaBase 
        id={id} 
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        rows={rows}
        required={required}
        aria-required={required}
      />
    </div>
  )
}