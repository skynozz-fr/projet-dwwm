import { useId, useMemo, useState } from "react"
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
  onValidationChange
}: PasswordStrengthInputProps) => {
  const id = useId()
  const [internalPassword, setInternalPassword] = useState("")
  const [isVisible, setIsVisible] = useState<boolean>(false)

  const password = controlledValue !== undefined ? controlledValue : internalPassword

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value
    if (controlledValue !== undefined && onChange) {
      onChange(newPassword)
    } else {
      setInternalPassword(newPassword)
    }
  }

  const toggleVisibility = () => setIsVisible((prevState) => !prevState)

  const checkStrength = (pass: string) => {
    const requirements = [
      { regex: /.{8,}/, text: "Au moins 8 caractères" },
      { regex: /[0-9]/, text: "Au moins 1 chiffre" },
      { regex: /[a-z]/, text: "Au moins 1 lettre minuscule" },
      { regex: /[A-Z]/, text: "Au moins 1 lettre majuscule" },
    ]

    return requirements.map((req) => ({
      met: req.regex.test(pass),
      text: req.text,
    }))
  }

  const strength = checkStrength(password)

  const strengthScore = useMemo(() => {
    return strength.filter((req) => req.met).length
  }, [strength])

  // Notifier le parent si le mot de passe est valide (tous les critères remplis)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const isPasswordValid = useMemo(() => {
    const isValid = strengthScore === 4 && password.length > 0
    if (onValidationChange) {
      onValidationChange(isValid)
    }
    return isValid
  }, [strengthScore, password.length, onValidationChange])

  const getStrengthColor = (score: number) => {
    if (score === 0) return "bg-border"
    if (score <= 1) return "bg-error"
    if (score <= 2) return "bg-warning"
    if (score === 3) return "bg-warning"
    return "bg-success"
  }

  const getStrengthText = (score: number) => {
    if (score === 0) return "Saisissez un mot de passe"
    if (score <= 2) return "Mot de passe faible"
    if (score === 3) return "Mot de passe moyen"
    return "Mot de passe fort"
  }

  return (
    <div>
      {/* Password input field with toggle visibility button */}
      <div className="space-y-2">
        <Label htmlFor={id} className="text-foreground">
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
            className="absolute inset-y-0 right-0 flex h-full w-10 items-center justify-center rounded-r-md text-muted-foreground hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-colors"
            type="button"
            onClick={toggleVisibility}
            aria-label={isVisible ? "Masquer le mot de passe" : "Afficher le mot de passe"}
            aria-pressed={isVisible}
          >
            {isVisible ? (
              <EyeOffIcon size={16} aria-hidden="true" />
            ) : (
              <EyeIcon size={16} aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Password strength indicator - only show if enabled */}
      {showStrength && (
        <>
          <div
            className="mt-3 mb-4 h-1 w-full overflow-hidden rounded-full bg-border"
            role="progressbar"
            aria-valuenow={strengthScore}
            aria-valuemin={0}
            aria-valuemax={4}
            aria-label="Force du mot de passe"
          >
            <div
              className={`h-full ${getStrengthColor(strengthScore)} transition-all duration-500 ease-out`}
              style={{ width: `${(strengthScore / 4) * 100}%` }}
            ></div>
          </div>

          {/* Password strength description */}
          <p
            id={`${id}-description`}
            className="mb-2 text-sm font-medium text-foreground"
          >
            {getStrengthText(strengthScore)}
          </p>

          {/* Password requirements list */}
          <ul className="space-y-1.5" aria-label="Exigences du mot de passe">
            {strength.map((req, index) => (
              <li key={index} className="flex items-center gap-2">
                {req.met ? (
                  <CheckIcon
                    size={16}
                    className="text-success"
                    aria-hidden="true"
                  />
                ) : (
                  <XIcon
                    size={16}
                    className="text-error"
                    aria-hidden="true"
                  />
                )}
                <span
                  className={`text-xs ${req.met ? "text-success" : "text-error"}`}
                >
                  {req.text}
                  <span className="sr-only">
                    {req.met ? " - Exigence remplie" : " - Exigence non remplie"}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  )
}
