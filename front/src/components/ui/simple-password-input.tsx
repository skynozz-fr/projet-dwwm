import { useState } from "react"
import { EyeIcon, EyeOffIcon } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface SimplePasswordInputProps {
  label?: string
  placeholder?: string
  value?: string
  onChange?: (value: string) => void
  required?: boolean
  className?: string
}

export const SimplePasswordInput = ({
  label = "Mot de passe",
  placeholder = "Votre mot de passe",
  value,
  onChange,
  required = false,
  className
}: SimplePasswordInputProps) => {
  const [isVisible, setIsVisible] = useState(false)
  
  const toggleVisibility = () => setIsVisible(!isVisible)
  
  return (
    <div className="space-y-2">
      <Label className="text-foreground">
        {label} {required && <span className="text-error">*</span>}
      </Label>
      <div className="relative">
        <Input
          type={isVisible ? "text" : "password"}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          className={`pr-10 ${className}`}
          required={required}
        />
        <button
          type="button"
          onClick={toggleVisibility}
          className="absolute inset-y-0 right-0 flex h-full w-10 items-center justify-center rounded-r-md text-muted-foreground hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-colors"
          aria-label={isVisible ? "Masquer le mot de passe" : "Afficher le mot de passe"}
        >
          {isVisible ? (
            <EyeOffIcon size={16} />
          ) : (
            <EyeIcon size={16} />
          )}
        </button>
      </div>
    </div>
  )
}
