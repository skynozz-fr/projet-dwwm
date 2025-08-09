import { useId } from "react"
import { MoonIcon, SunIcon } from "lucide-react"
import { useTheme } from "@/hooks/useTheme"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

export const ThemeToggle = () => {
  const id = useId()
  const { theme, toggleTheme } = useTheme()
  
  // Le switch est "checked" quand le thème est dark
  const checked = theme === 'dark'

  return (
    <div className="inline-flex items-center gap-2">
      <Switch
        id={id}
        checked={checked}
        onCheckedChange={toggleTheme}
        aria-label="Basculer entre thème clair et sombre"
      />
      <Label htmlFor={id}>
        <span className="sr-only">
          {theme === 'light' ? 'Passer en mode sombre' : 'Passer en mode clair'}
        </span>
        {checked ? (
          <MoonIcon size={16} aria-hidden="true" />
        ) : (
          <SunIcon size={16} aria-hidden="true" />
        )}
      </Label>
    </div>
  )
}
