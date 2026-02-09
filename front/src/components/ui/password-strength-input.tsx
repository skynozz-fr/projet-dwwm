import { useEffect, useId, useMemo, useState } from "react"
import { CheckIcon, EyeIcon, EyeOffIcon, XIcon } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type PasswordStrengthInputProps = {
  label?: string
  placeholder?: string
  value?: string
  onChange?: (password: string) => void
  showStrength?: boolean
  onValidationChange?: (isValid: boolean) => void
}

export const PasswordStrengthInput = ({
  label = "Mot de passe",
  placeholder = "Votre mot de passe",
  value: controlledValue,
  onChange,
  showStrength = false,
  onValidationChange,
}: PasswordStrengthInputProps) => {
  const id = useId()
  const [internalPassword, setInternalPassword] = useState("")
  const [isVisible, setIsVisible] = useState<boolean>(false)

  const password = controlledValue !== undefined ? controlledValue : internalPassword

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value
    if (controlledValue !== undefined && onChange) onChange(newPassword)
    else setInternalPassword(newPassword)
  }

  const strength = useMemo(
    () => [
      { met: /.{8,}/.test(password), text: "Au moins 8 caracteres" },
      { met: /[0-9]/.test(password), text: "Au moins 1 chiffre" },
      { met: /[a-z]/.test(password), text: "Au moins 1 lettre minuscule" },
      { met: /[A-Z]/.test(password), text: "Au moins 1 lettre majuscule" },
    ],
    [password]
  )

  const strengthScore = useMemo(() => strength.filter((req) => req.met).length, [strength])

  useEffect(() => {
    const isValid = strengthScore === 4 && password.length > 0
    onValidationChange?.(isValid)
  }, [strengthScore, password.length, onValidationChange])

  const strengthTone =
    strengthScore === 4 ? "bg-success" : strengthScore >= 2 ? "bg-warning" : strengthScore >= 1 ? "bg-error" : "bg-border"

  const strengthText =
    strengthScore === 0
      ? "Saisissez un mot de passe"
      : strengthScore <= 2
      ? "Mot de passe faible"
      : strengthScore === 3
      ? "Mot de passe moyen"
      : "Mot de passe fort"

  return (
    <div>
      <div className="space-y-1.5">
        <Label htmlFor={id} className="text-sm text-foreground/90">
          {label} <span className="text-error">*</span>
        </Label>
        <div className="relative">
          <Input
            id={id}
            className="pr-10"
            placeholder={placeholder}
            type={isVisible ? "text" : "password"}
            value={password}
            onChange={handlePasswordChange}
            aria-describedby={showStrength ? `${id}-description` : undefined}
            required
          />
          <button
            className="absolute inset-y-0 right-0 flex h-full w-10 items-center justify-center rounded-r-md text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
            type="button"
            onClick={() => setIsVisible((prev) => !prev)}
            aria-label={isVisible ? "Masquer le mot de passe" : "Afficher le mot de passe"}
            aria-pressed={isVisible}
          >
            {isVisible ? <EyeOffIcon size={16} aria-hidden="true" /> : <EyeIcon size={16} aria-hidden="true" />}
          </button>
        </div>
      </div>

      {showStrength && (
        <>
          <div className="mt-3 mb-4 h-1.5 w-full overflow-hidden rounded-full bg-surface-2" role="progressbar" aria-valuenow={strengthScore} aria-valuemin={0} aria-valuemax={4} aria-label="Force du mot de passe">
            <div className={`h-full ${strengthTone} transition-all duration-300`} style={{ width: `${(strengthScore / 4) * 100}%` }} />
          </div>

          <p id={`${id}-description`} className="mb-2 text-sm font-semibold text-foreground">
            {strengthText}
          </p>

          <ul className="space-y-1.5" aria-label="Exigences du mot de passe">
            {strength.map((req, index) => (
              <li key={index} className="flex items-center gap-2">
                {req.met ? <CheckIcon size={16} className="text-success" aria-hidden="true" /> : <XIcon size={16} className="text-error" aria-hidden="true" />}
                <span className={`text-xs ${req.met ? "text-success" : "text-error"}`}>{req.text}</span>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  )
}
